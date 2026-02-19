import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AssetDocument = Asset & Document;

@Schema({ timestamps: true })
export class Asset {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, enum: ['PUMP', 'MOTOR', 'VALVE', 'SENSOR', 'GENERATOR', 'TRANSFORMER'] })
    type: string;

    @Prop({ required: true })
    model: string;

    @Prop({ required: true })
    serialNumber: string;

    @Prop({ required: true })
    installationDate: Date;

    @Prop({ required: true, enum: ['SOURCE', 'WTP', 'RESERVOIR', 'DISTRIBUTION'] })
    facilityType: string;

    @Prop({ required: true }) // ID of the Source/WTP/Reservoir this asset belongs to
    facilityId: string;

    @Prop({ enum: ['OPERATIONAL', 'UNDER_MAINTENANCE', 'FAULTY', 'SCRAPPED'], default: 'OPERATIONAL' })
    status: string;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
AssetSchema.index({ facilityId: 1 });
