import {allowedOrigin, corsResponse, preflight} from '../../../lib/qr-cors';
import {env} from 'cloudflare:workers';
async function handleGET(_request:Request,{params}:{params:Promise<{id:string}>}){try{const {id}=await params;if(!/^[a-f0-9-]{36}$/.test(id))return new Response('이미지를 찾을 수 없습니다.',{status:404});if(!env.BUCKET)throw Error('Storage unavailable');const object=await env.BUCKET.get('images/'+id);if(!object)return new Response('이미지를 찾을 수 없습니다.',{status:404});return new Response(object.body,{headers:{'Content-Type':object.httpMetadata?.contentType||'application/octet-stream','Cache-Control':'private, max-age=3600','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox"}});}catch(e){console.error('Image load failed',e);return new Response('이미지를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',{status:503});}}

export async function GET(request:Request,context:{params:Promise<{id:string}>}){return corsResponse(request,await handleGET(request,context));}
export const OPTIONS = preflight;
