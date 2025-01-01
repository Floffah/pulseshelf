import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

import { TRPCProvider } from "@/providers/TRPCProvider";

export default function Root() {
    const scheme = useColorScheme();

    return (
        <TRPCProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: scheme === "dark" ? "#111827" : "#fff",
                    },
                    contentStyle: {
                        backgroundColor: scheme === "dark" ? "#030712" : "#fff",
                    },
                }}
            />
            <StatusBar
                style="auto"
                backgroundColor={scheme === "dark" ? "#111827" : "#fff"}
            />
        </TRPCProvider>
    );
}
