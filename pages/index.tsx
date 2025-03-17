import React, { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "antd";
import { useRouter } from "next/router";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <p>Welcome, {session?.user?.name}</p>
      <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
    </div>
  );
}
