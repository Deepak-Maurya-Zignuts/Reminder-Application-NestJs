// eslint-disable-next-line prettier/prettier
import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { Response } from 'express';
import { Types } from 'mongoose';
import { AuthGuard } from 'src/Guard/auth.guard';

@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @UseGuards(new AuthGuard())
  @Post(':ownerId')
  create(
    @Param('ownerId') ownerId: string,
    @Body() createReminderDto: CreateReminderDto,
    @Res() res: Response,
  ) {
    return this.remindersService.create(createReminderDto, res);
  }

  @UseGuards(new AuthGuard())
  @Get(':ownerId')
  findAll(@Param('ownerId') ownerId: Types.ObjectId) {
    return this.remindersService.findAll(ownerId);
  }

  @UseGuards(new AuthGuard())
  @Get(':ownerId/:id')
  findOne(
    @Param('ownerId') ownerId: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    return this.remindersService.findOne(ownerId, id, res);
  }

  @UseGuards(new AuthGuard())
  @Patch(':ownerId/:id')
  update(
    @Param('ownerId') ownerId: string,
    @Param('id') id: string,
    @Body() updateReminderDto: UpdateReminderDto,
    @Res() res: Response,
  ) {
    return this.remindersService.update(ownerId, id, updateReminderDto, res);
  }

  @UseGuards(new AuthGuard())
  @Delete(':ownerId/:id')
  remove(
    @Param('ownerId') ownerId: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    return this.remindersService.remove(ownerId, id, res);
  }

  @UseGuards(new AuthGuard())
  @Post(':ownerId/upComing')
  upcomingReminders(@Param('ownerId') ownerId: string, @Res() res: Response) {
    return this.remindersService.upcomingReminders(ownerId, res);
  }

  @UseGuards(new AuthGuard())
  @Post(':ownerId/pushReminder')
  pushReminder(@Param('ownerId') ownerId: string, @Res() res: Response) {
    return this.remindersService.pushReminder(ownerId, res);
  }
}
