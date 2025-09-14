# 📊 Overview 페이지 데이터 연동 및 기능 구현

## 🎯 **이슈 개요**

현재 Dashboard의 Overview 탭에 있는 **기존 디자인과 레이아웃을 완전히 그대로 유지**하면서, 실제 데이터 연동 및 기능 구현을 완료합니다.

> ⚠️ **중요**: UI/UX 디자인 변경 없이, 기존 컴포넌트의 데이터 연동만 수행합니다.

## 📋 **현재 상태**

### ✅ **구현된 UI 컴포넌트**

- `PersonalInformation` - 개인 정보 표시 (Mock 데이터)
- `DateSection` - 날짜 섹션 (정적 표시)
- `ExamSchedule` - 시험 일정 (Mock 데이터)
- `Announcements` - 공지사항 (Mock 데이터)
- `SubjectProgress` - 과목별 진행률 (Mock 데이터)

### 🔄 **구현이 필요한 영역**

- **실제 데이터 연동** (현재 Mock 데이터 사용)
- **Supabase 데이터베이스 연동**
- **API 로직 구현**
- **상태 관리 및 캐싱**
- **에러 처리 및 로딩 상태**

## 🚀 **구현할 기능 (기존 UI 유지)**

### 1. **👤 PersonalInformation 컴포넌트**

```typescript
// 현재: Mock 사용자 데이터
// 목표: 실제 Supabase profile 테이블 연동
```

- **실제 사용자 프로필 데이터 연동**
- **useAuthStore의 user 데이터 활용**
- **프로필 편집 기능 활성화** (기존 UI 그대로)
- **실시간 데이터 업데이트**

### 2. **📅 DateSection 컴포넌트**

```typescript
// 현재: 정적 날짜 표시
// 목표: 실시간 날짜/시간 업데이트
```

- **실시간 날짜/시간 표시**
- **한국 시간대 기반 포맷팅**
- **자동 업데이트 (1분마다)**
- **다국어 지원 (한국어 우선)**

### 3. **📋 ExamSchedule 컴포넌트**

```typescript
// 현재: Mock subjects 데이터
// 목표: Supabase schedule 테이블 연동
```

- **Supabase `schedule` 테이블 연동**
- **사용자별 시험 일정 필터링**
- **날짜별 정렬 및 표시**
- **D-Day 계산 로직**
- **일정 추가/편집 기능** (기존 UI 유지)

### 4. **📢 Announcements 컴포넌트**

```typescript
// 현재: 하드코딩된 공지사항
// 목표: Supabase announcement 테이블 연동
```

- **Supabase `announcement` 테이블 연동**
- **최신순 정렬 표시**
- **읽음/안읽음 상태 관리**
- **중요도별 우선순위 표시**
- **실시간 업데이트 (Realtime)**

### 5. **📊 SubjectProgress 컴포넌트**

```typescript
// 현재: Mock 진행률 데이터
// 목표: 실제 사용자 학습 데이터 기반 계산
```

- **실제 진행률 계산 로직**
- **사용자별 AP/SAT 결과 데이터 연동**
- **점수 및 성과 추적**
- **마지막 학습일 표시**
- **다음 추천 과목 로직**

## 🛠 **기술적 구현 사항**

### **데이터베이스 연동**

```sql
-- 기존 테이블 활용 (추가 테이블 생성 없음)
- auth.users          # 사용자 기본 정보
- public.profile      # 사용자 프로필
- public.schedule     # 시험 일정
- public.announcement # 공지사항
- public.user_ap_result     # AP 시험 결과
- public.user_sat_result    # SAT 시험 결과
```

### **새로운 훅 구현**

```typescript
// src/hooks/overview/
├── usePersonalInfo.ts      # 개인정보 데이터 훅
├── useExamSchedule.ts      # 시험일정 데이터 훅
├── useAnnouncements.ts     # 공지사항 데이터 훅
├── useSubjectProgress.ts   # 진행률 계산 훅
└── useOverviewData.ts      # 통합 데이터 훅
```

### **서비스 레이어 구현**

