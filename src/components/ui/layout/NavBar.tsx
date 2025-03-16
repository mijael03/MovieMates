"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/authStore";
import { signOut } from "@/lib/firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearchModalStore } from "@/lib/store/movieStore";
import { Search } from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { isOpen, setIsOpen } = useSearchModalStore();
  
  // Log when the component mounts and when store values change
  useEffect(() => {
    console.log("NavBar: SearchModalStore values:", { isOpen, setIsOpen });
    console.log("NavBar: setIsOpen is a function:", typeof setIsOpen === "function");
  }, [isOpen, setIsOpen]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleOpenSearch = () => {
    console.log("NavBar: handleOpenSearch called, current isOpen:", isOpen);
    console.log("NavBar: About to call setIsOpen(true)");
    setIsOpen(true);
    console.log("NavBar: After calling setIsOpen(true), new isOpen:", isOpen);
    // Note: isOpen won't reflect the new value immediately due to React's state update mechanism
  };

  return (
    <nav className="bg-slate-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-5 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl flex items-center gap-2">
          <img src="/moviemate.png" alt="MovieMate Logo" className="h-15 w-15" />
          MovieMate
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            href="/movies"
            className="hover:text-slate-300 transition-colors"
          >
            Películas
          </Link>
          <Button 
            variant="ghost" 
            onClick={handleOpenSearch} 
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md px-4 py-1.5 flex items-center gap-2 border border-slate-600"
            id="search-button"
          >
            <Search className="h-4 w-4" />
            Search
            <div className="ml-2 flex items-center gap-1 text-xs text-slate-300">
              <span className="px-1 py-0.5 bg-slate-600 rounded text-[10px]">Ctrl</span>
              <span className="px-1 py-0.5 bg-slate-600 rounded text-[10px]">K</span>
            </div>
          </Button>
          <Link href="/chat" className="hover:text-slate-300 transition-colors">
            Chat
          </Link>

          {user ? (
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.photoURL || undefined}
                  alt={user.displayName || "Usuario"}
                />
                <AvatarFallback>
                  {user.displayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" onClick={handleLogout} className="px-4 py-1.5 hover:bg-slate-700">
                Cerrar Sesión
              </Button>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button variant="outline" className="px-4 py-1.5 border-slate-600 hover:bg-slate-700">Iniciar Sesión</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
