import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
    @ApiProperty({ example: "clx1234567890" })
    id!: string;

    @ApiProperty({ example: "user@example.com" })
    email!: string;

    @ApiProperty({ example: "john_doe" })
    username!: string;

    @ApiProperty({ example: "https://example.com/avatar.png", nullable: true })
    profileImageUrl!: string | null;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}

export class AuthResponseDto {
    @ApiProperty({ type: UserResponseDto })
    user!: UserResponseDto;

    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
    accessToken!: string;
}

export class TokenExchangeResponseDto {
    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
    accessToken!: string;

    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
    refreshToken!: string;

    @ApiProperty({ example: 900 })
    expiresIn!: number;
}

export class MessageResponseDto {
    @ApiProperty({ example: "Operation successful" })
    message!: string;
}

export class CategoryResponseDto {
    @ApiProperty({ example: "clx1234567890" })
    id!: string;

    @ApiProperty({ example: "Programming" })
    name!: string;

    @ApiProperty({ example: "programming" })
    slug!: string;

    @ApiProperty({ example: "Learn programming" })
    description!: string;
}

export class CourseResponseDto {
    @ApiProperty({ example: "clx1234567890" })
    id!: string;

    @ApiProperty({ example: "Complete React Course" })
    title!: string;

    @ApiProperty({ example: "Learn React from scratch" })
    description!: string;

    @ApiProperty({ example: "https://example.com/thumbnail.jpg" })
    thumbnailUrl!: string;

    @ApiProperty({ example: 49.99 })
    price!: number;

    @ApiProperty({ example: 4.8 })
    rating!: number;

    @ApiProperty({ example: 1234 })
    totalStudents!: number;

    @ApiProperty({ example: true })
    isPopular!: boolean;

    @ApiProperty({ example: false })
    isBestseller!: boolean;

    @ApiProperty({ example: false })
    isNew!: boolean;

    @ApiProperty({ type: CategoryResponseDto })
    category!: CategoryResponseDto;
}

export class PaginationDto {
    @ApiProperty({ example: 100 })
    total!: number;

    @ApiProperty({ example: 1 })
    page!: number;

    @ApiProperty({ example: 12 })
    limit!: number;

    @ApiProperty({ example: 9 })
    pages!: number;
}

export class CourseListResponseDto {
    @ApiProperty({ type: [CourseResponseDto] })
    data!: CourseResponseDto[];

    @ApiProperty({ type: PaginationDto })
    pagination!: PaginationDto;
}

export class LessonResponseDto {
    @ApiProperty({ example: "clx1234567890" })
    id!: string;

    @ApiProperty({ example: "Introduction to React" })
    title!: string;

    @ApiProperty({ example: "Introduction content" })
    content!: string;

    @ApiProperty({ example: "https://example.com/video.mp4" })
    videoUrl!: string;

    @ApiProperty({ example: 1800 })
    videoDuration!: number;

    @ApiProperty({ example: 1 })
    displayOrder!: number;

    @ApiProperty({ example: 300, description: "User watch time in seconds" })
    watchTimeSeconds!: number;
}

export class SectionResponseDto {
    @ApiProperty({ example: "clx1234567890" })
    id!: string;

    @ApiProperty({ example: "Getting Started" })
    title!: string;

    @ApiProperty({ example: 1 })
    displayOrder!: number;

    @ApiProperty({ type: [LessonResponseDto] })
    lessons!: LessonResponseDto[];
}

export class EnrollmentResponseDto {
    @ApiProperty({ example: "clx1234567890" })
    id!: string;

    @ApiProperty({ type: CourseResponseDto })
    course!: CourseResponseDto;

    @ApiProperty({ example: 0 })
    progressPercentage!: number;

    @ApiProperty()
    enrolledAt!: Date;

    @ApiProperty({ nullable: true })
    completedAt!: Date | null;
}

export class ProgressResponseDto {
    @ApiProperty({ example: 10 })
    totalLessons!: number;

    @ApiProperty({ example: 5 })
    completedLessons!: number;

    @ApiProperty({ example: 50 })
    progressPercentage!: number;
}

export class ReviewResponseDto {
    @ApiProperty({ example: "clx1234567890" })
    id!: string;

    @ApiProperty({ example: 5 })
    rating!: number;

    @ApiProperty({ example: "Great course!" })
    comment!: string;

    @ApiProperty({ type: UserResponseDto })
    user!: UserResponseDto;

    @ApiProperty()
    createdAt!: Date;
}

export class ReviewListResponseDto {
    @ApiProperty({ type: [ReviewResponseDto] })
    data!: ReviewResponseDto[];

    @ApiProperty({ type: PaginationDto })
    pagination!: PaginationDto;
}

export class RatingDistributionDto {
    @ApiProperty({ example: 100 })
    "5"!: number;

    @ApiProperty({ example: 50 })
    "4"!: number;

    @ApiProperty({ example: 20 })
    "3"!: number;

    @ApiProperty({ example: 5 })
    "2"!: number;

    @ApiProperty({ example: 2 })
    "1"!: number;
}

export class CourseRatingResponseDto {
    @ApiProperty({ example: 4.8 })
    averageRating!: number;

    @ApiProperty({ example: 177 })
    totalRatings!: number;

    @ApiProperty({ type: RatingDistributionDto })
    ratingDistribution!: RatingDistributionDto;
}

export class NoteResponseDto {
    @ApiProperty({ example: "clx1234567890" })
    id!: string;

    @ApiProperty({ example: "My notes about this lesson" })
    content!: string;

    @ApiProperty({ type: LessonResponseDto })
    lesson!: LessonResponseDto;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}

export class LearningStatsResponseDto {
    @ApiProperty({ example: 10 })
    totalCourses!: number;

    @ApiProperty({ example: 3 })
    completed!: number;

    @ApiProperty({ example: 7 })
    inProgress!: number;
}

export class LearningProgressResponseDto {
    @ApiProperty({ example: "clx1234567890" })
    courseId!: string;

    @ApiProperty({ example: "Complete React Course" })
    courseTitle!: string;

    @ApiProperty({ example: 10 })
    totalLessons!: number;

    @ApiProperty({ example: 5 })
    completedLessons!: number;

    @ApiProperty({ example: 50 })
    progressPercentage!: number;
}

export class BannerResponseDto {
    @ApiProperty({ example: "clx1234567890" })
    id!: string;

    @ApiProperty({ example: "Spring Sale" })
    title!: string;

    @ApiProperty({ example: "https://example.com/banner.jpg" })
    imageUrl!: string;

    @ApiProperty({ example: "https://example.com/course/123" })
    linkUrl!: string;

    @ApiProperty({ example: 1 })
    displayOrder!: number;

    @ApiProperty({ example: true })
    isActive!: boolean;
}

export class PromotionResponseDto {
    @ApiProperty({ example: "clx1234567890" })
    id!: string;

    @ApiProperty({ example: "50% Off" })
    title!: string;

    @ApiProperty({ example: "Limited time offer" })
    description!: string;

    @ApiProperty({ example: "50OFF" })
    code!: string;

    @ApiProperty({ example: 50 })
    discountPercentage!: number;

    @ApiProperty()
    startDate!: Date;

    @ApiProperty()
    endDate!: Date;

    @ApiProperty({ example: true })
    isActive!: boolean;
}
