// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Product, ProductSchema } from "./schema.ts";
import { createErrorResponse, createSuccessResponse } from "./response.ts";
import { parse, validate } from "npm:@telegram-apps/init-data-node@2.0.3";
import { Context } from "./type.ts";

// Initialize the Supabase client with environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Create a Supabase client instance
const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, X-Telegram-InitData, Authorization",
      },
    });
  }

  const telegramBotToken = Deno.env.get("TELEGRAM_BOT_TOKEN") || "";
  const telegramInitRawData = req.headers.get("X-Telegram-InitData") || "";

  if (!telegramInitRawData) {
    return createErrorResponse({
      message: "Telegram init data is required",
      code: 400,
    });
  }

  let telegramInitData: any;
  try {
    validate(telegramInitRawData, telegramBotToken);
    telegramInitData = parse(telegramInitRawData);
    if (!telegramInitData.user?.id) {
      throw new Error("chat id not found");
    }
  } catch (error) {
    console.error("validate telegram data failed, error:", error);

    return createErrorResponse({
      message: "Invalid Telegram init data",
      code: 400,
    });
  }

  const context: Context = {
    chatId: telegramInitData.user?.id,
  };

  switch (req.method) {
    case "GET":
      return handleGetList(req, context);
    case "POST":
      return handleCreate(req, context);
    case "DELETE":
      return handleDelete(req, context);
    default:
      return createErrorResponse({
        message: "Method not allowed",
        code: 405,
      });
  }
});

async function handleGetList(req: Request, context: Context) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("chatId", context.chatId);

  if (error) {
    console.error("Error fetching products:", error);
    return createErrorResponse({
      message: "Failed to fetch products",
      code: 500,
    });
  }

  return createSuccessResponse(data);
}

async function handleCreate(req: Request, context: Context) {
  const product = await req.json();

  let parsedProduct: Omit<Product, "id">;
  try {
    parsedProduct = ProductSchema.omit({ id: true }).parse(
      {
        ...product,
        chatId: context.chatId,
      },
    );
  } catch (error) {
    console.error("Invalid product Format", error);
    return createErrorResponse({
      message: "Invalid product Format",
      code: 400,
    });
  }

  const { count, error: countError } = await supabase
    .from("products")
    .select("id", { count: "exact" })
    .eq("chatId", context.chatId);

  if (countError) {
    console.error("Error checking product count:", countError);
    return createErrorResponse({
      message: "Failed to check product limit",
      code: 500,
    });
  }

  if (count && count >= 3) {
    return createErrorResponse({
      message: "Each chat can have a maximum of 3 products",
      code: 400,
    });
  }

  const { error } = await supabase
    .from("products")
    .insert(parsedProduct);

  if (error) {
    console.error("add product in database failed error:", error);

    return createErrorResponse({
      message: error.message,
      code: 500,
    });
  }

  return createSuccessResponse();
}

async function handleDelete(req: Request, context: Context) {
  const id = req.url.split("/").pop();

  if (!id) {
    return createErrorResponse({
      message: "Product ID is required",
      code: 400,
    });
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("chatId", context.chatId);

  if (error) {
    console.error("Error deleting product:", error);
    return createErrorResponse({
      message: "Failed to delete product",
      code: 500,
    });
  }

  return createSuccessResponse();
}
