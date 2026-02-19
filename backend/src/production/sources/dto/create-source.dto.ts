import { IsEnum, IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
    @IsOptional()
    @IsString()
    type?: string; // 'Point'

    @IsNumber({}, { each: true })
    @IsArray()
    coordinates: number[]; // [Longitude, Latitude]
}

export class CreateSourceDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(['RIVER_INTAKE', 'BOREWELL', 'LAKE', 'SPRING'])
    type: string;

    @ValidateNested()
    @Type(() => LocationDto)
    location: LocationDto;

    @Type(() => Number)
    @IsNumber()
    maxCapacityMld: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
