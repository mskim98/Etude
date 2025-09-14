# 📊 Overview Page 기능 문서

## 🎯 개요

Overview 페이지는 학생들이 LMS에 로그인한 후 가장 먼저 보는 대시보드 페이지입니다. 학습 진행 상황, 시험 일정, 공지사항 등을 한눈에 볼 수 있도록 구성되어 있습니다.

## 🏗️ 전체 구조

```
Dashboard (메인 컨테이너)
├── PersonalInformation (개인정보)
├── Announcements (공지사항)
├── ExamSchedule (시험 일정)
├── APCourses (AP 과목)
├── SATMockExams (SAT 모의고사)
└── SubjectProgress (학습 진행도)
```

---

## 📋 1. PersonalInformation (개인정보 컴포넌트)

### 🎯 **목적**

사용자의 기본 정보와 서비스 이용 현황을 표시

### 📊 **표시 정보**

- **이름**: `profile.name`
- **이메일**: `auth.users.email`
- **대학교**: `profile.university`
- **전공**: `profile.major`
- **역할**: `profile.role` (Student/Teacher/Admin)
- **상태**: `profile.state` (Pending/Approved)

### 🔧 **기술 구현**

- **데이터 소스**: Zustand Store (`useAuthStore`)
- **인증 상태**: 실시간 사용자 정보 연동
- **타입 안전성**: TypeScript Profile 타입 사용

### 💡 **주요 기능**

- 로그인한 사용자 정보 자동 표시
- 권한 및 승인 상태 시각적 표시
- 반응형 레이아웃 지원

---

## 📢 2. Announcements (공지사항 컴포넌트)

### 🎯 **목적**

최신 공지사항을 시간순으로 표시하여 중요한 정보 전달

### 📊 **표시 정보**

- **제목**: `announcement.title`
- **내용**: `announcement.notification`
- **작성자**: `profile.name` (Teacher/Operations Team)
- **긴급도**: High/Medium/Low 배지
- **카테고리**: AP/SAT 배지
- **작성일**: 상대적 시간 (예: "2시간 전")

### 🔧 **기술 구현**

```typescript
// 데이터 훅
const { announcements, isLoading, error, refresh } = useDashboardAnnouncements(6);

// 서비스 레이어
AnnouncementService.getAnnouncements();
```

### 🎨 **UI 특징**

- **최대 6개** 공지사항 표시
- **스크롤 가능**: 384px 최대 높이
- **새로고침 버튼**: 실시간 데이터 업데이트
- **로딩/에러 상태**: 사용자 친화적 피드백

### 🔐 **권한 관리**

- **조회**: 모든 인증된 사용자
- **작성**: Teacher/Admin만 가능 (RLS 정책)

### 📝 **데이터 플로우**

1. `useDashboardAnnouncements` 훅 실행
2. `AnnouncementService.getAnnouncements()` 호출
3. Supabase에서 `announcement` + `profile` JOIN 쿼리
4. 데이터 변환 및 정렬 (긴급도 → 시간순)
5. UI 컴포넌트 렌더링

---

## 📅 3. ExamSchedule (시험 일정 컴포넌트)

### 🎯 **목적**

다가오는 시험 일정을 D-Day 형태로 표시하여 학습 계획 수립 지원

### 📊 **표시 정보**

- **시험명**: `schedule.title`
- **시험 날짜**: `schedule.d_day`
- **카테고리**: AP/SAT 아이콘 및 배지
- **D-Day**: 남은 일수 계산 (D-DAY, D-1, D-7 등)
- **긴급도**: 7일 이내 시험은 빨간색 표시

### 🔧 **기술 구현**

```typescript
// 데이터 훅
const { schedules, loading, error, refreshSchedules } = useExamSchedule();

// 서비스 레이어
ScheduleService.getSchedules();
```

### 🎨 **UI 특징**

- **긴급도 시각화**: 색상으로 구분 (빨강/회색)
- **D-Day 계산**: 실시간 날짜 차이 계산
- **애니메이션**: D-DAY인 경우 깜박임 효과
- **아이콘**: AP(📚), SAT(📋)으로 구분

### ⏰ **날짜 로직**

```typescript
// D-Day 계산
const daysUntil = Math.ceil((scheduleDate - today) / (1000 * 60 * 60 * 24));

// 상태 분류
- "today": daysUntil === 0
- "upcoming": daysUntil > 0
- "past": daysUntil < 0
```

### 🔐 **권한 관리**

- **조회**: 모든 인증된 사용자
- **작성**: Teacher/Admin만 가능 (RLS 정책)

### 📝 **데이터 플로우**

1. `useExamSchedule` 훅 실행
2. `ScheduleService.getSchedules()` 호출
3. Supabase에서 `schedule` 테이블 쿼리
4. 클라이언트에서 D-Day 계산 및 상태 분류
5. 긴급도에 따른 스타일링 적용

---

