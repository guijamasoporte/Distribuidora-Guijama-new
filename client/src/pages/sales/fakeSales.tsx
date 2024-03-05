// salesData.ts

interface Sale {
  id: number;
  nombre: string;
  apellido: string;
  fecha: string;
  total: number;
  cuotas: number;
  remito: string;
}

const fakeSales: Sale[] = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Perez",
    fecha: "18/02/2024",
    total: 100,
    cuotas: 2,
    remito: "RE-001",
  },
  {
    id: 2,
    nombre: "María",
    apellido: "González",
    fecha: "19/02/2024",
    total: 150,
    cuotas: 3,
    remito: "RE-002",
  },
  {
    id: 1,
    nombre: "Juan",
    apellido: "Perez",
    fecha: "20/02/2024",
    total: 100,
    cuotas: 2,
    remito: "RE-001",
  },
  {
    id: 2,
    nombre: "María",
    apellido: "González",
    fecha: "21/02/2024",
    total: 150,
    cuotas: 3,
    remito: "RE-002",
  },
  {
    id: 1,
    nombre: "Juan",
    apellido: "Perez",
    fecha: "22/02/2024",
    total: 100,
    cuotas: 2,
    remito: "RE-001",
  },
  {
    id: 2,
    nombre: "María",
    apellido: "González",
    fecha: "23/02/2024",
    total: 150,
    cuotas: 3,
    remito: "RE-002",
  },
  {
    id: 1,
    nombre: "Juan",
    apellido: "Perez",
    fecha: "24/02/2024",
    total: 100,
    cuotas: 2,
    remito: "RE-001",
  },
  {
    id: 2,
    nombre: "María",
    apellido: "González",
    fecha: "25/02/2024",
    total: 150,
    cuotas: 3,
    remito: "RE-002",
  },
  {
    id: 1,
    nombre: "Juan",
    apellido: "Perez",
    fecha: "26/02/2024",
    total: 100,
    cuotas: 2,
    remito: "RE-001",
  },
  {
    id: 2,
    nombre: "María",
    apellido: "González",
    fecha: "27/02/2024",
    total: 150,
    cuotas: 3,
    remito: "RE-002",
  },
  {
    id: 1,
    nombre: "Juan",
    apellido: "Perez",
    fecha: "15/02/2024",
    total: 100,
    cuotas: 2,
    remito: "RE-001",
  },
  {
    id: 2,
    nombre: "María",
    apellido: "lopez",
    fecha: "29/02/2024",
    total: 150,
    cuotas: 3,
    remito: "RE-002",
  },
  {
    id: 15,
    nombre: "Estela",
    apellido: "Chascomus",
    fecha: "15/02/2024",
    total: 1550,
    cuotas: 3,
    remito: "RE-002",
  },
  {
    id: 29,
    nombre: "Esteban",
    apellido: "Cuello",
    fecha: "15/02/2024",
    total: 1800,
    cuotas: 2,
    remito: "RE-001",
  },
  {
    id: 33,
    nombre: "Matias",
    apellido: "Suarez",
    fecha: "29/02/2024",
    total: 1050,
    cuotas: 3,
    remito: "RE-002",
  },
];

export default fakeSales;
