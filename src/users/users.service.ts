import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { User } from './entities/user.entity';
import { OrdersService } from '../orders/orders.service';

import { PaginationArgs } from './dto/pagination.args';
import { UserConnection } from './dto/user-connection.model';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @Inject(forwardRef(() => OrdersService))
        private ordersService: OrdersService,
    ) { }

    findAll() {
        return this.usersRepository.find();
    }

    async findAllPaginated(args: PaginationArgs): Promise<UserConnection> {
        const { limit, cursor } = args;

        const query: any = {};
        if (cursor) {
            // Assuming cursor is the ObjectId string
            query._id = { $gt: new ObjectId(cursor) };
        }

        const users = await this.usersRepository.find({
            where: query,
            take: limit + 1, // Fetch one extra to check hasNextPage
            order: {
                id: 'ASC' // Ensure consistent ordering
            } as any
        });

        const hasNextPage = users.length > limit;
        const edges = hasNextPage ? users.slice(0, limit) : users;

        return {
            edges: edges.map(user => ({
                node: user,
                cursor: user.id.toString(),
            })),
            pageInfo: {
                hasNextPage,
                endCursor: edges.length > 0 ? edges[edges.length - 1].id.toString() : undefined,
            }
        };
    }

    findOne(id: any) {
        return this.usersRepository.findOneBy({ id });
    }

    async seed() {
        const users: User[] = [];
        for (let i = 0; i < 50; i++) {
            const user = this.usersRepository.create({
                name: faker.person.fullName(),
                email: faker.internet.email(),
            });
            users.push(user);
        }
        const savedUsers = await this.usersRepository.save(users);

        // In Mongo, IDs are ObjectIds. We pass them directly to order seeding.
        const userIds = savedUsers.map(u => u.id);

        // Seed orders
        await this.ordersService.seed(userIds);

        return true;
    }
}
