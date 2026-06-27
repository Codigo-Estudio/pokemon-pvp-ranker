import Icon from "./Icon";

export type AppPageId = "mass-ranking" | "single-ranking" | "pokedex";

type NavigationItem = {
  id: AppPageId;
  label: string;
  icon: "bars" | "user" | "book";
};

const navigationItems: NavigationItem[] = [
  { id: "mass-ranking", label: "Ranking masivo", icon: "bars" },
  { id: "single-ranking", label: "Ranking individual", icon: "user" },
  { id: "pokedex", label: "Pokédex", icon: "book" }
];

type AppNavigationProps = {
  activePage: AppPageId;
  isMobileMenuOpen: boolean;
  onNavigate: (page: AppPageId) => void;
};

export default function AppNavigation({ activePage, isMobileMenuOpen, onNavigate }: AppNavigationProps) {
  return (
    <nav
      id="main-navigation"
      className={`top-nav${isMobileMenuOpen ? " is-open" : ""}`}
      aria-label="Navegación principal"
    >
      {navigationItems.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`top-nav__item${item.id === activePage ? " is-active" : ""}`}
          aria-current={item.id === activePage ? "page" : undefined}
          onClick={() => onNavigate(item.id)}
        >
          <Icon name={item.icon} size={18} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}