import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IApiListResponse,
  IApiPaginationParams,
  IApiResponse,
} from '../../interfaces/api-list-response.interface';
import { IUser, IUserCreate, IUserUpdate } from '../../interfaces/user.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiURL = `${environment.apiUrl}/users`;
  private http = inject(HttpClient);

  // Fetch all users
  getUsers(params?: IApiPaginationParams): Observable<IApiListResponse<IUser>> {
    return this.http.get<IApiListResponse<IUser>>(
      `${this.apiURL}?limit=${params?.limit || 10}&page=${params?.page || 1}`,
    );
  }

  // Fetch a single user by id
  getUser(id: string): Observable<IApiResponse<IUser>> {
    return this.http.get<IApiResponse<IUser>>(`${this.apiURL}/${id}`);
  }

  // Add a new user
  addUser(user: IUserCreate): Observable<IApiResponse<IUser>> {
    return this.http.post<IApiResponse<IUser>>(this.apiURL, user);
  }

  // Update an existing user
  updateUser(id: string, user: IUserUpdate): Observable<IApiResponse<IUser>> {
    return this.http.put<IApiResponse<IUser>>(`${this.apiURL}/${id}`, user);
  }

  // Delete a user (soft delete)
  deleteUser(id: string): Observable<unknown> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }

  // Restore a soft-deleted user
  restoreUser(id: string): Observable<IApiResponse<IUser>> {
    return this.http.put<IApiResponse<IUser>>(`${this.apiURL}/${id}/restore`, {});
  }

  // Delete a user permanently
  deleteUserPermanent(id: string): Observable<unknown> {
    return this.http.delete(`${this.apiURL}/${id}/permanent`);
  }

  // Revoke access for a user
  revokeAccess(id: string): Observable<IApiResponse<IUser>> {
    return this.http.put<IApiResponse<IUser>>(`${this.apiURL}/${id}/revoke-access`, {});
  }

  // Blacklist a user
  blacklistUser(id: string): Observable<IApiResponse<IUser>> {
    return this.http.put<IApiResponse<IUser>>(`${this.apiURL}/${id}/blacklist`, {});
  }
}
