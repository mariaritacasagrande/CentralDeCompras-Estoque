import { Injectable, computed, inject, signal } from '@angular/core';
import { ItemEstoque } from '../models/produto.model';
import { ProdutoService } from './produto.service';

@Injectable({ providedIn: 'root' })
export class EstoqueService {
  private readonly chavePersistencia = 'central-compras-estoque';
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
        const quantidadesSalvas = this.lerQuantidadesSalvas();

        this._itens.set(
          produtos.map((produto) => ({
            produto,
            quantidade: quantidadesSalvas[produto.id] ?? (produto.id * 7) % 20,
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
    this._itens.update((lista) => {
      const novaLista = lista.map((item) =>
        item.produto.id === id
          ? { ...item, quantidade: item.quantidade + quantidade }
          : item
      );

      this.salvarQuantidades(novaLista);
      return novaLista;
    });
  }

  private lerQuantidadesSalvas(): Record<number, number> {
    try {
      return JSON.parse(localStorage.getItem(this.chavePersistencia) ?? '{}');
    } catch {
      return {};
    }
  }

  private salvarQuantidades(itens: ItemEstoque[]): void {
    const quantidades = itens.reduce<Record<number, number>>((resultado, item) => {
      resultado[item.produto.id] = item.quantidade;
      return resultado;
    }, {});

    localStorage.setItem(this.chavePersistencia, JSON.stringify(quantidades));
  }
}