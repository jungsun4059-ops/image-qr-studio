import {allowedOrigin, corsResponse, preflight} from '../../../lib/qr-cors';
import { env } from 'cloudflare:workers';
async function handlePOST(request:Request){
 try{
 const origin=request.headers.get('origin');if(origin&&!allowedOrigin(request))return Response.json({error:'올바른 앱에서 다시 시도해 주세요.'},{status:403});
 const type=request.headers.get('content-type')||'';if(!['image/jpeg','image/png','image/webp','image/gif'].includes(type))return Response.json({error:'지원하지 않는 이미지 형식입니다.'},{status:400});
 if(Number(request.headers.get('content-length'))>10485760)return Response.json({error:'10MB 이하만 업로드할 수 있습니다.'},{status:413});
 const reader=request.body?.getReader();if(!reader)return Response.json({error:'이미지를 선택해 주세요.'},{status:400});let size=0;const chunks:Uint8Array[]=[];while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>10485760){await reader.cancel();return Response.json({error:'10MB 이하만 업로드할 수 있습니다.'},{status:413});}chunks.push(value);}const bytes=new Uint8Array(size);let at=0;for(const c of chunks){bytes.set(c,at);at+=c.length;}
 const sig=(n:number)=>String.fromCharCode(...bytes.slice(0,n));const valid=type==='image/jpeg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:type==='image/png'?bytes[0]===137&&sig(8).slice(1)==='PNG\r\n\x1a\n':type==='image/gif'?['GIF87a','GIF89a'].includes(sig(6)):sig(4)==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP';
 if(!valid)return Response.json({error:'올바른 이미지 파일이 아닙니다.'},{status:400});
 if(!env.BUCKET)throw Error('Storage unavailable');const id=crypto.randomUUID();await env.BUCKET.put('images/'+id,bytes,{httpMetadata:{contentType:type}});return Response.json({path:'/i/'+id},{status:201});
 }catch(e){console.error('Image upload failed',e);return Response.json({error:'이미지를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.'},{status:503});}
}

export async function POST(request:Request){return corsResponse(request,await handlePOST(request));}
export const OPTIONS = preflight;
