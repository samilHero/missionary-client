'use client';

import { Button, IconButton } from '@samilhero/design-system';
import { useAuth } from 'lib/auth/AuthContext';

interface HeaderProps {
  statusText?: string;
}

export function Header({
  statusText = '진행중인 선교 : 선교를 생성 해주세요.',
}: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="relative flex items-center w-full h-[100px] bg-white">
      <span className="absolute left-[40px] top-1/2 -translate-y-1/2 text-[28px] font-bold leading-[1.214] text-primary-80">
        {statusText}
      </span>
      <div className="absolute right-[40px] top-1/2 -translate-y-1/2 flex items-center gap-[16px]">
        {user && (
          <span className="text-[14px] font-medium leading-[1.43] text-gray-60">
            {user.email}
          </span>
        )}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={logout}
          className="!border-gray-10 !text-gray-60 !rounded-[6px] hover:!bg-gray-02"
        >
          로그아웃
        </Button>
        <IconButton
          type="button"
          variant="ghost"
          icon={
            <img src="/icon-home.svg" alt="" className="w-[34px] h-[34px]" />
          }
          label="홈으로"
          className="!h-auto !text-[28px] !font-bold !text-black"
        />
      </div>
    </header>
  );
}
