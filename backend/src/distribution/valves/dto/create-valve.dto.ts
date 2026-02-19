import { IsEnum, IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
    @IsNumber({}, { each: true })
    @IsArray()
    coordinates: number[]; // [Longitude, Latitude]
}

export class CreateValveDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(['SLUICE', 'AIR', 'SCOUR', 'NON_RETURN', 'FLOW_METER'])
    type: string;

    @ValidateNested()
    @Type(() => LocationDto)
    location: LocationDto;

    @IsString()
    @IsOptional()
    pipelineId: string;

    @IsEnum(['OPEN', 'CLOSED', 'PARTIAL', 'FAULTY'])
    @IsOptional()
    status: string;
}
