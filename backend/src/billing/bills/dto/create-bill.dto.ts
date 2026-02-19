import { IsEnum, IsNotEmpty, IsDateString, IsNumber, IsMongoId, IsOptional } from 'class-validator';

export class CreateBillDto {
    @IsMongoId()
    @IsNotEmpty()
    consumerId: string;

    @IsMongoId()
    @IsNotEmpty()
    connectionId: string;

    @IsDateString()
    billMonth: Date;

    @IsDateString()
    billDate: Date;

    @IsDateString()
    dueDate: Date;

    @IsNumber()
    @IsOptional()
    previousReading: number;

    @IsNumber()
    @IsOptional()
    currentReading: number;

    @IsNumber()
    @IsOptional()
    consumptionLiters: number;

    @IsNumber()
    amount: number;

    @IsEnum(['PENDING', 'PAID', 'PARTIALLY_PAID', 'OVERDUE'])
    @IsOptional()
    status: string;
}
