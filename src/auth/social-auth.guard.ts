import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleAuthGuard extends AuthGuard("google") {}

@Injectable()
export class KakaoAuthGuard extends AuthGuard("kakao") {}

@Injectable()
export class NaverAuthGuard extends AuthGuard("naver") {}
