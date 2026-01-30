import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/prisma.service";

@Injectable()
export class LearningProgressService {
    constructor(private prismaService: PrismaService) {}

    async getUserProgress(userId: string) {
        const enrollments = await this.prismaService.enrollment.findMany({
            where: { userId },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                lessonProgress: true,
            },
        });

        const progressData = enrollments.map((enrollment) => {
            const totalLessons = enrollment.lessonProgress.length;
            const completedLessons = enrollment.lessonProgress.filter(
                (p) => p.isCompleted,
            ).length;
            const progressPercentage =
                totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

            return {
                courseId: enrollment.course.id,
                courseTitle: enrollment.course.title,
                enrolledAt: enrollment.enrolledAt,
                completedAt: enrollment.completedAt,
                totalLessons,
                completedLessons,
                progressPercentage: parseFloat(progressPercentage.toFixed(2)),
            };
        });

        return progressData;
    }
}
