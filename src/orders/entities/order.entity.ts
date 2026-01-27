import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Entity, Column, ObjectIdColumn, ObjectId, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
@Entity()
export class Order {
    @Field(() => ID)
    @ObjectIdColumn()
    id: ObjectId;

    @Field(() => Float)
    @Column()
    totalAmount: number;

    @Field({ nullable: true })
    @Index()
    @Column()
    userId: string; // Store as string reference

    @Field(() => User, { nullable: true })
    user: User;

    @Field(() => [Product], { nullable: true })
    @Column()
    products: Product[];
}
