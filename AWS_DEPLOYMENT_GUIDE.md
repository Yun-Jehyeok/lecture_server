# AWS 배포 가이드 (EC2 + Docker Compose + PostgreSQL)

이 문서는 서버와 DB를 같은 EC2 인스턴스에서 Docker로 운영하는 절차를 정리한 문서입니다.

주의:

- 이 방식은 빠르게 시작하기 좋지만, 운영 성숙도가 올라가면 DB는 RDS로 분리하는 것을 권장합니다.
- 아래 가이드는 "앱 컨테이너 1개 + PostgreSQL 컨테이너 1개"를 같은 EC2에 올리는 방식입니다.

## 1. 아키텍처

- 컴퓨트: EC2 (Ubuntu 22.04)
- 컨테이너 런타임: Docker + Docker Compose
- 앱: NestJS 컨테이너
- DB: PostgreSQL 컨테이너
- HTTPS: Nginx + Certbot (Let's Encrypt)
- DNS: Route53 또는 외부 DNS

트래픽 흐름:

1. 사용자 -> 80/443
2. Nginx (EC2 호스트)
3. NestJS 컨테이너 (localhost:8080)
4. PostgreSQL 컨테이너 (내부 Docker 네트워크)

## 2. 사전 준비

- AWS 계정 및 IAM 사용자/권한
- 배포 리전 확정 (예: ap-northeast-2)
- EC2 키 페어 생성 (.pem)
- 도메인 보유 (HTTPS 운영 권장)
- 로컬에 Git, SSH 클라이언트 준비

## 3. EC2 생성

권장 시작 스펙:

- 인스턴스 타입: t3.small 이상
- 스토리지: gp3 30GB 이상
- OS: Ubuntu Server 22.04 LTS

보안 그룹 인바운드 규칙:

- 22 (SSH): 본인 IP만 허용
- 80 (HTTP): 0.0.0.0/0
- 443 (HTTPS): 0.0.0.0/0

중요:

- 5432는 외부에 열지 않습니다.

## 4. EC2 초기 설정

EC2 접속:

```bash
ssh -i /path/to/key.pem ubuntu@<EC2_PUBLIC_IP>
```

패키지 업데이트:

```bash
sudo apt update
sudo apt upgrade -y
```

Docker 설치:

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker
docker --version
docker compose version
```

## 5. 프로젝트 배치

서버에 코드 배치:

```bash
mkdir -p ~/apps/lecture-server
cd ~/apps/lecture-server
git clone https://github.com/Yun-Jehyeok/lecture_server.git .
```

환경파일 생성:

```bash
cp .env.example .env
```

.env 예시 (운영값으로 변경 필요):

```env
NODE_ENV=production
PORT=8080
JWT_SECRET=replace_this_secure_value
JWT_EXPIRES_IN=24h

POSTGRES_DB=lecture_platform
POSTGRES_USER=lecture_user
POSTGRES_PASSWORD=replace_this_db_password
DATABASE_URL=postgresql://lecture_user:replace_this_db_password@db:5432/lecture_platform?schema=public

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
KAKAO_CLIENT_ID=...
KAKAO_CLIENT_SECRET=...
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
```

## 6. Dockerfile

프로젝트 루트에 Dockerfile이 없다면 아래 예시를 사용합니다.

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run prisma:generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 8080
CMD ["node", "dist/main"]
```

## 7. docker-compose 구성

프로젝트 루트에 docker-compose.yml 생성:

```yaml
services:
    db:
        image: postgres:15
        container_name: lecture-db
        restart: always
        environment:
            POSTGRES_DB: ${POSTGRES_DB}
            POSTGRES_USER: ${POSTGRES_USER}
            POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
        volumes:
            - postgres_data:/var/lib/postgresql/data
        healthcheck:
            test:
                [
                    "CMD-SHELL",
                    "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}",
                ]
            interval: 10s
            timeout: 5s
            retries: 5
        networks:
            - lecture-net

    api:
        build: .
        container_name: lecture-api
        restart: always
        env_file:
            - .env
        depends_on:
            db:
                condition: service_healthy
        ports:
            - "127.0.0.1:8080:8080"
        networks:
            - lecture-net
        command: sh -c "npm run prisma:migrate:prod && node dist/main"

volumes:
    postgres_data:

networks:
    lecture-net:
        driver: bridge
```

설명:

- DB는 volume으로 데이터 영속화
- API는 localhost 바인딩으로 외부 직접 노출 방지
- 마이그레이션 후 앱 실행

## 8. 첫 배포 실행

빌드 및 실행:

```bash
cd ~/apps/lecture-server
docker compose up -d --build
```

상태 확인:

```bash
docker compose ps
docker compose logs -f api
docker compose logs -f db
```

로컬 헬스체크:

```bash
curl http://127.0.0.1:8080/
```

## 9. Nginx 리버스 프록시 + HTTPS

Nginx 설치:

```bash
sudo apt install -y nginx
```

Nginx 설정 (/etc/nginx/sites-available/lecture):

```nginx
server {
        listen 80;
        server_name api.yourdomain.com;

        location / {
                proxy_pass http://127.0.0.1:8080;
                proxy_http_version 1.1;
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
        }
}
```

활성화:

```bash
sudo ln -s /etc/nginx/sites-available/lecture /etc/nginx/sites-enabled/lecture
sudo nginx -t
sudo systemctl restart nginx
```

인증서 발급:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

## 10. 운영 업데이트 절차

배포 업데이트:

```bash
cd ~/apps/lecture-server
git pull origin main
docker compose up -d --build
```

롤백:

1. 이전 커밋으로 체크아웃
2. docker compose up -d --build 재실행

## 11. 백업 전략 (중요)

DB 컨테이너 백업:

```bash
docker exec -t lecture-db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > backup_$(date +%F_%H%M).sql
```

복원:

```bash
cat backup.sql | docker exec -i lecture-db psql -U "$POSTGRES_USER" "$POSTGRES_DB"
```

권장:

- 정기 백업 스크립트 + cron 설정
- 백업 파일을 S3로 주기적 업로드

## 12. 운영 체크리스트

- SSH는 본인 IP만 허용
- 5432 외부 미노출 확인
- .env 파일 권한 최소화
- Docker/OS 보안 업데이트 적용
- 로그 모니터링 (nginx + docker logs)
- 디스크 사용량 모니터링
- 백업 복원 리허설 월 1회 이상

## 13. 비용 최적화 팁

- 초기에 t3.small 또는 t3.medium으로 시작
- gp3 디스크 용량 최소로 시작 후 확장
- 미사용 스냅샷/Elastic IP 정리
- 트래픽이 적다면 NAT Gateway 없는 단일 EC2 구조 유지

## 14. 다음 단계 (성장 시 권장)

1. DB를 RDS PostgreSQL로 분리
2. 앱을 ECS 또는 EKS로 이전
3. CI/CD 도입 (GitHub Actions)
4. CloudWatch Agent, 알람, 대시보드 적용
