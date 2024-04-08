import { Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { reminderSchema } from './schema/reminders';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Reminder', schema: reminderSchema }]),
  ],
  controllers: [RemindersController],
  providers: [RemindersService],
})
export class RemindersModule {}
