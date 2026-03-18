import NetInfo from "@react-native-community/netinfo";

export async function useWifiChecker() {
  const state = await NetInfo.fetch();
  return state.isConnected;
}
