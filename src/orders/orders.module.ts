import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { Order } from './entities/order.entity';
import { UsersModule } from '../users/users.module';
import { OrdersLoaders } from './orders.loaders';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), forwardRef(() => UsersModule)],
  providers: [OrdersService, OrdersResolver, OrdersLoaders],
  exports: [OrdersService, OrdersLoaders],
})
export class OrdersModule { }
