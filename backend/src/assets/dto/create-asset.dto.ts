import { IsEnum, IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateAssetDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(['PUMP', 'MOTOR', 'VALVE', 'SENSOR', 'GENERATOR', 'TRANSFORMER'])
    type: string;

    @IsString()
    @IsNotEmpty()
    model: string;

    @IsString()
    @IsNotEmpty()
    serialNumber: string;

    @IsDateString()
    installationDate: Date;

    @IsEnum(['SOURCE', 'WTP', 'RESERVOIR', 'DISTRIBUTION'])
    facilityType: string;

    @IsString()
    @IsNotEmpty()
    facilityId: string;

    @IsEnum(['OPERATIONAL', 'UNDER_MAINTENANCE', 'FAULTY', 'SCRAPPED'])
    @IsOptional()
    status: string;
}
