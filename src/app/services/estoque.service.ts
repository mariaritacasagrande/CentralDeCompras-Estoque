import { Injectable, computed, inject, signal } from '@angular/core';
import { ItemEstoque } from '../models/produto.model';
import { ProdutoService } from './produto.service';

@Injectable({ providedIn: 'root' })
export class EstoqueService {
  private produtoService = inject(ProdutoService);

  private _itens = signal<ItemEstoque[]>([]);

  itens = this._itens.asReadonly();
  carregando = signal(false);
  erro = signal(false);

  totalUnidades = computed(() =>
    this._itens().reduce((soma, item) => soma + item.quantidade, 0)
  );

  carregar(): void {
    if (this._itens().length > 0 || this.carregando()) {
      return;
    }

    this.carregando.set(true);
    this.erro.set(false);

    this.produtoService.listar().subscribe({
      next: (produtos) => {
        this._itens.set(
          produtos.map((produto) => ({
            produto,
            quantidade: (produto.id * 7) % 20,
          }))
        );
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set(true);
        this.carregando.set(false);
      },
    });
  }

  buscarItem(id: number): ItemEstoque | undefined {
    return this._itens().find((item) => item.produto.id === id);
  }

  repor(id: number, quantidade: number): void {
    this._itens.update((lista) =>
      lista.map((item) =>
        item.produto.id === id
          ? { ...item, quantidade: item.quantidade + quantidade }
          : item
      )
    );
  }
}