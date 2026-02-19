import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Asset } from '../../entities/asset.entity';

export type MaintenanceDocument = Maintenance & Document;

@Schema({ timestamps: true })
export class Maintenance {
    @Prop({ required: true }) // Title of the maintenance task
    title: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Asset', required: true })
    assetId: Asset;

    @Prop({ required: true, enum: ['PREVENTIVE', 'CORRECTIVE', 'PREDICTIVE'] })
    type: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    scheduledDate: Date;

    @Prop()
    completedDate: Date;

    @Prop({ enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], default: 'SCHEDULED' })
    status: string;

    @Prop()
    technicianName: string;

    @Prop()
    cost: number;
}

export const MaintenanceSchema = SchemaFactory.createForClass(Maintenance);
MaintenanceSchema.index({ assetId: 1 });
MaintenanceSchema.index({ scheduledDate: 1 });
