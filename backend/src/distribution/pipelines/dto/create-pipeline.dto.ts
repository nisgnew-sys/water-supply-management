import { IsEnum, IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
    @IsArray()
    @IsArray({ each: true })
    coordinates: number[][]; // [[Lng, Lat], [Lng, Lat], ...]
}

export class CreatePipelineDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(['HDPE', 'DI', 'PVC', 'STEEL'])
    material: string;

    @IsNumber()
    diameterMm: number;

    @ValidateNested()
    @Type(() => LocationDto)
    location: LocationDto;

    @IsString()
    @IsNotEmpty()
    zoneId: string;

    @IsEnum(['OPERATIONAL', 'LEAKAGE', 'MAINTENANCE'])
    @IsOptional()
    status: string;
}
