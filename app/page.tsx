"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center h-screen">
      <Button
        className="absolute bottom-24 right-4"
        onClick={() => router.push("/settings")}
      >
        Settings
      </Button>
      <Button
        className="absolute bottom-24 right-4"
        onClick={() => router.push("/chrono-vault")}
      >
        Vault
      </Button>
          
    </div>
  );
}
