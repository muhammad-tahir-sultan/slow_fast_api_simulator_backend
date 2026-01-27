import { Injectable } from '@nestjs/common';

@Injectable()
export class OptimizationService {
    private _useDataLoader = true;

    get useDataLoader(): boolean {
        return this._useDataLoader;
    }

    set useDataLoader(value: boolean) {
        this._useDataLoader = value;
        console.log(`Optimization: DataLoader is now ${value ? 'ON' : 'OFF'}`);
    }
}
