"use client";

import Link from "next/link";
import { Home, Settings } from "lucide-react";
import { LuFolders } from "react-icons/lu";
import { MdOutlineWork } from "react-icons/md";

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: LuFolders, label: "Chrono Vault", href: "/chrono-vault" },
  { icon: MdOutlineWork, label: "Workspace", href: "/workspace" },
];

export default function Sidebar() {
  return (
    <aside className="h-screen w-20 bg-sidebar text-white flex flex-col items-center py-4">
      {menuItems.map(({ icon: Icon, label, href }) => (
        <Link key={href} href={href} className="flex flex-col items-center gap-1 p-4 hover:bg-gray-800 w-full">
          <Icon className="w-8 h-8" />
          <span className="text-xs">{label}</span>
        </Link>
      ))}
    </aside>
  );
}