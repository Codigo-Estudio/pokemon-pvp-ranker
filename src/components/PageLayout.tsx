import { ReactNode } from "react";
import Icon from "./Icon";
import AppNavigation, { AppPageId } from "./AppNavigation";
import SettingsModal from "./SettingsModal";

type PageLayoutProps = {
  activePage: AppPageId;
  isMobileMenuOpen: boolean;
  title: string;
  children: ReactNode;
  isSettingsOpen: boolean;
  onNavigate: (page: AppPageId) => void;
  onOpenSettings: () => void;
  onCloseSettings: () => void;
  onToggleMobileMenu: () => void;
  onCloseMobileMenu: () => void;
};

export default function PageLayout({
  activePage,
  isMobileMenuOpen,
  title,
  children,
  isSettingsOpen,
  onNavigate,
  onOpenSettings,
  onCloseSettings,
  onToggleMobileMenu,
  onCloseMobileMenu
}: PageLayoutProps) {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-block">
          <img
            className="brand-logo"
            src="/custom-assets/logo-principal.png"
            alt="PoGo Rank League"
          />
          <div className="brand-copy"><h1>{title}</h1></div>
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
        <AppNavigation
          activePage={activePage}
          isMobileMenuOpen={isMobileMenuOpen}
          onNavigate={onNavigate}
          onOpenSettings={onOpenSettings}
        />
      </header>

      {isMobileMenuOpen && <button type="button" className="mobile-nav-backdrop" aria-label="Cerrar menú" onClick={onCloseMobileMenu} />}
      <SettingsModal isOpen={isSettingsOpen} onClose={onCloseSettings} />
      {children}
    </main>
  );
}