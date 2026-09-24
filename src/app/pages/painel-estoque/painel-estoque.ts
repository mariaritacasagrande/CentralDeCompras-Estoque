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

  ngOnInit(): void {
    this.estoque.carregar();
  }
reporEstoque(item: ItemEstoque): void {
    const qteStr = prompt(`Quantas unidades deseja adicionar a "${item.produto.title}"?`);
    
    if (qteStr !== null) {
      const quantidade = Number(qteStr);
      
      if (!isNaN(quantidade) && quantidade > 0) {
        this.estoque.repor(item.produto.id, quantidade);
      } else {
        alert('Por favor, informe uma quantidade válida.');
      }
    }
  }
}