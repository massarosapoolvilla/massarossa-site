// netlify/functions/ical.js — серверний iCal-проксі (без CORS-проблем)
const ALLOWED = ["smartorder.ai","airbnb.com","booking.com","agoda.com","ical.net","outlook.com","google.com"];

exports.handler = async (event) => {
  const url = event.queryStringParameters.url || "";
  let host = "";
  try { host = new URL(url).hostname.replace(/^www\./,""); } catch(e) {}
  const ok = ALLOWED.some(d => host === d || host.endsWith("." + d));
  if (!/^https:\/\//.test(url) || !ok) {
    return { statusCode: 403, body: "Blocked domain" };
  }
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) return { statusCode: 502, body: "Upstream error " + res.status };
    const text = await res.text();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=600"
      },
      body: text
    };
  } catch (e) {
    return { statusCode: 502, body: "Fetch failed" };
  }
};