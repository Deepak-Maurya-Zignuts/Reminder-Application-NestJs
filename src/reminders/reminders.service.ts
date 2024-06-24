import { Injectable } from '@nestjs/common';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Reminder, ReminderDocument } from './schema/reminders';
import { User, UserDocument } from 'src/users/schema/users';
import { RemindersUtil } from './utils/reminders.util';
import { EmailsUtil } from './utils/email.util';
import * as nodemailer from 'nodemailer';

@Injectable()
export class RemindersService {
  constructor(
    @InjectModel(Reminder.name)
    private readonly reminderModel: Model<ReminderDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly remindersUtil: RemindersUtil,
    private readonly emailsUtil: EmailsUtil,
  ) {}

  // Create a reminder
  async create(createReminderDto: CreateReminderDto, res: Response) {
    try {
      const reminder = new this.reminderModel();
      reminder.title = createReminderDto.title;
      reminder.body = createReminderDto.body;
      reminder.date = createReminderDto.date;
      reminder.time = createReminderDto.time;
      reminder.owner = createReminderDto.owner;
      const savedReminder = await reminder.save();

      const reminderId = savedReminder.id;
      console.log(reminderId);

      // ** Create a cron job here **
      const cronCreated = await this.remindersUtil.createCronJob(
        createReminderDto.owner,
        reminderId,
      );

      if (!cronCreated.success) {
        throw new Error('Cron job creation failed');
      }
      return res.status(200).json({
        success: true,
        message: 'Reminder created successfully',
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({
        success: false,
        error: error.message,
        message: 'Error creating reminder',
      });
    }
  }

  // Get all reminders
  async findAll(ownerId: Types.ObjectId, res: Response) {
    try {
      const reminders = await this.reminderModel.find({ owner: ownerId });
      return res.status(200).json({
        success: true,
        message: 'Reminders fetched successfully',
        reminders,
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
        message: 'Error fetching reminders',
      });
    }
  }

  // Get a reminder
  async findOne(ownerId: string, id: string, res: Response) {
    try {
      const reminder = await this.reminderModel.findOne({
        _id: id,
        owner: ownerId,
      });
      if (!reminder) {
        return res.status(404).json({
          success: false,
          message: 'Reminder not found',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Reminder fetched successfully',
        reminder,
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
        message: 'Error fetching reminder',
      });
    }
  }

  // Update a reminder
  // eslint-disable-next-line prettier/prettier
  async update(ownerId: string, id: string, updateReminderDto: UpdateReminderDto, res: Response) {
    try {
      const filter = {
        _id: id,
        owner: ownerId,
      };
      const reminder = await this.reminderModel.findOneAndUpdate(
        filter,
        updateReminderDto,
        { new: true },
      );
      console.log(reminder);
      return res.status(200).json({
        success: true,
        message: 'Reminder updated successfully',
        reminder,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({
        success: false,
        error: error.message,
        message: 'Error updating reminder',
      });
    }
  }

  // Delete a reminder
  async remove(ownerId: string, id: string, res: Response) {
    try {
      const filter = {
        _id: id,
        owner: ownerId,
      };
      await this.reminderModel.deleteOne(filter);
      return res.status(200).json({
        success: true,
        message: 'Reminder deleted successfully',
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({
        success: false,
        error: error.message,
        message: 'Error deleting reminder',
      });
    }
  }

  // get upcoming reminders
  async upcomingReminders(ownerId: string, res: Response) {
    try {
      const currentDate = new Date();
      const reminders = await this.reminderModel.find({
        owner: ownerId,
        date: {
          $gte: currentDate.toISOString(),
        },
      });
      console.log(reminders);
      return res.status(200).json({
        success: true,
        message: 'Upcoming reminders fetched successfully',
        reminders,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({
        success: false,
        error: error.message,
        message: 'Error fetching upcoming reminders',
      });
    }
  }

  // send email reminder to user which are upcoming in 10 minutes
  async pushReminder(ownerId: string, res: Response) {
    try {
      const currentDateTime = new Date();
      const tenMinutesLaterDateTime = new Date(
        currentDateTime.getTime() + 10 * 60 * 1000,
      ); // 10 minutes in milliseconds

      const reminders = await this.reminderModel.find({
        owner: ownerId,
        date: {
          $gte: currentDateTime.toISOString(),
          $lte: tenMinutesLaterDateTime.toISOString(),
        },
        // time: {
        //   $lte: tenMinutesLaterDateTime.toISOString().split('T')[1].slice(0, 5),
        // }, // Check time part only
      });
      console.log(
        currentDateTime.toISOString(),
        tenMinutesLaterDateTime.toISOString(),
      );
      console.log(reminders);

      if (reminders.length > 0) {
        // Configure nodemailer transporter with your email service provider details
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'mauryadeepaktg2@gmail.com',
            // pass: 'unyv oyda wjgf pcom',
            pass: process.env.MAIL_PWD,
          },
        });
        console.log('1122');

        // Define email options
        const mailOptions = {
          from: 'mauryadeepaktg2@gmail.com',
          to: 'mauryadeepaktg@gmail.com', // Send notification to the user's email address
          subject: 'Reminder' + reminders[0].title,
          text: reminders[0].body, // Combine task descriptions into email body
        };
        console.log('1125');
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
          success: true,
          message: 'Reminder pushed successfully',
        });
      } else {
        return res.status(200).json({
          message: 'No reminders to push',
        });
      }

      // Send the email
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({
        error: error.message,
        message: 'Error pushing reminder',
      });
    }
  }

  async cronReminder(ownerId: string, reminderId: string, res: Response) {
    try {
      const reminder = await this.reminderModel
        .findById(reminderId)
        .populate('owner', 'email');
      // const user = await this.userModel.findById(ownerId);

      if (!reminder) {
        throw new Error('Reminder not found');
      }

      const owner = reminder.owner as unknown as User;

      console.log(owner.email);
      // console.log(user);

      const emailSent = await this.emailsUtil.sendReminderEmail(
        owner.email,
        reminder.title,
        reminder.body,
      );

      if (!emailSent) {
        throw new Error('Error sending reminder email');
      }

      return res.status(200).json({
        success: true,
        reminder,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({
        success: false,
        error: error.message,
        message: 'Error fetching reminder',
      });
    }
  }
}
