import { ReactNode } from "react";
import Icon from "./Icon";
import AppNavigation, { AppPageId } from "./AppNavigation";

type PageLayoutProps = {
  activePage: AppPageId;
  isMobileMenuOpen: boolean;
  title: string;
  children: ReactNode;
  onNavigate: (page: AppPageId) => void;
  onToggleMobileMenu: () => void;
  onCloseMobileMenu: () => void;
};

export default function PageLayout({
  activePage,
  isMobileMenuOpen,
  title,
  children,
  onNavigate,
  onToggleMobileMenu,
  onCloseMobileMenu
}: PageLayoutProps) {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-block">
          <div className="brand-mark" aria-hidden="true"><span>GO</span></div>
          <div><h1>{title}</h1></div>
        </div>
        <button
          type="button"
          className="nav-toggle"
          aria-label={isMobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="main-navigation"
          onClick={onToggleMobileMenu}
        >
          <Icon name={isMobileMenuOpen ? "close" : "bars"} size={20} />
        </button>
        <AppNavigation activePage={activePage} isMobileMenuOpen={isMobileMenuOpen} onNavigate={onNavigate} />
      </header>

      {isMobileMenuOpen && <button type="button" className="mobile-nav-backdrop" aria-label="Cerrar menú" onClick={onCloseMobileMenu} />}
      {children}
    </main>
  );
}