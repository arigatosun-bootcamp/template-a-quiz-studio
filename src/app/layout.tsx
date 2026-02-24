import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-sans-jp",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-serif-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Quiz Studio - 日本全国ご当地クイズ",
    template: "%s | Quiz Studio",
  },
  description:
    "47都道府県の地理・観光名所・ご当地グルメを楽しく学べるクイズアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} ${notoSerifJP.variable}`}>
        {children}
      </body>
    </html>
  );
}
