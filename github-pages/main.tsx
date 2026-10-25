import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import Home from '../app/page';
import Transfer from '../app/transfer/page';
import {apiUrl, pageUrl} from '../lib/qr-urls';
import '../app/globals.css';
window.qrStudioConfig = {apiOrigin:'https://image-qr-studio.buzzyteal.chatgpt.site',basePath:'/image-qr-studio'};
function ImageView(){
 const [src,setSrc]=useState(''),[error,setError]=useState('');
 useEffect(()=>{
  const id=new URLSearchParams(location.search).get('id');
  if(!id||!/^[a-f0-9-]{36}$/.test(id)){setError('이미지 주소를 확인해 주세요.');return;}
  const controller=new AbortController();let objectUrl='';
  fetch(apiUrl('/i/'+id),{signal:controller.signal}).then(async r=>{if(!r.ok)throw Error('이미지를 불러오지 못했습니다.');return r.blob();}).then(blob=>{objectUrl=URL.createObjectURL(blob);setSrc(objectUrl);}).catch(e=>{if(!controller.signal.aborted)setError(e.message);});
  return()=>{controller.abort();if(objectUrl)URL.revokeObjectURL(objectUrl);};
 },[]);
 return <main><a href={pageUrl('/')}>← 이미지 QR 스튜디오</a><h1 style={{marginTop:24}}>공유된 이미지</h1>{error?<p role="alert">{error}</p>:src?<><img src={src} alt="QR코드로 공유된 이미지" style={{maxWidth:'100%',maxHeight:'75vh',display:'block',margin:'24px auto'}}/><a className="primary" href={src} download="shared-image">이미지 저장</a></>:<p role="status">이미지를 불러오는 중…</p>}</main>;
}
const pathname=location.pathname.replace(/\/$/,'');
createRoot(document.getElementById('root')!).render(pathname.endsWith('/transfer')?<Transfer/>:pathname.endsWith('/image')?<ImageView/>:<Home/>);
