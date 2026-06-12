export async function handler(event) {
  try {
    const requestPath = event.path || "";

    const cleanPath = requestPath.replace("/.netlify/functions/api-proxy", "");

    const url = `http://studentmonitor.runasp.net${cleanPath}`;

    const forwardedHeaders = {
        ...event.headers,
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const response = await fetch(url, {
        method: event.httpMethod,
        headers: forwardedHeaders,
        body: event.httpMethod !== "GET" && event.body ? event.body : undefined,
      });

    const text = await response.text();

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
