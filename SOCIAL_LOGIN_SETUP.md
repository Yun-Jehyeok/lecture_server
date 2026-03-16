# 소셜 로그인 설정 가이드

## 환경 변수 설정

`.env` 파일에 다음 환경 변수를 추가하세요:

```env
# JWT Secret
JWT_SECRET=your-jwt-secret-key-here
JWT_EXPIRES_IN=86400

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Kakao OAuth
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CALLBACK_URL=http://localhost:3000/api/auth/kakao/callback

# Naver OAuth
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret
NAVER_CALLBACK_URL=http://localhost:3000/api/auth/naver/callback
```

## 소셜 로그인 OAuth 앱 설정

### Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성 또는 선택
3. API 및 서비스 > 사용자 인증 정보 메뉴
4. OAuth 2.0 클라이언트 ID 생성
5. 승인된 리디렉션 URI에 `http://localhost:3000/api/auth/google/callback` 추가
6. 클라이언트 ID와 클라이언트 보안 비밀을 `.env`에 저장

### Kakao OAuth

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 내 애플리케이션 > 애플리케이션 추가하기
3. 앱 설정 > 플랫폼 > Web 플랫폼 등록
4. 제품 설정 > 카카오 로그인 활성화
5. Redirect URI에 `http://localhost:3000/api/auth/kakao/callback` 추가
6. 앱 키 > REST API 키를 `.env`의 `KAKAO_CLIENT_ID`에 저장

### Naver OAuth

1. [Naver Developers](https://developers.naver.com/) 접속
2. 애플리케이션 > 애플리케이션 등록
3. 사용 API: 네아로(네이버 아이디로 로그인) 선택
4. 서비스 URL: `http://localhost:3000`
5. Callback URL: `http://localhost:3000/api/auth/naver/callback`
6. 클라이언트 ID와 클라이언트 Secret을 `.env`에 저장

## 데이터베이스 마이그레이션

```bash
npm run prisma:migrate
```

## API 엔드포인트

### 소셜 로그인 시작

- `GET /api/auth/google` - Google 로그인 시작
- `GET /api/auth/kakao` - Kakao 로그인 시작
- `GET /api/auth/naver` - Naver 로그인 시작

### 콜백 (자동 처리)

- `GET /api/auth/google/callback` - Google 로그인 콜백
- `GET /api/auth/kakao/callback` - Kakao 로그인 콜백
- `GET /api/auth/naver/callback` - Naver 로그인 콜백

### 응답 형식

```json
{
    "user": {
        "id": "user-id",
        "email": "user@example.com",
        "username": "username",
        "profileImageUrl": "https://..."
    },
    "accessToken": "jwt-token"
}
```

## 사용 예시

### 프론트엔드에서 소셜 로그인 시작

```javascript
// Google 로그인
window.location.href = "http://localhost:3000/api/auth/google";

// Kakao 로그인
window.location.href = "http://localhost:3000/api/auth/kakao";

// Naver 로그인
window.location.href = "http://localhost:3000/api/auth/naver";
```

### 콜백 처리

콜백 URL에서 JSON 응답을 받아 `accessToken`을 저장하고 사용합니다:

```javascript
// 로그인 후 받은 accessToken을 저장
localStorage.setItem('accessToken', response.accessToken);

// API 요청 시 헤더에 포함
headers: {
  'Authorization': `Bearer ${accessToken}`
}
```

## 테스트

소셜 로그인을 테스트하려면:

1. 각 소셜 플랫폼에서 OAuth 앱 등록 완료
2. `.env` 파일에 클라이언트 ID와 시크릿 설정
3. 서버 실행: `npm run start:dev`
4. 브라우저에서 `http://localhost:3000/api/auth/google` 접속
5. 소셜 로그인 진행 후 콜백에서 JWT 토큰 확인

## 주의사항

- 프로덕션 환경에서는 HTTPS 필수
- Callback URL을 정확히 설정해야 함
- 소셜 플랫폼마다 이메일 제공 여부가 다를 수 있음
- Kakao는 이메일 동의 항목 설정 필요
- 각 플랫폼의 개인정보처리방침 준수 필요
