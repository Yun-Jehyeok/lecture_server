# 📚 API 상세 문서

## 목차

1. [인증 API](#인증-api)
2. [카테고리 API](#카테고리-api)
3. [강의 API](#강의-api)
4. [커리큘럼 API](#커리큘럼-api)
5. [레슨 API](#레슨-api)
6. [수강 신청 API](#수강-신청-api)
7. [리뷰 API](#리뷰-api)
8. [노트 API](#노트-api)
9. [배너/프로모션 API](#배너프로모션-api)
10. [학습 통계 API](#학습-통계-api)

---

## 인증 API

### POST /api/auth/register

회원가입

**요청:**

```json
{
    "email": "user@example.com",
    "username": "username",
    "password": "password123"
}
```

**응답:**

```json
{
    "user": {
        "id": "user-id",
        "email": "user@example.com",
        "username": "username",
        "profileImageUrl": null
    },
    "accessToken": "eyJhbGci..."
}
```

---

### POST /api/auth/login

로그인

**요청:**

```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

**응답:**

```json
{
    "user": {
        "id": "user-id",
        "email": "user@example.com",
        "username": "username",
        "profileImageUrl": null
    },
    "accessToken": "eyJhbGci..."
}
```

---

### POST /api/auth/logout

로그아웃

**헤더:**

```
Authorization: Bearer <JWT_TOKEN>
```

**응답:**

```json
{
    "message": "Successfully logged out"
}
```

---

### GET /api/auth/me

현재 사용자 정보 조회

**헤더:**

```
Authorization: Bearer <JWT_TOKEN>
```

**응답:**

```json
{
    "id": "user-id",
    "email": "user@example.com",
    "username": "username",
    "profileImageUrl": null,
    "createdAt": "2024-01-29T10:00:00.000Z",
    "updatedAt": "2024-01-29T10:00:00.000Z"
}
```

---

### PUT /api/users/profile

프로필 수정

**헤더:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**요청:**

```json
{
    "username": "new_username",
    "profileImageUrl": "https://example.com/profile.jpg"
}
```

**응답:**

```json
{
    "id": "user-id",
    "email": "user@example.com",
    "username": "new_username",
    "profileImageUrl": "https://example.com/profile.jpg"
}
```

---

### PUT /api/users/password

비밀번호 변경

**헤더:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**요청:**

```json
{
    "currentPassword": "old_password",
    "newPassword": "new_password123",
    "confirmPassword": "new_password123"
}
```

**응답:**

```json
{
    "message": "Password changed successfully"
}
```

---

## 카테고리 API

### GET /api/categories

전체 카테고리 목록 조회

**응답:**

```json
[
    {
        "id": "category-1",
        "name": "프론트엔드",
        "slug": "frontend",
        "icon": "react-icon.svg",
        "displayOrder": 1,
        "createdAt": "2024-01-29T10:00:00.000Z",
        "updatedAt": "2024-01-29T10:00:00.000Z"
    },
    {
        "id": "category-2",
        "name": "백엔드",
        "slug": "backend",
        "icon": "nodejs-icon.svg",
        "displayOrder": 2,
        "createdAt": "2024-01-29T10:00:00.000Z",
        "updatedAt": "2024-01-29T10:00:00.000Z"
    }
]
```

---

### GET /api/categories/:id

특정 카테고리 상세 조회

**응답:**

```json
{
    "id": "category-1",
    "name": "프론트엔드",
    "slug": "frontend",
    "icon": "react-icon.svg",
    "displayOrder": 1,
    "createdAt": "2024-01-29T10:00:00.000Z",
    "updatedAt": "2024-01-29T10:00:00.000Z",
    "courses": [
        {
            "id": "course-1",
            "title": "React 완벽 가이드",
            "price": 49900,
            "rating": 4.8
        }
    ]
}
```

---

## 강의 API

### GET /api/courses

강의 목록 조회 (검색, 필터, 정렬)

**쿼리 파라미터:**

- `category_id` (optional): 카테고리 ID
- `search` (optional): 검색어
- `sort` (optional): 정렬 방식 (latest, rating, students, price)
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 12)

**응답:**

```json
{
    "data": [
        {
            "id": "course-1",
            "title": "React 완벽 가이드",
            "instructorName": "김대신",
            "description": "React의 기초부터 고급까지...",
            "imageUrl": "https://...",
            "price": 49900,
            "originalPrice": 99900,
            "durationHours": 25,
            "rating": 4.8,
            "totalStudents": 1250,
            "isBestseller": true,
            "isPopular": true,
            "isNew": false,
            "category": {
                "id": "category-1",
                "name": "프론트엔드"
            }
        }
    ],
    "pagination": {
        "total": 50,
        "page": 1,
        "limit": 12,
        "pages": 5
    }
}
```

---

### GET /api/courses/popular

인기 강의 조회

**응답:** 강의 배열

---

### GET /api/courses/bestseller

베스트셀러 강의 조회

**응답:** 강의 배열

---

### GET /api/courses/new

신규 강의 조회

**응답:** 강의 배열

---

### GET /api/courses/:id

강의 상세 정보 조회

**응답:**

```json
{
    "id": "course-1",
    "title": "React 완벽 가이드",
    "instructorName": "김대신",
    "description": "React의 기초부터 고급까지...",
    "imageUrl": "https://...",
    "price": 49900,
    "originalPrice": 99900,
    "durationHours": 25,
    "rating": 4.8,
    "totalStudents": 1250,
    "category": {
        "id": "category-1",
        "name": "프론트엔드"
    },
    "sections": [
        {
            "id": "section-1",
            "title": "React 기초",
            "displayOrder": 1,
            "lessons": [
                {
                    "id": "lesson-1",
                    "title": "React 소개",
                    "durationMinutes": 45,
                    "displayOrder": 1
                }
            ]
        }
    ],
    "learningPoints": [
        {
            "id": "point-1",
            "description": "React의 기본 개념 이해"
        }
    ],
    "reviews": [
        {
            "id": "review-1",
            "rating": 5,
            "comment": "아주 좋은 강의입니다!",
            "user": {
                "id": "user-1",
                "username": "user1",
                "profileImageUrl": "https://..."
            }
        }
    ]
}
```

---

### GET /api/courses/:id/rating

강의 평점 정보 조회

**응답:**

```json
{
    "averageRating": 4.8,
    "totalRatings": 245,
    "ratingDistribution": {
        "5": 180,
        "4": 45,
        "3": 15,
        "2": 3,
        "1": 2
    }
}
```

---

## 커리큘럼 API

### GET /api/courses/:courseId/curriculum

강의 커리큘럼 전체 조회

**응답:**

```json
[
    {
        "id": "section-1",
        "title": "React 기초",
        "displayOrder": 1,
        "lessons": [
            {
                "id": "lesson-1",
                "title": "React 소개",
                "videoUrl": "https://...",
                "durationMinutes": 45,
                "description": "React가 무엇인지...",
                "materialsUrl": "https://...",
                "displayOrder": 1
            }
        ]
    }
]
```

---

### GET /api/courses/:courseId/sections

섹션 목록 조회

**응답:**

```json
[
    {
        "id": "section-1",
        "title": "React 기초",
        "displayOrder": 1
    }
]
```

---

### GET /api/courses/:courseId/sections/:sectionId

섹션 상세 조회

**응답:**

```json
{
    "id": "section-1",
    "title": "React 기초",
    "displayOrder": 1,
    "lessons": [
        {
            "id": "lesson-1",
            "title": "React 소개",
            "durationMinutes": 45,
            "displayOrder": 1
        }
    ]
}
```

---

## 레슨 API

### GET /api/lessons/:lessonId

레슨 상세 조회

**응답:**

```json
{
    "id": "lesson-1",
    "title": "React 소개",
    "videoUrl": "https://...",
    "durationMinutes": 45,
    "description": "React가 무엇인지...",
    "materialsUrl": "https://...",
    "section": {
        "id": "section-1",
        "title": "React 기초"
    }
}
```

---

### GET /api/lessons/:lessonId/materials

강의 자료 다운로드 링크 조회

**응답:**

```json
{
    "lessonId": "lesson-1",
    "title": "React 소개",
    "materialsUrl": "https://example.com/materials.zip"
}
```

---

### POST /api/lessons/:lessonId/complete

레슨 완료 표시

**헤더:**

```
Authorization: Bearer <JWT_TOKEN>
```

**응답:**

```json
{
    "id": "progress-1",
    "userId": "user-1",
    "lessonId": "lesson-1",
    "isCompleted": true,
    "completedAt": "2024-01-29T10:30:00.000Z"
}
```

---

### DELETE /api/lessons/:lessonId/complete

레슨 완료 취소

**헤더:**

```
Authorization: Bearer <JWT_TOKEN>
```

**응답:**

```json
{
    "id": "progress-1",
    "userId": "user-1",
    "lessonId": "lesson-1",
    "isCompleted": false,
    "completedAt": null
}
```

---

### PUT /api/lessons/:lessonId/watch-time

시청 시간 업데이트

**헤더:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**요청:**

```json
{
    "watch_time_seconds": 300
}
```

**응답:**

```json
{
    "id": "progress-1",
    "userId": "user-1",
    "lessonId": "lesson-1",
    "watchTimeSeconds": 300,
    "lastWatchedAt": "2024-01-29T10:30:00.000Z"
}
```

---

## 수강 신청 API

### POST /api/enrollments

강의 신청

**헤더:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**요청:**

```json
{
    "courseId": "course-1"
}
```

**응답:**

```json
{
    "id": "enrollment-1",
    "userId": "user-1",
    "courseId": "course-1",
    "enrolledAt": "2024-01-29T10:00:00.000Z",
    "completedAt": null,
    "progressPercentage": 0
}
```

---

### GET /api/enrollments

내 수강 강의 목록

**헤더:**

```
Authorization: Bearer <JWT_TOKEN>
```

**응답:**

```json
[
    {
        "id": "enrollment-1",
        "userId": "user-1",
        "courseId": "course-1",
        "enrolledAt": "2024-01-29T10:00:00.000Z",
        "completedAt": null,
        "progressPercentage": 25,
        "course": {
            "id": "course-1",
            "title": "React 완벽 가이드",
            "category": {
                "id": "category-1",
                "name": "프론트엔드"
            }
        }
    }
]
```

---

### GET /api/enrollments/:courseId

특정 강의 수강 정보

**헤더:**

```
Authorization: Bearer <JWT_TOKEN>
```

**응답:**

```json
{
  "id": "enrollment-1",
  "userId": "user-1",
  "courseId": "course-1",
  "enrolledAt": "2024-01-29T10:00:00.000Z",
  "completedAt": null,
  "progressPercentage": 25,
  "course": { ... },
  "lessonProgress": [
    {
      "id": "progress-1",
      "lessonId": "lesson-1",
      "isCompleted": true,
      "watchTimeSeconds": 2700
    }
  ]
}
```

---

### GET /api/enrollments/:courseId/progress

강의 진행률 조회

**헤더:**

```
Authorization: Bearer <JWT_TOKEN>
```

**응답:**

```json
{
    "enrollmentId": "enrollment-1",
    "courseId": "course-1",
    "totalLessons": 12,
    "completedLessons": 3,
    "progressPercentage": 25.0
}
```

---

### DELETE /api/enrollments/:enrollmentId

수강 취소

**헤더:**

```
Authorization: Bearer <JWT_TOKEN>
```

**응답:**

```json
{
    "id": "enrollment-1",
    "userId": "user-1",
    "courseId": "course-1"
}
```

---

## 리뷰 API

### GET /api/courses/:courseId/reviews

리뷰 목록 조회

**쿼리 파라미터:**

- `page` (optional): 페이지 번호
- `limit` (optional): 페이지당 항목 수
- `sort` (optional): 정렬 (recent, rating-high, rating-low)

**응답:**

```json
{
    "data": [
        {
            "id": "review-1",
            "userId": "user-1",
            "courseId": "course-1",
            "rating": 5,
            "comment": "아주 좋은 강의입니다!",
            "createdAt": "2024-01-29T10:00:00.000Z",
            "updatedAt": "2024-01-29T10:00:00.000Z",
            "user": {
                "id": "user-1",
                "username": "user1",
                "profileImageUrl": "https://..."
            }
        }
    ],
    "pagination": {
        "total": 100,
        "page": 1,
        "limit": 10,
        "pages": 10
    }
}
```

---

### POST /api/courses/:courseId/reviews

리뷰 작성

**헤더:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**요청:**

```json
{
    "rating": 5,
    "comment": "정말 좋은 강의입니다!"
}
```

**응답:**

```json
{
    "id": "review-1",
    "userId": "user-1",
    "courseId": "course-1",
    "rating": 5,
    "comment": "정말 좋은 강의입니다!",
    "createdAt": "2024-01-29T10:00:00.000Z",
    "updatedAt": "2024-01-29T10:00:00.000Z",
    "user": {
        "id": "user-1",
        "username": "user1"
    }
}
```

---

### PUT /api/reviews/:reviewId

리뷰 수정

**헤더:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**요청:**

```json
{
    "rating": 4,
    "comment": "좋은 강의입니다."
}
```

**응답:** 업데이트된 리뷰 객체

---

### DELETE /api/reviews/:reviewId

리뷰 삭제

**헤더:**

```
Authorization: Bearer <JWT_TOKEN>
```

**응답:**

```json
{
    "message": "Review deleted successfully"
}
```

---

## 노트 API

### GET /api/lessons/:lessonId/notes

레슨 노트 조회

**헤더:**

```
Authorization: Bearer <JWT_TOKEN>
```

**응답:**

```json
{
    "id": "note-1",
    "userId": "user-1",
    "lessonId": "lesson-1",
    "content": "React의 기본 개념...",
    "createdAt": "2024-01-29T10:00:00.000Z",
    "updatedAt": "2024-01-29T10:00:00.000Z"
}
```

---

### POST /api/lessons/:lessonId/notes

노트 작성/수정

**헤더:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**요청:**

```json
{
    "content": "React의 기본 개념..."
}
```

**응답:** 생성/수정된 노트 객체

---

### GET /api/enrollments/:courseId/notes

강의 전체 노트 조회

**헤더:**

```
Authorization: Bearer <JWT_TOKEN>
```

**응답:**

```json
[
    {
        "id": "note-1",
        "userId": "user-1",
        "lessonId": "lesson-1",
        "content": "노트 내용...",
        "lesson": {
            "id": "lesson-1",
            "title": "React 소개"
        },
        "createdAt": "2024-01-29T10:00:00.000Z"
    }
]
```

---

## 배너/프로모션 API

### GET /api/banners

홈 배너 목록

**응답:**

```json
[
    {
        "id": "banner-1",
        "title": "여름 특별 할인",
        "description": "모든 강의 50% 할인",
        "imageUrl": "https://...",
        "link": "/promotions",
        "displayOrder": 1,
        "isActive": true,
        "createdAt": "2024-01-29T10:00:00.000Z"
    }
]
```

---

### GET /api/promotions

진행 중인 프로모션

**응답:**

```json
[
    {
        "id": "promotion-1",
        "title": "신규 사용자 환영 쿠폰",
        "description": "회원가입 후 첫 구매에 20% 할인",
        "discountPercent": 20,
        "startDate": "2024-01-29T00:00:00.000Z",
        "endDate": "2024-02-28T23:59:59.999Z",
        "isActive": true
    }
]
```

---

## 학습 통계 API

### GET /api/users/learning-stats

학습 통계

**헤더:**

```
Authorization: Bearer <JWT_TOKEN>
```

**응답:**

```json
{
    "totalCourses": 12,
    "completed": 3,
    "inProgress": 9
}
```

---

### GET /api/users/recent-courses

최근 본 강의

**헤더:**

```
Authorization: Bearer <JWT_TOKEN>
```

**응답:**

```json
[
    {
        "id": "recent-1",
        "userId": "user-1",
        "courseId": "course-1",
        "viewedAt": "2024-01-29T10:00:00.000Z",
        "course": {
            "id": "course-1",
            "title": "React 완벽 가이드",
            "imageUrl": "https://...",
            "category": {
                "id": "category-1",
                "name": "프론트엔드"
            }
        }
    }
]
```

---

### POST /api/users/recent-courses/:courseId

최근 본 강의에 추가

**헤더:**

```
Authorization: Bearer <JWT_TOKEN>
```

**응답:**

```json
{
    "id": "recent-1",
    "userId": "user-1",
    "courseId": "course-1",
    "viewedAt": "2024-01-29T10:00:00.000Z"
}
```

---

## 상태 코드

- `200 OK` - 성공
- `201 Created` - 리소스 생성 성공
- `400 Bad Request` - 잘못된 요청
- `401 Unauthorized` - 인증 필요
- `403 Forbidden` - 권한 없음
- `404 Not Found` - 리소스를 찾을 수 없음
- `409 Conflict` - 충돌 (예: 중복 회원가입)
- `500 Internal Server Error` - 서버 오류

## 에러 응답

```json
{
    "statusCode": 400,
    "message": "오류 메시지",
    "error": "Bad Request"
}
```
