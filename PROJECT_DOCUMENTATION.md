# Etude LMS 프로젝트 문서

## 📋 프로젝트 개요

**Etude**는 AP(Advanced Placement)와 SAT 모의고사 및 동영상 강의를 제공하는 Learning Management System(LMS)입니다. Next.js 기반의 현대적인 웹 애플리케이션으로 구축되었습니다.

## 🛠 기술 스택

### 핵심 프레임워크

- **Next.js 15.5.2** - React 기반 풀스택 프레임워크 (App Router 사용)
- **React 19.1.0** - UI 라이브러리
- **TypeScript 5** - 정적 타입 검사

### 스타일링

- **Tailwind CSS 4** - 유틸리티 퍼스트 CSS 프레임워크
- **Shadcn UI** - Radix UI 기반 컴포넌트 라이브러리 (New York 스타일)
- **Lucide React** - 아이콘 라이브러리
- **Framer Motion** - 애니메이션 라이브러리

### 상태 관리 & 데이터 페칭

- **Zustand 5.0.8** - 경량 상태 관리 라이브러리
- **TanStack Query 5.87.1** - 서버 상태 관리 및 데이터 페칭
- **React Hook Form 7.62.0** - 폼 관리
- **Zod 4.1.5** - 스키마 검증

### 백엔드 & 인증

- **Supabase** - Backend-as-a-Service (인증, 데이터베이스)
- **@supabase/supabase-js 2.57.4** - Supabase 클라이언트

### UI 컴포넌트

- **Radix UI** - 접근성이 뛰어난 헤드리스 UI 컴포넌트
  - Dialog, Dropdown, Tabs, Select, Progress 등
- **Headless UI** - 접근성 중심의 UI 컴포넌트
- **Recharts** - 차트 및 데이터 시각화

### 개발 도구

- **ESLint** - 코드 품질 검사
- **pnpm** - 패키지 매니저
- **Turbopack** - Next.js 빌드 도구 (개발 모드)

## 📁 프로젝트 구조

```
etude/
├── src/
│   ├── app/                    # Next.js App Router 페이지
│   │   ├── globals.css         # 전역 스타일 (Figma 디자인 시스템)
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── page.tsx            # 홈페이지 (랜딩페이지)
│   │   ├── providers.tsx       # 전역 프로바이더 (QueryClient 등)
│   │   ├── dashboard/          # 대시보드 페이지
│   │   ├── exam/               # 시험 페이지
│   │   ├── login/              # 로그인 페이지
│   │   ├── signup/             # 회원가입 페이지
│   │   ├── sat-results/        # SAT 결과 페이지
│   │   ├── ap-results/         # AP 결과 페이지
│   │   ├── sat-section-select/ # SAT 섹션 선택 페이지
│   │   └── sat-detailed-results/ # SAT 상세 결과 페이지
│   │
│   ├── components/             # React 컴포넌트
│   │   ├── ui/                 # Shadcn UI 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ... (48개 컴포넌트)
│   │   │
│   │   ├── dashboard/          # 대시보드 관련 컴포넌트
│   │   │   ├── Announcements.tsx
│   │   │   ├── APCourses.tsx
│   │   │   ├── ExamSchedule.tsx
│   │   │   ├── PersonalInformation.tsx
│   │   │   └── ...
│   │   │
│   │   ├── results/            # 결과 페이지 컴포넌트
│   │   │   ├── ScoreSummaryCard.tsx
│   │   │   ├── SectionScoreCard.tsx
│   │   │   ├── TypeAnalysisChart.tsx
│   │   │   └── ...
│   │   │
│   │   ├── figma/              # Figma 관련 컴포넌트
│   │   │   └── ImageWithFallback.tsx
│   │   │
│   │   ├── LandingPage.tsx     # 랜딩페이지
│   │   ├── Dashboard.tsx       # 메인 대시보드
│   │   ├── MockExamPage.tsx    # 모의고사 페이지
│   │   ├── LoginPage.tsx       # 로그인 페이지
│   │   ├── SignUpPage.tsx      # 회원가입 페이지
│   │   └── ... (기타 페이지 컴포넌트)
│   │
│   ├── lib/                    # 유틸리티 및 설정
│   │   ├── utils.ts            # 공통 유틸리티 함수
│   │   ├── query-client.ts     # TanStack Query 설정
│   │   ├── supabase.ts         # Supabase 클라이언트 설정
│   │   └── validations/        # Zod 스키마
│   │       └── auth.ts         # 인증 관련 검증
│   │
│   ├── store/                  # Zustand 스토어
│   │   └── auth.ts             # 인증 상태 관리
│   │
│   └── types/                  # TypeScript 타입 정의
│       ├── index.ts            # 공통 타입
│       └── desmos.d.ts         # Desmos 계산기 타입
│
├── public/                     # 정적 파일
├── components.json             # Shadcn UI 설정
├── package.json                # 의존성 및 스크립트
├── tsconfig.json               # TypeScript 설정
├── next.config.ts              # Next.js 설정
├── postcss.config.mjs          # PostCSS 설정
└── eslint.config.mjs           # ESLint 설정
```

