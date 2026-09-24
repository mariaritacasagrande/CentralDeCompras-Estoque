import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto.model';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private http = inject(HttpClient);
  private readonly url = 'https://fakestoreapi.com/products';

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.url);
  }
}