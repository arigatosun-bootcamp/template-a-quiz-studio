import Header from "./Header";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Header userEmail={user?.email} />
      <main style={{ minHeight: "calc(100vh - 56px)", padding: "1.5rem" }}>
        {children}
      </main>
    </>
  );
}
