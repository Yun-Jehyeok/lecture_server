import { Controller, Get, Param, Query } from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
} from "@nestjs/swagger";
import {
    CourseListResponseDto,
    CourseResponseDto,
    CourseRatingResponseDto,
} from "@/common/dto/response.dto";
import { CoursesService } from "./courses.service";

@Controller("api/courses")
@ApiTags("Courses")
export class CoursesController {
    constructor(private coursesService: CoursesService) {}

    @Get()
    @ApiOperation({ summary: "List courses" })
    @ApiQuery({ name: "category_id", required: false })
    @ApiQuery({ name: "search", required: false })
    @ApiQuery({
        name: "sort",
        required: false,
        enum: ["latest", "rating", "students", "price"],
    })
    @ApiQuery({ name: "page", required: false })
    @ApiQuery({ name: "limit", required: false })
    @ApiResponse({
        status: 200,
        description: "Course list",
        type: CourseListResponseDto,
    })
    async getAll(
        @Query("category_id") categoryId?: string,
        @Query("search") search?: string,
        @Query("sort") sort: string = "latest",
        @Query("page") page: string = "1",
        @Query("limit") limit: string = "12",
    ) {
        return this.coursesService.getAll(
            categoryId,
            search,
            sort,
            parseInt(page),
            parseInt(limit),
        );
    }

    @Get("popular")
    @ApiOperation({ summary: "List popular courses" })
    @ApiResponse({
        status: 200,
        description: "Popular courses",
        type: [CourseResponseDto],
    })
    async getPopular() {
        return this.coursesService.getPopular();
    }

    @Get("bestseller")
    @ApiOperation({ summary: "List bestseller courses" })
    @ApiResponse({
        status: 200,
        description: "Bestseller courses",
        type: [CourseResponseDto],
    })
    async getBestseller() {
        return this.coursesService.getBestseller();
    }

    @Get("new")
    @ApiOperation({ summary: "List new courses" })
    @ApiResponse({
        status: 200,
        description: "New courses",
        type: [CourseResponseDto],
    })
    async getNew() {
        return this.coursesService.getNew();
    }

    @Get(":id")
    @ApiOperation({ summary: "Get course by id" })
    @ApiParam({ name: "id", description: "Course id" })
    @ApiResponse({
        status: 200,
        description: "Course detail",
        type: CourseResponseDto,
    })
    async getById(@Param("id") id: string) {
        return this.coursesService.getById(id);
    }

    @Get(":id/rating")
    @ApiOperation({ summary: "Get course rating" })
    @ApiParam({ name: "id", description: "Course id" })
    @ApiResponse({
        status: 200,
        description: "Course rating",
        type: CourseRatingResponseDto,
    })
    async getRating(@Param("id") courseId: string) {
        return this.coursesService.getRating(courseId);
    }
}
