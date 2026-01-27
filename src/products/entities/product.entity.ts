import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';

@ObjectType()
@Entity()
export class Product {
    @Field(() => ID)
    @ObjectIdColumn()
    id: ObjectId;

    @Field()
    @Column()
    name: string;

    @Field(() => Float)
    @Column()
    price: number;
}
