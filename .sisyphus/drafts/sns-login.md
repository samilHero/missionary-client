# Draft: SNS 로그인 구현

## 현재 상태 (리서치 결과)

### ✅ 백엔드 (missionary-server) — 이미 구현됨

- Passport.js + JWT 인프라 완비
- 전략: Local(이메일/비번), JWT, Google OAuth 2.0, Kakao OAuth
- 토큰: access_token(15분) + refresh_token(7일), httpOnly 쿠키 저장
- 엔드포인트: login, google, google/callback, kakao, kakao/callback, refresh, me, logout
- Prisma User 모델: AuthProvider enum (LOCAL, GOOGLE, KAKAO)
- 환경변수 기반 조건부 전략 로딩

### ✅ Admin 앱 (missionary-admin) — 이미 구현됨

- 로그인 페이지: 이메일/비밀번호 폼 + Google/Kakao 버튼
- AuthContext: 글로벌 인증 상태 관리
- Axios 인터셉터: 401 시 자동 토큰 갱신
- middleware.ts: 인증 안 된 유저 → /login 리다이렉트
- Header: 유저 이메일 표시 + 로그아웃 버튼

### ❌ Main 앱 (missionary-app) — 인증 없음

- 빈 앱 상태, 라우트 없음
- 인증 관련 코드 전무 (AuthContext, 미들웨어, API 클라이언트 없음)

## Open Questions

- missionary-app에 SNS 로그인을 추가하려는 것인지?
- 추가 SNS 프로바이더(네이버, 애플 등)가 필요한지?
- 기존 admin 구현의 개선이 필요한지?
