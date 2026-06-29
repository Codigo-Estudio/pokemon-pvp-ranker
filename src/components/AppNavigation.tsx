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
  onOpenSettings: () => void;
};

export default function AppNavigation({ activePage, isMobileMenuOpen, onNavigate, onOpenSettings }: AppNavigationProps) {
  return (
    <nav
      id="main-navigation"
      className={`top-nav${isMobileMenuOpen ? " is-open" : ""}`}
      aria-label="Navegación principal"
    >
      <div className="top-nav__pages">
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
      </div>
      <button
        type="button"
        className="top-nav__settings"
        aria-label="Abrir configuración"
        onClick={onOpenSettings}
      >
        <Icon name="settings" size={18} />
      </button>
    </nav>
  );
}