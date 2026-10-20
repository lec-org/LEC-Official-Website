import type { Metadata } from "next";
import { AdmissionScreen } from "@/components/admission/admission-screen";

export const metadata: Metadata = {
  title: "招新录取查询 | 乐程软件工作室",
  description: "输入学号和姓名，查询乐程软件工作室 2026 年招新录取结果。",
  alternates: { canonical: "/admission" },
};

/** 提供查询页面的元信息，并挂载整屏查询与结果交互。 */
export default function AdmissionPage() {
  return <AdmissionScreen />;
}
