import {
    Controller,
    Get,
    Post,
    Delete,
    Put,
    Param,
    Body,
    UseGuards,
    Request,
} from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiParam,
    ApiBearerAuth,
    ApiBody,
    ApiResponse,
} from "@nestjs/swagger";
import { LessonResponseDto } from "@/common/dto/response.dto";
import { LessonsService } from "./lessons.service";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";

@Controller("api/lessons")
@ApiTags("Lessons")
export class LessonsController {
    constructor(private lessonsService: LessonsService) {}

    @Get(":lessonId")
    @ApiOperation({ summary: "Get lesson" })
    @ApiParam({ name: "lessonId", description: "Lesson id" })
    @ApiResponse({
        status: 200,
        description: "Lesson",
        type: LessonResponseDto,
    })
    async getLesson(@Param("lessonId") lessonId: string) {
        return this.lessonsService.getLesson(lessonId);
    }

    @Get(":lessonId/materials")
    @ApiOperation({ summary: "Get lesson materials" })
    @ApiParam({ name: "lessonId", description: "Lesson id" })
    @ApiResponse({
        status: 200,
        description: "Lesson materials",
        type: LessonResponseDto,
    })
    async getLessonMaterials(@Param("lessonId") lessonId: string) {
        return this.lessonsService.getLessonMaterials(lessonId);
    }

    @Post(":lessonId/complete")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Complete lesson" })
    @ApiParam({ name: "lessonId", description: "Lesson id" })
    @ApiResponse({ status: 200, description: "Lesson completed" })
    async completeLesson(
        @Request() req: any,
        @Param("lessonId") lessonId: string,
    ) {
        return this.lessonsService.completeLesson(req.user.id, lessonId);
    }

    @Delete(":lessonId/complete")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Uncomplete lesson" })
    @ApiParam({ name: "lessonId", description: "Lesson id" })
    @ApiResponse({ status: 200, description: "Lesson uncompleted" })
    async uncompleteLesson(
        @Request() req: any,
        @Param("lessonId") lessonId: string,
    ) {
        return this.lessonsService.uncompleteLesson(req.user.id, lessonId);
    }

    @Put(":lessonId/watch-time")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Update lesson watch time" })
    @ApiParam({ name: "lessonId", description: "Lesson id" })
    @ApiBody({
        schema: {
            type: "object",
            properties: { watch_time_seconds: { type: "number" } },
            required: ["watch_time_seconds"],
        },
    })
    @ApiResponse({ status: 200, description: "Watch time updated" })
    async updateWatchTime(
        @Request() req: any,
        @Param("lessonId") lessonId: string,
        @Body("watch_time_seconds") watchTimeSeconds: number,
    ) {
        return this.lessonsService.updateWatchTime(
            req.user.id,
            lessonId,
            watchTimeSeconds,
        );
    }
}
