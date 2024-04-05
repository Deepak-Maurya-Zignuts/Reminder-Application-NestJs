import { Injectable } from '@nestjs/common';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Reminder, ReminderDocument } from './schema/reminders';

@Injectable()
export class RemindersService {
  constructor(
    @InjectModel(Reminder.name)
    private readonly reminderModel: Model<ReminderDocument>,
  ) {}

  async create(createReminderDto: CreateReminderDto, res: Response) {
    try {
      const reminder = new this.reminderModel();
      reminder.title = createReminderDto.title;
      reminder.body = createReminderDto.body;
      reminder.date = createReminderDto.date;
      reminder.time = createReminderDto.time;
      await reminder.save();
      return res.status(200).json({
        message: 'Reminder created successfully',
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: 'Error creating reminder',
      });
    }
  }

  async findAll() {
    const reminders = await this.reminderModel.find();
    return reminders;
  }

  findOne(id: string, res: Response) {
    const reminder = this.reminderModel.findById(id);
    return res.json(reminder);
  }

  // eslint-disable-next-line prettier/prettier
  async update(id: string, updateReminderDto: UpdateReminderDto, res: Response) {
    try {
      const reminder = await this.reminderModel.findByIdAndUpdate(
        id,
        updateReminderDto,
        { new: true },
      );
      console.log(reminder);
      return res.status(200).json({
        message: 'Reminder updated successfully',
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: 'Error updating reminder',
      });
    }
  }

  async remove(id: string, res: Response) {
    await this.reminderModel.findByIdAndDelete(id);
    return res.status(200).json({
      message: 'Reminder deleted successfully',
    });
  }
}
