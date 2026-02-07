import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { decrypt, encrypt } from '@/common/utils/encryption';
import { PrismaService } from '@/database/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import type {
  AuthProvider,
  User,
  UserRole,
} from '../../prisma/generated/prisma';

@Injectable()
export class UserService {
  private readonly encryptKey: string;

  constructor(private readonly prisma: PrismaService) {
    this.encryptKey = process.env.AES_ENCRYPT_KEY || '';

    if (!this.encryptKey) {
      throw new Error('AES_ENCRYPT_KEY is not configured');
    }
  }

  private encryptIdentityNumber(identityNumber?: string): string | undefined {
    if (!identityNumber) return undefined;
    return encrypt(identityNumber, this.encryptKey);
  }

  private decryptIdentityNumber(user: User): User {
    if (user.identityNumber) {
      return {
        ...user,
        identityNumber: decrypt(user.identityNumber, this.encryptKey),
      };
    }
    return user;
  }

  private decryptIdentityNumberNullable(user: User | null): User | null {
    if (!user) return null;
    return this.decryptIdentityNumber(user);
  }

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('이미 존재하는 이메일입니다');
    }

    const data = {
      ...dto,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      baptizedAt: dto.baptizedAt ? new Date(dto.baptizedAt) : undefined,
      identityNumber: this.encryptIdentityNumber(dto.identityNumber),
    };

    const user = await this.prisma.user.create({ data });
    return this.decryptIdentityNumber(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map((user) => this.decryptIdentityNumber(user));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User #${id}을 찾을 수 없습니다`);
    }

    return this.decryptIdentityNumber(user);
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return this.decryptIdentityNumberNullable(user);
  }

  async findByProvider(provider: AuthProvider, providerId: string) {
    const user = await this.prisma.user.findFirst({
      where: { provider, providerId },
    });
    return this.decryptIdentityNumberNullable(user);
  }

  async findByLoginIdAndRole(loginId: string, role: UserRole) {
    const user = await this.prisma.user.findFirst({
      where: { loginId, role },
    });
    return this.decryptIdentityNumberNullable(user);
  }

  async createOAuthUser(data: {
    email: string;
    name?: string;
    provider: AuthProvider;
    providerId: string;
  }) {
    const user = await this.prisma.user.create({ data });
    return this.decryptIdentityNumber(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    const data = {
      ...dto,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      baptizedAt: dto.baptizedAt ? new Date(dto.baptizedAt) : undefined,
      identityNumber: this.encryptIdentityNumber(dto.identityNumber),
    };

    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    return this.decryptIdentityNumber(user);
  }

  async remove(id: string) {
    await this.findOne(id);

    const user = await this.prisma.user.delete({ where: { id } });
    return this.decryptIdentityNumber(user);
  }
}
