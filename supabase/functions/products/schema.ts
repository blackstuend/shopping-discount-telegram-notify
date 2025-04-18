import { z } from "https://esm.sh/zod@3.22.4";

export const ProductSchema = z.object({
  id: z.number(),
  chatId: z.number(),
  name: z.string(),
  price: z.number(),
  platforms: z.array(z.enum(["pchome", "momo"])).nonempty(),
});

export type Product = z.infer<typeof ProductSchema>;
