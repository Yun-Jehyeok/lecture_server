import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    UseGuards,
    Request,
    Body,
} from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiBody,
    ApiParam,
    ApiResponse,
} from "@nestjs/swagger";
import {
    EnrollmentResponseDto,
    ProgressResponseDto,
} from "@/common/dto/response.dto";
import { EnrollmentsService } from "./enrollments.service";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";

@Controller("api/enrollments")
@ApiTags("Enrollments")
export class EnrollmentsController {
    constructor(private enrollmentsService: EnrollmentsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Enroll in course" })
    @ApiBody({
        schema: {
            type: "object",
            properties: { courseId: { type: "string" } },
            required: ["courseId"],
        },
    })
    @ApiResponse({
        status: 201,
        description: "Enrollment created",
        type: EnrollmentResponseDto,
    })
    async enrollCourse(
        @Request() req: any,
        @Body("courseId") courseId: string,
    ) {
        return this.enrollmentsService.enrollCourse(req.user.id, courseId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get my enrollments" })
    @ApiResponse({
        status: 200,
        description: "Enrollments",
        type: [EnrollmentResponseDto],
    })
    async getMyEnrollments(@Request() req: any) {
        return this.enrollmentsService.getMyEnrollments(req.user.id);
    }

    @Get(":courseId")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get enrollment by course" })
    @ApiParam({ name: "courseId", description: "Course id" })
    @ApiResponse({
        status: 200,
        description: "Enrollment",
        type: EnrollmentResponseDto,
    })
    async getEnrollmentByCourse(
        @Request() req: any,
        @Param("courseId") courseId: string,
    ) {
        return this.enrollmentsService.getEnrollmentByCourse(
            req.user.id,
            courseId,
        );
    }

    @Get(":courseId/progress")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get course progress" })
    @ApiParam({ name: "courseId", description: "Course id" })
    @ApiResponse({
        status: 200,
        description: "Progress",
        type: ProgressResponseDto,
    })
    async getCourseProgress(
        @Request() req: any,
        @Param("courseId") courseId: string,
    ) {
        return this.enrollmentsService.getCourseProgress(req.user.id, courseId);
    }

    @Delete(":enrollmentId")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Delete enrollment" })
    @ApiParam({ name: "enrollmentId", description: "Enrollment id" })
    @ApiResponse({ status: 200, description: "Enrollment deleted" })
    async deleteEnrollment(@Param("enrollmentId") enrollmentId: string) {
        return this.enrollmentsService.deleteEnrollment(enrollmentId);
    }
}
