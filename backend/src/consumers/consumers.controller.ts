import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ConsumersService } from './consumers.service';
import { CreateConsumerDto } from './dto/create-consumer.dto';
import { UpdateConsumerDto } from './dto/update-consumer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('consumers')
@UseGuards(JwtAuthGuard)
export class ConsumersController {
  constructor(private readonly consumersService: ConsumersService) { }

  @Post()
  create(@Body() createConsumerDto: CreateConsumerDto) {
    return this.consumersService.create(createConsumerDto);
  }

  @Get()
  findAll() {
    return this.consumersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consumersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConsumerDto: UpdateConsumerDto) {
    return this.consumersService.update(id, updateConsumerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consumersService.remove(id);
  }
}
