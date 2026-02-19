import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Consumer } from '../../../consumers/entities/consumer.entity';
import { Connection } from '../../../consumers/connections/entities/connection.entity';

export type BillDocument = Bill & Document;

@Schema({ timestamps: true })
export class Bill {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Consumer', required: true })
    consumerId: Consumer;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Connection', required: true })
    connectionId: Connection;

    @Prop({ required: true })
    billMonth: Date; // First of the month

    @Prop({ required: true })
    billDate: Date;

    @Prop({ required: true })
    dueDate: Date;

    @Prop()
    previousReading: number;

    @Prop()
    currentReading: number;

    @Prop()
    consumptionLiters: number;

    @Prop({ required: true })
    amount: number;

    @Prop({ enum: ['PENDING', 'PAID', 'PARTIALLY_PAID', 'OVERDUE'], default: 'PENDING' })
    status: string;

    @Prop({ default: 0 })
    paidAmount: number;
}

export const BillSchema = SchemaFactory.createForClass(Bill);
BillSchema.index({ consumerId: 1, billMonth: -1 });
BillSchema.index({ status: 1 });
