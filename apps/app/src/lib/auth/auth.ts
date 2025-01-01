import * as SecureStore from "expo-secure-store"
import {SESSION_TOKEN} from "@pulseshelf/lib";

export function getAuthToken() {
    return SecureStore.getItemAsync(SESSION_TOKEN)
}

export function setAuthToken(token: string) {
    return SecureStore.setItemAsync(SESSION_TOKEN, token)
}