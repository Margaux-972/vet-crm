import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async getClients(query?: string) {
    const where: Prisma.ClientWhereInput = query
      ? {
          OR: [
            {
              firstName: {
                contains: query,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              lastName: {
                contains: query,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              email: {
                contains: query,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              phone: {
                contains: query,
              },
            },
          ],
        }
      : {};

    return this.prisma.client.findMany({
      where,
      include: {
        pet: true,
      },
    });
  }

  async getClient(id: number) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        pet: true,
      },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async createClient(createClientDto: CreateClientDto) {
    return this.prisma.client.create({
      data: createClientDto,
    });
  }

  async updateClient(id: number, updateClientDto: UpdateClientDto) {
    return this.prisma.client.update({
      where: { id },
      data: {
        ...updateClientDto,
      },
    });
  }

  async removeClient(id: number) {
    const toBeRemoved = await this.getClient(id);

    await this.prisma.client.delete({
      where: { id },
    });

    return toBeRemoved;
  }
}
