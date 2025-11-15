export interface Supplier {
  date: any;
  _id: any;
  idSupplier?: string;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  adress: string;
  buys: any;
}
export interface Client {
  idSupplier: any;
  date: any;
  _id: any;
  idClient?: string;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  adress: string;
  buys: any;
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
  pricex10: number | null | any;
  pricex100: number | null | any;
  category: string;
  brand: string;
  image: [];
  variant: string;
}

export interface ProductsProps {
  data: Product[];
}

export interface Sales {
  [x: string]: any;
  createdBy: any;
  address: any;
  buys: any;
  _id: string;
  saleId: string;
  idSale: string;
  date: string;
  products: Product[];
  priceTotal: number;
  client: Client;
  dues: Dues;
  state: boolean;
  createBy: string;
}

export interface Dues {
  length: number;
  payd: [];
  cant: number;
}

export interface DataLogin {
  email: string;
  password: string;
}

export interface propsModals {
  open: boolean;
  onClose: () => void;
  onCreate: ((newClient: Client) => void) | ((newSupplier: Supplier) => void);
  handleClose: () => void;
  categories: string[];
  brands: string[];
  variant: string[];
}

export interface Filters {
  code: string;
  cant: number;
  importe: number;
  title: string;
}
