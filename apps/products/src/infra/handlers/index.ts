import createProduct from './create-product'
import updateProduct from './update-product'
import getProduct from './get-product-by-id'
import listProducts from './list-products'
import loadEvent from './load-event'

export default {
    'create-product': createProduct,
    'update-product': updateProduct,
    'get-product': getProduct,
    'list-products': listProducts,
    'load-product-events': loadEvent
}
