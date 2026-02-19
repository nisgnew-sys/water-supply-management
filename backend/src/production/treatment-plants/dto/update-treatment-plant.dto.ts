import { PartialType } from '@nestjs/mapped-types';
import { CreateTreatmentPlantDto } from './create-treatment-plant.dto';

export class UpdateTreatmentPlantDto extends PartialType(CreateTreatmentPlantDto) {}
