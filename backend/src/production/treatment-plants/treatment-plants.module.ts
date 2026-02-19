import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TreatmentPlantsService } from './treatment-plants.service';
import { TreatmentPlantsController } from './treatment-plants.controller';
import { TreatmentPlant, TreatmentPlantSchema } from './entities/treatment-plant.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TreatmentPlant.name, schema: TreatmentPlantSchema }]),
  ],
  controllers: [TreatmentPlantsController],
  providers: [TreatmentPlantsService],
})
export class TreatmentPlantsModule { }
