import dayjs from 'dayjs/esm';

import { IOrder, NewOrder } from './order.model';

export const sampleWithRequiredData: IOrder = {
  id: 47761,
  name: 'firewall web-enabled',
  number: 84971,
  status: 'Franc',
  type: 'indexing',
  price: 44107,
};

export const sampleWithPartialData: IOrder = {
  id: 96762,
  name: 'Officer Soft',
  number: 43043,
  status: 'reinvent',
  type: 'Kwacha bypassing Face',
  price: 70933,
  importDate: dayjs('2024-06-13'),
  exportDate: dayjs('2024-06-13'),
};

export const sampleWithFullData: IOrder = {
  id: 47987,
  name: 'Walk',
  number: 82280,
  status: 'Fresh',
  type: 'Ville benchmark',
  price: 99735,
  importDate: dayjs('2024-06-13'),
  exportDate: dayjs('2024-06-14'),
};

export const sampleWithNewData: NewOrder = {
  name: 'Identity Rubber Operative',
  number: 14451,
  status: 'one-to-one deposit Refined',
  type: 'Loti',
  price: 58424,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
