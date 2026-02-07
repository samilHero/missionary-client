'use client';

import { Badge, Button } from '@samilhero/design-system';
import { Missionary } from 'apis/missionary';
import { useMissionaries } from 'hooks/missionary/useMissionaries';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\. /g, '.')
    .replace(/\.$/, '');
};

const getStatusBadge = (status: Missionary['status']) => {
  switch (status) {
    case 'RECRUITING':
      return <Badge variant="info">모집중</Badge>;
    case 'IN_PROGRESS':
      return <Badge variant="success">진행중</Badge>;
    case 'COMPLETED':
      // Using info variant but overriding with gray styles since 'gray' variant is not available
      return (
        <Badge variant="info" className="bg-gray-100 text-gray-600">
          완료
        </Badge>
      );
    default:
      return null;
  }
};

export default function MissionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nameFilter = searchParams.get('name');
  const { data: missionaries, isLoading } = useMissionaries();

  const filteredMissionaries = nameFilter
    ? missionaries?.filter((m) => m.name.includes(nameFilter))
    : missionaries;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">선교 목록</h1>
        <Link href="/missions/create">
          <Button color="primary">신규 선교 생성</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-10">로딩 중...</div>
      ) : !filteredMissionaries || filteredMissionaries.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          등록된 선교가 없습니다
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-left font-semibold text-gray-700">
                  선교 이름
                </th>
                <th className="p-3 text-left font-semibold text-gray-700">
                  선교 기간
                </th>
                <th className="p-3 text-left font-semibold text-gray-700">
                  담당 교역자
                </th>
                <th className="p-3 text-left font-semibold text-gray-700">
                  상태
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMissionaries.map((missionary) => (
                <tr
                  key={missionary.id}
                  onClick={() => router.push(`/missions/${missionary.id}/edit`)}
                  className="hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                >
                  <td className="p-3 text-gray-900">{missionary.name}</td>
                  <td className="p-3 text-gray-600">
                    {formatDate(missionary.startDate)} ~{' '}
                    {formatDate(missionary.endDate)}
                  </td>
                  <td className="p-3 text-gray-900">
                    {missionary.pastorName || '-'}
                  </td>
                  <td className="p-3">{getStatusBadge(missionary.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
