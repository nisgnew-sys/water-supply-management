import { IsEnum, IsNotEmpty, IsString, IsDateString, IsOptional, IsMongoId } from 'class-validator';

export class CreateConnectionDto {
    @IsMongoId()
    @IsNotEmpty()
    consumerId: string;

    @IsString()
    @IsNotEmpty()
    connectionNumber: string;

    @IsEnum(['METERED', 'NON_METERED'])
    type: string;

    @IsString()
    @IsOptional()
    meterNumber: string;

    @IsDateString()
    @IsOptional()
    installationDate: Date;
}
