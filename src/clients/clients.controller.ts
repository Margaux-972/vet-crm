import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  //adding a new constructor to inject an instance of clientService into our ClientsController
  // ClientsController depends on ClientsService
  constructor(private readonly clientsService: ClientsService) {}

  // GET route to see all clients (/clients) si Query --> /clients?name=bob
  @Get()
  async getClients(@Query('query') query?: string) {
    return this.clientsService.getClients(query);
  }
  // GET route to see one client by id (/clients/:id)
  @Get(':id')
  // Pipe allow us to do a custom transformation to the data coming in
  async getOneClient(@Param('id', ParseIntPipe) id: number) {
    return this.clientsService.getClient(id);
  }

  //POST route to create client (/clients)
  @Post()

  //Pipes are handy when it comes to validating a request body
  //check the "condition" in the "create dto" if the request validate the condition a client is created else we'll have an error
  async createClient(
    @Body(new ValidationPipe()) createClientDto: CreateClientDto,
  ) {
    return await this.clientsService.createClient(createClientDto);
  }

  // PUT route to update client (/clients/:id)
  @Put(':id')
  async updateClient(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return await this.clientsService.updateClient(id, updateClientDto);
  }

  // DELETE route to delete client (/clients/:id)
  @Delete(':id')
  async removeClient(@Param('id', ParseIntPipe) id: number) {
    return await this.clientsService.removeClient(id);
  }
}
