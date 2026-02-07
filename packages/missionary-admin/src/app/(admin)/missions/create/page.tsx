'use client';

import {
  Button,
  DatePicker,
  InputField,
  Select,
} from '@samilhero/design-system';
import { useCreateMissionary } from 'hooks/missionary';
import { useRegions } from 'hooks/region';
import { useState } from 'react';

export default function CreateMissionPage() {
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: regions } = useRegions();
  const createMutation = useCreateMissionary();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = '선교 이름을 입력해주세요';
    if (!startDate) newErrors.startDate = '선교 시작일을 선택해주세요';
    if (!endDate) newErrors.endDate = '선교 종료일을 선택해주세요';
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

    createMutation.mutate(
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
        onError: (error) => {
          console.error('Failed to create missionary:', error);
        },
      },
    );
  };

  const selectedRegion = regions?.find((r) => r.id === regionId);

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4 py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">신규 국내선교 생성</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField
          label="선교 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="선교 이름을 입력하세요"
          error={errors.name}
          disabled={createMutation.isPending}
        />

        <div className="grid grid-cols-2 gap-4">
          <DatePicker
            label="선교 시작일"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholder="YYYY-MM-DD"
            error={errors.startDate}
            disabled={createMutation.isPending}
          />
          <DatePicker
            label="선교 종료일"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholder="YYYY-MM-DD"
            error={errors.endDate}
            disabled={createMutation.isPending}
            minDate={startDate || undefined}
          />
        </div>

        <InputField
          label="담당 교역자"
          value={pastorName}
          onChange={(e) => setPastorName(e.target.value)}
          placeholder="담당 교역자 이름을 입력하세요"
          error={errors.pastorName}
          disabled={createMutation.isPending}
        />

        <div className="flex flex-col gap-1 relative">
          <label className="text-xs font-normal leading-[1.833] text-gray-70">
            지역
          </label>
          <Select
            value={regionId}
            onChange={(val) => setRegionId(val as string)}
          >
            <Select.Trigger
              type="button"
              className={`w-full flex items-center justify-between h-12 px-4 rounded-lg bg-gray-02 text-sm ${
                !regionId ? 'text-gray-30' : 'text-black'
              }`}
            >
              {selectedRegion ? selectedRegion.name : '지역을 선택하세요'}
            </Select.Trigger>
            <Select.Options className="absolute z-10 w-full mt-1 bg-white border border-gray-10 rounded-lg shadow-lg max-h-60 overflow-auto">
              {regions?.map((region) => (
                <Select.Option
                  key={region.id}
                  item={region.id}
                  className="px-4 py-2 hover:bg-gray-05 cursor-pointer text-sm"
                >
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
            disabled={createMutation.isPending}
          />
          <DatePicker
            label="참가 신청 종료일"
            selected={participationEndDate}
            onChange={(date) => setParticipationEndDate(date)}
            placeholder="YYYY-MM-DD"
            error={errors.participationEndDate}
            disabled={createMutation.isPending}
            minDate={participationStartDate || undefined}
          />
        </div>

        <div className="mt-4">
          <Button
            type="submit"
            disabled={createMutation.isPending}
            size="lg"
            className="w-full"
            color="primary"
          >
            {createMutation.isPending ? '생성 중...' : '생성하기'}
          </Button>
        </div>
      </form>
    </div>
  );
}
