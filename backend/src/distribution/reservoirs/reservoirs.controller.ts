import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReservoirsService } from './reservoirs.service';
import { CreateReservoirDto } from './dto/create-reservoir.dto';
import { UpdateReservoirDto } from './dto/update-reservoir.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('distribution/reservoirs')
@UseGuards(JwtAuthGuard)
export class ReservoirsController {
  constructor(private readonly reservoirsService: ReservoirsService) { }

  @Post()
  create(@Body() createReservoirDto: CreateReservoirDto) {
    return this.reservoirsService.create(createReservoirDto);
  }

  @Get()
  findAll() {
    return this.reservoirsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservoirsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservoirDto: UpdateReservoirDto) {
    return this.reservoirsService.update(id, updateReservoirDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservoirsService.remove(id);
  }
}
