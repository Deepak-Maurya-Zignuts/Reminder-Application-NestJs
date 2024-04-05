import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReminderDocument = Reminder & Document;

@Schema()
export class Reminder {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  body: string;

  @Prop({ type: Date, required: true })
  date: string;

  @Prop({ type: String, required: true })
  time: string;
}

export const Reminderschema = SchemaFactory.createForClass(Reminder);
