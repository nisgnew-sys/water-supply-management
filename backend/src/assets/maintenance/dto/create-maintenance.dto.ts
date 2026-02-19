import { IsEnum, IsNotEmpty, IsString, IsDateString, IsOptional, IsMongoId, IsNumber } from 'class-validator';

export class CreateMaintenanceDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsMongoId()
    @IsNotEmpty()
    assetId: string;

    @IsEnum(['PREVENTIVE', 'CORRECTIVE', 'PREDICTIVE'])
    type: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsDateString()
    scheduledDate: Date;

    @IsDateString()
    @IsOptional()
    completedDate: Date;

    @IsEnum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    @IsOptional()
    status: string;

    @IsString()
    @IsOptional()
    technicianName: string;

    @IsNumber()
    @IsOptional()
    cost: number;
}