## 🎨 디자인 시스템

### 컬러 팔레트

- **Primary Blue**: `#0091B3` - 메인 브랜드 컬러
- **Primary Hover**: `#007A9A` - 호버 상태
- **Primary Light**: `#e6f3f7` - 배경용 라이트 톤
- **Background**: `#faf9f7` - 따뜻한 베이지 톤
- **Card**: `#ffffff` - 순백색 카드 배경
- **Text Primary**: `#333333` - 메인 텍스트
- **Text Secondary**: `#666666` - 보조 텍스트

### 다크모드 지원

- **Dark Background**: `#1a1a1a`
- **Dark Primary**: `#1BBDE8` - 더 밝은 블루
- **Dark Card**: `#262626`

### 컴포넌트 스타일

- **Border Radius**: `0.75rem` (12px)
- **Shadow**: 카드 호버 시 그림자 효과
- **Typography**: 계층적 폰트 크기 및 웨이트

## 🚀 주요 기능

### 1. 인증 시스템

- Supabase 기반 사용자 인증
- 로그인/회원가입 페이지
- 개발자 모드 (빠른 테스트용)

### 2. 대시보드

- 개인 정보 표시
- 시험 일정 관리
- AP/SAT 과목별 진행률
- 공지사항

### 3. 모의고사 시스템

- BlueBook 스타일 시험 인터페이스
- 실시간 타이머
- 문제 플래그 기능
- 계산기, 노트, 공식 도구
- Desmos 그래프 계산기 통합

### 4. 결과 분석

- 상세 점수 분석
- 섹션별 성과
- 오답 분석
- 성과 추이 차트

### 5. 과목 관리

- AP 과목별 코스
- SAT 섹션별 연습
- 진행률 추적

## 🔧 개발 환경 설정

### 필수 요구사항

- Node.js 18+
- pnpm (권장 패키지 매니저)

### 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 린팅
pnpm lint
```

### 환경 변수

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📱 반응형 디자인

- **Mobile First** 접근 방식
- Tailwind CSS 반응형 유틸리티 활용
- 다양한 화면 크기 지원

## 🔒 보안

- Supabase RLS (Row Level Security)
- 클라이언트 사이드 검증 (Zod)
- TypeScript 타입 안전성

## 🚀 성능 최적화

- Next.js App Router
- Turbopack (개발 모드)
- TanStack Query 캐싱
- 이미지 최적화
- 코드 스플리팅

## 📊 모니터링 및 분석

- TanStack Query DevTools
- React DevTools
- ESLint 코드 품질 검사

## 🔄 마이그레이션 히스토리

이 프로젝트는 원본 `lms-figma` 프로젝트에서 Next.js로 마이그레이션되었습니다:

- **원본**: React + Vite 기반
- **현재**: Next.js 15 + App Router
- **디자인**: Figma 디자인 시스템 완전 복원
- **기능**: 모든 기능 이식 완료

## 📝 개발 가이드라인

### 컴포넌트 작성

- TypeScript 사용 필수
- Shadcn UI 컴포넌트 우선 사용
- 접근성 고려 (ARIA 속성)
- 반응형 디자인 적용

### 상태 관리

- 전역 상태: Zustand
- 서버 상태: TanStack Query
- 폼 상태: React Hook Form

### 스타일링

- Tailwind CSS 유틸리티 클래스 사용
- CSS 변수 활용 (디자인 시스템)
- 일관된 컬러 팔레트 사용

---

**마지막 업데이트**: 2024년 12월
**버전**: 0.1.0
**개발자**: mskim
