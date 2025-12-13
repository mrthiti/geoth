export async function onRequest({
  request,
  next,
}: {
  request: Request;
  next: () => Promise<Response>;
}): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const response = await next();

  response.headers.set("Access-Control-Allow-Origin", "*");

  return response;
}
