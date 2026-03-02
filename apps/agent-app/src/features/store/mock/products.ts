export type Product = {
  id: string;
  name: string;
  price: number;
};

export const PRODUCTS: Product[] = [
  { id: "prod_spanish_bread", name: "Spanish Bread", price: 30 },
  { id: "prod_pandesal", name: "Pandesal", price: 25 },
  { id: "prod_ensaymada", name: "Ensaymada", price: 45 },
  { id: "prod_hopia", name: "Hopia", price: 35 },
];
