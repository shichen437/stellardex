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
      {settings.interfaceConfig?.bgImage && (
        <div
          className="fixed inset-0 w-full h-full -z-10 before:fixed before:inset-0 before:w-full before:h-full before:bg-black/5 dark:before:bg-black/30"
          style={{
            backgroundImage: `url(${process.env.NEXT_PUBLIC_API_PREFIX}${settings.interfaceConfig.bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: `blur(${settings.interfaceConfig?.bgImageBlurred || 0}px)`,
          }}
        />
      )}

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
