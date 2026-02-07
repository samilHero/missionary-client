'use client';

import {
  Button,
  InputField,
  DatePicker,
  Select,
} from '@samilhero/design-system';
import { DeleteConfirmModal } from 'components/missionary/DeleteConfirmModal';
import {
  useMissionary,
  useUpdateMissionary,
  useDeleteMissionary,
} from 'hooks/missionary';
import { useRegions } from 'hooks/region';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function MissionaryEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: missionary, isLoading: isMissionaryLoading } =
    useMissionary(id);
  const { data: regions } = useRegions();

  const updateMutation = useUpdateMissionary(id);
  const deleteMutation = useDeleteMissionary(id);

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [pastorName, setPastorName] = useState('');
  const [regionId, setRegionId] = useState('');
  const [participationStartDate, setParticipationStartDate] =
    useState<Date | null>(null);
  const [participationEndDate, setParticipationEndDate] = useState<Date | null>(
    null,
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (missionary) {
      setName(missionary.name);
      setStartDate(new Date(missionary.startDate));
      setEndDate(new Date(missionary.endDate));
      setPastorName(missionary.pastorName || '');
      setRegionId(missionary.regionId || '');
      setParticipationStartDate(new Date(missionary.participationStartDate));
      setParticipationEndDate(new Date(missionary.participationEndDate));
    }
  }, [missionary]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = '선교 이름을 입력해주세요';
    if (!startDate) newErrors.startDate = '시작일을 선택해주세요';
    if (!endDate) newErrors.endDate = '종료일을 선택해주세요';
    if (!pastorName) newErrors.pastorName = '담당 교역자를 입력해주세요';
    if (!regionId) newErrors.regionId = '지역을 선택해주세요';
    if (!participationStartDate)
      newErrors.participationStartDate = '참가 신청 시작일을 선택해주세요';
    if (!participationEndDate)
      newErrors.participationEndDate = '참가 신청 종료일을 선택해주세요';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateMutation.mutate(
      {
        name,
        startDate: startDate!.toISOString(),
        endDate: endDate!.toISOString(),
        pastorName,
        regionId,
        participationStartDate: participationStartDate!.toISOString(),
        participationEndDate: participationEndDate!.toISOString(),
      },
      {
        onSuccess: () => {
          router.push('/missions');
        },
        onError: (error) => {
          console.error('Failed to update missionary:', error);
        },
      },
    );
  };

  if (isMissionaryLoading) {
    return (
      <div className="flex justify-center items-center h-full">로딩 중...</div>
    );
  }

  if (!missionary) {
    return (
      <div className="flex justify-center items-center h-full">
        선교를 찾을 수 없습니다
      </div>
    );
  }

  const selectedRegion = regions?.find((r) => r.id === regionId);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">선교 수정</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <InputField
          label="선교 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="선교 이름을 입력하세요"
          error={errors.name}
          disabled={updateMutation.isPending}
        />

        <div className="grid grid-cols-2 gap-4">
          <DatePicker
            label="선교 시작일"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholder="YYYY-MM-DD"
            error={errors.startDate}
            disabled={updateMutation.isPending}
          />
          <DatePicker
            label="선교 종료일"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholder="YYYY-MM-DD"
            error={errors.endDate}
            disabled={updateMutation.isPending}
            minDate={startDate || undefined}
          />
        </div>

        <InputField
          label="담당 교역자"
          value={pastorName}
          onChange={(e) => setPastorName(e.target.value)}
          placeholder="담당 교역자 이름을 입력하세요"
          error={errors.pastorName}
          disabled={updateMutation.isPending}
        />

        <div className="flex flex-col gap-1">
          <label className="text-xs font-normal leading-[1.833] text-gray-70">
            지역
          </label>
          <Select
            value={regionId}
            onChange={(val) => setRegionId(val as string)}
          >
            <Select.Trigger className="w-full flex items-center justify-between h-12 px-4 rounded-lg bg-gray-02 text-sm">
              {selectedRegion ? selectedRegion.name : '지역을 선택하세요'}
            </Select.Trigger>
            <Select.Options>
              {regions?.map((region) => (
                <Select.Option key={region.id} item={region.id}>
                  {region.name}
                </Select.Option>
              ))}
            </Select.Options>
          </Select>
          {errors.regionId && (
            <div className="mt-1 text-error-60 text-xs leading-[1.5]">
              {errors.regionId}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DatePicker
            label="참가 신청 시작일"
            selected={participationStartDate}
            onChange={(date) => setParticipationStartDate(date)}
            placeholder="YYYY-MM-DD"
            error={errors.participationStartDate}
            disabled={updateMutation.isPending}
          />
          <DatePicker
            label="참가 신청 종료일"
            selected={participationEndDate}
            onChange={(date) => setParticipationEndDate(date)}
            placeholder="YYYY-MM-DD"
            error={errors.participationEndDate}
            disabled={updateMutation.isPending}
            minDate={participationStartDate || undefined}
          />
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex-1"
            size="lg"
            color="primary"
          >
            {updateMutation.isPending ? '수정 중...' : '수정하기'}
          </Button>
          <Button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            color="secondary"
            className="flex-1 bg-error-60 hover:bg-error-70 text-white"
            size="lg"
          >
            삭제하기
          </Button>
        </div>
      </form>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onConfirm={() => deleteMutation.mutate()}
        onCancel={() => setIsDeleteModalOpen(false)}
        missionaryName={missionary?.name || ''}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
