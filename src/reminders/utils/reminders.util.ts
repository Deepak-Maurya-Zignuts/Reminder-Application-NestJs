import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Reminder, ReminderDocument } from '../schema/reminders';

@Injectable()
export class RemindersUtil {
  constructor(
    @InjectModel(Reminder.name)
    private readonly reminderModel: Model<ReminderDocument>,
  ) {}

  async createCronJob(ownerId: Types.ObjectId, reminderId: Types.ObjectId) {
    try {
      console.log(ownerId, reminderId, 'inside utils');

      // ** fetching reminder details
      const reminders = await this.reminderModel.findOne({ _id: reminderId });
      console.log(reminders.date, reminders.time, 'inside utils');

      // ** Create a cron job here **
      const cronApiKey = process.env.CRON_API_KEY;
      const cronApiUrl = `https://remindme.vercel.app/reminders/pushReminder/${ownerId}/${reminderId}`;

      // ** cron job configuration
      const payload = {
        job: {
          url: cronApiUrl,
          enabled: true,
          saveResponses: true,
          schedule: {
            timezone: 'Asia/Kolkata',
            expiresAt: 0,
            hours: [15],
            mdays: [18],
            minutes: [-1],
            months: [-1],
            wdays: [-1],
          },
        },
      };

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cronApiKey}`,
      };
      console.log(headers);

      // ** Cron job creation
      const cronResponse = await axios.put(
        'https://api.cron-job.org/jobs',
        payload,
        { headers },
      );
      console.log('cron response : ', cronResponse.data);

      if (cronResponse.data) {
        console.log('Cron job created successfully:', cronResponse.data);
      } else {
        console.log('Failed to create cron job:', cronResponse.data);
      }
      return {
        success: true,
        message: 'Cron job created successfully',
      };
    } catch (error) {
      console.log(error.message);
      return {
        success: false,
        error: error.message,
        message: 'Error creating cron job',
      };
    }
  }
}
