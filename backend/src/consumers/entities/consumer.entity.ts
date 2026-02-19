import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConsumerDocument = Consumer & Document;

@Schema({ timestamps: true })
export class Consumer {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    address: string;

    @Prop({
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }
    })
    location: { type: string; coordinates: number[] };

    @Prop({ required: true, enum: ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'INSTITUTIONAL'] })
    category: string;

    @Prop({ default: true })
    isActive: boolean;
}

export const ConsumerSchema = SchemaFactory.createForClass(Consumer);
ConsumerSchema.index({ location: '2dsphere' });
ConsumerSchema.index({ email: 1 });
