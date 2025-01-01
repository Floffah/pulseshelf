import { $ } from "bun";

if (process.env.EXPO_CI === "1") {
    await $`bun run build --filter=@pulseshelf/app`
}