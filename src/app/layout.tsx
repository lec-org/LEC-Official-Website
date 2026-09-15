import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lec-page-2026.ziroo.cn"),
  title: "乐程软件工作室",
  description:
    "乐程软件工作室 2026 年招新，面向西南石油大学全体大一新生。涵盖全栈开发、Agent开发、游戏开发等多种方向，参与实际项目，提升编程技能。",
  keywords: ["乐程软件工作室", "LEC software studio", "LEC", "招新", "西南石油大学"],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    title: "乐程软件工作室 2026 招新",
    description: "乐程软件工作室，加入我们，一起用代码创造世界！",
    type: "website",
    locale: "zh_CN",
  },
  verification: {
    other: {
      "msvalidate.01": "710B2A1397626ED3DF77EFA42BDDED1C",
      "baidu-site-verification": "codeva-Sw3VlCfxmg",
    },
  },
  icons: { icon: "/lec.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+SC:wght@300;400;500;700&family=Noto+Serif+SC:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://ik.imagekit.io/Ziro/MiSans-Medium/result.css?updatedAt=1783173591609"
        />
        <link
          rel="stylesheet"
          href="https://ik.imagekit.io/Ziro/MiSans-Light/result.css?updatedAt=1785220028179"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
