import { environment } from "../../../environments/environment";

export const apiRoutes = {
    /* Identity API */

    // Auth Routes
    register: `${environment.authapiBaseUrl}/api/identity/auth/register`,
    login: `${environment.authapiBaseUrl}/api/identity/auth/login`,
    forgotPassword: `${environment.authapiBaseUrl}/api/identity/auth/forgotPassword/`,
    changePassword: `${environment.authapiBaseUrl}/api/identity/auth/changePassword?addAuth=true`,

    // User Routes
    createUser: `${environment.authapiBaseUrl}/api/identity/user/createUser?addAuth=true`,
    getUsers: `${environment.authapiBaseUrl}/api/identity/user/getUsers?addAuth=true`,
    getUserById: `${environment.authapiBaseUrl}/api/identity/user/getUserBuId/`,
    deleteUser: `${environment.authapiBaseUrl}/api/identity/user/DeleteUser/`,
    updateUser: `${environment.authapiBaseUrl}/api/identity/user/UpdateUser/`,

    /* Product API */

    // Product Routes
    getProducts: `${environment.productapiBaseUrl}/api/product/product/GetAll`,
    getProduct: `${environment.productapiBaseUrl}/api/product/product/Get/`,
    getProductList: `${environment.productapiBaseUrl}/api/product/product/GetProductList?addAuth=true`,
    createProduct: `${environment.productapiBaseUrl}/api/product/product/Create?addAuth=true`,
    updateProduct: `${environment.productapiBaseUrl}/api/product/product/Update/`,
    deleteProduct: `${environment.productapiBaseUrl}/api/product/product/Delete/`,

    // Category Routes
    getCategories: `${environment.productapiBaseUrl}/api/product/category/GetAll?addAuth=true`,
    getCategoryList: `${environment.productapiBaseUrl}/api/product/category/GetCategoryList?addAuth=true`,
    getCategory: `${environment.productapiBaseUrl}/api/product/category/Get/`,
    createCategory: `${environment.productapiBaseUrl}/api/product/category/Create?addAuth=true`,
    updateCategory: `${environment.productapiBaseUrl}/api/product/category/Update/`,
    deleteCategory: `${environment.productapiBaseUrl}/api/product/category/Delete/`,

    // StockLevel Routes
    getStockLevels: `${environment.productapiBaseUrl}/api/product/stocklevel/GetAll?addAuth=true`,
    getStockLevel: `${environment.productapiBaseUrl}/api/product/stocklevel/Get/`,
    createStockLevel: `${environment.productapiBaseUrl}/api/product/stocklevel/Create?addAuth=true`,
    updateStockLevel: `${environment.productapiBaseUrl}/api/product/stocklevel/Update/`,
    deleteStockLevel: `${environment.productapiBaseUrl}/api/product/stocklevel/Delete/`,


    /* Customer API */

    // Cart Routes
    getCart: `${environment.customerapiBaseUrl}/api/customer/cart/GetCart/`,
    updateCart: `${environment.customerapiBaseUrl}/api/customer/cart/UpdateCart?addAuth=true`,
    deletCartItem: `${environment.customerapiBaseUrl}/api/customer/cart/DeleteCartItem/`,
    emptyCart: `${environment.customerapiBaseUrl}/api/customer/cart/EmptyCart/`,

    // Order Routes
    createOrder: `${environment.customerapiBaseUrl}/api/customer/order/CreateOrder?addAuth=true`,
    createPaymentSession: `${environment.customerapiBaseUrl}/api/customer/order/CreatePaymentSession?addAuth=true`,
    validatePayment: `${environment.customerapiBaseUrl}/api/customer/order/ValidatePayment/`,
    getOrder: `${environment.customerapiBaseUrl}/api/customer/order/GetOrder/`,
    getOrders: `${environment.customerapiBaseUrl}/api/customer/order/GetOrders?addAuth=true`,
    getOrdersByUserId: `${environment.customerapiBaseUrl}/api/customer/order/GetOrdersByUserId/`,
    updateOrder: `${environment.customerapiBaseUrl}/api/customer/order/UpdateOrder?addAuth=true`
};
