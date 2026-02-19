import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ValveDocument = Valve & Document;

@Schema({ timestamps: true })
export class Valve {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, enum: ['SLUICE', 'AIR', 'SCOUR', 'NON_RETURN', 'FLOW_METER'] })
    type: string;

    @Prop({
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }
    })
    location: { type: string; coordinates: number[] };

    @Prop({ required: true })
    pipelineId: string; // Placeholder for Pipeline relation or simple ID

    @Prop({ enum: ['OPEN', 'CLOSED', 'PARTIAL', 'FAULTY'], default: 'OPEN' })
    status: string;
}

export const ValveSchema = SchemaFactory.createForClass(Valve);
ValveSchema.index({ location: '2dsphere' });
