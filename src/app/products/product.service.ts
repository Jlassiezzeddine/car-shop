import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IApiListResponse } from '../shared/interfaces/api-response.interface';
import { IProduct } from './product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiURL = 'https://e-commerce-api-63r3.onrender.com/api/v1/products'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  // Fetch all products
  getProducts(): Observable<IApiListResponse<IProduct>> {
    const result = this.http.get<IApiListResponse<IProduct>>(this.apiURL);
    return result;
  }

  // Fetch a single product by id
  getProduct(id: string): Observable<any> {
    return this.http.get(`${this.apiURL}/${id}`);
  }

  // Add a new product
  addProduct(product: any): Observable<any> {
    return this.http.post(this.apiURL, product);
  }

  // Update an existing product
  updateProduct(id: string, product: any): Observable<any> {
    return this.http.put(`${this.apiURL}/${id}`, product);
  }

  // Delete a product
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }
}
