import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PipelineDocument = Pipeline & Document;

@Schema({ timestamps: true })
export class Pipeline {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, enum: ['HDPE', 'DI', 'PVC', 'STEEL'] })
    material: string;

    @Prop({ required: true })
    diameterMm: number;

    @Prop({
        type: { type: String, enum: ['LineString'], default: 'LineString' },
        coordinates: { type: [[Number]], required: true }
    })
    location: { type: string; coordinates: number[][] }; // Array of [lng, lat] arrays

    @Prop({ required: true })
    zoneId: string;

    @Prop({ enum: ['OPERATIONAL', 'LEAKAGE', 'MAINTENANCE'], default: 'OPERATIONAL' })
    status: string;
}

export const PipelineSchema = SchemaFactory.createForClass(Pipeline);
PipelineSchema.index({ location: '2dsphere' });
