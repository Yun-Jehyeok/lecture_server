import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Query,
    UseGuards,
    Request,
} from "@nestjs/common";
import {
    ApiTags,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiBearerAuth,
    ApiBody,
    ApiResponse,
} from "@nestjs/swagger";
import {
    ReviewListResponseDto,
    ReviewResponseDto,
    MessageResponseDto,
} from "@/common/dto/response.dto";
import { ReviewsService } from "./reviews.service";
import { JwtAuthGuard } from "@/auth/jwt-auth.guard";

@Controller("api/courses")
@ApiTags("Reviews")
export class ReviewsController {
    constructor(private reviewsService: ReviewsService) {}

    @Get(":courseId/reviews")
    @ApiOperation({ summary: "Get course reviews" })
    @ApiParam({ name: "courseId", description: "Course id" })
    @ApiQuery({ name: "page", required: false })
    @ApiQuery({ name: "limit", required: false })
    @ApiQuery({
        name: "sort",
        required: false,
        enum: ["recent", "rating-high", "rating-low"],
    })
    @ApiResponse({
        status: 200,
        description: "Review list",
        type: ReviewListResponseDto,
    })
    async getReviews(
        @Param("courseId") courseId: string,
        @Query("page") page?: string,
        @Query("limit") limit?: string,
        @Query("sort") sort?: string,
    ) {
        return this.reviewsService.getReviews(
            courseId,
            parseInt(page ?? "1", 10) || 1,
            parseInt(limit ?? "10", 10) || 10,
            sort,
        );
    }

    @Post(":courseId/reviews")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Create review" })
    @ApiParam({ name: "courseId", description: "Course id" })
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                rating: { type: "number", minimum: 1, maximum: 5 },
                comment: { type: "string" },
            },
            required: ["rating", "comment"],
        },
    })
    @ApiResponse({
        status: 201,
        description: "Review created",
        type: ReviewResponseDto,
    })
    async createReview(
        @Request() req: any,
        @Param("courseId") courseId: string,
        @Body("rating") rating: number,
        @Body("comment") comment: string,
    ) {
        return this.reviewsService.createReview(
            req.user.id,
            courseId,
            rating,
            comment,
        );
    }
}

@Controller("api/reviews")
@ApiTags("Reviews")
export class ReviewController {
    constructor(private reviewsService: ReviewsService) {}

    @Put(":reviewId")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Update review" })
    @ApiParam({ name: "reviewId", description: "Review id" })
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                rating: { type: "number", minimum: 1, maximum: 5 },
                comment: { type: "string" },
            },
            required: ["rating", "comment"],
        },
    })
    @ApiResponse({
        status: 200,
        description: "Review updated",
        type: ReviewResponseDto,
    })
    async updateReview(
        @Request() req: any,
        @Param("reviewId") reviewId: string,
        @Body("rating") rating: number,
        @Body("comment") comment: string,
    ) {
        return this.reviewsService.updateReview(
            reviewId,
            req.user.id,
            rating,
            comment,
        );
    }

    @Delete(":reviewId")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Delete review" })
    @ApiParam({ name: "reviewId", description: "Review id" })
    @ApiResponse({
        status: 200,
        description: "Review deleted",
        type: MessageResponseDto,
    })
    async deleteReview(
        @Request() req: any,
        @Param("reviewId") reviewId: string,
    ) {
        return this.reviewsService.deleteReview(reviewId, req.user.id);
    }
}
