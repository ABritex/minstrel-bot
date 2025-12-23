const ALLOWED_DOMAINS = {
    "youtube.com": "YouTube",
    "youtu.be": "YouTube",
    "music.youtube.com": "YouTube Music",
    "open.spotify.com": "Spotify",
    "soundcloud.com": "SoundCloud",
    "music.apple.com": "Apple Music"
};

export function isValidSongUrl(url) {
    try {
        const urlObj = new URL(url);
        const domain = Object.keys(ALLOWED_DOMAINS).find(domain =>
            urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
        );
        if (!domain) return false;
        if (urlObj.pathname.includes("playlist")) return false;
        return ALLOWED_DOMAINS[domain];
    } catch {
        return false;
    }
}