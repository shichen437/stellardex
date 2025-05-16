import { SearchBar } from "@/components/modes/module/SearchBar";
import { SEARCH_ENGINE_LOGO } from "@/lib/search";
import { useSettingsStore } from "@/lib/store/settings";
import { useEffect, useState } from "react";

export function SimpleModeView() {
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center -mt-32">
      <div className="w-full max-w-3xl px-4">
        <div className="transform scale-110">
          {mounted && (
            <SearchBar
              searchEngine={settings.moduleConfig.searchEngine}
              searchEngineLogo={SEARCH_ENGINE_LOGO}
              onSearchEngineChange={(engine) =>
                updateSettings({
                  ...settings,
                  moduleConfig: {
                    ...settings.moduleConfig,
                    searchEngine: engine,
                  },
                })
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
