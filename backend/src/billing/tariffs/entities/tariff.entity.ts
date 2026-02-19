import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TariffDocument = Tariff & Document;

@Schema({ timestamps: true })
export class Tariff {
    @Prop({ required: true, enum: ['DOMESTIC', 'COMMERCIAL', 'INDUSTRIAL', 'INSTITUTIONAL'] })
    category: string;

    @Prop({
        required: true, type: [{
            minLiters: Number,
            maxLiters: Number,
            ratePerKL: Number
        }]
    })
    slabs: { minLiters: number; maxLiters: number; ratePerKL: number }[];

    @Prop({ required: true })
    effectiveDate: Date;

    @Prop({ default: true })
    isActive: boolean;
}

export const TariffSchema = SchemaFactory.createForClass(Tariff);
TariffSchema.index({ category: 1, effectiveDate: -1 });
