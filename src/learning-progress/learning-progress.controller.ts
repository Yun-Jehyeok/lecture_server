import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
} from "@nestjs/swagger";
import { LearningProgressService } from "./learning-progress.service";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { LearningProgressResponseDto } from "@/common/dto/response.dto";

@Controller("api/learning-progress")
@ApiTags("Learning Progress")
export class LearningProgressController {
    constructor(private learningProgressService: LearningProgressService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get user learning progress" })
    @ApiResponse({
        status: 200,
        description: "Learning progress",
        type: [LearningProgressResponseDto],
    })
    async getUserProgress(@Request() req: any) {
        return this.learningProgressService.getUserProgress(req.user.id);
    }
}