## 📚 4. APCourses (AP 과목 컴포넌트)

### 🎯 **목적**

AP 과목별 학습 진행 상황과 시험 접근 제공

### 📊 **표시 정보**

- **과목명**: Biology, Chemistry, Physics 등
- **진행률**: 백분율 프로그레스 바
- **상태**: In Progress/Completed/Not Started
- **챕터 정보**: 완료된 챕터/전체 챕터

### 🔧 **기술 구현**

- **데이터**: Mock 데이터 (향후 실제 DB 연동 예정)
- **진행률 계산**: 완료 챕터 / 전체 챕터 \* 100

### 🎨 **UI 특징**

- **프로그레스 바**: 시각적 진행률 표시
- **과목 아이콘**: 각 과목별 대표 이모지
- **클릭 가능**: 과목 선택 시 상세 페이지 이동

---

## 📝 5. SATMockExams (SAT 모의고사 컴포넌트)

### 🎯 **목적**

SAT 모의고사 목록과 성적 기록 제공

### 📊 **표시 정보**

- **시험명**: SAT Practice Test 1, 2 등
- **점수**: 총점/1600점
- **섹션별 점수**: Reading & Writing/Math
- **응시 상태**: 완료/미완료

### 🔧 **기술 구현**

- **데이터**: Mock 데이터 (향후 실제 DB 연동 예정)
- **점수 계산**: 섹션별 점수 합계

### 🎨 **UI 특징**

- **점수 표시**: 큰 숫자로 강조
- **섹션 구분**: Reading & Writing + Math
- **상태 배지**: 완료/미완료 표시

---

## 📈 6. SubjectProgress (학습 진행도 컴포넌트)

### 🎯 **목적**

전체적인 학습 진행 상황을 요약하여 표시

### 📊 **표시 정보**

- **전체 진행률**: 모든 과목 평균 진행률
- **이번 주 활동**: 주간 학습 시간
- **완료된 과목**: 100% 완료 과목 수
- **목표 달성률**: 설정된 목표 대비 진행률

### 🔧 **기술 구현**

- **데이터**: Mock 데이터 (향후 실제 학습 로그 연동 예정)
- **진행률 계산**: 가중 평균 또는 단순 평균

### 🎨 **UI 특징**

- **원형 차트**: 전체 진행률 시각화
- **통계 카드**: 주요 지표별 카드 형태
- **색상 코딩**: 진행률에 따른 색상 변화

---

## 🔧 공통 기술 스택

### 📦 **상태 관리**

- **Zustand**: 전역 인증 상태 (`useAuthStore`)
- **React Query**: 서버 상태 관리 (향후 적용 예정)
- **React Hooks**: 로컬 상태 및 생명주기 관리

### 🎨 **UI 라이브러리**

- **Shadcn UI**: 기본 컴포넌트 (Card, Button, Badge 등)
- **Tailwind CSS**: 스타일링 및 반응형 디자인
- **Lucide React**: 아이콘 라이브러리

### 🔐 **보안**

- **Supabase RLS**: 테이블별 세밀한 권한 제어
- **JWT 토큰**: 자동 인증 상태 관리
- **TypeScript**: 타입 안전성 보장

### 🗄️ **데이터베이스**

```sql
-- 주요 테이블들
announcement (공지사항)
schedule (시험 일정)
profile (사용자 프로필)
service (서비스 정보)
user_service (사용자-서비스 매핑)
```

---

## 🚀 향후 개발 계획

### ✅ **완료된 기능**

- ✅ PersonalInformation: 실제 데이터 연동
- ✅ Announcements: 완전한 CRUD 및 실시간 업데이트
- ✅ ExamSchedule: 완전한 일정 관리 시스템

### 🔄 **진행 중인 기능**

- 🔄 APCourses: 실제 AP 과목 데이터 연동
- 🔄 SATMockExams: 실제 시험 결과 데이터 연동
- 🔄 SubjectProgress: 학습 로그 기반 진행률 계산

### 📋 **예정된 기능**

- 📋 실시간 알림 시스템
- 📋 학습 분석 대시보드
- 📋 성적 추이 차트
- 📋 개인화된 학습 추천

---

## 🎯 성능 최적화

### ⚡ **로딩 최적화**

- **지연 로딩**: 컴포넌트별 독립적 데이터 로딩
- **캐싱**: 자주 조회되는 데이터 캐시 적용
- **에러 처리**: 각 컴포넌트별 독립적 에러 상태

### 📱 **반응형 디자인**

- **모바일 최적화**: 768px 이하 화면 지원
- **그리드 레이아웃**: CSS Grid 기반 유연한 배치
- **터치 친화적**: 모바일 터치 인터페이스 고려

---

## 📞 문의 및 지원

이 문서에 대한 질문이나 기능 개선 제안이 있으시면 개발팀에 문의해 주세요.

**마지막 업데이트**: 2025년 1월 15일  
**버전**: v1.0.0
