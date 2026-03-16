import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-naver-v2";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, "naver") {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get<string>("NAVER_CLIENT_ID") || "",
            clientSecret:
                configService.get<string>("NAVER_CLIENT_SECRET") || "",
            callbackURL: configService.get<string>("NAVER_CALLBACK_URL") || "",
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any,
    ): Promise<any> {
        const { id, email, nickname, profile_image } = profile;
        const user = {
            providerId: id,
            email: email || `naver_${id}@naver.com`,
            username: nickname || `naver_user_${id}`,
            profileImageUrl: profile_image,
            provider: "naver",
        };
        done(null, user);
    }
}
