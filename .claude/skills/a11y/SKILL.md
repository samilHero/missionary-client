---
name: a11y
description: 웹 접근성 코딩 가이드라인을 제공한다. 스크린 리더 3요소(역할, 레이블, 상태)와 4원칙(구조, 의미, 예측가능성, 시각정보보완)을 따르는 접근 가능한 UI 작성 규칙을 포함한다. UI 컴포넌트 작성·리뷰, ARIA 속성 적용, 키보드 접근성 구현, 시맨틱 HTML 작성 시 사용한다.
---

# 웹 접근성 코딩 가이드라인

## 핵심 멘탈 모델: 스크린 리더 3요소

모든 인터랙티브 요소는 다음 3가지를 갖추어야 한다:

1. **역할(Role)**: 요소가 어떤 종류인지 (버튼, 입력창, 탭, 대화상자 등)
2. **레이블(Label)**: 요소의 이름이 무엇인지 (무엇을 하는 버튼인지)
3. **상태(State)**: 현재 어떤 상태인지 (선택됨, 펼쳐짐, 비활성화 등)

## 원칙 1: 구조를 명확하게

### 인터랙티브 요소 중첩 금지

- `<a>` 안에 `<button>`, `<button>` 안에 `<button>` 금지
- 카드형 UI(전체 클릭 + 내부 버튼)에는 레이어링 패턴 사용:
  - 외부 div + `position: relative`
  - 전체 영역 투명 button (`position: absolute; inset: 0; opacity: 0`)
  - 내부 버튼은 `position: relative; z-index: 2`로 분리

### 테이블 행 클릭

- `<tr onClick>` 금지 — 스크린 리더 인식 불가
- 행 내부에 명시적인 `<a>` 또는 `<button>` 배치

## 원칙 2: 의미를 정확히 전달

### 모든 인터랙티브 요소에 이름 필수

- 모든 `<input>`, `<select>`, `<textarea>`에 `<label>`을 연결한다
- 아이콘만 있는 버튼에 `aria-label`을 부여한다: `<button aria-label="닫기"><svg aria-hidden="true" /></button>`
- placeholder만으로 레이블을 대체하지 않는다

### 이름 읽기 우선순위

1. `aria-labelledby`
2. `aria-label`
3. `<label>` (for 속성 연결)
4. 요소 내부 텍스트

### 같은 이름 구분

- "더보기" 버튼이 여러 개면 `aria-label`로 구분: "공지사항 더보기", "이벤트 더보기"
- 같은 텍스트의 링크가 여러 개면 `aria-describedby`로 맥락 제공

## 원칙 3: 예상 가능한 동작

### 올바른 요소 사용

- 버튼은 반드시 `<button>` — `<div onClick>` + `cursor: pointer` 금지
- 링크는 반드시 `<a>` 태그 사용
- 불가피하게 div를 사용하면 3가지 모두 필수: `role="button"` + `tabIndex={0}` + `onKeyDown` (Enter/Space 처리)

### 폼 구조

- 관련 input들을 `<form>`으로 감싼다
- Enter 키로 제출 가능하도록 보장한다
- 관련 입력 그룹은 `<fieldset>` + `<legend>` 사용

## 원칙 4: 시각 정보 보완

### 이미지/아이콘 대체 텍스트

- 의미 있는 이미지: 구체적 설명의 `alt` 필수
- 장식용 이미지: `alt=""` 명시
- 아이콘 버튼: `aria-label`은 버튼에, 아이콘에 `aria-hidden="true"`
- 복잡한 차트/인포그래픽: `aria-describedby`로 상세 설명 연결

## UI 컴포넌트별 규칙

### 탭 (Tab)

- 탭 목록: `role="tablist"` + `aria-label`
- 각 탭: `role="tab"` + `aria-selected={true/false}`
- 탭 패널: `role="tabpanel"` + `aria-labelledby`로 탭과 연결
- 키보드: 좌우 화살표 이동, Enter/Space 선택

### 아코디언 (Accordion)

- 트리거 버튼: `aria-expanded={true/false}` + `aria-controls`
- 가능하면 `<details>` + `<summary>` 네이티브 요소 사용

### 모달 (Modal)

- `<dialog>` + `showModal()` 사용 (포커스 트랩, ESC, 배경 차단 자동 제공)
- 열기 버튼: `aria-haspopup="dialog"`
- 모달: `aria-labelledby`로 제목 연결
- `<dialog>` 미사용 시 필수: `role="dialog"` + `aria-modal="true"` + 포커스 트랩 + ESC 닫기 + 배경 `inert`

### 라디오/체크박스

- 네이티브 `<input>` + `<label>` 사용
- 커스텀 UI면 `role`, `aria-checked`, `tabIndex` 필수

### 스위치

- `role="switch"` + `aria-checked={true/false}`

## 상태 속성 참조표

| 상태        | 속성                                 | 사용처             |
| ----------- | ------------------------------------ | ------------------ |
| 체크 여부   | `aria-checked`                       | 체크박스, 스위치   |
| 선택 여부   | `aria-selected`                      | 탭, 리스트         |
| 펼침 여부   | `aria-expanded`                      | 아코디언, 드롭다운 |
| 비활성화    | `aria-disabled` / `disabled`         | 버튼, 입력         |
| 현재 위치   | `aria-current="page"`                | 네비게이션         |
| 로딩 중     | `aria-busy`                          | 데이터 로드 영역   |
| 실시간 알림 | `aria-live="polite"` / `"assertive"` | 에러 메시지, 알림  |

## 추가 규칙

### 시맨틱 HTML

- `<nav>`, `<main>`, `<section>`, `<article>`, `<header>`, `<footer>` 적절히 사용
- heading 계층 유지 (h1 → h2 → h3, 건너뛰기 금지)

### 키보드 접근성

- 모든 인터랙티브 요소에 키보드로 접근 가능해야 한다
- focus outline 제거 금지 — 커스텀 시 `:focus-visible` 사용
- 키보드 트랩 없어야 한다 (모달 내부 제외)

### 색상 대비

- 텍스트/배경 명도비 4.5:1 이상 (AA 기준)
- 대형 텍스트(18px bold 또는 24px 이상) 3:1 이상
