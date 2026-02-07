# React State Management Skill

React 상태 관리 가이드라인을 제공한다. 상태 배치(State Colocation) 원칙과 의사결정 플로우차트를 따라 최적의 상태 위치를 결정하는 규칙을 포함한다. React 컴포넌트 작성·리뷰, 상태 관리 설계, Props Drilling 해결, 성능 최적화 시 사용한다.

## 핵심 원칙: State Colocation

> "상태를 가능한 한 사용되는 곳에 가까이 배치하라"

상태 배치(State Colocation)는 코드를 가능한 한 그것과 관련된 곳에 가까이 두는 원칙이다. 상태가 실제로 필요한 컴포넌트 근처에 위치할수록:

- 코드 유지보수가 쉬워진다
- 불필요한 리렌더링이 줄어든다
- 앱 성능이 향상된다

---

## 상태 위치 결정 플로우차트

```
┌─────────────────┐
│   useState()    │
│   으로 시작     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ 이 컴포넌트에서만 사용?     │
└────────┬────────────────────┘
         │
    ┌────┴────┐
    │         │
   Yes        No
    │         │
    ▼         ▼
┌───────┐  ┌─────────────────────────┐
│ 유지  │  │ 하나의 자식만 사용?     │
│ (Leave)│  └────────┬────────────────┘
└───────┘           │
              ┌─────┴─────┐
              │           │
             Yes          No
              │           │
              ▼           ▼
        ┌──────────┐  ┌─────────────────────────┐
        │ 상태     │  │ 형제/부모가 사용?       │
        │ 내리기   │  └────────┬────────────────┘
        │(Colocate)│          │
        └──────────┘     ┌────┴────┐
                         │         │
                        Yes        No
                         │         │
                         ▼         ▼
                   ┌──────────┐  (다시 분석 필요)
                   │ 상태     │
                   │ 올리기   │
                   │ (Lift)   │
                   └────┬─────┘
                        │
                        ▼
              ┌─────────────────────────┐
              │ Prop Drilling 문제?     │
              └────────┬────────────────┘
                       │
                  ┌────┴────┐
                  │         │
                 Yes        No
                  │         │
                  ▼         ▼
   ┌──────────────────────────┐  ┌───────┐
   │ 자식이 부모 없이         │  │ 배포! │
   │ 독립적으로 동작 가능?    │  │(Ship) │
   └────────┬─────────────────┘  └───────┘
            │
       ┌────┴────┐
       │         │
      Yes        No
       │         │
       ▼         ▼
┌────────────┐  ┌────────────────┐
│ Context    │  │ Component      │
│ Provider   │  │ Composition    │
│ 사용       │  │ (props.children)│
└────────────┘  └────────────────┘
       │              │
       └──────┬───────┘
              ▼
         ┌───────┐
         │ 배포! │
         │(Ship) │
         └───────┘
              │
              ▼
      요구사항 변경 시
      처음부터 다시 평가
```

---

## 패턴별 상세 가이드

### 1. Leave It (유지)

**언제**: 상태가 현재 컴포넌트에서만 사용될 때

```tsx
// GOOD: 상태가 이 컴포넌트에서만 사용됨
function SearchBox() {
  const [query, setQuery] = useState('');

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

### 2. Colocate State (상태 내리기)

**언제**: 상태가 하나의 자식 컴포넌트에서만 사용될 때

```tsx
// BAD: 부모가 불필요하게 상태를 들고 있음
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Header />
      <Counter count={count} setCount={setCount} />
      <Footer />
    </div>
  );
}

