import React from "react";
import { Header } from "../Header";
import { Footer } from "../Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      <Header />
      <main className="flex-1 flex flex-col w-full px-4 sm:px-6 lg:px-8 py-6 max-w-5xl mx-auto">{children}</main>
      <Footer />
    </div>
  );
}
