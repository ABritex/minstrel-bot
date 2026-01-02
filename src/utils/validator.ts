const ALLOWED_DOMAINS: Record<string, string> = {
    "youtube.com": "YouTube",
    "youtu.be": "YouTube",
    "music.youtube.com": "YouTube Music",
    "open.spotify.com": "Spotify",
    "soundcloud.com": "SoundCloud",
    "music.apple.com": "Apple Music"
};

export function isValidSongUrl(url: string): string | null {
    try {
        const urlObj = new URL(url);
        const domain = Object.keys(ALLOWED_DOMAINS).find(domain =>
            urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
        );

        if (!domain) return null;

        // Check for playlists in pathname
        if (urlObj.pathname.includes("playlist")) return null;

        // Check for YouTube playlist in query parameters
        if (urlObj.searchParams.has('list')) {
            return null; // Reject URLs with list parameter (playlists/radio)
        }

        return ALLOWED_DOMAINS[domain];
    } catch {
        return null;
    }
}