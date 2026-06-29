import { useEffect, useState } from "react";
import PageLayout from "./components/PageLayout";
import { AppPageId } from "./components/AppNavigation";
import { LevelSettingsProvider, useLevelSettings } from "./context/LevelSettingsContext";
import MassRankingPage from "./pages/MassRankingPage";
import SingleRankingPage from "./pages/SingleRankingPage";
import PokedexPage from "./pages/PokedexPage";

const APP_TITLE = "PoGo Rank League";

function AppContent() {
  const [activePage, setActivePage] = useState<AppPageId>("mass-ranking");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { maxLevel } = useLevelSettings();

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 992) setIsMobileMenuOpen(false);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleNavigate(page: AppPageId) {
    setActivePage(page);
    setIsMobileMenuOpen(false);
  }

  function renderActivePage() {
    switch (activePage) {
      case "mass-ranking":
        return <MassRankingPage maxLevel={maxLevel} />;
      case "single-ranking":
        return <SingleRankingPage maxLevel={maxLevel} />;
      case "pokedex":
        return <PokedexPage />;
      default:
        return <MassRankingPage maxLevel={maxLevel} />;
    }
  }

  return (
    <PageLayout
      activePage={activePage}
      isMobileMenuOpen={isMobileMenuOpen}
      isSettingsOpen={isSettingsOpen}
      title={APP_TITLE}
      onNavigate={handleNavigate}
      onOpenSettings={() => setIsSettingsOpen(true)}
      onCloseSettings={() => setIsSettingsOpen(false)}
      onToggleMobileMenu={() => setIsMobileMenuOpen((current) => !current)}
      onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
    >
      {renderActivePage()}
    </PageLayout>
  );
}

export default function App() {
  return (
    <LevelSettingsProvider>
      <AppContent />
    </LevelSettingsProvider>
  );
}
