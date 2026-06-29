import { useEffect } from "react";

import { useLevelSettings } from "../context/LevelSettingsContext";
import Icon from "./Icon";

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { maxLevel, enableXL, bestBuddy, setEnableXL, setBestBuddy } = useLevelSettings();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="settings-modal__header">
          <div>
            <h2 id="settings-modal-title">Configuración</h2>
            <p>Nivel máximo usado por Ranking masivo y Ranking individual durante esta sesión.</p>
          </div>
          <button type="button" className="settings-modal__close" aria-label="Cerrar configuración" onClick={onClose}>
            <Icon name="close" size={18} />
          </button>
        </header>

        <div className="settings-card">
          <div className="settings-card__level">
            <span>Nivel máximo para cálculos</span>
            <strong>{maxLevel}</strong>
          </div>

          <label className="settings-toggle">
            <input
              type="checkbox"
              checked={enableXL}
              onChange={(event) => setEnableXL(event.target.checked)}
            />
            <span>Caramelos XL</span>
          </label>

          {enableXL && (
            <label className="settings-toggle settings-toggle--nested">
              <input
                type="checkbox"
                checked={bestBuddy}
                onChange={(event) => setBestBuddy(event.target.checked)}
              />
              <span>Mejor Compañero</span>
            </label>
          )}
        </div>
      </section>
    </div>
  );
}