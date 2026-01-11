import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IApiListResponse,
  IApiPaginationParams,
  IApiResponse,
} from '../shared/interfaces/api-list-response.interface';
import { IProduct, IProductCreate, IProductUpdate } from './product.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiURL = `${environment.apiUrl}/products`; // Replace with your API endpoint

  private http = inject(HttpClient);

  // Fetch all products
  getProducts(params?: IApiPaginationParams) {
    return this.http.get<IApiListResponse<IProduct>>(
      `${this.apiURL}?limit=${params?.limit || 10}&page=${params?.page || 1}`,
    );
  }

  // Fetch a single product by id
  getProduct(id: string) {
    return this.http.get<IApiResponse<IProduct>>(`${this.apiURL}/${id}`);
  }

  // Add a new product
  addProduct(product: IProductCreate) {
    return this.http.post<IApiResponse<IProduct>>(this.apiURL, product);
  }

  // Update an existing product
  updateProduct(id: string, product: IProductUpdate) {
    return this.http.put<IApiResponse<IProduct>>(`${this.apiURL}/${id}`, product);
  }

  // Delete a product
  deleteProduct(id: string): Observable<unknown> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }
}
