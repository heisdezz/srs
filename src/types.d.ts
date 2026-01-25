export type OptionValue = {
  label: string;
  price: number;
};

export type Option = {
  label: string;
  type: "select";
  values: {
    [key: string]: OptionValue;
  };
};

export type OptionsConfig = {
  [key: string]: Option;
};

export type CartOption = {};
export type CartItemOption = {
  [key: string]: {
    values: {
      [key: string]: {
        price: number;
      };
    };
  };
};

export interface CartItem {
  id: string;
  name: string;
  img: string;
  options: CartItemOption;
  quantity: number;
  price: number;
}
export type UserCart = {
  [key: string]: CartItem;
};

export type OrderType = {
  productId: string;
  userId: string;
  refId: string;
  productOptions: CartItemOption;
  price: number;
  quantity: number;
  deliveryFee: number;
};

export interface CartRequestType {
  productId: string;
  options: CartItemOption;
}
