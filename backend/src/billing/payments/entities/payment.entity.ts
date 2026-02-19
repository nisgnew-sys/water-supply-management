import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Bill } from '../../bills/entities/bill.entity';
import { Consumer } from '../../../consumers/entities/consumer.entity';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Bill', required: true })
    billId: Bill;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Consumer', required: true })
    consumerId: Consumer;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    paymentDate: Date;

    @Prop({ enum: ['CASH', 'ONLINE', 'CHEQUE', 'DD'], required: true })
    mode: string;

    @Prop()
    transactionReference: string;

    @Prop({ enum: ['SUCCESS', 'FAILED', 'PENDING'], default: 'SUCCESS' })
    status: string;

    @Prop()
    remarks: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
PaymentSchema.index({ billId: 1 });
PaymentSchema.index({ consumerId: 1 });
