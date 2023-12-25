import { ILogger } from "@packages/logger";
import { Product } from "./Product";
import { LambdaInvoke } from "./lambda-invoke";

export class SDK {
    public readonly products: Product;

    constructor(private readonly logger: ILogger) {
        const invoke = new LambdaInvoke(this.logger);
        this.products = new Product(invoke);
    }
}
