//↓↓ ClientsService initial. Fonctionne en mémoire avec un tableau (this.clients) stocké dans la mémoire de l'application.
// Étape avant de test avant de se connecter à une bdd externe.
//private signifie que seul le service peut y accéder directement
//this fait référence à l'instance actuelle du service, clients est partagé dans toute l'application tant que le service existe.
//*Limites*: données qui disparaissent au redémarrage du serveur. Pas de relations comme dans une vraie bdd.

// import { Injectable } from '@nestjs/common';
// import { CreateClientDto } from './dto/create-client.dto';
// import { UpdateClientDto } from './dto/update-client.dto';

// //This provider can be injected into any class that depends on it
// @Injectable()
// export class ClientsService {
//   private clients = [
//     {
//       id: 0,
//       civility: 'Mr',
//       name: 'Bob',
//       lastName: 'Le Bricoleur',
//       email: 'bob@mail.com',
//       phone: 1234567890,
//       // pet: 'cat',
//     },
//     {
//       id: 1,
//       civility: 'Mme',
//       name: 'Mary-Jane',
//       lastName: 'Watson',
//       email: 'mj@mail.com',
//       phone: 9876543210,
//       // pet: 'dog',
//     },
//   ];

//   //Method to return this collection and allows us to optionally filter by name

//   getClients(name: string) {
//     if (name) {
//       return this.clients.filter((client) => client.name === name);
//     }
//     return this.clients;
//   }

//   getClient(id: number) {
//     const client = this.clients.find((client) => client.id === id);
//     if (!client) {
//       throw new Error('client not found');
//     }
//     return client;
//   }

//   createClient(createClientDto: CreateClientDto) {
//     const newClient = {
//       ...createClientDto,
//       id: Date.now(),
//     };
//     this.clients.push(newClient); // ← on stocke le client dans "this.clients"
//     return newClient;
//   }

//   updateClient(id: number, updateClientDto: UpdateClientDto) {
//     this.clients = this.clients.map((client) => {
//       if (client.id === id) {
//         return { ...client, ...updateClientDto };
//       }
//       return client;
//     });
//     return this.getClient(id);
//   }

//   removeClient(id: number) {
//     const toBeRemoved = this.getClient(id);
//     this.clients = this.clients.filter((client) => client.id !== id);
//     return toBeRemoved;
//   }
// }

//↓↓ Nouveau ClientsService pour utiliser Prisma

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
