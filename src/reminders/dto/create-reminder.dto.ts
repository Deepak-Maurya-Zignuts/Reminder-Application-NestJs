import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

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
}
