import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/common/prisma.service";

@Injectable()
export class NotesService {
    constructor(private prismaService: PrismaService) {}

    async getLessonNotes(userId: string, lessonId: string) {
        return (this.prismaService as any).note.findFirst({
            where: {
                userId,
                lessonId,
            },
        });
    }

    async createOrUpdateNote(
        userId: string,
        lessonId: string,
        content: string,
    ) {
        const enrollment = await (
            this.prismaService as any
        ).enrollment.findFirst({
            where: {
                userId,
                course: {
                    sections: {
                        some: {
                            lessons: {
                                some: {
                                    id: lessonId,
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!enrollment) {
            throw new NotFoundException("Enrollment not found for this lesson");
        }

        const existingNote = await (this.prismaService as any).note.findFirst({
            where: {
                userId,
                lessonId,
            },
        });

        if (existingNote) {
            return (this.prismaService as any).note.update({
                where: { id: existingNote.id },
                data: { content },
            });
        }

        return (this.prismaService as any).note.create({
            data: {
                userId,
                lessonId,
                enrollmentId: enrollment.id,
                content,
            },
        });
    }

    async getCourseNotes(userId: string, courseId: string) {
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

        return (this.prismaService as any).note.findMany({
            where: {
                enrollmentId: enrollment.id,
            },
            include: {
                lesson: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }
}
