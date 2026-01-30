# 온라인 강의 플랫폼 서버 셋업 가이드

이 가이드는 온라인 강의 플랫폼 API 서버를 설정하고 실행하는 방법을 설명합니다.

## 📋 사전 요구사항

- **Node.js**: 18.0.0 이상
- **npm**: 9.0.0 이상
- **PostgreSQL**: 13.0 이상
- **Git**

## 🚀 빠른 시작

### 1단계: PostgreSQL 데이터베이스 설정

```bash
# PostgreSQL 클라이언트 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE lecture_platform;
CREATE USER lecture_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE lecture_platform TO lecture_user;

# 또는 Windows에서 pgAdmin 사용
```

### 2단계: 환경 설정

```bash
# .env 파일 생성 (이미 있는 경우 수정)
# .env.example을 참고하여 다음 값을 설정하세요:

DATABASE_URL="postgresql://lecture_user:your_password@localhost:5432/lecture_platform"
JWT_SECRET="your-strong-secret-key-here"
JWT_EXPIRES_IN=24h
NODE_ENV=development
PORT=3000
```

### 3단계: 프로젝트 초기화

```bash
# 의존성 설치
npm install

# Prisma 클라이언트 생성
npm run prisma:generate

# 데이터베이스 마이그레이션 실행
npm run prisma:migrate
```

### 4단계: 서버 실행

```bash
# 개발 모드 (자동 재시작 포함)
npm run start:dev

# 프로덕션 모드
npm run build
npm run start:prod
```

서버가 `http://localhost:3000`에서 실행됩니다.

## 📚 주요 npm 명령어

```bash
# 개발 서버 실행 (watch 모드)
npm run start:dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start:prod

# Prisma 마이그레이션 (개발)
npm run prisma:migrate

# Prisma 마이그레이션 (프로덕션)
npm run prisma:migrate:prod

# Prisma Studio (GUI 데이터베이스 관리자)
npm run prisma:studio

# Prisma 스키마에서 클라이언트 재생성
npm run prisma:generate
```

## 🔐 JWT 설정

`.env` 파일에서 `JWT_SECRET`을 설정하세요:

```
JWT_SECRET=your-strong-secret-key-at-least-32-characters-long
JWT_EXPIRES_IN=24h
```

개발 환경에서는 기본값을 사용할 수 있지만, **프로덕션 환경에서는 반드시 강력한 비밀 키를 설정하세요.**

## 🗄️ 데이터베이스 마이그레이션

### 초기 마이그레이션 (최초 한 번)

```bash
npm run prisma:migrate
```

### 스키마 변경 후

1. `prisma/schema.prisma` 수정
2. 마이그레이션 생성:
    ```bash
    npm run prisma:migrate -- --name your_migration_name
    ```

### Prisma Studio로 데이터 관리

```bash
npm run prisma:studio
```

브라우저에서 `http://localhost:5555`로 접속하면 GUI로 데이터를 관리할 수 있습니다.

## 📡 API 테스트

### Postman 또는 cURL로 테스트

```bash
# 서버 상태 확인
curl http://localhost:3000/health

# 회원가입
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123"
  }'

# 로그인
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# 강의 목록 조회
curl http://localhost:3000/api/courses

# 카테고리 목록
curl http://localhost:3000/api/categories
```

## 🐛 문제 해결

### PostgreSQL 연결 오류

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**해결방법:**

- PostgreSQL 서비스가 실행 중인지 확인
- `DATABASE_URL`의 호스트, 포트, 사용자명, 비밀번호 확인
- Windows: `services.msc`에서 PostgreSQL 서비스 시작

### Prisma 마이그레이션 오류

```bash
# 마이그레이션 초기화 및 재실행
npm run prisma:migrate -- --skip-generate

# 또는 모든 마이그레이션 초기화
rm -rf prisma/migrations
npm run prisma:migrate -- --name init
```

### 포트 이미 사용 중

포트 3000이 이미 사용 중인 경우:

```bash
# .env에서 PORT 변경
PORT=3001

# 또는 Windows에서 포트 프로세스 종료
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### JWT 토큰 오류

요청 시 다음과 같이 Authorization 헤더를 포함하세요:

```bash
curl -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  http://localhost:3000/api/auth/me
```

## 📦 프로젝트 구조

```
server/
├── src/
│   ├── auth/              # 인증 로직
│   ├── users/             # 사용자 관리
│   ├── categories/        # 강의 카테고리
│   ├── courses/           # 강의 정보
│   ├── curriculum/        # 커리큘럼/섹션
│   ├── lessons/           # 레슨/영상
│   ├── enrollments/       # 수강 신청
│   ├── reviews/           # 리뷰/평점
│   ├── notes/             # 사용자 노트
│   ├── learning-progress/ # 학습 진행
│   ├── promotions/        # 배너/프로모션
│   ├── common/            # 공용 서비스
│   ├── app.module.ts      # 메인 모듈
│   └── main.ts            # 진입점
├── prisma/
│   ├── schema.prisma      # 데이터베이스 스키마
│   └── migrations/        # 마이그레이션
├── .env                   # 환경 변수 (git ignore)
├── .env.example           # 환경 변수 예시
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 보안 체크리스트

- [ ] `.env` 파일을 git에서 제외했는가?
- [ ] JWT_SECRET을 강력한 값으로 설정했는가?
- [ ] PostgreSQL 비밀번호를 변경했는가?
- [ ] CORS 설정을 확인했는가?
- [ ] 프로덕션 환경에서는 NODE_ENV=production으로 설정했는가?

## 📝 다음 단계

1. **데이터 시딩**: 초기 데이터 추가
2. **API 문서**: Swagger 또는 OpenAPI 추가
3. **로깅**: Winston 또는 Pino로 로깅 구현
4. **테스팅**: Jest로 단위 테스트 작성
5. **CI/CD**: GitHub Actions 또는 GitLab CI 설정

## 💬 도움말

문제가 발생하면:

1. README.md 확인
2. 이슈 생성
3. 로그 메시지 확인

## 📄 라이센스

MIT
