import { Injectable } from '@nestjs/common';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  private pets = [
    {
      id: 1,
      name: 'Cinnamon',
      age: 2,
      size: 80,
      weigth: 15,
      type: 'cat',
    },
  ];

  getPets(name: string) {
    if (name) {
      return this.pets.filter((pet) => pet.name === name);
    }
    return this.pets;
  }

  getPet(id: number) {
    const pet = this.pets.find((pet) => pet.id === id);
    if (!pet) {
      throw new Error('pet not found');
    }
    return pet;
  }

  createPet(createPetDto: CreatePetDto) {
    const newPet = {
      ...createPetDto,
      id: Date.now(),
    };
    this.pets.push(newPet);
    return newPet;
  }

  updatePet(id: number, updatePetDto: UpdatePetDto) {
    this.pets = this.pets.map((pet) => {
      if (pet.id === id) {
        return { ...pet, ...updatePetDto };
      }
      return pet;
    });
    return this.getPet(id);
  }

  removePet(id: number) {
    const toBeRemoved = this.getPet(id);
    this.pets = this.pets.filter((pet) => pet.id !== id);
    return toBeRemoved;
  }
}
