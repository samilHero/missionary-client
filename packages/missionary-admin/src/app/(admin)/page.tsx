'use client';

import { Button } from '@samilhero/design-system';
import Link from 'next/link';

export default function MainPage() {
  return (
    <>
      <div className="flex items-center w-full h-[100px] px-[40px] rounded-[8px] bg-white shadow-[0_10px_30px_0_rgba(17,38,146,0.05)]">
        <p className="m-0 text-[28px] font-bold leading-[1.214] text-black">
          선교 생성 후 신청자 조회 및 준비팀 권한 부여를 진행해주세요.
        </p>
      </div>

      <div className="flex flex-col items-center w-[510px] py-[50px] mt-[40px] rounded-[8px] bg-white shadow-[0_10px_30px_0_rgba(17,38,146,0.05)]">
        <h2 className="m-[0_0_50px] text-[34px] font-bold leading-[1.176] text-center text-black">
          선교 관리
        </h2>
        <div className="flex flex-col gap-[20px]">
          <Link href="/missions/create">
            <Button size="xlg" width={240} color="primary">
              신규 국내선교 생성
            </Button>
          </Link>
          <Button size="xlg" width={240} color="primary" variant="outline">
            신규 해외선교 생성
          </Button>
        </div>
      </div>
    </>
  );
}
