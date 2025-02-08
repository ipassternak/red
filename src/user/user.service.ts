import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@src/database/prisma.service';

import { UserResponseDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async get(id: string): Promise<UserResponseDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
