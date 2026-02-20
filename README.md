# 🧊 CHILLGRAM AI FE (AD Scramble)

AD Scramble 는 **식품 브랜드를 위한 AI 기반 광고 자동 생성 및 SNS 운영 플랫폼**입니다.

브랜드 제품을 등록하면,

- ✍ AI 광고 카피 생성
- 🎨 패키지 도안 생성
- 🖼 SNS 콘텐츠 생성
- 🎬 숏폼 영상 생성
- 📊 광고 성과 분석 및 리포트 제공



### 👥 R&R (Roles and Responsibilities)

| 역할 | 담당 |
| --- | --- |
| **FE** | **황태민**, 반선우, 이한조, 하태욱 |
| **BE** | **하태욱**, 오흥찬 |
| **AI** | **김채환**, 김지윤, 반선우, 오흥찬, 이한조, 황태민 |
| **DATA** | 김지윤, 하태욱 |
| **SERVER** | 오흥찬, 하태욱 |



### 🛠 Tech Stack

* **Framework**: React
* **Styling**: Tailwind CSS
* **State**: Zustand
* **Data Fetching**: React Query
* **Design**: Figma




### 📂 Project Structure

```
src/
├── api/          # API 통신을 위한 기본 설정
├── app/          # 애플리케이션의 엔트리 포인트 및 전역 Provider 설정
├── assets/       # 이미지, 아이콘, 폰트 등 정적 리소스 파일
├── components/   # 재사용 가능한 UI 컴포넌트 계층
│   ├── auth/       # 인증 관련 컴포넌트
│   ├── common/     # 공통 UI 요소 (Button, Input 등)
│   ├── layout/     # 페이지 레이아웃 (Header, Footer 등)
│   ├── navigation/ # 네비게이션 및 메뉴 관련 컴포넌트
│   ├── products/   # 제품 관리 및 광고 관련 컴포넌트
│   └── sns/        # SNS 연동 및 게시 관련 컴포넌트
├── data/         # Mock 데이터, 상수 설정 및 정적 리스트
├── hooks/        # 커스텀 훅 (공통 비즈니스 로직 분리)
├── lib/          # 외부 라이브러리 커스텀 설정 및 래퍼
├── pages/        # 서비스의 개별 페이지 단위 컴포넌트
│   ├── ad/         # 광고 생성 및 관리 페이지 그룹
│   ├── oauth/      # 소셜 로그인 및 인증 페이지 그룹
│   └── qna/        # 고객 문의 및 Q&A 페이지 그룹
├── routes/       # 라우팅 경로 정의 및 접근 권한(PrivateRoute) 관리
├── services/     # 비즈니스 로직 및 서버 상태 관리
│   ├── api/        # 도메인별 API 호출 함수
│   └── queries/    # React Query(useQuery, useMutation) 정의
├── stores/       # Zustand를 활용한 전역 상태 관리 저장소
└── utils/        # 공통 유틸리티 함수 (포맷팅, 검증 로직 등)

```





### 📝 Commit Convention

* **feat**: 기능 추가 (API/유스케이스/도메인 로직)
* **refactor**: 리팩토링 (동작 동일)
* **perf**: 성능 개선 (캐싱/렌더링 최적화)
* **docs**: 문서 수정 (README, 설계 문서 등)
* **test**: 테스트 코드 추가/수정
* **chore**: 빌드 설정, 의존성 관리, CI/CD 설정




