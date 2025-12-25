# Minstrel Bot

A Discord bot that automatically saves music links shared in a designated channel to a Neon PostgreSQL database, allowing server members to browse and access the collected music library through a companion website. Built with Node.js, Discord.js, and Drizzle ORM.

## Features

- **Automatic Link Saving**: Detects and saves music URLs from YouTube, Spotify, SoundCloud, and Apple Music
- **Song Title Display**: Shows actual song/video titles in commands using platform APIs
- **URL Validation**: Rejects playlists and invalid links with user feedback
- **Duplicate Prevention**: Avoids saving the same URL twice
- **Rate Limiting**: Prevents spam with 5 messages per minute per user
- **Rich Commands**: Supports both slash (/) and prefix (!) commands with embeds
- **Bot Information**: Commands for bot stats, user profiles, and server info
- **Production Ready**: Logging, health checks, graceful shutdown, and environment validation
- **Database Integration**: Uses Drizzle ORM with Neon serverless PostgreSQL
- **Website Integration**: Saved songs displayed on companion website

## Prerequisites

- Node.js 18+
- A Discord Bot Token
- A Neon PostgreSQL database
- A Discord server with a designated song channel

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ABritex/minstrel-bot.git
   cd minstrel-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file with:
   - `DISCORD_TOKEN`: Your Discord bot token
   - `SONG_CHANNEL_ID`: The ID of the channel where songs are shared
   - `DATABASE_URL`: Your Neon database connection string
   - `WEBSITE_URL`: URL of your website for the `!songs` command
   - `HEALTH_PORT`: Port for health check server (optional, defaults to 3000)

## Database Setup

1. Create a Neon PostgreSQL database
2. Run the migrations:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

## Usage

### Starting the Bot

```bash
npm start
```

### Bot Functionality

- **Automatic Saving**: Post music links in the designated channel - they'll be automatically saved to the database
- **Website Access**: Server members can visit your companion website to browse the complete music collection
- **Commands**:
  - `!ping`: Test if the bot is responsive
  - `!songs`: View the website link and recent saved songs

### Supported Platforms

- YouTube (including YouTube Music)
- Spotify
- SoundCloud
- Apple Music

Playlists are not supported and will be rejected.

## Development

### Adding New Commands

Commands support both slash and prefix modes. Create files in `src/commands/` following this structure:

```javascript
export default new Command({
  name: 'newcommand',
  description: 'Command description',
  category: 'info',
  run: async ({ interaction }) => {
    await interaction.followUp('Slash response');
  },
  prefixRun: async ({ message }) => {
    await message.reply('Prefix response');
  },
});
```

Commands are automatically loaded on startup.

### Database Schema

The `songs` table stores:
- `id`: Auto-incrementing primary key
- `serverId`: Discord server ID
- `channelId`: Discord channel ID
- `messageId`: Discord message ID
- `userId`: Discord user ID
- `url`: The music URL
- `platform`: Detected platform (YouTube, Spotify, etc.)

## Deployment

### Render

1. Connect your GitHub repository to Render
2. Set build command: (leave empty)
3. Set start command: `npm start`
4. Configure environment variables in Render dashboard
5. Set health check path: `/health`

### Environment Variables

| Variable          | Description                     | Required              |
| ----------------- | ------------------------------- | --------------------- |
| `DISCORD_TOKEN`   | Discord bot token               | Yes                   |
| `SONG_CHANNEL_ID` | Channel ID for song sharing     | Yes                   |
| `DATABASE_URL`    | Neon database connection string | Yes                   |
| `WEBSITE_URL`     | Website URL for !songs command  | Yes                   |
| `HEALTH_PORT`     | Health check server port        | No (defaults to 3000) |
| `PORT`            | Render-assigned port            | No (used by Render)   |

## Health Checks

The bot includes a health check endpoint at `http://localhost:3000/health` (or configured port) that returns JSON status.

## Logging

Logs are written to:
- Console (colorized)
- `logs/error.log` (errors only)
- `logs/combined.log` (all logs)

## License

[MIT License](LICENSE)