import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, select: false }) // Password hidden by default
    password: string;

    @Prop({ required: true })
    name: string;

    @Prop({
        required: true,
        enum: ['ADMIN', 'OPERATOR', 'CONSUMER', 'FIELD_STAFF'],
        default: 'CONSUMER',
    })
    role: string;

    @Prop({ default: true })
    isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
