export interface Product {
  id: string;
  name: string;
  stock: number;
}

export interface Reservation {
  id: string;
  productId: string;
  quantity: number;
  expiresAt: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Limited Sneakers",
    stock: 5,
  },
  {
    id: "2",
    name: "Exclusive Hoodie",
    stock: 3,
  },
];

export const reservations: Reservation[] = [];
