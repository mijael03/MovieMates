"use client"
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">MovieChat</h3>
            <p className="text-slate-300">
              Una aplicación para amantes del cine donde puedes chatear y
              compartir reseñas.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/movies"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Películas
                </Link>
              </li>
              <li>
                <Link
                  href="/chat"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Chat
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Créditos</h3>
            <p className="text-slate-300">
              Datos de películas proporcionados por{" "}
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                TMDB
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-700 text-center text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} MovieChat. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
