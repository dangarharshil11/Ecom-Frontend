import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { FilterModel } from '../models/filter-model';
import { apiRoutes } from '../constants/api-routes';
import { Response } from '../models/response-model';

@Injectable({
  providedIn: 'root'
})
export class CommomService {

  constructor(private http: HttpClient) { }

  getProducts(filter: FilterModel) : Observable<Response>{
    return this.http.post<Response>(apiRoutes.getProducts, filter);
  }
}
