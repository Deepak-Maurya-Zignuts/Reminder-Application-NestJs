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
      const reminder = await this.reminderModel.findOne({ _id: reminderId });
      if (!reminder) {
        throw new Error('Reminder not found');
      }

      console.log(reminder.date, reminder.time, 'inside utils');

      // ** time format hh:mm
      const hour = parseInt(reminder.time?.split(':')[0]);
      const minute = parseInt(reminder.time?.split(':')[1]);

      // ** date format yyyy-mm-dd
      const day = parseInt(reminder.date?.split('-')[2]);
      const month = parseInt(reminder.date?.split('-')[1]);

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
            hours: [hour],
            mdays: [day],
            minutes: [minute],
            months: [month],
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

        // ** update reminder details
        reminder.cronId = cronResponse.data.jobId;
        reminder.sent = true;
        await reminder.save();
      } else {
        throw new Error('Cron job creation failed');
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

  async updateCronJob(ownerId: string, reminderId: string) {
    try {
      // ** fetching reminder details
      const reminder = await this.reminderModel.findOne({
        _id: reminderId,
        owner: ownerId,
      });

      // ** validation
      if (!reminder) {
        throw new Error('Reminder not found');
      }

      // ** time format hh:mm
      const hour = parseInt(reminder.time?.split(':')[0]);
      const minute = parseInt(reminder.time?.split(':')[1]);

      // ** date format yyyy-mm-dd
      const day = parseInt(reminder.date?.split('-')[2]);
      const month = parseInt(reminder.date?.split('-')[1]);

      const jobId = reminder?.cronId;

      // ** cron config
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
            hours: [hour],
            mdays: [day],
            minutes: [minute],
            months: [month],
            wdays: [-1],
          },
        },
      };

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cronApiKey}`,
      };
      console.log(headers);

      // ** Cron job update
      const cronResponse = await axios.patch(
        `https://api.cron-job.org/jobs/${jobId}`,
        payload,
        { headers },
      );

      // ** validation
      if (!cronResponse.data) {
        throw new Error('Cron job update failed');
      }
      console.log('cron response : ', cronResponse.data);

      return {
        success: true,
        message: 'Cron job updated successfully',
      };
    } catch (error) {
      console.log(error.message);
      return {
        success: false,
        error: error.message,
        message: 'Error updating cron job',
      };
    }
  }

  async deleteCronJob(ownerId: string, reminderId: string) {
    try {
      // ** fetching reminder details
      const reminder = await this.reminderModel.findOne({
        _id: reminderId,
        owner: ownerId,
      });

      // ** validation
      if (!reminder) {
        throw new Error('Reminder not found');
      }

      // ** cron job deletion
      const cronApiKey = process.env.CRON_API_KEY;

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cronApiKey}`,
      };

      const cronResponse = await axios.delete(
        `https://api.cron-job.org/jobs/${reminder.cronId}`,
        { headers },
      );
      console.log('cron response : ', cronResponse.data);

      // ** validation
      if (cronResponse.data) {
        console.log('Cron job deleted successfully:', cronResponse.data);
      } else {
        throw new Error('Cron job deletion failed');
      }

      // ** update reminder details
      reminder.cronId = null;
      reminder.sent = false;
      await reminder.save();

      return {
        success: true,
        message: 'Cron job deleted successfully',
      };
    } catch (error) {
      console.log(error.message);
      return {
        success: false,
        error: error.message,
        message: 'Error deleting cron job',
      };
    }
  }
}
