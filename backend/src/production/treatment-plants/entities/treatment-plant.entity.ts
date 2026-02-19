import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Source } from '../../sources/entities/source.entity';

export type TreatmentPlantDocument = TreatmentPlant & Document;

@Schema({ timestamps: true })
export class TreatmentPlant {
    @Prop({ required: true })
    name: string;

    @Prop({
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }
    })
    location: { type: string; coordinates: number[] };

    @Prop({ required: true })
    maxCapacityMld: number;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Source' })
    sourceId: Source;

    @Prop({ enum: ['OPERATIONAL', 'MAINTENANCE', 'SHUTDOWN'], default: 'OPERATIONAL' })
    status: string;
}

export const TreatmentPlantSchema = SchemaFactory.createForClass(TreatmentPlant);
TreatmentPlantSchema.index({ location: '2dsphere' });
