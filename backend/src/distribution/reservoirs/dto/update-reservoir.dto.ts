import { PartialType } from '@nestjs/mapped-types';
import { CreateReservoirDto } from './create-reservoir.dto';

export class UpdateReservoirDto extends PartialType(CreateReservoirDto) {}
