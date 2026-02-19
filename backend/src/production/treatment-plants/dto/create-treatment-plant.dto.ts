import { IsEnum, IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
    @IsNumber({}, { each: true })
    @IsArray()
    coordinates: number[]; // [Longitude, Latitude]
}

export class CreateTreatmentPlantDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @ValidateNested()
    @Type(() => LocationDto)
    location: LocationDto;

    @IsNumber()
    maxCapacityMld: number;

    @IsString()
    @IsOptional()
    sourceId: string;

    @IsEnum(['OPERATIONAL', 'MAINTENANCE', 'SHUTDOWN'])
    @IsOptional()
    status: string;
}
