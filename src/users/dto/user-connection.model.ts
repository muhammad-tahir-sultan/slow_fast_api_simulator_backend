import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class PageInfo {
    @Field()
    hasNextPage: boolean;

    @Field({ nullable: true })
    endCursor?: string;
}

@ObjectType()
export class UserEdge {
    @Field(() => User)
    node: User;

    @Field()
    cursor: string;
}

@ObjectType()
export class UserConnection {
    @Field(() => [UserEdge])
    edges: UserEdge[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
}
