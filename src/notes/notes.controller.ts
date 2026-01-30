import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    UseGuards,
    Request,
} from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiParam,
    ApiBody,
    ApiResponse,
} from "@nestjs/swagger";
import { NoteResponseDto } from "@/common/dto/response.dto";
import { NotesService } from "./notes.service";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";

@Controller("api/lessons")
@ApiTags("Notes")
export class LessonNotesController {
    constructor(private notesService: NotesService) {}

    @Get(":lessonId/notes")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get lesson notes" })
    @ApiParam({ name: "lessonId", description: "Lesson id" })
    @ApiResponse({
        status: 200,
        description: "Lesson notes",
        type: NoteResponseDto,
    })
    async getLessonNotes(
        @Request() req: any,
        @Param("lessonId") lessonId: string,
    ) {
        return this.notesService.getLessonNotes(req.user.id, lessonId);
    }

    @Post(":lessonId/notes")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Create or update lesson note" })
    @ApiParam({ name: "lessonId", description: "Lesson id" })
    @ApiBody({
        schema: {
            type: "object",
            properties: { content: { type: "string" } },
            required: ["content"],
        },
    })
    @ApiResponse({
        status: 200,
        description: "Note saved",
        type: NoteResponseDto,
    })
    async createOrUpdateNote(
        @Request() req: any,
        @Param("lessonId") lessonId: string,
        @Body("content") content: string,
    ) {
        return this.notesService.createOrUpdateNote(
            req.user.id,
            lessonId,
            content,
        );
    }
}

@Controller("api/enrollments")
@ApiTags("Notes")
export class EnrollmentNotesController {
    constructor(private notesService: NotesService) {}

    @Get(":courseId/notes")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get course notes" })
    @ApiParam({ name: "courseId", description: "Course id" })
    @ApiResponse({
        status: 200,
        description: "Course notes",
        type: [NoteResponseDto],
    })
    async getCourseNotes(
        @Request() req: any,
        @Param("courseId") courseId: string,
    ) {
        return this.notesService.getCourseNotes(req.user.id, courseId);
    }
}
