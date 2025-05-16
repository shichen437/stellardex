import { create } from "zustand";
import { groupList } from "@/api/group";
import { Group } from "@/lib/types/group";
import { GROUP_KEY } from "./consts";

interface GroupState {
  groups: Group[];
  groupsLoaded: boolean;
  fetchGroups: (refresh?: boolean) => Promise<Group[]>;
  clearGroups: () => void;
}

export const useGroupStore = create<GroupState>((set, get) => ({
  groups: (() => {
    try {
      return JSON.parse(localStorage.getItem(GROUP_KEY) || "[]");
    } catch {
      return [];
    }
  })(),
  groupsLoaded: false,
  async fetchGroups(refresh = true) {
    if (!refresh && get().groupsLoaded && get().groups.length > 0) {
      return get().groups;
    }
    const res = await groupList();
    let groups: Group[] = [];
    if (res?.code === 0) {
      groups = res.data?.rows ?? [];
      set({ groups, groupsLoaded: true });
      localStorage.setItem(GROUP_KEY, JSON.stringify(groups));
    } else {
      set({ groups: [], groupsLoaded: true });
    }
    return groups;
  },
  clearGroups() {
    set({ groups: [], groupsLoaded: false });
    localStorage.removeItem(GROUP_KEY);
  },
}));
