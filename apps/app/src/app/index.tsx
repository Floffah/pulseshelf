import { Redirect } from "expo-router";
import { css, html } from "react-strict-dom";

import { Heading } from "@/components/ui/Heading";
import { useUser } from "@/state/user";

export default function LoginPage() {
    const user = useUser();

    if (user.isAuthenticated) {
        return <Redirect href="/home" />;
    }

    return (
        <html.main style={styles.container}>
            <Heading level={1}>Login</Heading>
        </html.main>
    );
}

const styles = css.create({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
    },
});
