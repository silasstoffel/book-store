import { IProductRepository } from '../../../domain/product.repository';
import { Product } from '../../../domain/product.entity';
import { Model } from 'mongoose';
import { ProductNameAlreadyExistsException, ProductNotFoundException } from '../../../domain/exceptions';
import { UnknownException } from '@package/exceptions';
import { buildSetAndUnsetOperators } from '@packages/mongoose-utils';

export class ProductRepository implements IProductRepository {
    constructor(private readonly model: Model<Product>) {}

    async create(product: Product): Promise<Product> {
        try {
            const result = await this.model.create(product);
            return new Product(result);
        } catch (error) {
            this.resolveCommonException(error)
        }
    }

    async update(id: string, product: Partial<Product>): Promise<Product> {
        const { $set, $unset } = buildSetAndUnsetOperators(product)
        try {
            const record = await this.model.findOneAndUpdate(
                { id },
                { $set, $unset },
                { runValidators: true, returnOriginal: false }
            ).exec()

            if (!record) {
                throw new ProductNotFoundException()
            }

            return new Product(record);
        } catch (error) {
            this.resolveCommonException(error)
        }
    }

    private resolveCommonException(error: unknown, throwUnknownException = true): void {
        const { code } = error as { code?: number }
        if (code === 11000) {
            throw new ProductNameAlreadyExistsException()
        }

        if (error instanceof ProductNotFoundException) {
            throw error
        }

        if (throwUnknownException) {
            throw new UnknownException()
        }
    }
}
