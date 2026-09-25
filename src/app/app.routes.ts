import { Routes } from '@angular/router';
import { PainelEstoque } from './pages/painel-estoque/painel-estoque';
import { ReporEstoque } from './pages/repor-estoque/repor-estoque';

export const routes: Routes = [
  { path: '', component: PainelEstoque },
  { path: 'repor', component: ReporEstoque },
  { path: '**', redirectTo: '' },
];

