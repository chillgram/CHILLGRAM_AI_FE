import { create } from "zustand";

const initialState = {
  instagramAccount: {
    connected: false,
    username: "",
    followers: 0,
  },
  youtubeAccount: {
    connected: false,
    channelName: "",
    subscribers: 0,
  },
};

const normalizeIg = (ig) => ({
  connected: Boolean(ig?.connected),
  username: ig?.username || ig?.accountLabel || "",
  followers: Number(ig?.followers || 0),
});

const normalizeYt = (yt) => ({
  connected: Boolean(yt?.connected),
  channelName: yt?.accountLabel || yt?.channelName || "",
  subscribers: Number(yt?.subscribers || 0),
});

const useSnsStore = create((set) => ({
  ...initialState,

  /**
   * payload
   * {
   *   youtube: { connected, accountLabel, subscribers },
   *   instagram: { connected, username, followers }
   * }
   */
  setAccountsFromServer: (payload) =>
    set(() => ({
      instagramAccount: normalizeIg(payload?.instagram),
      youtubeAccount: normalizeYt(payload?.youtube),
    })),

  /**
   * 선택: 강제 초기화
   */
  resetAccounts: () => set({ ...initialState }),
}));

export default useSnsStore;
