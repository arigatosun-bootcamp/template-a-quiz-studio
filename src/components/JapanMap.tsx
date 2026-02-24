"use client";

import type { Difficulty } from "@/lib/constants";

// 都道府県の色分け（仕様書準拠: 緑系統）
const COLORS: Record<string, string> = {
  none: "#D1D5DB",
  beginner: "#90C978",
  intermediate: "#5B8C3E",
  advanced: "#2D5A1E",
};

interface PrefectureData {
  prefecture: string;
  maxDifficulty: Difficulty | null;
}

interface JapanMapProps {
  prefectureProgress: PrefectureData[];
  onPrefectureClick?: (prefecture: string, maxDifficulty: Difficulty | null) => void;
}

// 簡易的な47都道府県SVGパス（位置・形状は模式的）
const PREFECTURES_SVG: { name: string; d: string }[] = [
  { name: "北海道", d: "M350,30 L390,20 L420,35 L410,70 L380,80 L360,75 L345,55 Z" },
  { name: "青森県", d: "M360,95 L385,90 L395,100 L390,115 L365,118 L355,108 Z" },
  { name: "岩手県", d: "M370,120 L395,118 L400,140 L390,155 L370,155 L365,135 Z" },
  { name: "宮城県", d: "M365,157 L390,157 L395,172 L380,178 L365,175 Z" },
  { name: "秋田県", d: "M350,120 L365,118 L365,148 L355,155 L345,145 Z" },
  { name: "山形県", d: "M350,155 L365,155 L365,178 L355,185 L345,175 Z" },
  { name: "福島県", d: "M345,180 L380,180 L385,200 L350,205 L340,195 Z" },
  { name: "茨城県", d: "M350,207 L370,205 L375,225 L360,230 L348,220 Z" },
  { name: "栃木県", d: "M340,195 L360,195 L365,215 L345,218 L335,208 Z" },
  { name: "群馬県", d: "M320,195 L340,193 L345,215 L330,218 L318,208 Z" },
  { name: "埼玉県", d: "M325,220 L345,218 L350,232 L335,236 L322,228 Z" },
  { name: "千葉県", d: "M350,232 L368,228 L378,245 L365,258 L350,248 Z" },
  { name: "東京都", d: "M332,237 L350,234 L352,248 L338,250 L330,244 Z" },
  { name: "神奈川県", d: "M330,250 L350,248 L355,260 L340,265 L328,258 Z" },
  { name: "新潟県", d: "M295,160 L340,155 L345,180 L320,190 L290,185 Z" },
  { name: "富山県", d: "M270,190 L295,188 L298,205 L278,208 L268,200 Z" },
  { name: "石川県", d: "M258,178 L272,175 L275,200 L265,205 L255,195 Z" },
  { name: "福井県", d: "M248,200 L268,198 L272,218 L255,222 L245,212 Z" },
  { name: "山梨県", d: "M305,230 L325,228 L328,245 L312,248 L302,240 Z" },
  { name: "長野県", d: "M295,195 L320,192 L325,225 L305,228 L290,215 Z" },
  { name: "岐阜県", d: "M265,208 L295,205 L298,230 L272,233 L262,222 Z" },
  { name: "静岡県", d: "M290,248 L325,245 L330,262 L300,268 L285,258 Z" },
  { name: "愛知県", d: "M270,240 L295,238 L300,258 L280,262 L268,252 Z" },
  { name: "三重県", d: "M255,252 L275,250 L280,275 L262,280 L252,268 Z" },
  { name: "滋賀県", d: "M248,225 L265,223 L268,242 L255,245 L245,236 Z" },
  { name: "京都府", d: "M230,215 L250,213 L255,238 L238,242 L228,230 Z" },
  { name: "大阪府", d: "M238,245 L255,243 L258,260 L245,263 L236,255 Z" },
  { name: "兵庫県", d: "M215,225 L238,222 L242,255 L222,258 L212,242 Z" },
  { name: "奈良県", d: "M245,258 L260,255 L264,278 L250,280 L243,270 Z" },
  { name: "和歌山県", d: "M232,268 L252,265 L258,290 L242,295 L228,282 Z" },
  { name: "鳥取県", d: "M200,215 L222,213 L225,228 L208,232 L198,224 Z" },
  { name: "島根県", d: "M175,218 L200,215 L205,235 L182,238 L172,228 Z" },
  { name: "岡山県", d: "M205,235 L228,232 L232,252 L212,255 L202,245 Z" },
  { name: "広島県", d: "M178,238 L205,235 L210,258 L188,262 L175,252 Z" },
  { name: "山口県", d: "M152,245 L178,242 L182,265 L162,268 L148,258 Z" },
  { name: "徳島県", d: "M220,268 L242,265 L245,280 L228,283 L218,276 Z" },
  { name: "香川県", d: "M218,255 L240,252 L242,265 L225,268 L216,262 Z" },
  { name: "愛媛県", d: "M190,265 L218,262 L222,285 L200,288 L188,278 Z" },
  { name: "高知県", d: "M195,290 L230,285 L235,308 L205,312 L190,302 Z" },
  { name: "福岡県", d: "M130,260 L155,258 L158,278 L140,282 L128,272 Z" },
  { name: "佐賀県", d: "M118,270 L138,268 L140,282 L125,285 L115,278 Z" },
  { name: "長崎県", d: "M100,278 L120,275 L125,298 L108,302 L95,292 Z" },
  { name: "熊本県", d: "M125,285 L150,282 L155,308 L135,312 L122,300 Z" },
  { name: "大分県", d: "M148,265 L172,262 L175,282 L158,286 L145,276 Z" },
  { name: "宮崎県", d: "M148,290 L170,285 L175,315 L158,320 L145,305 Z" },
  { name: "鹿児島県", d: "M118,310 L148,305 L155,338 L130,342 L115,328 Z" },
  { name: "沖縄県", d: "M80,380 L110,375 L115,395 L90,400 L78,390 Z" },
];

export default function JapanMap({ prefectureProgress, onPrefectureClick }: JapanMapProps) {
  const progressMap = new Map(
    prefectureProgress.map((p) => [p.prefecture, p.maxDifficulty])
  );

  function getColor(name: string): string {
    const diff = progressMap.get(name);
    if (!diff) return COLORS.none;
    return COLORS[diff] || COLORS.none;
  }

  return (
    <svg viewBox="60 10 380 400" xmlns="http://www.w3.org/2000/svg">
      {PREFECTURES_SVG.map((pref) => (
        <path
          key={pref.name}
          d={pref.d}
          fill={getColor(pref.name)}
          stroke="#fff"
          strokeWidth="1.5"
          style={{ cursor: "pointer", transition: "fill 0.3s" }}
          onClick={() => {
            const diff = progressMap.get(pref.name) ?? null;
            onPrefectureClick?.(pref.name, diff);
          }}
        >
          <title>{pref.name}</title>
        </path>
      ))}
    </svg>
  );
}
