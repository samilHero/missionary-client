'use client';

import { Button, InputField } from '@samilhero/design-system';
import { useLogin } from 'hooks/auth';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const loginMutation = useLogin();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error');

    if (oauthError) {
      setError('소셜 로그인에 실패했습니다. 다시 시도해주세요.');
      window.history.replaceState({}, '', '/login');
    }
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    loginMutation.mutate(
      { email, password },
      {
        onError: () => {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        },
      },
    );
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_PROXY_API_URL}/auth/google`;
  };

  const handleKakaoLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_PROXY_API_URL}/auth/kakao`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-white">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center w-[400px]"
      >
        <img
          src="/logo-horizontal.svg"
          alt="삼일교회 로고"
          className="w-[228px] h-[60px] mb-[50px]"
        />
        <h1 className="m-[0_0_12px] text-[34px] font-bold leading-[1.18] text-center text-black">
          삼일교회 선교 담당
          <br />
          교역자 로그인
        </h1>
        <p className="m-[0_0_60px] text-[16px] font-normal leading-[1.375] text-center text-black">
          전달받은 선교 담당 계정으로
          <br />
          로그인 하세요.
        </p>
        <div className="flex flex-col w-full gap-[12px]">
          <InputField
            label="이메일"
            hideLabel
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            className="w-full"
          />
          <InputField
            label="비밀번호"
            hideLabel
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            error={error}
            className="w-full"
          />
        </div>
        <div className="w-full mt-[12px]">
          <Button
            type="submit"
            size="lg"
            width={400}
            color="primary"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? '로그인 중...' : '로그인'}
          </Button>
        </div>

        <div className="relative flex items-center justify-center w-full my-[24px] before:content-[''] before:flex-1 before:h-[1px] before:bg-gray-10 after:content-[''] after:flex-1 after:h-[1px] after:bg-gray-10">
          <span className="px-[12px] text-[13px] text-gray-30">또는</span>
        </div>

        <div className="flex flex-col gap-[12px] w-full">
          <Button
            type="button"
            size="lg"
            variant="outline"
            width={400}
            onClick={handleGoogleLogin}
            className="!bg-[#F2F2F2] !border-[#747775] !text-[#1F1F1F] hover:!bg-[#E8E8E8]"
          >
            Google로 로그인
          </Button>
          <Button
            type="button"
            size="lg"
            variant="filled"
            width={400}
            onClick={handleKakaoLogin}
            className="!bg-[#FEE500] !text-[#191919] hover:!bg-[#E6CF00] !border-none"
          >
            Kakao로 로그인
          </Button>
        </div>
      </form>
    </div>
  );
}
