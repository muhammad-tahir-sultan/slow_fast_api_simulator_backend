import { Resolver, Query } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';

@Resolver(() => Product)
export class ProductsResolver {
    constructor(private readonly productsService: ProductsService) { }

    @Query(() => [Product], { name: 'products' })
    findAll() {
        return this.productsService.findAll();
    }
}
