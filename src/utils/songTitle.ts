interface OEmbedResponse {
    title?: string;
}

export async function getSongTitle(url: string, platform: string): Promise<string> {
    try {
        if (platform === 'YouTube' || platform === 'YouTube Music') {
            const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1];
            if (videoId) {
                const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
                const data = await response.json() as OEmbedResponse;
                return data.title || 'Unknown Title';
            }
        } else if (platform === 'Spotify') {
            const response = await fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`);
            const data = await response.json() as OEmbedResponse;
            return data.title || 'Unknown Title';
        } else if (platform === 'SoundCloud') {
            const response = await fetch(`https://soundcloud.com/oembed?url=${encodeURIComponent(url)}&format=json`);
            const data = await response.json() as OEmbedResponse;
            return data.title || 'Unknown Title';
        } else if (platform === 'Apple Music') {
            const response = await fetch(`https://music.apple.com/oembed?url=${encodeURIComponent(url)}`);
            const data = await response.json() as OEmbedResponse;
            return data.title || 'Unknown Title';
        }
        // For other platforms, return the platform name
        return platform;
    } catch (error) {
        console.error('Error fetching song title:', error);
        return platform;
    }
}