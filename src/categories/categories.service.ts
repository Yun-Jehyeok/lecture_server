import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/prisma.service";

@Injectable()
export class CategoriesService {
    constructor(private prismaService: PrismaService) {}

    async getAll() {
        return this.prismaService.category.findMany({
            orderBy: { displayOrder: "asc" },
        });
    }

    async getById(id: string) {
        return this.prismaService.category.findUnique({
            where: { id },
            include: {
                courses: true,
            },
        });
    }
}
