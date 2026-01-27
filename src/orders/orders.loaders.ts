import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';

@Injectable({ scope: Scope.REQUEST })
export class OrdersLoaders {
    constructor(private ordersService: OrdersService) { }

    public readonly batchOrdersByUserId = new DataLoader<string, Order[]>(
        async (userIds: string[]) => {
            const orders = await this.ordersService.findOrdersByUserIds(userIds);
            // Map orders to userIds
            const ordersMap = new Map<string, Order[]>();
            orders.forEach(order => {
                if (!ordersMap.has(order.userId)) {
                    ordersMap.set(order.userId, []);
                }
                ordersMap.get(order.userId)!.push(order);
            });

            // Return arrays of orders preserving the order of userIds
            return userIds.map(userId => ordersMap.get(userId) || []);
        },
    );
}
