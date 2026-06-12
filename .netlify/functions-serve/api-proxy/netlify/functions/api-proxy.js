var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// netlify/functions/api-proxy.js
var api_proxy_exports = {};
__export(api_proxy_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(api_proxy_exports);
var BACKEND_HOST = "http://studentmonitor.runasp.net";
var HOP_BY_HOP = /* @__PURE__ */ new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "content-length",
  "upgrade"
]);
async function handler(event) {
  try {
    const requestPath = event.path || "";
    const cleanPath = requestPath.replace("/.netlify/functions/api-proxy", "");
    const target = new URL(`${BACKEND_HOST}${cleanPath}`);
    if (event.rawQueryString) {
      target.search = event.rawQueryString;
    } else if (event.queryStringParameters) {
      Object.entries(event.queryStringParameters).forEach(([k, v]) => {
        if (v !== void 0 && v !== null) target.searchParams.append(k, v);
      });
    }
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,HEAD",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        },
        body: ""
      };
    }
    const forwardedHeaders = {};
    const headers = event.headers || {};
    const explicitAuth = headers.authorization || headers.Authorization;
    let contentTypeHeader = void 0;
    for (const [k, v] of Object.entries(headers)) {
      const key = k.toLowerCase();
      if (HOP_BY_HOP.has(key) || key === "host") continue;
      if (key === "authorization") {
        continue;
      }
      if (key === "content-type") {
        contentTypeHeader = v;
        continue;
      }
      forwardedHeaders[k] = v;
    }
    if (explicitAuth) forwardedHeaders["Authorization"] = explicitAuth;
    if (contentTypeHeader) {
      forwardedHeaders["Content-Type"] = contentTypeHeader;
    }
    let body = void 0;
    if (event.body && !["GET", "HEAD"].includes(event.httpMethod)) {
      body = event.isBase64Encoded ? Buffer.from(event.body, "base64") : event.body;
    }
    const response = await fetch(target.toString(), {
      method: event.httpMethod,
      headers: forwardedHeaders,
      body
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
    responseHeaders["Access-Control-Allow-Headers"] = responseHeaders["Access-Control-Allow-Headers"] || "Content-Type, Authorization";
    const contentType = response.headers.get("content-type") || "";
    const isBinary = !/^text\/|\+json|application\/json/i.test(contentType);
    return {
      statusCode: response.status,
      headers: responseHeaders,
      body: isBinary ? buffer.toString("base64") : buffer.toString("utf-8"),
      isBase64Encoded: isBinary
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message })
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=api-proxy.js.map
