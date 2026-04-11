// import { Injectable, NotFoundException } from '@nestjs/common';
// import { CreatePetDto } from './dto/create-pet.dto';
// import { UpdatePetDto } from './dto/update-pet.dto';
// import { PrismaService } from 'src/prisma/prisma.service';

// @Injectable()
// export class PetsService {
//   constructor(private prisma: PrismaService) {}

//   async getPets(name: string) {
//     if (name) {
//       return this.prisma.pet.findMany({ where: { name } });
//     }
//     return this.prisma.pet.findMany();
//   }

//   async getPet(id: number) {
//     const pet = await this.prisma.pet.findUnique({ where: { id } });
//     if (!pet) {
//       throw new NotFoundException('pet not found');
//     }
//     return pet;
//   }

//   async createPet(createPetDto: CreatePetDto) {
//     return this.prisma.pet.create({
//       data: {
//         ...createPetDto,
//         client: {
//           connect: { id: createPetDto.clientId },
//         },
//       },
//     });
//   }

//   async updatePet(id: number, updatePetDto: UpdatePetDto) {
//     return this.prisma.pet.update({ where: { id }, data: updatePetDto });
//   }

//   async removePet(id: number) {
//     const toBeRemoved = await this.getPet(id);
//     await this.prisma.pet.delete({ where: { id } });
//     return toBeRemoved;
//   }
// }

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PetsService {
  constructor(private prisma: PrismaService) {}

  async getPets(name?: string) {
    const where = name
      ? {
          name: {
            contains: name,
            mode: Prisma.QueryMode.insensitive,
          },
        }
      : {};

    return this.prisma.pet.findMany({
      where,
      include: {
        client: true,
      },
    });
  }

  async getPet(id: number) {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      include: {
        client: true,
      },
    });

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    return pet;
  }

  async createPet(createPetDto: CreatePetDto) {
    const { clientId, ...petData } = createPetDto;

    return this.prisma.pet.create({
      data: {
        ...petData,
        client: {
          connect: { id: clientId },
        },
      },
      include: {
        client: true,
      },
    });
  }

  async updatePet(id: number, updatePetDto: UpdatePetDto) {
    const { clientId, ...petData } = updatePetDto;

    return this.prisma.pet.update({
      where: { id },
      data: {
        ...petData,
        ...(clientId && {
          client: {
            connect: { id: clientId },
          },
        }),
      },
      include: {
        client: true,
      },
    });
  }

  async removePet(id: number) {
    const pet = await this.getPet(id);

    await this.prisma.pet.delete({
      where: { id },
    });

    return pet;
  }
}
