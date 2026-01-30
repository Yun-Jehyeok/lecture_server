import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/prisma.service";

@Injectable()
export class LessonsService {
    constructor(private prismaService: PrismaService) {}

    async getLesson(lessonId: string) {
        return (this.prismaService as any).lesson.findUnique({
            where: { id: lessonId },
            include: {
                section: true,
            },
        });
    }

    async getLessonMaterials(lessonId: string) {
        const lesson = await (this.prismaService as any).lesson.findUnique({
            where: { id: lessonId },
            select: {
                id: true,
                title: true,
                materialsUrl: true,
            },
        });

        return {
            lessonId: lesson.id,
            title: lesson.title,
            materialsUrl: lesson.materialsUrl,
        };
    }

    async completeLesson(userId: string, lessonId: string) {
        return (this.prismaService as any).userLessonProgress.update({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId,
                },
            },
            data: {
                isCompleted: true,
                completedAt: new Date(),
            },
        });
    }

    async uncompleteLesson(userId: string, lessonId: string) {
        return (this.prismaService as any).userLessonProgress.update({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId,
                },
            },
            data: {
                isCompleted: false,
                completedAt: null,
            },
        });
    }

    async updateWatchTime(
        userId: string,
        lessonId: string,
        watchTimeSeconds: number,
    ) {
        const existingProgress = await (
            this.prismaService as any
        ).userLessonProgress.findUnique({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId,
                },
            },
        });

        const newWatchTime =
            existingProgress.watchTimeSeconds + watchTimeSeconds;

        return (this.prismaService as any).userLessonProgress.update({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId,
                },
            },
            data: {
                watchTimeSeconds: newWatchTime,
                lastWatchedAt: new Date(),
            },
        });
    }
}
