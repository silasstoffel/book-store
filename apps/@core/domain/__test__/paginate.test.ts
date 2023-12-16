import { buildPaginateResponse } from '../paginate';

describe('buildPaginateResponse', () => {

  it('should return the correct response when there is more data', () => {
    const args = { limit: 2 };
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }];

    const expectedResponse = {
      hasMore: true,
      data: [data[0], data[1]],
      info: {
        startingAfter: 2,
        endingBefore: 1,
      },
    };

    const response = buildPaginateResponse(args, data);
    expect(response).toEqual(expectedResponse);
  });

  describe('endingBefore', () => {
    it('should return the correct response when there is more data', () => {
        const args = { limit: 2, endingBefore: 'p4' };
        const data = [{ id: 'p3' }, { id: 'p2' }, { id: 'p1' }];

        const expectedResponse = {
          hasMore: true,
          data: [{ id: 'p2' }, { id: 'p3' }],
          info: {
            startingAfter: 'p3',
            endingBefore: 'p2',
          },
        };

        const response = buildPaginateResponse(args, data);
        expect(response).toEqual(expectedResponse);
    });
  })

});
