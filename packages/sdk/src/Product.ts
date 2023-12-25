import { LambdaInvoke } from "./lambda-invoke";

const { ENV } = process.env

export class Product {

    constructor(private readonly lambdaInvoke: LambdaInvoke) {}

    async getById<T>(id: string): Promise<T | null> {
        return this.lambdaInvoke.syncInvoke<T>({
            httpMethod: 'GET',
            pathParameters: { product: id },
            function: `bookstore-products-${ENV}-get-product`,
        })
    }
}
