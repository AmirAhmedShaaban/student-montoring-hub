/* eslint-env node */
/* global Buffer */
const BACKEND_HOST = "http://studentmonitor.runasp.net";

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "content-length",
  "upgrade",
]);

export async function handler(event) {
  try {
    const requestPath = event.path || "";
    const cleanPath = requestPath.replace(
      /^\/(?:\.netlify\/functions\/file-proxy|files)/,
      "",
    );

    const target = new URL(`${BACKEND_HOST}${cleanPath}`);
    if (event.rawQueryString) {
      target.search = event.rawQueryString;
    } else if (event.queryStringParameters) {
      Object.entries(event.queryStringParameters).forEach(([k, v]) => {
        if (v !== undefined && v !== null) target.searchParams.append(k, v);
      });
    }

    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,HEAD",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
        body: "",
      };
    }

    const forwardedHeaders = {};
    const headers = event.headers || {};
    const explicitAuth = headers.authorization || headers.Authorization;
    let contentTypeHeader;

    for (const [k, v] of Object.entries(headers)) {
      const key = k.toLowerCase();
      if (HOP_BY_HOP.has(key) || key === "host") continue;
      if (key === "authorization") continue;
      if (key === "content-type") {
        contentTypeHeader = v;
        continue;
      }
      forwardedHeaders[k] = v;
    }

    if (explicitAuth) forwardedHeaders["Authorization"] = explicitAuth;
    if (contentTypeHeader) forwardedHeaders["Content-Type"] = contentTypeHeader;

    let body;
    if (event.body && !["GET", "HEAD"].includes(event.httpMethod)) {
      body = event.isBase64Encoded
        ? Buffer.from(event.body, "base64")
        : event.body;
    }

    const response = await fetch(target.toString(), {
      method: event.httpMethod,
      headers: forwardedHeaders,
      body,
    });

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      const lk = key.toLowerCase();
      if (HOP_BY_HOP.has(lk)) return;
      responseHeaders[key] = value;
    });

    responseHeaders["Access-Control-Allow-Origin"] = "*";
    responseHeaders["Access-Control-Allow-Headers"] =
      responseHeaders["Access-Control-Allow-Headers"] ||
      "Content-Type, Authorization";

    const contentType = response.headers.get("content-type") || "";
    const isBinary = !/^text\/|\+json|application\/json/i.test(contentType);

    return {
      statusCode: response.status,
      headers: responseHeaders,
      body: isBinary ? buffer.toString("base64") : buffer.toString("utf-8"),
      isBase64Encoded: isBinary,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message }),
    };
  }
}
