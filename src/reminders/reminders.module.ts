import { Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { RemindersController } from './reminders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { reminderSchema } from './schema/reminders';
import { UserSchema } from 'src/users/schema/users';
import { RemindersUtil } from './utils/reminders.util';
import { EmailsUtil } from './utils/email.util';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Reminder', schema: reminderSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [RemindersController],
  providers: [RemindersService, RemindersUtil, EmailsUtil],
})
export class RemindersModule {}
