import { FaChevronDown } from "react-icons/fa";
import { useState } from "react";

export default function ThemeDropdown({ onThemeChange }) {
  const [open, setOpen] = useState(false);

  const changeTheme = (theme) => {
    onThemeChange(theme);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        style={{ backgroundColor: "var(--portfolio-badge-bg)", color: "var(--portfolio-text)" }}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-white"
      >
        Theme <FaChevronDown size={12} />
      </button>

      
      {open && (
        <div className="absolute mt-2 w-40 rounded-xl shadow-lg z-50 border" style={{ backgroundColor: "var(--portfolio-pill-bg)", borderColor: "var(--portfolio-accent-border)", backdropFilter: "blur(12px)" }}>
          <ul className="text-sm" style={{ color: "var(--portfolio-text)" }}>
            <li
              onClick={() => changeTheme("violet")}
              className="px-4 py-2 cursor-pointer rounded-t-xl hover:opacity-80"
            >
              🟣 Violet
            </li>
            <li
              onClick={() => changeTheme("yellow")}
              className="px-4 py-2 cursor-pointer rounded-b-xl hover:opacity-80"
            >
              🟡 Yellow
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}