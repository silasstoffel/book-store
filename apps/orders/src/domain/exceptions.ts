import { BaseException, EntityNotFoundException } from '@package/exceptions';
import { ExceptionCode } from './enum';

export class InactiveProductException extends BaseException {
    constructor(id: string) {
        super(
            `Unavailable product(${id}).`,
            ExceptionCode.INACTIVE_PRODUCT,
            { httpStatusCode: 400 }
        );
        this.name = 'InactiveProductException';
    }
}

export class ProductNotFoundException extends EntityNotFoundException {
    constructor(id: string) {
        super(
            `Product not found (${id}).`,
            ExceptionCode.PRODUCT_NOT_FOUND,
        );
        this.name = 'ProductNotFoundException';
    }
}

export class UnavailableQuantityRequestedException extends BaseException {
    constructor(availableQuantity: number) {
        super(
            `Requested quantity is bigger than available quantity (${availableQuantity}).`,
            ExceptionCode.UNAVAILABLE_QUANTITY_REQUESTED,
            { httpStatusCode: 400 }
        );
        this.name = 'UnavailableQuantityRequestedException';
    }
}
