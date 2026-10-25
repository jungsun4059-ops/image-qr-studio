import {env} from 'cloudflare:workers';
type Context={params:Promise<{id:string}>};
const fail=(error:string,status=400)=>Response.json({error},{status,headers:{'Cache-Control':'no-store'}});
async function session(request:Request,context:Context){
 const {id}=await context.params;
 if(!/^[a-f0-9-]{36}$/.test(id))return {error:fail('전송 QR을 찾을 수 없습니다.',404)};
 if(!env.BUCKET)throw Error('Storage unavailable');
 const object=await env.BUCKET.get(`transfer/${id}/session`);
 if(!object)return {error:fail('전송 QR을 찾을 수 없습니다.',404)};
 const data=await object.json<{receive:string,send:string,expires:number}>();
 const token=request.headers.get('authorization')?.replace(/^Bearer /,'');
 if(token!==data.receive&&token!==data.send)return {error:fail('올바른 QR로 다시 접속해 주세요.',403)};
 if(data.expires<Date.now())return {error:fail('전송 시간이 끝났습니다. 노트북에서 새 QR을 만들어 주세요.',410)};
 return {id,data,isReceiver:token===data.receive};
}
export async function GET(request:Request,context:Context){
 try{
  const s=await session(request,context);if(s.error)return s.error;
  if(!s.isReceiver)return Response.json({expires:s.data!.expires},{headers:{'Cache-Control':'no-store'}});
  const file=new URL(request.url).searchParams.get('file');
  if(file){
   if(!/^[a-f0-9-]{36}$/.test(file))return fail('파일을 찾을 수 없습니다.',404);
   const object=await env.BUCKET!.get(`transfer/${s.id}/files/${file}`);if(!object)return fail('파일을 찾을 수 없습니다.',404);
   return new Response(object.body,{headers:{'Content-Type':object.httpMetadata?.contentType||'application/octet-stream','Content-Disposition':`attachment; filename="photo"; filename*=UTF-8''${encodeURIComponent(object.customMetadata?.name||'photo')}`,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox"}});
  }
  const listOptions={prefix:`transfer/${s.id}/files/`,limit:100,include:['customMetadata']};
  const result=await env.BUCKET!.list(listOptions);
  return Response.json({expires:s.data!.expires,files:result.objects.map(o=>({id:o.key.split('/').pop(),name:o.customMetadata?.name||'사진',size:o.size,uploaded:o.uploaded.toISOString()})).sort((a,b)=>b.uploaded.localeCompare(a.uploaded))},{headers:{'Cache-Control':'no-store'}});
 }catch(e){console.error('Transfer read failed',e);return fail('사진을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',503);}
}
export async function POST(request:Request,context:Context){
 if(request.headers.get('origin')!==new URL(request.url).origin)return fail('앱에서 다시 시도해 주세요.',403);
 try{
  const s=await session(request,context);if(s.error)return s.error;
  const reader=request.body?.getReader();if(!reader)return fail('사진을 선택해 주세요.');
  const max=10*1024*1024;if(Number(request.headers.get('content-length'))>max)return fail('사진 한 장당 10MB 이하로 선택해 주세요.',413);
  let size=0;const chunks:Uint8Array[]=[];
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();return fail('사진 한 장당 10MB 이하로 선택해 주세요.',413);}chunks.push(value);}
  const bytes=new Uint8Array(size);let at=0;for(const c of chunks){bytes.set(c,at);at+=c.length;}
  const sig=(a:number,b:number)=>String.fromCharCode(...bytes.slice(a,b));
  const brand=sig(8,12);const type=bytes[0]===255&&bytes[1]===216&&bytes[2]===255?'image/jpeg':sig(0,8)==='\x89PNG\r\n\x1a\n'?'image/png':['GIF87a','GIF89a'].includes(sig(0,6))?'image/gif':sig(0,4)==='RIFF'&&sig(8,12)==='WEBP'?'image/webp':sig(4,8)==='ftyp'&&['heic','heix','hevc','hevx','mif1','msf1','avif','avis'].includes(brand)?(['avif','avis'].includes(brand)?'image/avif':'image/heic'):null;
  if(!type)return fail('JPG, PNG, GIF, WebP, HEIC 또는 AVIF 사진을 선택해 주세요.');
  const current=await env.BUCKET!.list({prefix:`transfer/${s.id}/files/`,limit:100});if(current.objects.length>=100)return fail('이 QR의 사진이 가득 찼습니다. 새 QR을 만들어 주세요.');
  let name='photo';try{name=decodeURIComponent(request.headers.get('x-file-name')||'photo').replace(/[\x00-\x1f\x7f]/g,'').slice(0,180)||'photo';}catch{}
  const id=crypto.randomUUID();await env.BUCKET!.put(`transfer/${s.id}/files/${id}`,bytes,{httpMetadata:{contentType:type},customMetadata:{name}});
  return Response.json({id,name},{status:201,headers:{'Cache-Control':'no-store'}});
 }catch(e){console.error('Transfer upload failed',e);return fail('사진을 보내지 못했습니다. 다시 시도해 주세요.',503);}
}
