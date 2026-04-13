import {
    IsEmail,
    IsString,
    MinLength,
    IsNotEmpty,
    IsOptional,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegisterDto {
    @ApiProperty({ example: "user@example.com" })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: "john_doe" })
    @IsString()
    @IsNotEmpty()
    username!: string;

    @ApiProperty({ example: "password123" })
    @IsString()
    @MinLength(6)
    password!: string;
}

export class LoginDto {
    @ApiProperty({ example: "user@example.com" })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: "password123" })
    @IsString()
    password!: string;
}

export class UpdateProfileDto {
    @ApiPropertyOptional({ example: "john_doe" })
    @IsString()
    @IsNotEmpty()
    username?: string;

    @ApiPropertyOptional({ example: "https://example.com/avatar.png" })
    @IsString()
    profileImageUrl?: string;
}

export class ChangePasswordDto {
    @ApiProperty({ example: "oldPassword123" })
    @IsString()
    currentPassword!: string;

    @ApiProperty({ example: "newPassword123" })
    @IsString()
    @MinLength(6)
    newPassword!: string;

    @ApiProperty({ example: "newPassword123" })
    @IsString()
    @MinLength(6)
    confirmPassword!: string;
}

export class SocialLoginDto {
    @ApiProperty({
        example: "google",
        description: "Social login provider (google, kakao, naver)",
    })
    @IsString()
    @IsNotEmpty()
    provider!: string;

    @ApiProperty({
        example: "ya29.a0AfH6SMBx...",
        description: "Access token from social provider",
    })
    @IsString()
    @IsNotEmpty()
    accessToken!: string;
}

export class ExchangeCodeDto {
    @ApiProperty({
        example:
            "f4e6f4c7bf2e40c8a0a5d9f9564f4f5f0f5d0cc4c37d73f6d1d2c6f5f4e6a1b2",
        description: "One-time login exchange code issued by social callback",
    })
    @IsString()
    @IsNotEmpty()
    code!: string;

    @ApiPropertyOptional({
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        description: "Optional OAuth state for additional CSRF validation",
    })
    @IsOptional()
    @IsString()
    state?: string;
}
