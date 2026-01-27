import { Module, Global } from '@nestjs/common';
import { OptimizationService } from './optimization.service';

@Global()
@Module({
    providers: [OptimizationService],
    exports: [OptimizationService],
})
export class OptimizationModule { }
