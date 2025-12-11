# RePlay
연극·영화 동아리 소품 중고거래 플랫폼 Re;Play의 백엔드/프론트엔드 모노레포입니다.

## Backend Deployment

- 배포 환경: Railway
- 백엔드 베이스 URL:  
  `https://replay-production-69e1.up.railway.app`
- Swagger URL:  
  `https://replay-production-69e1.up.railway.app/docs`

### 브랜치 전략

- `dev`  
  - 기본 개발 브랜치  
  - 기능 브랜치(feature/..., chore/...)는 모두 `dev`에서 분기하여 작업
- `main`  
  - 배포 브랜치  
  - `dev`에서 충분히 검증된 변경 사항만 PR을 통해 머지  
  - `main` 브랜치에 머지되면 Railway에서 자동 배포가 수행됨

## WebSocket 테스트 가이드

RePlay 백엔드에서는 `/ws/echo` 엔드포인트를 통해
기본적인 WebSocket echo / broadcast 기능을 제공합니다.

