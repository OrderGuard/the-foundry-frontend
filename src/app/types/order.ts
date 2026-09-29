export type Topping = {
  name: string;
  quantity: number;
};

export type OrderItem = {
  id: number;
  item_name: string;
  item_price: number;
  quantity: number;
  total_price: number;
  toppings?: Topping[];
};

export type Order = {
  id: number;
  items?: OrderItem[];
};

