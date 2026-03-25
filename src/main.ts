import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const allowedOrigins = (
        process.env.CORS_ORIGINS ||
        "http://localhost:3000,https://lecture-client.vercel.app"
    )
        .split(",")
        .map((origin) => origin.trim().replace(/\/$/, ""))
        .filter(Boolean);

    // Enable validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Enable CORS
    app.enableCors({
        origin: allowedOrigins,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    });

    const swaggerConfig = new DocumentBuilder()
        .setTitle("Online Lecture Platform API")
        .setDescription("API documentation for the lecture platform")
        .setVersion("1.0")
        .addBearerAuth()
        .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api-docs", app, swaggerDocument);

    const port = process.env.PORT || 8080;
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap().catch((err) => {
    console.error("Failed to start application:", err);
    process.exit(1);
});
