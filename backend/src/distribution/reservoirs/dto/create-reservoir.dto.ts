import { IsEnum, IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
    @IsNumber({}, { each: true })
    @IsArray()
    coordinates: number[]; // [Longitude, Latitude]
}

export class CreateReservoirDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(['GSR', 'ESR', 'MBR', 'SUMP'])
    type: string;

    @ValidateNested()
    @Type(() => LocationDto)
    location: LocationDto;

    @IsNumber()
    capacityLiters: number;

    @IsString()
    @IsNotEmpty()
    zoneId: string;

    @IsEnum(['OPERATIONAL', 'CLEANING', 'REPAIR'])
    @IsOptional()
    status: string;
}
