// eslint-disable-next-line prettier/prettier
import { Controller, Post, Body, Res, Patch, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import { ResetPasswordDto } from './dto/resetpwd.dto';
import { AuthGuard } from 'src/Guard/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  signup(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    return this.usersService.signup(createUserDto, res);
  }

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    return this.usersService.login(loginUserDto, res);
  }

  @UseGuards(new AuthGuard())
  @Patch(':ownerId')
  resetPassword(
    @Param('ownerId') ownerId: string,
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res: Response,
  ) {
    return this.usersService.resetPassword(ownerId, resetPasswordDto, res);
  }

  @UseGuards(new AuthGuard())
  @Post('logout/:ownerId')
  logout(@Param('ownerId') ownerId: string, @Res() res: Response) {
    return this.usersService.logout(res);
  }
}
