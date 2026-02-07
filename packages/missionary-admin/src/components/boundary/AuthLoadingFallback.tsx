'use client';

export function AuthLoadingFallback() {
  return (
    <div className="flex justify-center items-center h-screen w-full bg-[#f5f5f5]">
      <div className="w-[48px] h-[48px] border-[4px] border-[#e0e0e0] border-t-[#1976d2] rounded-full animate-spin" />
    </div>
  );
}
