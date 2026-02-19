import { IsEnum, IsNotEmpty, IsDateString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class SlabDto {
    @IsNumber()
    minLiters: number;

    @IsNumber()
    maxLiters: number;

    @IsNumber()
    ratePerKL: number;
}

export class CreateTariffDto {
    @IsEnum(['DOMESTIC', 'COMMERCIAL', 'INDUSTRIAL', 'INSTITUTIONAL'])
    category: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SlabDto)
    slabs: SlabDto[];

    @IsDateString()
    effectiveDate: Date;
}
