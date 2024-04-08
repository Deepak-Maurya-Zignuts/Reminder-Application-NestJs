import { IsString, IsNotEmpty, IsDateString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateReminderDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  readonly title: string;

  @IsString()
  readonly body: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Date is required' })
  readonly date: string;

  @IsString()
  @IsNotEmpty({ message: 'Time is required' })
  readonly time: string;

  @IsNotEmpty({ message: 'User Id must be required' })
  readonly owner: Types.ObjectId;
}
