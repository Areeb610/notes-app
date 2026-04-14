"use client";

import { Button } from "@/components/ui/button";
import { FileText, Home, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

export default function Navbar() {
  const pathname = usePathname();

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    toast.success("Logged out successfully");
    window.location.href = "/login";
  };

  return (
    <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="bg-linear-to-br from-primary to-purple-600 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              NotesApp
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button
                variant={pathname === "/" ? "default" : "ghost"}
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/notes">
              <Button
                variant={pathname === "/notes" ? "default" : "ghost"}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                My Notes
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
