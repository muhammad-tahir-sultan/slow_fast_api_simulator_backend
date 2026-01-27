import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // Check if it's a GraphQL Context
        if ((context.getType() as string) === 'graphql') {
            const gqlContext = GqlExecutionContext.create(context);
            const info = gqlContext.getInfo();
            const parentType = info.parentType.name;
            const fieldName = info.fieldName;

            // Only log top-level queries/mutations to avoid noise from every field resolver
            if (parentType === 'Query' || parentType === 'Mutation') {
                const now = Date.now();
                return next.handle().pipe(
                    tap(() => {
                        const time = Date.now() - now;
                        this.logger.log(`GraphQL ${parentType} "${fieldName}" took ${time}ms`);
                    }),
                );
            }
        }

        // Default HTTP handling (if you add REST controllers later)
        const now = Date.now();
        return next
            .handle()
            .pipe(
                tap(() =>
                    // Only log if it's http
                    context.getType() === 'http'
                        ? this.logger.log(`HTTP Request took ${Date.now() - now}ms`)
                        : null
                ),
            );
    }
}
