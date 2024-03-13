export interface Client {
  _id: any;
  idClient: string;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  adress: string;
  buys: [];
}

export interface Product {

  _id: string;
  unity: string | number | readonly string[] | undefined | any;
  generic: boolean;
  code: string;
  title: string;
  stock: number;
  priceList: number | null | any;
  priceCost: number | null | any;
  category: string;
  brand: string;
  image: [];
  // sales: {};
}

export interface ProductsProps {
  data: Product[];
}

export interface Sales {
  idSale: string;
  date: Date;
  products: Product[];
  priceTotal: number;
  client: {};
  dues: Dues;
  invoice: string;
  state: boolean;
}

export interface Dues {
  length: number;
  payd: number;
  cant: number;
}

export interface DataLogin {
  email: string;
  password: string;
}

export interface propsModals {
  open: boolean;
  onClose: () => void;
  onCreate: (newClient: Client) => void;
  handleClose:() => void;
  categories: string[];
  brands: string[];
}
