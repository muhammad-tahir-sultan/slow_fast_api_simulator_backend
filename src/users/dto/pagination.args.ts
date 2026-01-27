import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
    @Field(() => Int, { defaultValue: 10 })
    limit: number;

    @Field({ nullable: true })
    cursor?: string; // The ID of the last item from the previous page
}
