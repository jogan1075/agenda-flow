import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { SuperAdminSeedService } from './super-admin-seed.service';
import { UsersService } from './users.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersService, SuperAdminSeedService],
  exports: [UsersService],
})
export class UsersModule {}
