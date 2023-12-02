import { IProductRepository } from '../../../domain/product.repository';
import { Product } from '../../../domain/product.entity';
import { Model } from 'mongoose';
import { ProductNameAlreadyExistsException, ProductNotFoundException } from '../../../domain/exceptions';
import { UnknownException } from '@package/exceptions';
import { buildSetAndUnsetOperators } from '@packages/mongoose-utils';
import { ILogger } from '@packages/logger'
import { Paginate, PaginateArgs, LIMIT_DEFAULT } from '@core/domain';
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

    async findAll(args: Partial<PaginateArgs>): Promise<Paginate<Product>> {
        const {  limit, page } = { page: 1, limit: LIMIT_DEFAULT, ...args } as PaginateArgs

        const result = await this.model.find({
            $sort: { id: 1 },
            $limit: limit + 1,
        }).exec()

        const hasMore = result.length > limit
        let next = null;
        let previous = null

        if (hasMore) {
            result.pop()
            next = args.page + 1
            previous = page > 1 ? page - 1 : null
        }

        return {
            hasMore,
            data: result?.map((item) => new Product(item)),
            info: { page, next, previous }
        }
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
