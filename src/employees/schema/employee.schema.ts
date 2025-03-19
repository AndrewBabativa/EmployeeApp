import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Employee extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  jobTitle: string;

  @Prop({ required: true })
  birthDate: Date;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' }) 
  createdBy: Types.ObjectId;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
