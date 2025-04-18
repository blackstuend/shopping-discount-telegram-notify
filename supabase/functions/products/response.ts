export interface ErrorResponse {
  message: string;
  code: number;
}

export function createErrorResponse(response: ErrorResponse) {
  return new Response(
    JSON.stringify({
      message: response.message,
    }),
    {
      status: response.code,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, X-Telegram-InitData, Authorization",
      },
    },
  );
}

export function createSuccessResponse(data?: any) {
  return new Response(
    JSON.stringify({
      message: "success",
      data: data,
    }),
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, X-Telegram-InitData, Authorization",
      },
    },
  );
}
