import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SourceDocument = Source & Document;

@Schema({ timestamps: true })
export class Source {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, enum: ['RIVER_INTAKE', 'BOREWELL', 'LAKE', 'SPRING'] })
    type: string;

    @Prop({
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }
    })
    location: { type: string; coordinates: number[] };

    @Prop({ required: true })
    maxCapacityMld: number;

    @Prop({ default: true })
    isActive: boolean;
}

export const SourceSchema = SchemaFactory.createForClass(Source);
SourceSchema.index({ location: '2dsphere' });
