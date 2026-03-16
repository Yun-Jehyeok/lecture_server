import { IsEmail, IsString, MinLength, IsNotEmpty } from "class-validator";
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
