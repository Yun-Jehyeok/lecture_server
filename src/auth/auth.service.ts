import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
    ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@/common/prisma.service";
import { CryptoService } from "@/common/crypto.service";
import { RegisterDto, LoginDto } from "./auth.dto";

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private cryptoService: CryptoService,
    ) {}

    async register(registerDto: RegisterDto) {
        const existingUser = await (this.prismaService as any).user.findUnique({
            where: { email: registerDto.email },
        });

        if (existingUser) {
            throw new ConflictException("Email already exists");
        }

        const hashedPassword = await this.cryptoService.hashPassword(
            registerDto.password,
        );

        const user = await (this.prismaService as any).user.create({
            data: {
                email: registerDto.email,
                username: registerDto.username,
                passwordHash: hashedPassword,
            },
        });

        const token = this.generateToken(user.id, user.email);

        return {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                profileImageUrl: user.profileImageUrl,
            },
            accessToken: token,
        };
    }

    async login(loginDto: LoginDto) {
        const user = await (this.prismaService as any).user.findUnique({
            where: { email: loginDto.email },
        });

        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const isPasswordValid = await this.cryptoService.comparePassword(
            loginDto.password,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const token = this.generateToken(user.id, user.email);

        return {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                profileImageUrl: user.profileImageUrl,
            },
            accessToken: token,
        };
    }

    async validateUser(userId: string) {
        const user = await (this.prismaService as any).user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        return {
            id: user.id,
            email: user.email,
            username: user.username,
            profileImageUrl: user.profileImageUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    private generateToken(userId: string, email: string): string {
        const payload = { sub: userId, email };
        return this.jwtService.sign(payload, {
            expiresIn: this.configService.get<number>("JWT_EXPIRES_IN", 86400),
        } as any);
    }

    async socialLogin(profile: {
        providerId: string;
        email: string;
        username: string;
        profileImageUrl?: string;
        provider: string;
    }) {
        // 기존 소셜 로그인 사용자 찾기
        let user = await (this.prismaService as any).user.findUnique({
            where: {
                provider_providerId: {
                    provider: profile.provider,
                    providerId: profile.providerId,
                },
            },
        });

        // 사용자가 없으면 새로 생성
        if (!user) {
            user = await (this.prismaService as any).user.create({
                data: {
                    email: profile.email,
                    username: profile.username,
                    profileImageUrl: profile.profileImageUrl,
                    provider: profile.provider,
                    providerId: profile.providerId,
                    passwordHash: null, // 소셜 로그인은 비밀번호 불필요
                },
            });
        }

        const token = this.generateToken(user.id, user.email);

        return {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                profileImageUrl: user.profileImageUrl,
            },
            accessToken: token,
        };
    }
}
