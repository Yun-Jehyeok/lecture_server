import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/prisma.service";

@Injectable()
export class CurriculumService {
    constructor(private prismaService: PrismaService) {}

    async getCurriculum(courseId: string) {
        return this.prismaService.curriculumSection.findMany({
            where: { courseId },
            include: {
                lessons: {
                    orderBy: { displayOrder: "asc" },
                },
            },
            orderBy: { displayOrder: "asc" },
        });
    }

    async getSections(courseId: string) {
        return this.prismaService.curriculumSection.findMany({
            where: { courseId },
            orderBy: { displayOrder: "asc" },
        });
    }

    async getSection(courseId: string, sectionId: string) {
        return this.prismaService.curriculumSection.findFirst({
            where: {
                id: sectionId,
                courseId,
            },
            include: {
                lessons: {
                    orderBy: { displayOrder: "asc" },
                },
            },
        });
    }
}
