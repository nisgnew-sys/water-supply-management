import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Consumer } from '../../entities/consumer.entity';

export type ConnectionDocument = Connection & Document;

@Schema({ timestamps: true })
export class Connection {
    @Prop({ required: true, unique: true })
    consumerId: string; // Foreign Key to Consumer

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Consumer', required: true })
    consumerRef: Consumer;

    @Prop({ required: true, unique: true })
    connectionNumber: string;

    @Prop({ enum: ['METERED', 'NON_METERED'], default: 'METERED' })
    type: string;

    @Prop()
    meterNumber: string;

    @Prop({ enum: ['ACTIVE', 'DISCONNECTED', 'SUSPENDED'], default: 'ACTIVE' })
    status: string;

    @Prop()
    installationDate: Date;
}

export const ConnectionSchema = SchemaFactory.createForClass(Connection);
ConnectionSchema.index({ consumerId: 1 });
ConnectionSchema.index({ connectionNumber: 1 });
