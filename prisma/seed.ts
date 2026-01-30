import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // Create categories
    const frontendCategory = await prisma.category.create({
        data: {
            name: "프론트엔드",
            slug: "frontend",
            displayOrder: 1,
        },
    });

    const backendCategory = await prisma.category.create({
        data: {
            name: "백엔드",
            slug: "backend",
            displayOrder: 2,
        },
    });

    const mobileCategory = await prisma.category.create({
        data: {
            name: "모바일",
            slug: "mobile",
            displayOrder: 3,
        },
    });

    // Create sample courses
    const course1 = await prisma.course.create({
        data: {
            title: "React 완벽 가이드",
            instructorName: "김대신",
            categoryId: frontendCategory.id,
            description: "React의 기초부터 고급까지 모든 것을 배워보세요.",
            imageUrl: "https://via.placeholder.com/400x300?text=React",
            price: 49900,
            originalPrice: 99900,
            durationHours: 25,
            isBestseller: true,
            isPopular: true,
            isNew: false,
        },
    });

    const course2 = await prisma.course.create({
        data: {
            title: "Node.js 및 Express 마스터",
            instructorName: "이순신",
            categoryId: backendCategory.id,
            description: "Node.js와 Express를 이용한 백엔드 개발 완벽 가이드",
            imageUrl: "https://via.placeholder.com/400x300?text=Node.js",
            price: 59900,
            originalPrice: 119900,
            durationHours: 30,
            isBestseller: true,
            isPopular: false,
            isNew: true,
        },
    });

    const course3 = await prisma.course.create({
        data: {
            title: "Flutter 앱 개발 입문",
            instructorName: "박민수",
            categoryId: mobileCategory.id,
            description: "Flutter로 iOS/Android 앱을 함께 개발해보세요.",
            imageUrl: "https://via.placeholder.com/400x300?text=Flutter",
            price: 69900,
            originalPrice: 129900,
            durationHours: 35,
            isBestseller: false,
            isPopular: true,
            isNew: true,
        },
    });

    // Create curriculum sections
    const section1 = await prisma.curriculumSection.create({
        data: {
            courseId: course1.id,
            title: "React 기초",
            displayOrder: 1,
        },
    });

    const section2 = await prisma.curriculumSection.create({
        data: {
            courseId: course1.id,
            title: "React Hooks",
            displayOrder: 2,
        },
    });

    // Create lessons
    await prisma.lesson.create({
        data: {
            sectionId: section1.id,
            title: "React 소개",
            videoUrl: "https://via.placeholder.com/600x400?text=Video1",
            durationMinutes: 45,
            description: "React가 무엇이고 왜 사용하는지 알아봅시다.",
            displayOrder: 1,
        },
    });

    await prisma.lesson.create({
        data: {
            sectionId: section1.id,
            title: "JSX 이해하기",
            videoUrl: "https://via.placeholder.com/600x400?text=Video2",
            durationMinutes: 50,
            description: "JSX 문법과 사용법을 배워봅시다.",
            displayOrder: 2,
        },
    });

    // Create learning points
    await prisma.learningPoint.create({
        data: {
            courseId: course1.id,
            description: "React의 기본 개념과 원리를 이해",
            displayOrder: 1,
        },
    });

    await prisma.learningPoint.create({
        data: {
            courseId: course1.id,
            description: "React Hook을 이용한 상태 관리",
            displayOrder: 2,
        },
    });

    // Create banners
    await prisma.banner.create({
        data: {
            title: "여름 특별 할인",
            description: "모든 강의 50% 할인",
            imageUrl:
                "https://via.placeholder.com/1200x400?text=Summer+Discount",
            link: "/promotions",
            displayOrder: 1,
            isActive: true,
        },
    });

    // Create promotions
    await prisma.promotion.create({
        data: {
            title: "신규 사용자 환영 쿠폰",
            description: "회원가입 후 첫 구매에 20% 할인",
            discountPercent: 20,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            isActive: true,
        },
    });

    console.log("Database seeding completed!");
    console.log("Created:");
    console.log("- 3 Categories");
    console.log("- 3 Courses");
    console.log("- 2 Curriculum Sections");
    console.log("- 2 Lessons");
    console.log("- 2 Learning Points");
    console.log("- 1 Banner");
    console.log("- 1 Promotion");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
