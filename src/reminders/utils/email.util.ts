import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import ejs from 'ejs';

@Injectable()
export class EmailsUtil {
  async sendReminderEmail(email: string, title: string, body: string) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465, // You can also use 587
        secure: true, // Use true for 465, false for 587
        auth: {
          user: 'mauryadeepaktg2@gmail.com',
          pass: process.env.MAIL_PWD,
        },
      });

      const sendEmail = async (email, title, body) => {
        ejs.renderFile(
          __dirname + '/templates/email.ejs',
          { email, body },
          (err, data) => {
            if (err) {
              console.log(err);
              throw new Error(err.message);
            } else {
              const mailOptions = {
                from: 'mauryadeepaktg2@gmail.com',
                to: email,
                subject: title,
                html: data,
              };

              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  throw new Error(error.message);
                }
                console.log('Message sent: %s', info.messageId);
              });
            }
          },
        );
      };
      await sendEmail(email, title, body);
      return {
        success: true,
        message: 'Email sent successfully',
      };
    } catch (error) {
      console.log(error.message);
      return {
        success: false,
        error: error.message,
        message: 'Error sending email',
      };
    }
  }
}
