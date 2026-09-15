import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "后台管理",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-50 px-4 py-10">{children}</div>;
}
