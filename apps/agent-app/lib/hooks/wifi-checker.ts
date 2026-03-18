import NetInfo from "@react-native-community/netinfo";

export async function checkWifi() {
  const state = await NetInfo.fetch();
  return state.isConnected;
}
