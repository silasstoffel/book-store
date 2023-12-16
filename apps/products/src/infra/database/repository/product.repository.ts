import { IProductRepository, FindAllInput } from '../../../domain/product.repository';
import { Product } from '../../../domain/product.entity';
import { Model } from 'mongoose';
import { ProductNameAlreadyExistsException, ProductNotFoundException } from '../../../domain/exceptions';
import { UnknownException } from '@package/exceptions';
import { buildSetAndUnsetOperators } from '@packages/mongoose-utils';
import { ILogger } from '@packages/logger'
import { Paginate, LIMIT_DEFAULT, buildPaginateResponse } from '@core/domain';
export class ProductRepository implements IProductRepository {
    constructor(
        private readonly model: Model<Product>,
        private readonly logger: ILogger
    ) {}

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

    async getById(id: string): Promise<Product> {
        try {
            const record = await this.model.findOne({ id }).exec()
            if (!record) {
                throw new ProductNotFoundException()
            }
            return new Product(record);
        } catch (error) {
            this.resolveCommonException(error)
        }
    }

    async findAll(args: FindAllInput): Promise<Paginate<Product>> {
        const { limit, startingAfter, endingBefore } = { limit: LIMIT_DEFAULT, ...args }
        const name = args.name ? { name: new RegExp(args.name, 'i')} : {}
        const category = args.category ? { category:args.category } : {}
        const startingAfterFilter = startingAfter ? { id: { $gt: startingAfter } } : {}
        const endingBeforeFilter = endingBefore ? { id: { $lt: endingBefore } } : {}

        const result = await this.model.find({
            ...name,
            ...category,
            ...startingAfterFilter,
            ...endingBeforeFilter
        }).sort({ id: args?.endingBefore ? -1 : 1 })
        .limit(limit + 1)
        .exec()

        return buildPaginateResponse<Product>(args, result?.map(record => new Product(record)))
    }

    private resolveCommonException(error: unknown, throwUnknownException = true): void {
        const { code } = error as { code?: number }
        if (code === 11000) {
            this.logger.warn('Product name already exists.')
            throw new ProductNameAlreadyExistsException()
        }

        if (error instanceof ProductNotFoundException) {
            this.logger.warn('Product not found.')
            throw error
        }

        if (throwUnknownException) {
            this.logger.error('An error occurred.', error as Error)
            throw new UnknownException()
        }
    }
}
