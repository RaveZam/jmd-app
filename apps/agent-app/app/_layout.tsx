import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useSegments, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useRef, useState } from "react";

import { useColorScheme } from "@/hooks/useColorScheme";
import { supabase } from "@/lib/supabase";
import { initDb } from "@/lib/sqlite/db-migration";
import { syncOutbox } from "@/lib/sync/sync-outbox";
import RoutesDao from "@/lib/sqlite/dao/routes-dao";
import ProvincesDao from "@/lib/sqlite/dao/province-dao";
import StoresDao from "@/lib/sqlite/dao/store-dao";
import OutboxDao from "@/lib/sqlite/dao/outbox-dao";
import RouteSessionsDao from "@/lib/sqlite/dao/route-sessions-dao";
import SessionStoresDao from "@/lib/sqlite/dao/session-stores-dao";
import "react-native-get-random-values";
import SelectRouteScreen from "@/src/features/routes/screens/SelectRouteScreen";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const segments = useSegments();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    initDb();
    // console.log("db initialized");
    // RoutesDao.logAll();
    // ProvincesDao.logAll();
    // StoresDao.logAll();
    // OutboxDao.logAll();
    RouteSessionsDao.logAll();
    SessionStoresDao.logAll();
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data?.session ?? null;
        if (!mounted) return;
        const onAuthRoute = segments[0] === "auth";
        if (!session && !onAuthRoute) {
          router.replace("/auth/sign-in");
        } else if (session && onAuthRoute) {
          router.replace("/");
        }
      } catch {
      } finally {
        if (mounted) setCheckingSession(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segments]);

  useEffect(() => {
    if (checkingSession) return;
    syncOutbox();
    console.log("syncing outbox");
    const interval = setInterval(syncOutbox, 10_000);
    return () => clearInterval(interval);
  }, [checkingSession]);

  if (!loaded || checkingSession) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/sign-in" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
