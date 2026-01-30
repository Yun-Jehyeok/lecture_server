import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/common/prisma.service";

@Injectable()
export class ReviewsService {
    constructor(private prismaService: PrismaService) {}

    async getReviews(
        courseId: string,
        page: number = 1,
        limit: number = 10,
        sort: string = "recent",
    ) {
        const skip = (page - 1) * limit;

        const orderBy: any = {};
        switch (sort) {
            case "rating-high":
                orderBy.rating = "desc";
                break;
            case "rating-low":
                orderBy.rating = "asc";
                break;
            default:
                orderBy.createdAt = "desc";
        }

        const [reviews, total] = await Promise.all([
            (this.prismaService as any).review.findMany({
                where: { courseId },
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            profileImageUrl: true,
                        },
                    },
                },
                orderBy,
                skip,
                take: limit,
            }),
            (this.prismaService as any).review.count({ where: { courseId } }),
        ]);

        return {
            data: reviews,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async createReview(
        userId: string,
        courseId: string,
        rating: number,
        comment: string,
    ) {
        if (rating < 1 || rating > 5) {
            throw new BadRequestException("Rating must be between 1 and 5");
        }

        const existingReview = await (
            this.prismaService as any
        ).review.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        if (existingReview) {
            throw new BadRequestException(
                "You have already reviewed this course",
            );
        }

        const enrollment = await (
            this.prismaService as any
        ).enrollment.findFirst({
            where: { userId, courseId },
        });

        if (!enrollment) {
            throw new BadRequestException(
                "You must be enrolled in the course to review it",
            );
        }

        const review = await (this.prismaService as any).review.create({
            data: {
                userId,
                courseId,
                rating,
                comment,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profileImageUrl: true,
                    },
                },
            },
        });

        // Update course rating
        await this.updateCourseRating(courseId);

        return review;
    }

    async updateReview(
        reviewId: string,
        userId: string,
        rating: number,
        comment: string,
    ) {
        if (rating < 1 || rating > 5) {
            throw new BadRequestException("Rating must be between 1 and 5");
        }

        const review = await (this.prismaService as any).review.findUnique({
            where: { id: reviewId },
        });

        if (!review) {
            throw new NotFoundException("Review not found");
        }

        if (review.userId !== userId) {
            throw new BadRequestException(
                "You can only update your own reviews",
            );
        }

        const updatedReview = await (this.prismaService as any).review.update({
            where: { id: reviewId },
            data: {
                rating,
                comment,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profileImageUrl: true,
                    },
                },
            },
        });

        // Update course rating
        await this.updateCourseRating(updatedReview.courseId);

        return updatedReview;
    }

    async deleteReview(reviewId: string, userId: string) {
        const review = await (this.prismaService as any).review.findUnique({
            where: { id: reviewId },
        });

        if (!review) {
            throw new NotFoundException("Review not found");
        }

        if (review.userId !== userId) {
            throw new BadRequestException(
                "You can only delete your own reviews",
            );
        }

        await (this.prismaService as any).review.delete({
            where: { id: reviewId },
        });

        // Update course rating
        await this.updateCourseRating(review.courseId);

        return { message: "Review deleted successfully" };
    }

    private async updateCourseRating(courseId: string) {
        const reviews = await (this.prismaService as any).review.findMany({
            where: { courseId },
        });

        const averageRating =
            reviews.length > 0
                ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
                  reviews.length
                : 0;

        await (this.prismaService as any).course.update({
            where: { id: courseId },
            data: { rating: parseFloat(averageRating.toFixed(1)) },
        });
    }
}
