const ALLOWED=["smartorder.ai","airbnb.com","booking.com","agoda.com","ical.net","outlook.com","google.com"];
exports.handler=async function(event){
  const url=(event.queryStringParameters||{}).url||"";
  let u;try{u=new URL(url)}catch(e){return{statusCode:403,body:"Bad URL"}}
  const ok=ALLOWED.some(function(d){return u.hostname===d||u.hostname.endsWith("."+d)});
  if(!ok)return{statusCode:403,body:"Domain not allowed"};
  try{
    const r=await fetch(u.href,{redirect:"follow"});
    if(!r.ok)return{statusCode:502,body:"Upstream error "+r.status};
    const t=await r.text();
    return{statusCode:200,headers:{"Content-Type":"text/calendar; charset=utf-8","Access-Control-Allow-Origin":"*","Cache-Control":"public, max-age=600"},body:t};
  }catch(e){return{statusCode:502,body:"Fetch failed"}}
};
