import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { TokenResponse } from '../models/token-response.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.backend_host}/auth`;

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.baseUrl}/login`, request);
  }

  register(request: LoginRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/register`, request);
  }
}