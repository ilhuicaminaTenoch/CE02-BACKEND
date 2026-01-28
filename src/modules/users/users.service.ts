import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
    ) { }

    async onModuleInit() {
        await this.seedAdmin();
    }

    private async seedAdmin() {
        const email = this.configService.get<string>('ADMIN_EMAIL', '');
        const password = this.configService.get<string>('ADMIN_PASSWORD', '');
        const fullName = this.configService.get<string>('ADMIN_FULL_NAME', '');

        const existingAdmin = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!existingAdmin) {
            const passwordHash = await bcrypt.hash(password, 10);
            await this.prisma.user.create({
                data: {
                    email,
                    passwordHash,
                    fullName,
                    role: UserRole.ADMIN,
                },
            });
            console.log(`Admin user created: ${email}`);
        }
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async create(data: any) {
        const { password, ...userData } = data;
        const passwordHash = await bcrypt.hash(password, 10);

        return this.prisma.user.create({
            data: {
                ...userData,
                passwordHash,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
}

