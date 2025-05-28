import { useState, useEffect } from "react";
import type { SearchEngine } from "@/lib/types/settings";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePolyglot } from "@/providers/PolyglotProvider";

interface SearchBarProps {
  searchEngine: SearchEngine;
  searchEngineLogo: Record<SearchEngine, string>;
  onSearchEngineChange?: (engine: SearchEngine) => void;
}

export function SearchBar({
  searchEngine: defaultEngine,
  searchEngineLogo,
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentEngine, setCurrentEngine] =
    useState<SearchEngine>(defaultEngine);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t } = usePolyglot();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchUrls = {
      baidu: `https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery)}`,
      google: `https://www.google.com/search?q=${encodeURIComponent(
        searchQuery
      )}`,
      bing: `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`,
      yandex: `https://yandex.com/search/?text=${encodeURIComponent(searchQuery)}`,
      yahoo: `https://search.yahoo.com/search?p=${encodeURIComponent(searchQuery)}`,
      github: `https://www.github.com/search?q=${encodeURIComponent(searchQuery)}&type=repositories`
    };
    window.open(searchUrls[currentEngine], "_blank");
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-0">
      <div className="relative">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("common.placeholder.search")}
            className="w-full pl-16 pr-12 py-4 rounded-2xl
                     focus:outline-none
                     bg-popover/60 dark:bg-popover/80
                     text-gray-900 dark:text-gray-100
                     shadow-lg text-lg"
          />
          <Button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            variant="ghost"
            size="sm"
            className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 hover:bg-transparent dark:hover:bg-transparent bg-transparent dark:bg-transparent !bg-transparent dark:!bg-transparent"
            style={{ backgroundColor: "transparent" }}
          >
            <Image
              src={`/search-engines/${currentEngine}.png`}
              alt={currentEngine}
              width={24}
              height={24}
              className="w-5 h-5"
            />
          </Button>
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 cursor-pointer"
            onClick={handleSearch}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </form>

        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute top-full left-0 right-0 mt-1 bg-popover/60 dark:bg-popover/80 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-20">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t("other.searchEngine")}
                </h3>
              </div>
              <div className="p-2 grid grid-cols-6 gap-2">
                {(["baidu", "google", "bing", "yandex", "yahoo", "github"] as SearchEngine[]).map(
                  (engine) => (
                    <button
                      key={engine}
                      type="button"
                      onClick={() => {
                        setCurrentEngine(engine);
                        setShowDropdown(false);
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl transition-colors
                      ${engine === currentEngine
                          ? "bg-zinc-200/70 dark:!bg-zinc-500/70"
                          : "hover:bg-zinc-200/70 dark:hover:!bg-zinc-500/70"
                      }`}
                    >
                      <Image
                        src={`/search-engines/${engine}.png`}
                        alt={engine}
                        width={28}
                        height={28}
                        className="w-8 h-8 mb-2"
                      />
                      <span className="text-sm text-center">
                        {searchEngineLogo[engine]}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
