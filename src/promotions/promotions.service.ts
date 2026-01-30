import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/prisma.service";

@Injectable()
export class PromotionsService {
    constructor(private prismaService: PrismaService) {}

    async getBanners() {
        return this.prismaService.banner.findMany({
            where: { isActive: true },
            orderBy: { displayOrder: "asc" },
        });
    }

    async getPromotions() {
        const now = new Date();
        return this.prismaService.promotion.findMany({
            where: {
                isActive: true,
                startDate: { lte: now },
                endDate: { gte: now },
            },
            orderBy: { startDate: "desc" },
        });
    }
}
