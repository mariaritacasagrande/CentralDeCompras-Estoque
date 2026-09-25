import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstoqueService } from '../../services/estoque.service';
import { ItemEstoque } from '../../models/produto.model';

@Component({
  selector: 'app-painel-estoque',
  imports: [RouterLink],
  templateUrl: './painel-estoque.html',
  styleUrl: './painel-estoque.css',
})
export class PainelEstoque implements OnInit {
  estoque = inject(EstoqueService);
  itemParaRepor: ItemEstoque | null = null;
  erroReposicao = '';

  ngOnInit(): void {
    this.estoque.carregar();
  }
  reporEstoque(item: ItemEstoque): void {
    this.itemParaRepor = item;
    this.erroReposicao = '';
  }

  cancelarReposicao(): void {
    this.itemParaRepor = null;
    this.erroReposicao = '';
  }

  confirmarReposicao(valor: string): void {
    const quantidade = Number(valor);

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      this.erroReposicao = 'Informe uma quantidade inteira maior que zero.';
      return;
    }

    this.estoque.repor(this.itemParaRepor!.produto.id, quantidade);
    this.cancelarReposicao();
  }
}