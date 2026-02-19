import { IsEnum, IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested, IsEmail, IsPhoneNumber } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
    @IsNumber({}, { each: true })
    @IsArray()
    coordinates: number[]; // [Longitude, Latitude]
}

export class CreateConsumerDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsString() // Ideally IsPhoneNumber, but can be tricky with international formats without locale
    @IsNotEmpty()
    phone: string;

    @IsString()
    @IsNotEmpty()
    address: string;

    @ValidateNested()
    @Type(() => LocationDto)
    location: LocationDto;

    @IsEnum(['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'INSTITUTIONAL'])
    category: string;
}
