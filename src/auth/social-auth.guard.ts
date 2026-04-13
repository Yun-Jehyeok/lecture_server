import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleAuthGuard extends AuthGuard("google") {
    getAuthenticateOptions(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const state = req.query?.state;

        return state ? { state } : undefined;
    }
}

@Injectable()
export class KakaoAuthGuard extends AuthGuard("kakao") {
    getAuthenticateOptions(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const state = req.query?.state;

        return state ? { state } : undefined;
    }
}

@Injectable()
export class NaverAuthGuard extends AuthGuard("naver") {
    getAuthenticateOptions(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const state = req.query?.state;

        return state ? { state } : undefined;
    }
}
