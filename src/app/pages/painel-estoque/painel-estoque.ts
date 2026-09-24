import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstoqueService } from '../../services/estoque.service';

@Component({
  selector: 'app-painel-estoque',
  imports: [RouterLink],
  template: `
    <h1>Estoque</h1>

    @if (estoque.carregando()) {
      <p>Carregando produtos...</p>
    } @else if (estoque.erro()) {
      <p class="erro">Não foi possível carregar os produtos. Tente novamente mais tarde.</p>
    } @else {
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Produto</th>
            <th>Categoria</th>
            <th>Em estoque</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          @for (item of estoque.itens(); track item.produto.id) {
            <tr>
              <td><img [src]="item.produto.image" [alt]="item.produto.title" /></td>
              <td>{{ item.produto.title }}</td>
              <td>{{ item.produto.category }}</td>
              <td>
                <span class="qtd"
                  [class.esgotado]="item.quantidade === 0"
                  [class.baixo]="item.quantidade > 0 && item.quantidade < 5">
                  {{ item.quantidade }}
                </span>
                @if (item.quantidade === 0) {
                  <small>Esgotado</small>
                } @else if (item.quantidade < 5) {
                  <small>Estoque baixo</small>
                }
              </td>
              <td>
                <a [routerLink]="['/repor']" [queryParams]="{ produto: item.produto.id }">Repor</a>
              </td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
  styles: [`
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 10px 8px; border-bottom: 1px solid #d9dee3; vertical-align: middle; }
    img { width: 44px; height: 44px; object-fit: contain; }
    .qtd { font-weight: 700; margin-right: 8px; }
    .baixo { color: #b54708; }
    .esgotado { color: #b42318; }
    small { color: #52606d; }
    a { color: #1f5fbf; }
    .erro { color: #b42318; }
  `],
})
export class PainelEstoque implements OnInit {
  estoque = inject(EstoqueService);

  ngOnInit(): void {
    this.estoque.carregar();
  }
}