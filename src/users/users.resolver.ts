import { Resolver, Query, Mutation, ResolveField, Parent, Args } from '@nestjs/graphql';
import { Inject, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Order } from '../orders/entities/order.entity';
import { OrdersService } from '../orders/orders.service';
import { OrdersLoaders } from '../orders/orders.loaders';
import { PaginationArgs } from './dto/pagination.args';
import { UserConnection } from './dto/user-connection.model';
import { OptimizationService } from '../optimization.service';

@Resolver(() => User)
export class UsersResolver {
    constructor(
        private readonly usersService: UsersService,
        @Inject(forwardRef(() => OrdersService))
        private readonly ordersService: OrdersService,
        private readonly ordersLoaders: OrdersLoaders,
        private readonly optimizationService: OptimizationService,
    ) { }

    @Mutation(() => Boolean)
    async seedDatabase() {
        return this.usersService.seed();
    }

    @Mutation(() => Boolean)
    async toggleNPlus1Refactor(@Args('enable') enable: boolean) {
        this.optimizationService.useDataLoader = enable;
        return true;
    }

    @Mutation(() => Boolean)
    async toggleIndexing(@Args('enable') enable: boolean) {
        return this.ordersService.setIndexing(enable);
    }

    @Query(() => [User], { name: 'users' })
    findAll() {
        return this.usersService.findAll();
    }

    @Query(() => UserConnection, { name: 'usersPaginated' })
    async findAllPaginated(@Args() args: PaginationArgs) {
        return this.usersService.findAllPaginated(args);
    }

    @ResolveField(() => [Order])
    async orders(@Parent() user: User) {
        if (this.optimizationService.useDataLoader) {
            // FAST PATH
            return this.ordersLoaders.batchOrdersByUserId.load(user.id.toString());
        } else {
            // SLOW PATH (Simulate N+1)
            console.log(`[Slow Mode] Fetching orders for user ${user.name} (DB Call)`);
            return this.ordersService.findAllByUserId(user.id.toString());
        }
    }
}
