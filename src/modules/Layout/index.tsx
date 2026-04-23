import React from "react";
import { SistematizeLogo } from "@/src/components/branding/SistematizeLogo";
import { Header } from "../Header";
import { Footer } from "../Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F7F9FF] font-sans text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-72 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(247,249,255,0)_100%)]" />
        <div className="absolute -left-28 top-24 h-80 w-80 rounded-full bg-[rgba(37,136,245,0.16)] blur-3xl" />
        <div className="absolute -right-24 top-16 h-[26rem] w-[26rem] rounded-full bg-[rgba(142,34,255,0.14)] blur-3xl" />
        <div className="absolute left-1/2 top-32 hidden -translate-x-1/2 opacity-[0.055] lg:block">
          <SistematizeLogo lockup="symbol" className="h-[24rem] w-[24rem]" />
        </div>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col w-full px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
