"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/authStore";
import { signOut } from "@/lib/firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearchModalStore } from "@/lib/store/movieStore";
import { Menu, Search, X, EyeIcon } from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { isOpen, setIsOpen } = useSearchModalStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-slate-800 text-white shadow-md fixed top-0 left-0 right-0 z-[100]">
      <div className="container mx-auto px-4 py-5 flex justify-between items-center relative z-50">
        <Link href="/" className="font-bold text-xl flex items-center gap-2">
          <img src="/moviemate.png" alt="MovieMate Logo" className="h-15 w-15" />
          MovieMate
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center text-slate-200 hover:text-white"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/movies"
            className="hover:text-slate-300 transition-colors"
          >
            Películas
          </Link>
          {user && (
            <Link href="/watched-movies" className="hover:text-slate-300 transition-colors flex items-center gap-2">
              <EyeIcon className="w-4 h-4" />
              Películas Vistas
            </Link>
          )}
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

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <>
            <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[40]" onClick={toggleMobileMenu}></div>
            <div className="md:hidden fixed top-20 left-0 right-0 bg-slate-800 shadow-lg z-[41] p-4 border-t border-slate-700">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/movies"
                  className="hover:text-slate-300 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Películas
                </Link>
                {user && (
                  <Link
                    href="/watched-movies"
                    className="hover:text-slate-300 transition-colors py-2 flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <EyeIcon className="w-4 h-4" />
                    Películas Vistas
                  </Link>
                )}
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleOpenSearch();
                    setMobileMenuOpen(false);
                  }}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md px-4 py-3 flex items-center gap-2 border border-slate-600 w-full justify-start"
                >
                  <Search className="h-4 w-4" />
                  Search
                </Button>
                <Link
                  href="/chat"
                  className="hover:text-slate-300 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Chat
                </Link>

                {user ? (
                  <div className="flex flex-col space-y-3 pt-2 border-t border-slate-700">
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
                      <span>{user.displayName || user.email}</span>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-slate-700 w-full text-left"
                    >
                      Cerrar Sesión
                    </Button>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="outline" className="px-4 py-2 border-slate-600 hover:bg-slate-700 w-full">Iniciar Sesión</Button>
                  </Link>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
