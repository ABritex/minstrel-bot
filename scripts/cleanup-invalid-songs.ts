// scripts/cleanup-playlists.ts
import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from '../src/config';

async function cleanup() {
    const sql = neon(DATABASE_URL);

    console.log('Finding playlist URLs...');
    const playlistSongs = await sql`
        SELECT id, url FROM songs
        WHERE url LIKE '%list=%' OR url LIKE '%playlist%'
    `;

    console.log(`Found ${playlistSongs.length} playlist URLs:`);
    playlistSongs.forEach(song => {
        console.log(`  ID ${song.id}: ${song.url}`);
    });

    console.log('\nDeleting playlist URLs...');
    const result = await sql`
        DELETE FROM songs
        WHERE url LIKE '%list=%' OR url LIKE '%playlist%'
        RETURNING id
    `;

    console.log(`✅ Deleted ${result.length} playlist URLs`);
    process.exit(0);
}

cleanup().catch(error => {
    console.error('Error:', error);
    process.exit(1);
});