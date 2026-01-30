import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/prisma.service";

@Injectable()
export class CoursesService {
    constructor(private prismaService: PrismaService) {}

    async getAll(
        categoryId?: string,
        search?: string,
        sort: string = "latest",
        page: number = 1,
        limit: number = 12,
    ) {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (categoryId) where.categoryId = categoryId;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        const orderBy: any = {};
        switch (sort) {
            case "rating":
                orderBy.rating = "desc";
                break;
            case "students":
                orderBy.totalStudents = "desc";
                break;
            case "price":
                orderBy.price = "asc";
                break;
            default:
                orderBy.createdAt = "desc";
        }

        const [courses, total] = await Promise.all([
            (this.prismaService as any).course.findMany({
                where,
                include: {
                    category: true,
                    reviews: true,
                    _count: {
                        select: { enrollments: true },
                    },
                },
                orderBy,
                skip,
                take: limit,
            }),
            (this.prismaService as any).course.count({ where }),
        ]);

        return {
            data: courses,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async getPopular() {
        return (this.prismaService as any).course.findMany({
            where: { isPopular: true },
            include: {
                category: true,
            },
            take: 12,
        });
    }

    async getBestseller() {
        return (this.prismaService as any).course.findMany({
            where: { isBestseller: true },
            include: {
                category: true,
            },
            take: 12,
        });
    }

    async getNew() {
        return (this.prismaService as any).course.findMany({
            where: { isNew: true },
            include: {
                category: true,
            },
            orderBy: { createdAt: "desc" },
            take: 12,
        });
    }

    async getById(id: string) {
        return (this.prismaService as any).course.findUnique({
            where: { id },
            include: {
                category: true,
                sections: {
                    include: {
                        lessons: true,
                    },
                    orderBy: { displayOrder: "asc" },
                },
                learningPoints: {
                    orderBy: { displayOrder: "asc" },
                },
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                profileImageUrl: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async getRating(courseId: string) {
        const reviews = await (this.prismaService as any).review.findMany({
            where: { courseId },
        });

        if (reviews.length === 0) {
            return {
                averageRating: 0,
                totalRatings: 0,
                ratingDistribution: {
                    "5": 0,
                    "4": 0,
                    "3": 0,
                    "2": 0,
                    "1": 0,
                },
            };
        }

        const averageRating =
            reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
            reviews.length;
        const distribution: Record<number, number> = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
        };

        reviews.forEach((r: any) => {
            distribution[r.rating as number]++;
        });

        return {
            averageRating: parseFloat(averageRating.toFixed(1)),
            totalRatings: reviews.length,
            ratingDistribution: distribution,
        };
    }
}
