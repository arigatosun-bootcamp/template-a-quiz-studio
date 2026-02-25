import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { checkDailyUsage } from "@/lib/usage";
import StepSelector from "./StepSelector";
import DailyLimitNotice from "./DailyLimitNotice";
import TopMapSection from "./TopMapSection";
import styles from "./top.module.css";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let todayCount = 0;
  let canPlay = true;

  if (user) {
    try {
      const usage = await checkDailyUsage(supabase, user.id);
      todayCount = usage.todayCount;
      canPlay = usage.canPlay;
    } catch {
      // 利用回数取得に失敗してもページは表示する
    }
  }

  return (
    <div className={styles.container}>
      {user && (
        <p className={styles.greeting}>
          ようこそ、<strong>{user.email}</strong> さん
        </p>
      )}

      <DailyLimitNotice todayCount={todayCount} canPlay={canPlay} />

      <StepSelector canPlay={canPlay} />

      <TopMapSection />

      <Link href="/history" className={styles.historyLink}>
        回答履歴を見る
      </Link>
    </div>
  );
}
