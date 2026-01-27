import { Resolver, Query } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';

@Resolver(() => Order)
export class OrdersResolver {
    constructor(private readonly ordersService: OrdersService) { }

    @Query(() => [Order], { name: 'orders' })
    findAll() {
        return this.ordersService.findAll();
    }
}
