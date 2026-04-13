import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
    ConflictException,
} from "@nestjs/common";
import { randomBytes } from "crypto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "@/common/prisma.service";
import { CryptoService } from "@/common/crypto.service";
import { RegisterDto, LoginDto } from "./auth.dto";

type SocialExchangeCodePayload = {
    userId: string;
    provider: string;
    state?: string;
    expiresAt: number;
};

@Injectable()
export class AuthService {
    private readonly socialExchangeCodeStore = new Map<
        string,
        SocialExchangeCodePayload
    >();

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

        const token = this.generateAccessToken(user.id, user.email);

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

        const token = this.generateAccessToken(user.id, user.email);

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

    private generateAccessToken(userId: string, email: string): string {
        const payload = { sub: userId, email };
        return this.jwtService.sign(payload, {
            expiresIn: this.configService.get<number>("JWT_EXPIRES_IN", 86400),
        } as any);
    }

    private generateRefreshToken(userId: string, email: string): string {
        const payload = { sub: userId, email, type: "refresh" };
        return this.jwtService.sign(payload, {
            expiresIn: this.configService.get<string>(
                "JWT_REFRESH_EXPIRES_IN",
                "30d",
            ),
        } as any);
    }

    private getAccessTokenExpiresInSeconds(): number {
        return this.configService.get<number>("JWT_EXPIRES_IN_SECONDS", 86400);
    }

    private cleanupExpiredSocialCodes() {
        const now = Date.now();

        for (const [code, payload] of this.socialExchangeCodeStore.entries()) {
            if (payload.expiresAt <= now) {
                this.socialExchangeCodeStore.delete(code);
            }
        }
    }

    createSocialExchangeCode(userId: string, provider: string, state?: string) {
        this.cleanupExpiredSocialCodes();

        const code = randomBytes(32).toString("hex");
        const ttlMs = this.configService.get<number>(
            "SOCIAL_EXCHANGE_CODE_TTL_MS",
            60_000,
        );

        this.socialExchangeCodeStore.set(code, {
            userId,
            provider,
            state,
            expiresAt: Date.now() + ttlMs,
        });

        return code;
    }

    async exchangeSocialCode(code: string, state?: string) {
        if (!code || code.length < 32) {
            throw new BadRequestException("Invalid exchange code format");
        }

        this.cleanupExpiredSocialCodes();

        const payload = this.socialExchangeCodeStore.get(code);
        if (!payload) {
            throw new UnauthorizedException("Invalid or expired exchange code");
        }

        this.socialExchangeCodeStore.delete(code);

        if (payload.state && payload.state !== state) {
            throw new UnauthorizedException("Invalid exchange state");
        }

        const user = await (this.prismaService as any).user.findUnique({
            where: { id: payload.userId },
        });

        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        const accessToken = this.generateAccessToken(user.id, user.email);
        const refreshToken = this.generateRefreshToken(user.id, user.email);

        return {
            accessToken,
            refreshToken,
            expiresIn: this.getAccessTokenExpiresInSeconds(),
        };
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

        const token = this.generateAccessToken(user.id, user.email);

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
