# Online Lecture Platform API

온라인 강의 플랫폼의 백엔드 서버입니다. Nest.js, PostgreSQL, Prisma ORM을 사용하여 구축되었습니다.

## 기술 스택

- **Framework**: Nest.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (passport-jwt)
- **Language**: TypeScript
- **Validation**: class-validator, class-transformer

## 설치

### 필수 요구사항

- Node.js 18+
- PostgreSQL 13+
- npm 또는 yarn

### 설치 단계

```bash
# 1. 프로젝트 디렉토리로 이동
cd server

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env
# .env 파일을 열어서 DATABASE_URL과 JWT_SECRET을 수정

# 4. 데이터베이스 마이그레이션
npm run prisma:migrate

# 5. Prisma 클라이언트 생성
npm run prisma:generate
```

## 환경 변수

`.env` 파일에 다음 변수를 설정하세요:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lecture_platform"

# JWT
JWT_SECRET=your-secret-key-change-me-in-production
JWT_EXPIRES_IN=24h

# Server
NODE_ENV=development
PORT=3000
```

## 실행

### 개발 모드

```bash
npm run start:dev
```

### 프로덕션 모드

```bash
npm run build
npm run start:prod
```

### Prisma Studio (데이터베이스 GUI)

```bash
npm run prisma:studio
```

## 데이터베이스 구조

### 테이블 목록

1. **users** - 사용자 정보
2. **categories** - 강의 카테고리
3. **courses** - 강의 정보
4. **curriculum_sections** - 강의 섹션
5. **lessons** - 강의 레슨/영상
6. **enrollments** - 수강 신청
7. **user_lesson_progress** - 레슨 진행 상황
8. **reviews** - 강의 리뷰
9. **learning_points** - 강의 학습 목표
10. **notes** - 사용자 노트
11. **banners** - 홈 배너
12. **promotions** - 프로모션
13. **recent_courses** - 최근 본 강의

## API 엔드포인트

### 인증/사용자 관리

- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 사용자 정보
- `PUT /api/users/profile` - 프로필 수정
- `PUT /api/users/password` - 비밀번호 변경

### 카테고리

- `GET /api/categories` - 전체 카테고리 목록
- `GET /api/categories/:id` - 특정 카테고리 상세

### 강의

- `GET /api/courses` - 강의 목록 (검색, 필터, 정렬 지원)
- `GET /api/courses/popular` - 인기 강의
- `GET /api/courses/bestseller` - 베스트셀러 강의
- `GET /api/courses/new` - 신규 강의
- `GET /api/courses/:id` - 강의 상세 정보
- `GET /api/courses/:id/rating` - 강의 평점 정보

### 커리큘럼

- `GET /api/courses/:courseId/curriculum` - 강의 커리큘럼 전체
- `GET /api/courses/:courseId/sections` - 섹션 목록
- `GET /api/courses/:courseId/sections/:sectionId` - 특정 섹션 상세

### 레슨

- `GET /api/lessons/:lessonId` - 레슨 상세 정보
- `GET /api/lessons/:lessonId/materials` - 강의 자료
- `POST /api/lessons/:lessonId/complete` - 레슨 완료 표시
- `DELETE /api/lessons/:lessonId/complete` - 레슨 완료 취소
- `PUT /api/lessons/:lessonId/watch-time` - 시청 시간 업데이트

### 수강 신청

- `POST /api/enrollments` - 강의 신청
- `GET /api/enrollments` - 내 수강 강의 목록
- `GET /api/enrollments/:courseId` - 특정 강의 수강 정보
- `GET /api/enrollments/:courseId/progress` - 강의 진행률
- `DELETE /api/enrollments/:enrollmentId` - 수강 취소

### 리뷰

- `GET /api/courses/:courseId/reviews` - 리뷰 목록
- `POST /api/courses/:courseId/reviews` - 리뷰 작성
- `PUT /api/reviews/:reviewId` - 리뷰 수정
- `DELETE /api/reviews/:reviewId` - 리뷰 삭제

### 노트

- `GET /api/lessons/:lessonId/notes` - 레슨 노트 조회
- `POST /api/lessons/:lessonId/notes` - 노트 작성/수정
- `GET /api/enrollments/:courseId/notes` - 강의 전체 노트

### 학습 통계

- `GET /api/users/learning-stats` - 학습 통계
- `GET /api/users/recent-courses` - 최근 본 강의
- `POST /api/users/recent-courses/:courseId` - 최근 본 강의 추가

### 배너/프로모션

- `GET /api/banners` - 홈 배너 목록
- `GET /api/promotions` - 진행 중인 프로모션

## 프로젝트 구조

```
src/
├── auth/              # 인증 모듈
├── users/             # 사용자 모듈
├── categories/        # 카테고리 모듈
├── courses/           # 강의 모듈
├── curriculum/        # 커리큘럼 모듈
├── lessons/           # 레슨 모듈
├── enrollments/       # 수강 신청 모듈
├── reviews/           # 리뷰 모듈
├── learning-progress/ # 학습 진행 모듈
├── notes/             # 노트 모듈
├── promotions/        # 배너/프로모션 모듈
├── common/            # 공통 서비스/유틸리티
├── app.module.ts      # 메인 모듈
├── app.controller.ts  # 메인 컨트롤러
├── app.service.ts     # 메인 서비스
└── main.ts            # 애플리케이션 진입점

prisma/
├── schema.prisma      # Prisma 스키마
└── migrations/        # 마이그레이션 파일
```

## 주요 기능

### 인증

- JWT 기반 인증
- 비밀번호 해싱 (bcrypt)
- 회원가입/로그인

### 강의 관리

- 강의 목록 조회 (필터, 검색, 정렬)
- 강의 상세 정보
- 커리큘럼 및 레슨 조회

### 수강 관리

- 강의 수강 신청
- 수강 취소
- 진행률 추적

### 학습 추적

- 레슨별 완료 상태
- 시청 시간 기록
- 학습 통계

### 사용자 피드백

- 강의 리뷰 및 평점
- 학습 노트

## API 요청 예시

### 회원가입

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "username",
    "password": "password123"
  }'
```

### 로그인

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 강의 목록 조회

```bash
curl -X GET "http://localhost:3000/api/courses?page=1&limit=12&sort=latest&category_id=1"
```

### 강의 신청 (JWT 토큰 필요)

```bash
curl -X POST http://localhost:3000/api/enrollments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "courseId": "course_id"
  }'
```

## 문제 해결

### 데이터베이스 연결 실패

- PostgreSQL 서버가 실행 중인지 확인하세요
- `DATABASE_URL` 환경 변수가 올바른지 확인하세요

### 마이그레이션 오류

```bash
# 마이그레이션 초기화
npm run prisma:migrate -- --name init
```

## 라이센스

이 프로젝트는 MIT 라이센스 하에 있습니다.

## 지원

문제가 발생하면 이슈를 생성해주세요.
