import { Controller, Get, Res, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
  @Get()
  getHomePage(@Res() res: Response): any {
    return res.render('home');
  }
  @Get('/user-dashboard')
  getUserDashboard(@Req() req: Request, @Res() res: Response): any {
    const authorization = req.cookies.token;
    res.setHeader('authorization', `${authorization}`);
    return res.render('user-dashboard', {
      userId: req.cookies.userId,
    });
  }
}
