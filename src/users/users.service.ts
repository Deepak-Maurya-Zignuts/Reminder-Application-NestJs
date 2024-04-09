import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/users';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResetPasswordDto } from './dto/resetpwd.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  // Create a user
  async signup(createUserDto: CreateUserDto, res: Response) {
    try {
      const user = await this.userModel.findOne({ email: createUserDto.email });
      if (user) {
        // throw new Error('User already exists');
        return res.status(400).json({ message: 'User already exists' });
      }
      const model = new this.userModel();
      model.name = createUserDto.name;
      model.email = createUserDto.email;
      model.password = bcrypt.hashSync(createUserDto.password, 10);
      model.save();
      return res.status(200).json({
        message: 'User created successfully',
      });
    } catch (error) {
      console.log(error);
    }
  }

  //  Login a user
  async login(loginUserDto: LoginUserDto, res: Response) {
    try {
      const user = await this.userModel.findOne({ email: loginUserDto.email });
      if (!user) {
        // throw new Error('User not found');
        return res.status(400).json({ message: 'User not found' });
      }
      const isMatch = bcrypt.compareSync(loginUserDto.password, user.password);
      if (!isMatch) {
        // throw new Error('Invalid credentials');
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const authToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
      );
      res.setHeader('authorization', authToken);
      return res.status(200).json({
        message: 'Login successful',
        // token: user.id,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ message: error.message });
    }
  }

  // Reset password
  // eslint-disable-next-line prettier/prettier
  async resetPassword(ownerId: string, resetPasswordDto: ResetPasswordDto, res: Response) {
    try {
      const user = await this.userModel.findById(ownerId);
      if (!user) {
        // throw new Error('User not found');
        return res.status(400).json({ message: 'User not found' });
      }

      const isMatch = bcrypt.compareSync(
        resetPasswordDto.oldPassword,
        user.password,
      );

      if (!isMatch) {
        // throw new Error('Invalid credentials');
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const newPassword = bcrypt.hashSync(resetPasswordDto.newPassword);
      await this.userModel.findByIdAndUpdate(
        ownerId,
        { password: newPassword },
        { new: true },
      );
      return res.status(200).json({
        message: 'Password updated successfully',
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ message: error.message });
    }
  }

  // Logout
  async logout(res: Response) {
    res.setHeader('authorization', '');
    return res.status(200).json({
      message: 'Logout successful',
    });
  }
}
