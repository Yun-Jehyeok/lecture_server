import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./common/prisma.service";
import { CryptoService } from "./common/crypto.service";
import { JwtStrategy } from "./auth/jwt.strategy";
import { GoogleStrategy } from "./auth/google.strategy";
import { KakaoStrategy } from "./auth/kakao.strategy";
import { NaverStrategy } from "./auth/naver.strategy";
import { AuthService } from "./auth/auth.service";
import { AuthController, UsersController } from "./auth/auth.controller";
import { UsersService } from "./users/users.service";
import { CategoriesService } from "./categories/categories.service";
import { CategoriesController } from "./categories/categories.controller";
import { CoursesService } from "./courses/courses.service";
import { CoursesController } from "./courses/courses.controller";
import { CurriculumService } from "./curriculum/curriculum.service";
import { CurriculumController } from "./curriculum/curriculum.controller";
import { LessonsService } from "./lessons/lessons.service";
import { LessonsController } from "./lessons/lessons.controller";
import { EnrollmentsService } from "./enrollments/enrollments.service";
import { EnrollmentsController } from "./enrollments/enrollments.controller";
import { ReviewsService } from "@/reviews/reviews.service";
import {
    ReviewsController,
    ReviewController,
} from "@/reviews/reviews.controller";
import { NotesService } from "@/notes/notes.service";
import {
    LessonNotesController,
    EnrollmentNotesController,
} from "./notes/notes.controller";
import { PromotionsService } from "./promotions/promotions.service";
import { PromotionsController } from "./promotions/promotions.controller";
import { LearningProgressService } from "./learning-progress/learning-progress.service";
import { LearningProgressController } from "./learning-progress/learning-progress.controller";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ".env",
        }),
        PassportModule.register({ defaultStrategy: "jwt" }),
        JwtModule.registerAsync({
            useFactory: async () => ({
                secret: process.env.JWT_SECRET || "your-secret-key",
                signOptions: { expiresIn: 86400 },
            }),
        }),
    ],
    controllers: [
        AppController,
        AuthController,
        UsersController,
        CategoriesController,
        CoursesController,
        CurriculumController,
        LessonsController,
        EnrollmentsController,
        ReviewsController,
        ReviewController,
        LessonNotesController,
        EnrollmentNotesController,
        PromotionsController,
        LearningProgressController,
    ],
    providers: [
        AppService,
        PrismaService,
        CryptoService,
        JwtStrategy,
        GoogleStrategy,
        KakaoStrategy,
        NaverStrategy,
        AuthService,
        UsersService,
        CategoriesService,
        CoursesService,
        CurriculumService,
        LessonsService,
        EnrollmentsService,
        ReviewsService,
        NotesService,
        PromotionsService,
        LearningProgressService,
    ],
})
export class AppModule {}
