export function toCodePoints(str: string): string {
    const chars = str.split("");
    const codePoints: string[] = [];

    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        const code = char.charCodeAt(0);

        if (code >= 0xd800 && code <= 0xdbff) {
            const low = chars[i + 1].charCodeAt(0);
            if (low >= 0xdc00 && low <= 0xdfff) {
                codePoints.push(char + chars[i + 1]);
                i++;
                continue;
            }
        }

        codePoints.push(char);
    }

    return codePoints.map((c) => c.codePointAt(0)?.toString(16)).join("-");
}
