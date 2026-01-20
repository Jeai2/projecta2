import React from "react";
import { Header } from "./Header";

interface GeneralLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogoClick: () => void;
}

export const GeneralLayout = ({
  children,
  currentPage,
  onNavigate,
  onLogoClick,
}: GeneralLayoutProps) => {
  return (
    <div className="bg-background-main min-h-screen text-text-light">
      <Header
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogoClick={onLogoClick}
      />
      <main className="w-full pt-16">{children}</main>
    </div>
  );
};
