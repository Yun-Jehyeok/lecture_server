import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { CategoryResponseDto } from "@/common/dto/response.dto";
import { CategoriesService } from "./categories.service";

@Controller("api/categories")
@ApiTags("Categories")
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) {}

    @Get()
    @ApiOperation({ summary: "List categories" })
    @ApiResponse({
        status: 200,
        description: "Category list",
        type: [CategoryResponseDto],
    })
    async getAll() {
        return this.categoriesService.getAll();
    }

    @Get(":id")
    @ApiOperation({ summary: "Get category by id" })
    @ApiParam({ name: "id", description: "Category id" })
    @ApiResponse({
        status: 200,
        description: "Category",
        type: CategoryResponseDto,
    })
    async getById(@Param("id") id: string) {
        return this.categoriesService.getById(id);
    }
}
