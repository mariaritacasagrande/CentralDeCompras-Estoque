export interface Produto {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: { rate: number; count: number };
}

export interface ItemEstoque {
  produto: Produto;
  quantidade: number;
}