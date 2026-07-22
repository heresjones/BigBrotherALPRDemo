import type { ReactNode } from "react";

export function MockBanner({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 rounded-md border border-[#ffe066] bg-[#fff3bf] px-3 py-2 text-sm text-[#4a3b00] dark:border-[#7a6300] dark:bg-[#4a3b00] dark:text-[#ffe066]">
      {children}
    </div>
  );
}
