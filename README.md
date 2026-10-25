# 이미지 QR 스튜디오 — 소스코드 백업

이 폴더는 이미지 QR 생성과 휴대폰 → 노트북 사진 전송 기능을 포함하는 앱의 소스코드입니다.

- 기존 앱: https://image-qr-studio.buzzyteal.chatgpt.site
- 사진 전송: https://image-qr-studio.buzzyteal.chatgpt.site/transfer
- 원본 소스 커밋: f959be5799a106e1914cbc9de8d110b83afd1f95

## GitHub에 간단히 보관하기
1. GitHub에서 image-qr-studio 저장소를 만듭니다. 개인 보관용이면 Private를 선택합니다.
2. ZIP 자체를 Upload files로 올리면 전체 소스를 한 파일로 백업할 수 있습니다.
3. GitHub에서 코드까지 바로 보고 수정하려면 ZIP을 풀어 파일과 폴더를 업로드합니다.
4. 전체 소스를 누락 없이 옮기려면 GitHub Desktop에서 압축을 푼 폴더를 새 저장소로 만들고 Publish repository를 이용하세요. 파일이 많으면 브라우저 업로드보다 이 방식이 적합합니다.

ZIP에는 설정 파일도 포함되어 있습니다. 일부 설정 파일은 macOS Finder에서 기본적으로 보이지 않을 수 있으므로, 원본 ZIP도 보관해 주세요.

## 주요 파일
- app/page.tsx: 이미지 QR 생성 화면
- app/transfer/page.tsx: 휴대폰 → 노트북 전송 화면
- app/api/images/route.ts: 이미지 업로드
- app/api/transfer/: 전송용 QR 세션 및 사진 업로드/다운로드
- app/i/[id]/route.ts: 이미지 열람
- app/globals.css, app/transfer/transfer.css: 디자인
- package.json, pnpm-lock.yaml: 의존성 정보
- .openai/hosting.json: 기존 Sites 식별자와 R2 저장소 바인딩
- STARTER-README.md: 기존 프레임워크의 기술 안내

## 실행과 복원
Node.js 22.13.0 이상과 package.json에 지정된 pnpm이 필요합니다.
의존성을 설치한 뒤 package.json의 dev/build/start 명령을 사용합니다.
사진 기능은 Cloudflare Workers 호환 서버와 BUCKET 이름의 R2 저장소가 필요합니다.
GitHub에 소스를 올리는 것만으로 앱이 자동 배포되거나 사진 저장소가 복원되지는 않습니다.
기존 Sites에서 복원할 때는 .openai/hosting.json의 사이트 식별자를 유지하세요.
별도의 사이트로 옮길 때는 해당 배포 환경의 설정과 저장소 연결을 다시 구성해야 합니다.
이 백업을 만들면서 앱을 변경하거나 재배포하지 않았습니다.

## 포함하지 않은 항목
사용자가 업로드한 사진, 서버 저장소 데이터, 로그인 인증 정보, node_modules, 빌드 결과 및 Git 이력은 포함하지 않았습니다.
