import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReservoirDocument = Reservoir & Document;

@Schema({ timestamps: true })
export class Reservoir {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, enum: ['GSR', 'ESR', 'MBR', 'SUMP'] })
    type: string;

    @Prop({
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }
    })
    location: { type: string; coordinates: number[] };

    @Prop({ required: true })
    capacityLiters: number;

    @Prop({ required: true })
    zoneId: string; // Placeholder for Zone relation

    @Prop({ enum: ['OPERATIONAL', 'CLEANING', 'REPAIR'], default: 'OPERATIONAL' })
    status: string;
}

export const ReservoirSchema = SchemaFactory.createForClass(Reservoir);
ReservoirSchema.index({ location: '2dsphere' });
