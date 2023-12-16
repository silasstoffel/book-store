import { queryStringListProductSchema } from './schema';

describe('queryStringListProductSchema', () => {
  it('should validate the name property', () => {
    const validData = {
      name: 'Product Name',
      category: 'Product Category',
      limit: 10,
    };

    expect(queryStringListProductSchema.safeParse(validData).success).toBe(true);

    const invalidData = {
      name: '',
      category: 'Product Category',
      limit: 10,
    };

    expect(queryStringListProductSchema.safeParse(invalidData).success).toBe(false);
  });

  it('should validate the category property', () => {
    const validData = {
      name: 'Product Name',
      category: 'Product Category',
      page: 1,
      limit: 10,
    };

    expect(queryStringListProductSchema.safeParse(validData).success).toBe(true);
  });

  it('should validate the limit property', () => {
    const validData = {
      name: 'Product Name',
      category: 'Product Category',
      page: 1,
      limit: 10,
    };

    expect(queryStringListProductSchema.safeParse(validData).success).toBe(true);

    const invalidData = {
      name: 'Product Name',
      category: 'Product Category',
      page: 1,
      limit: 'invalid',
    };

    expect(queryStringListProductSchema.safeParse(invalidData).success).toBe(false);
  });

  describe('Casting values', () => {

    it('should transform string to number for page and limit parameters', () => {
        const input = { limit: '100' };
        const data = queryStringListProductSchema.parse(input);
        expect(data).toStrictEqual({ limit: 100})
    });

  })
});
