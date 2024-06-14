import dayjs from 'dayjs/esm';

export interface IOrder {
  id: number;
  name?: string | null;
  number?: number | null;
  status?: string | null;
  type?: string | null;
  price?: number | null;
  importDate?: dayjs.Dayjs | null;
  exportDate?: dayjs.Dayjs | null;
}

export type NewOrder = Omit<IOrder, 'id'> & { id: null };
