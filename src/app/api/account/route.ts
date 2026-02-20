import { createClient } from "@supabase/supabase-js";
import { getAuthenticatedUser } from "@/lib/auth";
import { unauthorized, serverError } from "@/lib/api-error";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    // 1. 認証チェック
    const auth = await getAuthenticatedUser();
    if (auth.error || !auth.user) {
      return unauthorized();
    }
    const { user, supabase } = auth;

    // 2. Service Role Key で Admin クライアントを作成
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 3. ユーザーを削除（CASCADE で関連データも全削除）
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
      user.id
    );

    if (deleteError) {
      console.error("アカウント削除失敗:", deleteError);
      return serverError("アカウントの削除に失敗しました");
    }

    // 4. セッションを破棄
    await supabase.auth.signOut();

    // 5. レスポンス
    return NextResponse.json({ message: "アカウントを削除しました" });
  } catch (error) {
    console.error("アカウント削除APIエラー:", error);
    return serverError("アカウントの削除に失敗しました");
  }
}
