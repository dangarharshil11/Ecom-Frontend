import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Response } from '../models/response-model';
import { FilterModel } from '../models/filter-model';
import { CategoryRequest } from '../models/category-request';
import { apiRoutes } from '../../../common/constants/api-routes';
import { ProductRequest } from '../models/product-request';
import { StockLevelRequest } from '../models/stocklevel-request';
import { RegisterRequest } from '../../auth/models/register-request.model';
import { User } from '../../auth/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }


  //#region  Product Related Requests
  getProducts(filterModel: FilterModel): Observable<Response> {
    return this.http.post<Response>(apiRoutes.getProducts, filterModel);
  }

  getProductList(): Observable<Response> {
    return this.http.get<Response>(apiRoutes.getProductList);
  }

  getProductByName(name: string): Observable<Response> {
    return this.http.get<Response>(apiRoutes.getProduct + name);
  }

  getProductById(id: string): Observable<Response> {
    return this.http.get<Response>(apiRoutes.getProduct + id);
  }

  createProduct(request: ProductRequest): Observable<Response> {
    return this.http.post<Response>(apiRoutes.createProduct, request);
  }

  updateProduct(request: ProductRequest, id: string): Observable<Response> {
    return this.http.put<Response>(apiRoutes.updateProduct + `${id}?addAuth=true`, request);
  }

  deleteProduct(id: string): Observable<Response> {
    return this.http.delete<Response>(apiRoutes.deleteProduct + `${id}?addAuth=true`);
  }

  //#endregion

  //#region Category Related Requests
  getCategories(filterModel: FilterModel): Observable<Response> {
    return this.http.post<Response>(apiRoutes.getCategories, filterModel);
  }

  getCategoryList(): Observable<Response> {
    return this.http.get<Response>(apiRoutes.getCategoryList);
  }

  getCategoryByName(name: string): Observable<Response> {
    return this.http.get<Response>(apiRoutes.getCategory + `${name}?addAuth=true`);
  }

  getCategoryById(id: string): Observable<Response> {
    return this.http.get<Response>(apiRoutes.getCategory + `${id}?addAuth=true`);
  }

  createCategory(request: CategoryRequest): Observable<Response> {
    return this.http.post<Response>(apiRoutes.createCategory, request);
  }

  updateCategory(request: CategoryRequest, id: string): Observable<Response> {
    return this.http.put<Response>(apiRoutes.updateCategory + `${id}?addAuth=true`, request);
  }

  deleteCategory(id: string): Observable<Response> {
    return this.http.delete<Response>(apiRoutes.deleteCategory + `${id}?addAuth=true`);
  }
  //#endregion

  //#region StockLevel Related Requests
  getStockLevels(filterModel: FilterModel): Observable<Response> {
    return this.http.post<Response>(apiRoutes.getStockLevels, filterModel);
  }

  getStockLevel(id: string): Observable<Response> {
    return this.http.get<Response>(apiRoutes.getStockLevel + `${id}?addAuth=true`);
  }

  createStockLevel(request: StockLevelRequest): Observable<Response> {
    return this.http.post<Response>(apiRoutes.createStockLevel, request);
  }

  updateStockLevel(request: StockLevelRequest, id: string): Observable<Response> {
    return this.http.put<Response>(apiRoutes.updateStockLevel + `${id}?addAuth=true`, request);
  }

  deleteStockLevel(id: string): Observable<Response> {
    return this.http.delete<Response>(apiRoutes.deleteStockLevel + `${id}?addAuth=true`);
  }
  //#endregion

  //#region User Management Related Requests
  getUsers(): Observable<Response> {
    return this.http.get<Response>(apiRoutes.getUsers);
  }

  getUserById(id: string): Observable<Response> {
    return this.http.get<Response>(apiRoutes.getUserById + `${id}?addAuth=true`);
  }

  createUser(request: RegisterRequest): Observable<Response> {
    return this.http.post<Response>(apiRoutes.createUser, request);
  }

  updateUser(request: User, id: string): Observable<Response> {
    return this.http.post<Response>(apiRoutes.updateUser + `${id}?addAuth=true`, request);
  }

  deleteUser(id: string): Observable<Response> {
    return this.http.delete<Response>(apiRoutes.deleteUser + `${id}?addAuth=true`);
  }
  //#endregion

  //#region Order Management Related Requests
  validatePayment(orderId: string): Observable<Response>{
    return this.http.get<Response>(apiRoutes.validatePayment + `${orderId}?addAuth=true`);
  }

  getOrder(orderId: string): Observable<Response>{
    return this.http.get<Response>(apiRoutes.getOrder + `${orderId}?addAuth=true`);
  }

  getOrders(request: FilterModel): Observable<Response>{
    return this.http.post<Response>(apiRoutes.getOrders, request);
  }

  updateOrder(newStatus: string, orderId: string, note: string): Observable<Response>{
    return this.http.post<Response>(apiRoutes.updateOrder , {orderId: orderId, note: note, status: newStatus});
  }

  //#endregion

}
