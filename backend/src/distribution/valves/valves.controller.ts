import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ValvesService } from './valves.service';
import { CreateValveDto } from './dto/create-valve.dto';
import { UpdateValveDto } from './dto/update-valve.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('distribution/valves')
@UseGuards(JwtAuthGuard)
export class ValvesController {
  constructor(private readonly valvesService: ValvesService) { }

  @Post()
  create(@Body() createValveDto: CreateValveDto) {
    return this.valvesService.create(createValveDto);
  }

  @Get()
  findAll() {
    return this.valvesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.valvesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateValveDto: UpdateValveDto) {
    return this.valvesService.update(id, updateValveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.valvesService.remove(id);
  }
}
