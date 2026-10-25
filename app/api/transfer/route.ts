import { env } from 'cloudflare:workers';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'앱에서 다시 시도해 주세요.'},{status:403});
 try{
  if(!env.BUCKET)throw Error('Storage unavailable');
  const id=crypto.randomUUID(),receive=crypto.randomUUID()+crypto.randomUUID(),send=crypto.randomUUID()+crypto.randomUUID(),expires=Date.now()+3600000;
  await env.BUCKET.put(`transfer/${id}/session`,JSON.stringify({receive,send,expires}),{httpMetadata:{contentType:'application/json'}});
  return Response.json({id,receive,send,expires},{status:201,headers:{'Cache-Control':'no-store'}});
 }catch(e){console.error('Transfer creation failed',e);return Response.json({error:'전송 QR을 만들지 못했습니다. 다시 시도해 주세요.'},{status:503});}
}
