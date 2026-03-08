import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  create(input: {
    businessId: string;
    fullName: string;
    email: string;
    passwordHash: string;
    role: 'owner' | 'admin' | 'staff';
  }) {
    return this.userModel.create(input);
  }

  findByBusinessAndEmail(businessId: string, email: string) {
    return this.userModel.findOne({ businessId, email: email.toLowerCase() });
  }
}
