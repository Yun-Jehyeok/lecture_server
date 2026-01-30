# 프로젝트 구조 및 파일 설명

## 📁 전체 디렉토리 구조

```
server/
├── src/                           # 소스 코드
│   ├── auth/                      # 인증 모듈
│   │   ├── auth.controller.ts     # 인증 컨트롤러
│   │   ├── auth.service.ts        # 인증 서비스
│   │   ├── auth.dto.ts            # 인증 DTO
│   │   ├── jwt.strategy.ts        # JWT 전략
│   │   └── jwt-auth.guard.ts      # JWT 인증 가드
│   │
│   ├── users/                     # 사용자 모듈
│   │   └── users.service.ts       # 사용자 서비스
│   │
│   ├── categories/                # 카테고리 모듈
│   │   ├── categories.service.ts  # 카테고리 서비스
│   │   └── categories.controller.ts # 카테고리 컨트롤러
│   │
│   ├── courses/                   # 강의 모듈
│   │   ├── courses.service.ts     # 강의 서비스
│   │   └── courses.controller.ts  # 강의 컨트롤러
│   │
│   ├── curriculum/                # 커리큘럼 모듈
│   │   ├── curriculum.service.ts  # 커리큘럼 서비스
│   │   └── curriculum.controller.ts # 커리큘럼 컨트롤러
│   │
│   ├── lessons/                   # 레슨 모듈
│   │   ├── lessons.service.ts     # 레슨 서비스
│   │   └── lessons.controller.ts  # 레슨 컨트롤러
│   │
│   ├── enrollments/               # 수강 신청 모듈
│   │   ├── enrollments.service.ts # 수강 신청 서비스
│   │   └── enrollments.controller.ts # 수강 신청 컨트롤러
│   │
│   ├── reviews/                   # 리뷰 모듈
│   │   ├── reviews.service.ts     # 리뷰 서비스
│   │   └── reviews.controller.ts  # 리뷰 컨트롤러
│   │
│   ├── notes/                     # 노트 모듈
│   │   ├── notes.service.ts       # 노트 서비스
│   │   └── notes.controller.ts    # 노트 컨트롤러
│   │
│   ├── learning-progress/         # 학습 진행 모듈
│   │   ├── learning-progress.service.ts
│   │   └── learning-progress.controller.ts
│   │
│   ├── promotions/                # 배너/프로모션 모듈
│   │   ├── promotions.service.ts
│   │   └── promotions.controller.ts
│   │
│   ├── common/                    # 공용 서비스
│   │   ├── prisma.service.ts      # Prisma 서비스
│   │   └── crypto.service.ts      # 암호화 서비스 (bcrypt)
│   │
│   ├── app.module.ts              # 메인 Nest 모듈
│   ├── app.controller.ts          # 메인 컨트롤러
│   ├── app.service.ts             # 메인 서비스
│   └── main.ts                    # 애플리케이션 진입점
│
├── prisma/                        # Prisma ORM
│   ├── schema.prisma              # 데이터베이스 스키마
│   ├── seed.ts                    # 초기 데이터 시드
│   └── migrations/                # 데이터베이스 마이그레이션
│       └── 0_init/
│           └── migration.sql
│
├── .env                           # 환경 변수 (git ignore)
├── .env.example                   # 환경 변수 예시
├── .env.test                      # 테스트 환경 변수
├── .gitignore                     # Git 무시 파일
├── .nestrc.json                   # Nest CLI 설정
├── package.json                   # npm 의존성
├── tsconfig.json                  # TypeScript 설정
│
├── README.md                      # 프로젝트 개요
├── SETUP.md                       # 설치 및 셋업 가이드
├── API_DOCUMENTATION.md           # 상세 API 문서
└── PROJECT_STRUCTURE.md           # 이 파일 (프로젝트 구조)
```

## 📄 주요 파일 설명

### `src/main.ts`

- 애플리케이션 진입점
- Express 서버 초기화
- 미들웨어 설정 (ValidationPipe, CORS)
- 포트 3000에서 서버 실행

### `src/app.module.ts`

- Nest.js 메인 모듈
- 모든 서브 모듈 임포트
- JWT 설정
- 환경 변수 설정

### `src/common/prisma.service.ts`

- Prisma 클라이언트 관리
- 데이터베이스 연결/해제
- 애플리케이션 생명주기 관리

### `src/common/crypto.service.ts`

- bcrypt를 사용한 비밀번호 해싱
- 비밀번호 비교

### `src/auth/`

- **jwt.strategy.ts**: Passport JWT 전략 구현
- **jwt-auth.guard.ts**: JWT 토큰 검증 가드
- **auth.service.ts**: 회원가입, 로그인, JWT 토큰 생성
- **auth.controller.ts**: 인증 관련 엔드포인트
- **auth.dto.ts**: 요청/응답 스키마

