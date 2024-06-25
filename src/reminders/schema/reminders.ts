import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReminderDocument = Reminder & Document;

@Schema()
export class Reminder {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  body: string;

  @Prop({ type: Date, required: true })
  date: string;

  @Prop({ type: String, required: true })
  time: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  owner: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  cronId: number;

  @Prop({ type: Boolean, default: false })
  sent: boolean;
}

export const reminderSchema = SchemaFactory.createForClass(Reminder);
