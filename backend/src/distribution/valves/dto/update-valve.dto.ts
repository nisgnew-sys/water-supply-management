import { PartialType } from '@nestjs/mapped-types';
import { CreateValveDto } from './create-valve.dto';

export class UpdateValveDto extends PartialType(CreateValveDto) {}
