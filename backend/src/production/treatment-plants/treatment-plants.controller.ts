import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TreatmentPlantsService } from './treatment-plants.service';
import { CreateTreatmentPlantDto } from './dto/create-treatment-plant.dto';
import { UpdateTreatmentPlantDto } from './dto/update-treatment-plant.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('production/treatment-plants')
@UseGuards(JwtAuthGuard)
export class TreatmentPlantsController {
  constructor(private readonly treatmentPlantsService: TreatmentPlantsService) { }

  @Post()
  create(@Body() createTreatmentPlantDto: CreateTreatmentPlantDto) {
    return this.treatmentPlantsService.create(createTreatmentPlantDto);
  }

  @Get()
  findAll() {
    return this.treatmentPlantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.treatmentPlantsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTreatmentPlantDto: UpdateTreatmentPlantDto) {
    return this.treatmentPlantsService.update(id, updateTreatmentPlantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.treatmentPlantsService.remove(id);
  }
}
