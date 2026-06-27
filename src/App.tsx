import { useEffect, useState } from "react";
import PageLayout from "./components/PageLayout";
import { AppPageId } from "./components/AppNavigation";
import MassRankingPage from "./pages/MassRankingPage";
import SingleRankingPage from "./pages/SingleRankingPage";
import PokedexPage from "./pages/PokedexPage";

const pageTitles: Record<AppPageId, string> = {
  "mass-ranking": "Pokémon PvP Rank Simulator",
  "single-ranking": "Ranking individual",
  pokedex: "Pokédex"
};

export default function App() {
  const [activePage, setActivePage] = useState<AppPageId>("mass-ranking");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        return <MassRankingPage />;
      case "single-ranking":
        return <SingleRankingPage />;
      case "pokedex":
        return <PokedexPage />;
      default:
        return <MassRankingPage />;
    }
  }

  return (
    <PageLayout
      activePage={activePage}
      isMobileMenuOpen={isMobileMenuOpen}
      title={pageTitles[activePage]}
      onNavigate={handleNavigate}
      onToggleMobileMenu={() => setIsMobileMenuOpen((current) => !current)}
      onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
    >
      {renderActivePage()}
    </PageLayout>
  );
}
