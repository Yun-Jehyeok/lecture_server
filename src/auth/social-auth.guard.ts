import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { createPackedSocialState } from "@/auth/social-callback-state";

function isOAuthCallbackRequest(req: { path?: string }) {
    return req.path?.includes("/callback") ?? false;
}

@Injectable()
export class GoogleAuthGuard extends AuthGuard("google") {
    getAuthenticateOptions(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        if (isOAuthCallbackRequest(req)) {
            const state = req.query?.state;

            return state ? { state } : undefined;
        }

        return {
            state: createPackedSocialState({
                clientState: req.query?.state,
                requestOrigin: req.headers?.origin,
                requestReferer: req.headers?.referer,
            }),
        };
    }
}

@Injectable()
export class KakaoAuthGuard extends AuthGuard("kakao") {
    getAuthenticateOptions(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        if (isOAuthCallbackRequest(req)) {
            const state = req.query?.state;

            return state ? { state } : undefined;
        }

        return {
            state: createPackedSocialState({
                clientState: req.query?.state,
                requestOrigin: req.headers?.origin,
                requestReferer: req.headers?.referer,
            }),
        };
    }
}

@Injectable()
export class NaverAuthGuard extends AuthGuard("naver") {
    getAuthenticateOptions(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        if (isOAuthCallbackRequest(req)) {
            const state = req.query?.state;

            return state ? { state } : undefined;
        }

        return {
            state: createPackedSocialState({
                clientState: req.query?.state,
                requestOrigin: req.headers?.origin,
                requestReferer: req.headers?.referer,
            }),
        };
    }
}
