import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    getHello(): string {
        return "Welcome to Online Lecture Platform API!";
    }

    getVersion(): object {
        return {
            version: "1.0.0",
            name: "Online Lecture Platform API",
            status: "running",
        };
    }
}
