import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@ObjectType()
@Entity()
export class User {
    @Field(() => ID)
    @ObjectIdColumn()
    id: ObjectId;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    email: string;

    @Field(() => [Order], { nullable: 'items' })
    orders: Order[];
}
