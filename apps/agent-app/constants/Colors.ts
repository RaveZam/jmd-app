/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#1F6B46";
const tintColorDark = "#288A5B";

export const Colors = {
  light: {
    text: "#0F172A",
    background: "#F0F0EB",
    tint: tintColorLight,
    icon: "#64748B",
    tabIconDefault: "#64748B",
    tabIconSelected: tintColorLight,
    border: "#E2E8F0",
  },
  dark: {
    text: "#F8FAFC",
    background: "#020817",
    tint: tintColorDark,
    icon: "#64748B",
    tabIconDefault: "#64748B",
    tabIconSelected: tintColorDark,
    border: "#1E293B",
  },
};