```typescript
// src/lib/services/
├── overview.ts             # Overview 데이터 서비스
├── schedule.ts            # 일정 관리 서비스
├── announcements.ts       # 공지사항 서비스
└── progress.ts            # 진행률 계산 서비스
```

### **타입 정의 확장**

```typescript
// src/types/overview.ts
interface OverviewData {
	personalInfo: UserProfile;
	examSchedule: ExamScheduleItem[];
	announcements: AnnouncementItem[];
	subjectProgress: SubjectProgressData[];
}
```

## 🔄 **기존 컴포넌트 수정 범위**

### **수정하지 않을 부분**

- ✅ **UI 레이아웃 및 스타일링**
- ✅ **컴포넌트 구조 및 JSX**
- ✅ **Tailwind CSS 클래스**
- ✅ **아이콘 및 시각적 요소**
- ✅ **반응형 디자인**

### **수정할 부분 (데이터만)**

- 🔄 **Props 인터페이스 확장**
- 🔄 **데이터 소스 변경** (Mock → Real)
- 🔄 **로딩/에러 상태 추가**
- 🔄 **이벤트 핸들러 구현**

## 📦 **구현 단계**

### **Phase 1: 데이터 연동 기반 구축** (3일)

- [ ] Supabase 쿼리 함수 구현
- [ ] 커스텀 훅 개발
- [ ] 타입 정의 및 인터페이스

### **Phase 2: 컴포넌트별 데이터 연동** (4일)

- [ ] `PersonalInformation` 실데이터 연동
- [ ] `DateSection` 실시간 업데이트
- [ ] `ExamSchedule` DB 연동
- [ ] `Announcements` DB 연동

### **Phase 3: 진행률 계산 로직** (3일)

- [ ] `SubjectProgress` 계산 로직 구현
- [ ] AP/SAT 결과 데이터 분석
- [ ] 진행률 알고리즘 개발

### **Phase 4: 최적화 및 안정화** (2일)

- [ ] 캐싱 및 성능 최적화
- [ ] 에러 처리 강화
- [ ] 로딩 상태 UI 개선

## 🧪 **테스트 계획**

### **기능 테스트**

- [ ] 각 컴포넌트 데이터 로딩 테스트
- [ ] 실시간 업데이트 동작 확인
- [ ] 에러 상황 처리 검증

### **성능 테스트**

- [ ] 데이터 로딩 시간 측정
- [ ] 메모리 사용량 최적화
- [ ] 캐싱 효율성 검증

### **사용자 테스트**

- [ ] 실제 사용자 데이터로 테스트
- [ ] 다양한 데이터 시나리오 검증
- [ ] 브라우저 호환성 테스트

## 🎯 **성공 지표**

### **기능적 요구사항**

- [ ] 모든 컴포넌트가 실제 데이터 표시
- [ ] 실시간 업데이트 정상 동작
- [ ] 에러 없는 안정적 동작

### **성능 요구사항**

- [ ] 초기 로딩 시간 < 3초
- [ ] 데이터 업데이트 지연 < 1초
- [ ] 메모리 누수 없음

### **사용자 경험**

- [ ] 기존 UI/UX와 동일한 사용감
- [ ] 로딩 상태 명확한 표시
- [ ] 에러 상황 사용자 친화적 처리

## 🚫 **명확히 하지 않을 것**

- ❌ **새로운 UI 컴포넌트 추가**
- ❌ **디자인 시스템 변경**
- ❌ **레이아웃 구조 수정**
- ❌ **추가 기능 구현** (통계, 게임화 등)
- ❌ **새로운 페이지 생성**

---

**📅 예상 작업 기간**: 2주 (12일)  
**👥 필요 인원**: Frontend 개발자 1명  
**🔧 우선순위**: High  
**📱 플랫폼**: Web (기존 호환성 유지)  
**🎨 디자인**: 기존 디자인 100% 유지

---

**작성자**: mskim  
**작성일**: 2024-12-14  
**이슈 태그**: `data-integration`, `overview`, `supabase`, `no-ui-changes`
