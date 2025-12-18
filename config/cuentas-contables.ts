import type { CuentaContable } from '@/types';

export const CUENTAS_CONTABLES: CuentaContable[] = [
  {
    codigo: '5010',
    nombre: 'Material Didáctico',
    conceptos: [
      'Cartulinas',
      'Marcadores',
      'Pinturas',
      'Material de laboratorio',
      'Libros de texto',
      'Mapas y láminas',
    ],
  },
  {
    codigo: '5020',
    nombre: 'Papelería y Útiles de Oficina',
    conceptos: [
      'Resmas de papel',
      'Bolígrafos',
      'Carpetas',
      'Grapas y clips',
      'Cuadernos',
      'Archivadores',
    ],
  },
  {
    codigo: '5030',
    nombre: 'Servicios Generales',
    conceptos: [
      'Mantenimiento',
      'Limpieza',
      'Vigilancia',
      'Jardinería',
      'Reparaciones',
      'Fumigación',
    ],
  },
  {
    codigo: '5040',
    nombre: 'Tecnología e Informática',
    conceptos: [
      'Tóner y cartuchos',
      'Cables y conectores',
      'Licencias de software',
      'Equipos de cómputo',
      'Accesorios informáticos',
      'Mantenimiento de equipos',
    ],
  },
  {
    codigo: '5050',
    nombre: 'Material Deportivo',
    conceptos: [
      'Balones',
      'Conos',
      'Redes',
      'Colchonetas',
      'Uniformes deportivos',
      'Implementos deportivos',
    ],
  },
  {
    codigo: '5060',
    nombre: 'Mobiliario y Equipo',
    conceptos: [
      'Escritorios',
      'Sillas',
      'Estanterías',
      'Pizarras',
      'Mesas',
      'Archivadores',
    ],
  },
  {
    codigo: '5070',
    nombre: 'Servicios Públicos',
    conceptos: ['Energía eléctrica', 'Agua', 'Internet', 'Teléfono', 'Gas'],
  },
];

