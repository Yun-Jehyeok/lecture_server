import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@/common/prisma.service";
import { CryptoService } from "@/common/crypto.service";
import { UpdateProfileDto, ChangePasswordDto } from "@/auth/auth.dto";

@Injectable()
export class UsersService {
    constructor(
        private prismaService: PrismaService,
        private cryptoService: CryptoService,
    ) {}

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
        const user = await (this.prismaService as any).user.update({
            where: { id: userId },
            data: updateProfileDto,
        });

        return {
            id: user.id,
            email: user.email,
            username: user.username,
            profileImageUrl: user.profileImageUrl,
        };
    }

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
        if (
            changePasswordDto.newPassword !== changePasswordDto.confirmPassword
        ) {
            throw new BadRequestException("Passwords do not match");
        }

        const user = await (this.prismaService as any).user.findUnique({
            where: { id: userId },
        });

        const isPasswordValid = await this.cryptoService.comparePassword(
            changePasswordDto.currentPassword,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new BadRequestException("Current password is incorrect");
        }

        const hashedPassword = await this.cryptoService.hashPassword(
            changePasswordDto.newPassword,
        );

        await (this.prismaService as any).user.update({
            where: { id: userId },
            data: { passwordHash: hashedPassword },
        });

        return { message: "Password changed successfully" };
    }

    async getLearningStats(userId: string) {
        const enrollments = await (
            this.prismaService as any
        ).enrollment.findMany({
            where: { userId },
        });

        const totalCourses = enrollments.length;
        const completed = enrollments.filter(
            (e: any) => e.completedAt !== null,
        ).length;
        const inProgress = totalCourses - completed;

        return {
            totalCourses,
            completed,
            inProgress,
        };
    }

    async getRecentCourses(userId: string) {
        return (this.prismaService as any).recentCourse.findMany({
            where: { userId },
            include: {
                course: {
                    include: {
                        category: true,
                    },
                },
            },
            orderBy: { viewedAt: "desc" },
            take: 10,
        });
    }

    async addRecentCourse(userId: string, courseId: string) {
        const recentCourse = await (
            this.prismaService as any
        ).recentCourse.upsert({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
            create: {
                userId,
                courseId,
            },
            update: {
                viewedAt: new Date(),
            },
            include: {
                course: true,
            },
        });

        return recentCourse;
    }
}
