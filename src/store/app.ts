interface AppState {
  tabbarIndex: number;
}

export const useAppStore = defineStore("app", {
  state: (): AppState => {
    return {
      tabbarIndex: 0,
    };
  },
  getters: {
    getTabbarIndex(): number {
      return this.tabbarIndex;
    },
  },
  actions: {
    setTabbarIndex(index: number) {
      this.tabbarIndex = index;
    },
  },
});
