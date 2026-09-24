import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstoqueService } from '../../services/estoque.service';

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
}