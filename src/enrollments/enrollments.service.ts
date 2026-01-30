import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/common/prisma.service";

@Injectable()
export class EnrollmentsService {
    constructor(private prismaService: PrismaService) {}

    async enrollCourse(userId: string, courseId: string) {
        const existingEnrollment = await (
            this.prismaService as any
        ).enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        if (existingEnrollment) {
            throw new BadRequestException("Already enrolled in this course");
        }

        const course = await (this.prismaService as any).course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            throw new NotFoundException("Course not found");
        }

        const enrollment = await (this.prismaService as any).enrollment.create({
            data: {
                userId,
                courseId,
            },
            include: {
                course: {
                    include: {
                        category: true,
                        sections: {
                            include: {
                                lessons: true,
                            },
                        },
                    },
                },
            },
        });

        // Create user lesson progress entries
        const sections = await (
            this.prismaService as any
        ).curriculumSection.findMany({
            where: { courseId },
            include: {
                lessons: true,
            },
        });

        for (const section of sections) {
            for (const lesson of section.lessons) {
                await (this.prismaService as any).userLessonProgress.create({
                    data: {
                        userId,
                        lessonId: lesson.id,
                        enrollmentId: enrollment.id,
                    },
                });
            }
        }

        return enrollment;
    }

    async getMyEnrollments(userId: string) {
        return (this.prismaService as any).enrollment.findMany({
            where: { userId },
            include: {
                course: {
                    include: {
                        category: true,
                    },
                },
            },
            orderBy: { enrolledAt: "desc" },
        });
    }

    async getEnrollmentByCourse(userId: string, courseId: string) {
        return (this.prismaService as any).enrollment.findFirst({
            where: {
                userId,
                courseId,
            },
            include: {
                course: {
                    include: {
                        category: true,
                        sections: {
                            include: {
                                lessons: true,
                            },
                        },
                    },
                },
                lessonProgress: true,
            },
        });
    }

    async deleteEnrollment(enrollmentId: string) {
        return (this.prismaService as any).enrollment.delete({
            where: { id: enrollmentId },
        });
    }

    async getCourseProgress(userId: string, courseId: string) {
        const enrollment = await (
            this.prismaService as any
        ).enrollment.findFirst({
            where: {
                userId,
                courseId,
            },
        });

        if (!enrollment) {
            throw new NotFoundException("Enrollment not found");
        }

        const lessonProgress = await (
            this.prismaService as any
        ).userLessonProgress.findMany({
            where: {
                enrollmentId: enrollment.id,
            },
        });

        const totalLessons = lessonProgress.length;
        const completedLessons = lessonProgress.filter(
            (p: any) => p.isCompleted,
        ).length;
        const progressPercentage =
            totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

        await (this.prismaService as any).enrollment.update({
            where: { id: enrollment.id },
            data: { progressPercentage },
        });

        return {
            enrollmentId: enrollment.id,
            courseId,
            totalLessons,
            completedLessons,
            progressPercentage: parseFloat(progressPercentage.toFixed(2)),
        };
    }
}
