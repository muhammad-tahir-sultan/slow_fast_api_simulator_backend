import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from './entities/user.entity';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => OrdersModule)],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule { }
