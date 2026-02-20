import { DAILY_LIMIT } from "@/lib/constants";
import styles from "./top.module.css";

interface DailyLimitNoticeProps {
  todayCount: number;
  canPlay: boolean;
}

export default function DailyLimitNotice({
  todayCount,
  canPlay,
}: DailyLimitNoticeProps) {
  if (canPlay) {
    return (
      <div className={styles.limitNotice}>
        <p className={styles.limitText}>
          本日の利用回数: {todayCount} / {DAILY_LIMIT}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.limitReached}>
      <p className={styles.limitText}>
        本日の利用上限（{DAILY_LIMIT}回）に達しました。
      </p>
      <p className={styles.limitCount}>
        明日またお楽しみください！
      </p>
    </div>
  );
}
