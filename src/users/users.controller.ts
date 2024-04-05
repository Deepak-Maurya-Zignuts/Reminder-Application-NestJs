// eslint-disable-next-line prettier/prettier
import { Controller, Post, Body, Res, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import { ResetPasswordDto } from './dto/resetpwd.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  signup(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    return this.usersService.signup(createUserDto, res);
  }

  @Post()
  login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    return this.usersService.login(loginUserDto, res);
  }

  @Patch(':id')
  // eslint-disable-next-line prettier/prettier
  resetPassword(@Param('id') id: string, @Body() resetPasswordDto: ResetPasswordDto, @Res() res: Response) {
    return this.usersService.resetPassword(id, resetPasswordDto, res);
  }
}