### `src/courses/`

- **courses.service.ts**: 강의 조회, 검색, 필터, 정렬 로직
- **courses.controller.ts**: 강의 관련 엔드포인트

### `src/enrollments/`

- **enrollments.service.ts**: 수강 신청, 취소, 진행률 관리
- **enrollments.controller.ts**: 수강 관련 엔드포인트

### `prisma/schema.prisma`

- 데이터베이스 스키마 정의
- 13개 테이블 정의
- 관계(Relations) 정의
- 인덱스 정의

### `prisma/migrations/0_init/migration.sql`

- 초기 데이터베이스 마이그레이션
- 모든 테이블 생성
- 외래키 설정
- 유니크 인덱스 설정

## 🗄️ 데이터베이스 테이블 관계도

```
┌─────────────────────────────────────────────────────────┐
│                       users                              │
│  id(PK) | email | username | password_hash | profile... │
└──────────────────────┬──────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┬──────────────┐
         ▼             ▼             ▼              ▼
   ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐
   │enrollments│ │reviews   │ │notes    │ │recent   │
   └──────────┘  └──────────┘  └─────────┘  │_courses│
         │             │             │        └──────────┘
         ▼             ▼             ▼
   ┌─────────────────────────────────────┐
   │           courses                    │
   │ id(PK) | title | category_id | ... │
   └─────────────────────────────────────┘
         │
         │ has_many
         ├────────────────────────┬────────────────┐
         ▼                        ▼                ▼
   ┌─────────────┐         ┌──────────────┐  ┌──────────────┐
   │categories   │         │curriculum    │  │learning      │
   │             │         │_sections     │  │_points       │
   └─────────────┘         └──────────────┘  └──────────────┘
                                  │
                                  │
                                  ▼
                            ┌──────────────┐
                            │   lessons    │
                            └──────────────┘
                                  │
                                  │
                                  ▼
                     ┌─────────────────────────┐
                     │user_lesson_progress     │
                     └─────────────────────────┘

Additional Tables:
- banners: 홈 배너
- promotions: 프로모션
```

## 🔄 API 계층 구조

```
HTTP Request
    │
    ▼
Controller (요청 처리)
    │ (쿼리 파라미터, 본문 추출)
    ▼
Service (비즈니스 로직)
    │ (데이터 처리, 계산)
    ▼
Prisma Client (데이터베이스 쿼리)
    │
    ▼
PostgreSQL Database
    │
    ▼
Response (JSON)
```

## 📊 인증 흐름

```
User Registration/Login
         │
         ▼
  AuthService
    │ hash/verify password
    │ generate JWT token
    ▼
    AccessToken
         │
         ▼
   HTTP Header: Authorization: Bearer <token>
         │
         ▼
  JwtAuthGuard
    │ validate token
    │ extract user
    ▼
Protected Route
```

## 🛡️ 보안 기능

- **JWT 기반 인증**: Bearer 토큰 사용
- **비밀번호 해싱**: bcrypt로 안전한 저장
- **CORS**: 교차 출처 요청 관리
- **검증**: class-validator로 입력 검증
- **타입 안전성**: TypeScript 사용

## 📦 의존성 구조

```
Nest.js Core (@nestjs/common, @nestjs/core)
    ├── @nestjs/config (환경 변수)
    ├── @nestjs/jwt (JWT 토큰)
    ├── @nestjs/passport (Passport 통합)
    │   └── passport-jwt (JWT 전략)
    │
    ├── @prisma/client (ORM)
    │
    ├── class-validator (입력 검증)
    ├── class-transformer (데이터 변환)
    │
    └── bcrypt (비밀번호 해싱)
```

## 🚀 애플리케이션 시작 순서

1. `main.ts` 실행
2. `AppModule` 초기화
3. `PrismaService` 데이터베이스 연결
4. `JwtStrategy` 등록
5. 모든 컨트롤러 초기화
6. Express 서버 3000 포트에서 대기

## 📝 환경 변수

```
DATABASE_URL          # PostgreSQL 연결 문자열
JWT_SECRET            # JWT 서명 키
JWT_EXPIRES_IN        # 토큰 만료 시간
NODE_ENV              # 실행 환경 (development/production)
PORT                  # 서버 포트
```

## 🧪 테스트 구조

```
tests/
├── unit/
│   ├── auth/
│   ├── courses/
│   └── ...
├── integration/
│   └── ...
└── e2e/
    └── ...
```

## 📚 참고 문서

- [Nest.js 공식 문서](https://docs.nestjs.com/)
- [Prisma 문서](https://www.prisma.io/docs/)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Passport.js](https://www.passportjs.org/)
