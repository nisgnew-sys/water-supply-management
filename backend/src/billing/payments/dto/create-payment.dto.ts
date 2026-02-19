import { IsEnum, IsNotEmpty, IsDateString, IsNumber, IsMongoId, IsString, IsOptional } from 'class-validator';

export class CreatePaymentDto {
    @IsMongoId()
    @IsNotEmpty()
    billId: string;

    @IsMongoId()
    @IsNotEmpty()
    consumerId: string;

    @IsNumber()
    amount: number;

    @IsDateString()
    paymentDate: Date;

    @IsEnum(['CASH', 'ONLINE', 'CHEQUE', 'DD'])
    mode: string;

    @IsString()
    @IsOptional()
    transactionReference: string;

    @IsEnum(['SUCCESS', 'FAILED', 'PENDING'])
    @IsOptional()
    status: string;

    @IsString()
    @IsOptional()
    remarks: string;
}
