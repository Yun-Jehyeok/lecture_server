import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import {
    BannerResponseDto,
    PromotionResponseDto,
} from "@/common/dto/response.dto";
import { PromotionsService } from "./promotions.service";

@Controller("api")
@ApiTags("Promotions")
export class PromotionsController {
    constructor(private promotionsService: PromotionsService) {}

    @Get("banners")
    @ApiOperation({ summary: "Get banners" })
    @ApiResponse({
        status: 200,
        description: "Banners",
        type: [BannerResponseDto],
    })
    async getBanners() {
        return this.promotionsService.getBanners();
    }

    @Get("promotions")
    @ApiOperation({ summary: "Get promotions" })
    @ApiResponse({
        status: 200,
        description: "Promotions",
        type: [PromotionResponseDto],
    })
    async getPromotions() {
        return this.promotionsService.getPromotions();
    }
}
