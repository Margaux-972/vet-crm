import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  async getPets(@Query('name') name: string) {
    return this.petsService.getPets(name);
  }

  @Get(':id')
  async getOnePet(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.petsService.getPet(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Post()
  async createPet(@Body(new ValidationPipe()) createPetDto: CreatePetDto) {
    return this.petsService.createPet(createPetDto);
  }

  @Put(':id')
  async updatePet(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePetDto: UpdatePetDto,
  ) {
    return this.petsService.updatePet(id, updatePetDto);
  }

  @Delete(':id')
  async removePet(@Param('id', ParseIntPipe) id: number) {
    return this.petsService.removePet(id);
  }
}
