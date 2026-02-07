# Draft: 선교 CRUD 페이지

## Requirements (confirmed)

- **생성 페이지**: 3개 필드 (선교 이름, 선교 기간, 담당 교역자 이름)
- **수정 페이지**: 생성과 동일한 3개 필드 + 삭제 버튼
- **리스트 페이지**: 테이블 형태 (이름, 기간, 교역자, 상태)
- **리스트 클릭 → 수정 페이지 이동**
- **생성 완료 후 → 리스트 페이지 이동**
- **삭제**: 수정 페이지에 삭제 버튼, 확인 모달 후 삭제 → 리스트로 이동
- **대시보드 "신규 국내선교 생성" 버튼 → /missions/create 연결**
- **사이드바 국내선교 메뉴 → 선교 리스트 페이지 연결**

## Technical Decisions

- **폼 상태관리**: useState (기존 로그인 폼 패턴 따름)
- **날짜 입력**: react-datepicker 라이브러리 + 디자인 시스템 DatePicker 컴포넌트
- **API 호출**: useMutation (React Query) - 기존 useLogin 패턴
- **테스트**: Vitest TDD
- **서버 API**: 이미 존재 (POST/GET/PATCH/DELETE /missionaries)

## Research Findings

- 서버 CreateMissionaryDto: name(필수), startDate, endDate, pastorName(선택), regionId(필수) 등
- 디자인 시스템에 DatePicker 없음 → 새로 만들어야 함
- InputField, Button, Select 컴포넌트 사용 가능
- 로그인 페이지가 폼 패턴 레퍼런스

## Scope Boundaries

- INCLUDE: 생성/수정/삭제/리스트 페이지, DatePicker, 사이드바 연결, 대시보드 버튼 연결, Vitest 세팅
- EXCLUDE: 해외선교, 참가신청기간/참가비/정원/계좌 등 추가 필드, 상세 조회 전용 페이지

## Open Questions

- regionId가 서버에서 필수인데 생성 폼에 없음 → 기본값 처리 필요
- 서버 validation과 프론트 validation 범위
