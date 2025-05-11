"use client";

import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Folder } from "lucide-react";
import { DatabaseManager } from "./_components/Database-manager";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaArrowRightLong } from "react-icons/fa6";
import { BaseDirectoryDialog } from "./_components/BaseDirectoryDialog";

export default function SettingsPage() {
  const [baseDirectory, setBaseDirectory] = useState<string | null>(null);
  const [baseDirectoryDialogOpen, setBaseDirectoryDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadBaseDirectory = async () => {
      try {
        const dir = await invoke<string | null>("get_last_directory");
        setBaseDirectory(dir);
      } catch (error) {
        console.error("Error loading base directory:", error);
      }
    };
    loadBaseDirectory();
  }, []);

  const handleDirectorySet = async () => {
    try {
      const dir = await invoke<string | null>("get_last_directory");
      setBaseDirectory(dir);
    } catch (error) {
      console.error("Error updating base directory:", error);
    }
  };

  return (
    <div className="flex px-6">
      <div className="w-1/2">
        <img src="/Folder-art.svg" alt="Folder Art" width={650} />
      </div>
      <div className="w-1/2 mt-12">
        <div className="flex items-center gap-4">
          <img src="/ChronosLogo.svg" alt="Logo" width={100} />
          <div className="flex-col">
            <h1 className="text-5xl font-bold">Welcome to Chronos!</h1>
            <p className="text-xl mt-4 text-foreground-muted">
              Your study space, with everything in one place.
            </p>
          </div>
        </div>
        {baseDirectory ? (
          <div className="mt-12">
            <DatabaseManager
              baseDirectory={baseDirectory}
              onBaseDirectoryChange={handleDirectorySet}
              baseDirectoryDialogOpen={baseDirectoryDialogOpen}
              setBaseDirectoryDialogOpen={setBaseDirectoryDialogOpen}
            />
            <Button
              className="absolute bottom-24 right-4"
              onClick={() => router.push("/")}
            >
              <div className="flex items-center gap-2">
                <span>Continue to Chronos</span>
                <FaArrowRightLong size={20} />
              </div>
            </Button>
          </div>
        ) : (
          <div
            className="mt-12 p-6 border-2 border-dashed rounded-lg"
            style={{ borderColor: "#2DDA7B", height: "400px" }}
          >
            <Button
              className="flex items-center justify-center w-full h-[280px] p-0 bg-transparent border-none outline-none"
              onClick={() => setBaseDirectoryDialogOpen(true)}
            >
              <Folder
                style={{ fill: "#2DDA7B", color: "#2DDA7B" }}
                className="w-60 h-60"
              />
            </Button>
            <p className="mt-4 text-center" style={{ color: "#2DDA7B" }}>
              Select a folder to save your database
            </p>
          </div>
        )}

        <BaseDirectoryDialog
          open={baseDirectoryDialogOpen}
          onOpenChange={setBaseDirectoryDialogOpen}
          onDirectorySet={handleDirectorySet}
          currentDirectory={baseDirectory}
        />

      </div>
    </div>
  );
}
