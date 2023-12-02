import { BaseException, EntityNotFoundException } from '@package/exceptions';
import { ExceptionCode } from './enum';

export class ProductNameAlreadyExistsException extends BaseException {
    constructor() {
        super(
            'Product name already exists.',
            ExceptionCode.PRODUCT_NAME_ALREADY_EXISTS,
            { httpStatusCode: 400 }
        );
        this.name = 'ProductNameAlreadyExistsException';
    }
}

export class ProductNotFoundException extends EntityNotFoundException {
    constructor() {
        super(
            'Product not found.',
            ExceptionCode.PRODUCT_NOT_FOUND,
        );
        this.name = 'ProductNotFoundException';
    }
}
