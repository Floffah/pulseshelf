import Constants from "expo-constants";

export function getBaseURL() {
    const experienceUrl = new URL(Constants.experienceUrl);

    if (!experienceUrl.hostname.includes("pulseshelf")) {
        return `http://${experienceUrl.hostname}:3000`;
    }
    return "https://pulseshelf.com";
};