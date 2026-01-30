import {
    Controller,
    Post,
    Get,
    Put,
    Body,
    UseGuards,
    Request,
    HttpCode,
    Param,
} from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiBody,
    ApiResponse,
} from "@nestjs/swagger";
import {
    AuthResponseDto,
    UserResponseDto,
    MessageResponseDto,
    LearningStatsResponseDto,
} from "@/common/dto/response.dto";
import { AuthService } from "./auth.service";
import { UsersService } from "@/users/users.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import {
    RegisterDto,
    LoginDto,
    UpdateProfileDto,
    ChangePasswordDto,
} from "./auth.dto";

@Controller("api/auth")
@ApiTags("Auth")
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) {}

    @Post("register")
    @HttpCode(201)
    @ApiOperation({ summary: "Register a new user" })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({
        status: 201,
        description: "User registered",
        type: AuthResponseDto,
    })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post("login")
    @HttpCode(200)
    @ApiOperation({ summary: "Login" })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200,
        description: "Login successful",
        type: AuthResponseDto,
    })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post("logout")
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Logout" })
    @ApiResponse({
        status: 200,
        description: "Successfully logged out",
        type: MessageResponseDto,
    })
    logout() {
        return { message: "Successfully logged out" };
    }

    @Get("me")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get current user" })
    @ApiResponse({
        status: 200,
        description: "Current user",
        type: UserResponseDto,
    })
    async getCurrentUser(@Request() req: any) {
        return this.authService.validateUser(req.user.id);
    }
}

@Controller("api/users")
@ApiTags("Users")
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Put("profile")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Update profile" })
    @ApiBody({ type: UpdateProfileDto })
    @ApiResponse({
        status: 200,
        description: "Profile updated",
        type: UserResponseDto,
    })
    async updateProfile(
        @Request() req: any,
        @Body() updateProfileDto: UpdateProfileDto,
    ) {
        return this.usersService.updateProfile(req.user.id, updateProfileDto);
    }

    @Put("password")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Change password" })
    @ApiBody({ type: ChangePasswordDto })
    @ApiResponse({
        status: 200,
        description: "Password changed",
        type: MessageResponseDto,
    })
    async changePassword(
        @Request() req: any,
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        return this.usersService.changePassword(req.user.id, changePasswordDto);
    }

    @Get("learning-stats")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get learning stats" })
    @ApiResponse({
        status: 200,
        description: "Learning statistics",
        type: LearningStatsResponseDto,
    })
    async getLearningStats(@Request() req: any) {
        return this.usersService.getLearningStats(req.user.id);
    }

    @Get("recent-courses")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get recent courses" })
    @ApiResponse({ status: 200, description: "Recent courses" })
    async getRecentCourses(@Request() req: any) {
        return this.usersService.getRecentCourses(req.user.id);
    }

    @Post("recent-courses/:courseId")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Add recent course" })
    @ApiResponse({ status: 201, description: "Recent course added" })
    async addRecentCourse(
        @Request() req: any,
        @Param("courseId") courseId: string,
    ) {
        return this.usersService.addRecentCourse(req.user.id, courseId);
    }
}
