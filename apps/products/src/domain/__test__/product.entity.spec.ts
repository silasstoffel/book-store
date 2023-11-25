import { ProductCategory } from '../enum';
import { Product } from '../product.entity';
describe('ProductEntity', () => {

    describe('When create an instance', () => {
        it('should define value for createdAt and updateAt attribute', () => {
            const params = {
                name: 'The clean Architecture',
                description: 'A cool book about software architecture',
                price: 99.99,
                quantity: 10,
                category: ProductCategory.SELF_HELP
            }
            const product = new Product(params);

            expect(product.createdAt).toBeDefined();
            expect(product.updatedAt).toBeDefined();
            expect(product.name).toBe(params.name);
            expect(product.description).toBe(params.description);
            expect(product.price).toBe(params.price);
        });

        it('should not define value for createdAt and updateAt attribute when it is defined as argument', () => {
            const createdAt = new Date('2020-01-01T00:00:00.000Z');
            const updatedAt = new Date('2020-01-02T10:00:00.000Z');

            const params = {
                name: 'The clean Architecture',
                description: 'A cool book about software architecture',
                price: 99.99,
                quantity: 10,
                createdAt,
                updatedAt,
            }

            const product = new Product(params);
            expect(product.createdAt).toBe(createdAt);
            expect(product.updatedAt).toBe(updatedAt);
        });
    })
});
