import api from './instance';

export interface Region {
  id: string;
  name: string;
  type: 'DOMESTIC' | 'ABROAD';
}

export interface Missionary {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  pastorName?: string;
  pastorPhone?: string;
  participationStartDate: string;
  participationEndDate: string;
  price?: number;
  description?: string;
  maximumParticipantCount?: number;
  bankName?: string;
  bankAccountHolder?: string;
  bankAccountNumber?: string;
  regionId: string;
  region?: Region;
  status: 'RECRUITING' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
}

export interface CreateMissionaryPayload {
  name: string;
  startDate: string;
  endDate: string;
  pastorName?: string;
  pastorPhone?: string;
  participationStartDate: string;
  participationEndDate: string;
  price?: number;
  description?: string;
  maximumParticipantCount?: number;
  bankName?: string;
  bankAccountHolder?: string;
  bankAccountNumber?: string;
  regionId: string;
  status?: 'RECRUITING' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface UpdateMissionaryPayload {
  name?: string;
  startDate?: string;
  endDate?: string;
  pastorName?: string;
  pastorPhone?: string;
  participationStartDate?: string;
  participationEndDate?: string;
  price?: number;
  description?: string;
  maximumParticipantCount?: number;
  bankName?: string;
  bankAccountHolder?: string;
  bankAccountNumber?: string;
  regionId?: string;
  status?: 'RECRUITING' | 'IN_PROGRESS' | 'COMPLETED';
}

export const missionaryApi = {
  getMissionaries() {
    return api.get<Missionary[]>('/missionaries');
  },

  getMissionary(id: string) {
    return api.get<Missionary>(`/missionaries/${id}`);
  },

  createMissionary(data: CreateMissionaryPayload) {
    return api.post<Missionary>('/missionaries', data);
  },

  updateMissionary(id: string, data: UpdateMissionaryPayload) {
    return api.patch<Missionary>(`/missionaries/${id}`, data);
  },

  deleteMissionary(id: string) {
    return api.delete(`/missionaries/${id}`);
  },
};
