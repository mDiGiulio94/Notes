// import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AppState from "./AppState/AppState";

// import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    // <Stack>
    //   <Stack.Screen name="index" />
    // </Stack>
    <>
      <StatusBar backgroundColor="yellow" />
      <AppState />
    </>
  );
}
