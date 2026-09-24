import { Routes } from '@angular/router';
import { PainelEstoque } from './pages/painel-estoque/painel-estoque';

export const routes: Routes = [
  { path: '', component: PainelEstoque },
  { path: '**', redirectTo: '' },
];