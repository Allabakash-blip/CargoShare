import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
      className="p-3 rounded-xl hover:bg-slate-100 transition"
    >
      {theme === "dark" ? (
        <Sun size={22} className="text-yellow-500" />
      ) : (
        <Moon size={22} className="text-slate-700" />
      )}
    </button>
  );
}