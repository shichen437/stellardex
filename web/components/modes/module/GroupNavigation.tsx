import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Group } from "@/lib/types/group";

import { useEffect, useState } from "react";

interface GroupNavigationProps {
  groups: Group[];
  selectedGroupId: number | null;
  onGroupSelect: (groupId: number) => void;
  onAddGroupItem: (groupId: number) => void;
}

const getDisplayText = (text: string) => {
  let length = 0;
  let result = '';
  for (const char of text) {
    if (/[\u4e00-\u9fa5]/.test(char)) {
      length += 1;
    } else {
      length += 0.5;
    }
    result += char;
    if (length >= 4) {
      return result + '...';
    }
  }
  return result;
};

export function GroupNavigation({ groups, selectedGroupId, onGroupSelect, onAddGroupItem }: GroupNavigationProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <TooltipProvider>
      <div className="fixed left-4 top-1/2 -translate-y-1/2 bg-gray-50/80 dark:bg-black/80 backdrop-blur-sm rounded-lg shadow-lg p-2 space-y-1.5 z-50 max-h-[calc(2.5rem*7)] overflow-isShow overflow-x-isShow [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {groups
          .filter(group => group.isShow)
          .map(group => (
            <div key={group.id} className="relative group overflow-isShow">
              {group.groupName.length > getDisplayText(group.groupName).length ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => onGroupSelect(group.id)}
                      variant="ghost"
                      className={`w-full text-center px-3 py-1.5 rounded-md transition-all duration-200 text-sm ${selectedGroupId === group.id
                          ? 'bg-blue-50/80 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/30'
                        }`}
                    >
                      {getDisplayText(group.groupName)}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    align="center"
                    sideOffset={5}
                    className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-3 py-1.5 text-sm rounded-md shadow-md border border-gray-100/50 dark:border-gray-700/50"
                  >
                    <p className="text-gray-700 dark:text-gray-300">{group.groupName}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Button
                  onClick={() => onGroupSelect(group.id)}
                  variant="ghost"
                  className={`w-full text-center px-3 py-1.5 rounded-md transition-all duration-200 text-sm ${selectedGroupId === group.id
                      ? 'bg-blue-50/80 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-700/30'
                    }`}
                >
                  {group.groupName}
                </Button>
              )}
              <button
                onClick={() => onAddGroupItem(group.id)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[calc(100%+8px)] px-1.5 py-1 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-md bg-gray-50/90 dark:bg-gray-800/90 hover:bg-gray-100 dark:hover:bg-gray-700 z-[60]"
              >
                <Plus className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          ))}
      </div>
    </TooltipProvider>
  );
}