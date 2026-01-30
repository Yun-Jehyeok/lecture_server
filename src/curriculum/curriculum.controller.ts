import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { SectionResponseDto } from "@/common/dto/response.dto";
import { CurriculumService } from "./curriculum.service";

@Controller("api/courses")
@ApiTags("Curriculum")
export class CurriculumController {
    constructor(private curriculumService: CurriculumService) {}

    @Get(":courseId/curriculum")
    @ApiOperation({ summary: "Get course curriculum" })
    @ApiParam({ name: "courseId", description: "Course id" })
    @ApiResponse({
        status: 200,
        description: "Curriculum",
        type: [SectionResponseDto],
    })
    async getCurriculum(@Param("courseId") courseId: string) {
        return this.curriculumService.getCurriculum(courseId);
    }

    @Get(":courseId/sections")
    @ApiOperation({ summary: "Get course sections" })
    @ApiParam({ name: "courseId", description: "Course id" })
    @ApiResponse({
        status: 200,
        description: "Sections",
        type: [SectionResponseDto],
    })
    async getSections(@Param("courseId") courseId: string) {
        return this.curriculumService.getSections(courseId);
    }

    @Get(":courseId/sections/:sectionId")
    @ApiOperation({ summary: "Get section detail" })
    @ApiParam({ name: "courseId", description: "Course id" })
    @ApiParam({ name: "sectionId", description: "Section id" })
    @ApiResponse({
        status: 200,
        description: "Section",
        type: SectionResponseDto,
    })
    async getSection(
        @Param("courseId") courseId: string,
        @Param("sectionId") sectionId: string,
    ) {
        return this.curriculumService.getSection(courseId, sectionId);
    }
}
