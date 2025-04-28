"use client";

import Link from "next/link";
import { Home, Settings } from "lucide-react";
import { LuFolders } from "react-icons/lu";


const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: LuFolders, label: "Chrono Vault", href: "/chrono-vault" },
];

export default function Sidebar() {
  return (
    <aside className="h-screen w-20 bg-gray-900 text-white flex flex-col items-center py-4">
      <div className="mb-4">
        <img src="/App Logo.svg" alt="App Logo" height={60} width={60} />
      </div>
      {menuItems.map(({ icon: Icon, label, href }) => (
        <Link key={href} href={href} className="flex flex-col items-center gap-1 p-4 hover:bg-gray-800 w-full">
          <Icon className="w-8 h-8" />
          <span className="text-xs">{label}</span>
        </Link>
      ))}
    </aside>
  );
}