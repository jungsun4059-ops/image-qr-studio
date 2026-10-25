# GitHub Pages 배포

사이트 주소: https://jungsun4059-ops.github.io/image-qr-studio/

화면은 GitHub Pages의 `main` 브랜치 `/docs` 폴더에서 제공하며, 사진 업로드·QR 전송 API와 이미지 저장소는 기존 Sites 서버를 사용합니다. 기존 서버를 중단하면 사진 기능도 중단됩니다.

## 최초 설정
GitHub 저장소 → Settings → Pages → Build and deployment에서 Source를 **Deploy from a branch**, Branch를 **main**, 폴더를 **/docs**로 선택한 뒤 Save를 누릅니다.

비공개 저장소의 Pages는 GitHub Pro 등 지원 요금제가 필요합니다. GitHub Free에서는 공개 저장소가 필요합니다. 이 변경에서는 저장소를 비공개로 유지했습니다. Pages로 게시되는 사이트 자체는 공개됩니다.

## 업데이트
`pnpm build:pages`로 `/docs`를 다시 생성하고 변경한 소스와 `/docs`를 함께 GitHub에 커밋합니다. API를 수정한 경우 기존 Sites에도 별도로 배포해야 합니다.

GitHub 화면은 `github-pages/main.tsx`, `vite.pages.config.ts`, `lib/qr-urls.ts`를 사용합니다. API의 CORS는 기존 사이트 자체와 `https://jungsun4059-ops.github.io`만 허용합니다. 전송 토큰은 URL의 fragment에 유지되며 API 요청의 Authorization 헤더로 전송됩니다.
