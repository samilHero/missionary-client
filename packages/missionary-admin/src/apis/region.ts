import api from './instance';

export interface Region {
  id: string;
  name: string;
  type: 'DOMESTIC' | 'ABROAD';
}

export const regionApi = {
  getRegions() {
    return api.get<Region[]>('/regions');
  },
};
