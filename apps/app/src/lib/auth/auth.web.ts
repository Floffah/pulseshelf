import AsyncStorage from "@react-native-async-storage/async-storage";

import { SESSION_TOKEN } from "@pulseshelf/lib";

export function getAuthToken() {
    return AsyncStorage.getItem(SESSION_TOKEN);
}

export function setAuthToken(token: string) {
    return AsyncStorage.setItem(SESSION_TOKEN, token);
}