// GOOD: 상태를 실제로 사용하는 자식으로 이동
function Parent() {
  return (
    <div>
      <Header />
      <Counter /> {/* Counter가 자체 상태 관리 */}
      <Footer />
    </div>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

**성능 이점**: 부모의 불필요한 리렌더링 방지

### 3. Lift State (상태 올리기)

**언제**: 형제 컴포넌트나 부모가 상태를 공유해야 할 때

```tsx
// 형제 컴포넌트가 같은 상태를 사용
function Parent() {
  const [filter, setFilter] = useState('all');

  return (
    <div>
      <FilterButtons filter={filter} setFilter={setFilter} />
      <ItemList filter={filter} />
    </div>
  );
}
```

**규칙**: 가장 가까운 공통 부모로만 올린다 (불필요하게 높이 올리지 않음)

### 4. Component Composition (컴포넌트 합성)

**언제**:

- Prop Drilling이 발생하고
- 자식이 부모 없이는 의미가 없을 때 (강한 결합)

```tsx
// BAD: Prop Drilling
function App() {
  const [user, setUser] = useState(null);
  return <Layout user={user} />;
}

function Layout({ user }) {
  return <Sidebar user={user} />;
}

function Sidebar({ user }) {
  return <UserInfo user={user} />;
}

// GOOD: Component Composition
function App() {
  const [user, setUser] = useState(null);

  return (
    <Layout>
      <Sidebar>
        <UserInfo user={user} />
      </Sidebar>
    </Layout>
  );
}

function Layout({ children }) {
  return <div className="layout">{children}</div>;
}

function Sidebar({ children }) {
  return <aside>{children}</aside>;
}
```

**장점**:

- 중간 컴포넌트가 props를 알 필요 없음
- 더 유연한 컴포넌트 구조
- Context 없이 Prop Drilling 해결

### 5. Context Provider

**언제**:

- Prop Drilling이 발생하고
- 자식이 부모 없이도 독립적으로 사용될 수 있을 때 (약한 결합)
- 진정한 "글로벌" 상태 (테마, 인증, 언어 설정 등)

```tsx
// Context가 적절한 경우: 인증 상태
const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// 앱 어디서든 사용 가능
function UserMenu() {
  const { user } = useAuth();
  return user ? <ProfileMenu /> : <LoginButton />;
}
```

---

## 안티패턴

### 1. 모든 상태를 Context에 넣기

```tsx
// BAD: 관련 없는 상태들을 하나의 Context에
const AppContext = createContext({
  user: null,
  theme: 'light',
  sidebarOpen: false,
  modalOpen: false,
  searchQuery: '',
  // ... 수십 개의 상태
});

// GOOD: 관련된 상태끼리 분리 + 로컬 상태 활용
// - user, theme → AuthContext, ThemeContext (진짜 글로벌)
// - sidebarOpen → Layout 컴포넌트의 로컬 상태
// - modalOpen → 해당 Modal을 사용하는 컴포넌트의 로컬 상태
// - searchQuery → SearchBox 컴포넌트의 로컬 상태
```

### 2. 성급한 상태 끌어올리기

```tsx
// BAD: 미래를 대비해서 불필요하게 상태를 올림
function App() {
  const [count, setCount] = useState(0); // Counter에서만 사용하는데 App에 있음

  return (
    <div>
      <Header />
      <Counter count={count} setCount={setCount} />
    </div>
  );
}

// GOOD: 실제로 필요할 때 올린다
function App() {
  return (
    <div>
      <Header />
      <Counter />
    </div>
  );
}
```

### 3. Props Drilling을 무조건 Context로 해결

```tsx
// BAD: 바로 Context 사용
// → 컴포넌트가 불필요하게 Context에 의존

// GOOD: 먼저 Component Composition 시도
// → Composition으로 해결 안 되면 그때 Context 사용
```

---

## 결정 체크리스트

상태 위치를 결정할 때 다음을 확인한다:

- [ ] 이 상태를 사용하는 컴포넌트가 몇 개인가?
- [ ] 상태를 사용하는 컴포넌트들의 가장 가까운 공통 조상은 어디인가?
- [ ] 상태가 변경되면 어떤 컴포넌트가 리렌더링 되는가?
- [ ] Prop Drilling이 3단계 이상 발생하는가?
- [ ] 자식 컴포넌트가 부모 없이 독립적으로 사용될 수 있는가?

---

## 참고

- [State Colocation will make your React app faster](https://kentcdodds.com/blog/state-colocation-will-make-your-react-app-faster) - Kent C. Dodds
- [Application State Management with React](https://kentcdodds.com/blog/application-state-management-with-react) - Kent C. Dodds
