import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EstoqueService } from '../../services/estoque.service';

@Component({
  selector: 'app-repor-estoque',
  imports: [ReactiveFormsModule],
  template: `
    <h1>Repor estoque</h1>

    @if (estoque.carregando()) {
      <p>Carregando produtos...</p>
    } @else if (estoque.erro()) {
      <p class="erro">Não foi possível carregar os produtos. Tente novamente mais tarde.</p>
    } @else {
      <form [formGroup]="form" (ngSubmit)="repor()">
        <label>
          Produto
          <select formControlName="produtoId">
            <option [ngValue]="null" disabled>Selecione um produto</option>
            @for (item of estoque.itens(); track item.produto.id) {
              <option [ngValue]="item.produto.id">
                {{ item.produto.title }} (atual: {{ item.quantidade }})
              </option>
            }
          </select>
        </label>
        @if (produtoId.invalid && produtoId.touched) {
          <small class="erro">Selecione o produto que será reposto.</small>
        }

        <label>
          Quantidade a repor
          <input type="number" formControlName="quantidade" />
        </label>
        @if (quantidade.invalid && quantidade.touched) {
          <small class="erro">
            @if (quantidade.errors?.['required']) { Informe a quantidade. }
            @else if (quantidade.errors?.['pattern']) { Use apenas números inteiros. }
            @else if (quantidade.errors?.['min']) { A quantidade mínima é 1. }
            @else if (quantidade.errors?.['max']) { A quantidade máxima por reposição é 1000. }
          </small>
        }

        <button type="submit" [disabled]="form.invalid">Repor estoque</button>
      </form>

      @if (mensagem()) {
        <p class="ok">{{ mensagem() }}</p>
      }
    }
  `,
  styles: [`
    form { display: flex; flex-direction: column; gap: 10px; max-width: 440px;
           background: var(--superficie); border: 1px solid var(--borda);
           border-radius: 12px; padding: 20px; }
    label { display: flex; flex-direction: column; gap: 4px; font-weight: 600; }
    select, input { padding: 8px; border: 1px solid var(--borda); border-radius: 8px;
                    font: inherit; color: var(--texto); background: var(--superficie); }
    select:focus, input:focus { outline: 2px solid var(--primaria); border-color: var(--primaria); }
    button { background: var(--primaria); color: var(--texto); border: 0; border-radius: 8px;
             padding: 10px 16px; font-weight: 600; cursor: pointer; }
    button:hover:not([disabled]) { background: var(--primaria-forte); }
    button[disabled] { opacity: 0.5; cursor: not-allowed; }
    .erro { color: var(--erro-texto); }
    .ok { max-width: 440px; margin-top: 16px; padding: 10px 14px; border-radius: 8px;
          background: var(--ok-fundo); color: var(--ok-texto); font-weight: 600; }
  `],
})
export class ReporEstoque implements OnInit {
  estoque = inject(EstoqueService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  mensagem = signal('');

  form = this.fb.group({
    produtoId: [null as number | null, Validators.required],
    quantidade: [
      null as number | null,
      [Validators.required, Validators.min(1), Validators.max(1000), Validators.pattern(/^\d+$/)],
    ],
  });

  get produtoId() { return this.form.controls.produtoId; }
  get quantidade() { return this.form.controls.quantidade; }

  ngOnInit(): void {
    this.estoque.carregar();

    // Se veio do link "Repor" do painel, já deixa o produto selecionado.
    const idDaUrl = this.route.snapshot.queryParamMap.get('produto');
    if (idDaUrl) {
      this.produtoId.setValue(Number(idDaUrl));
    }
  }

  repor(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.produtoId.value!;
    const qtd = Number(this.quantidade.value);

    this.estoque.repor(id, qtd);

    const item = this.estoque.buscarItem(id);
    this.mensagem.set(
      `Reposição feita: +${qtd} unidades de "${item?.produto.title}". Novo total: ${item?.quantidade}.`
    );

    this.form.reset();
  }
}