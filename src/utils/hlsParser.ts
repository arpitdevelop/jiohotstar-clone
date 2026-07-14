export interface HlsStream {
  id: string; // unique identifier
  label: string; // e.g. "1080p", "720p", etc.
  sub?: string; // e.g. "Full HD", "HD", etc.
  resolution: string; // e.g. "1920x1080"
  bandwidth: number;
  url: string; // absolute URL
}

/**
 * Parses a master HLS m3u8 playlist content and extracts individual streams.
 *
 * @param manifestText The raw content of the m3u8 file
 * @param masterUrl The absolute URL of the master playlist
 */
export function parseHlsPlaylist(manifestText: string, masterUrl: string): HlsStream[] {
  const lines = manifestText.split(/\r?\n/);
  const streams: HlsStream[] = [];

  // Calculate base URL for relative URLs
  let baseUrl = "";
  if (masterUrl.includes("/")) {
    baseUrl = masterUrl.substring(0, masterUrl.lastIndexOf("/") + 1);
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("#EXT-X-STREAM-INF:")) {
      const attributes = line.substring("#EXT-X-STREAM-INF:".length);

      // Simple attribute parser (e.g. BANDWIDTH=2149280,RESOLUTION=1280x720,NAME="720")
      const attrMap: Record<string, string> = {};
      const regex = /([A-Z0-9\-]+)=("[^"]*"|[^,]*)/gi;
      let match;
      while ((match = regex.exec(attributes)) !== null) {
        const key = match[1];
        let val = match[2];
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        }
        attrMap[key] = val;
      }

      // Find the URL line: the next non-empty line that doesn't start with '#'
      let url = "";
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j].trim();
        if (nextLine && !nextLine.startsWith("#")) {
          url = nextLine;
          i = j; // Advance outer loop index
          break;
        }
      }

      if (url) {
        // Resolve absolute URL if relative
        let resolvedUrl = url;
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          resolvedUrl = baseUrl + url;
        }

        const resolution = attrMap["RESOLUTION"] || "";
        const name = attrMap["NAME"] || "";
        const bandwidth = parseInt(attrMap["BANDWIDTH"] || "0", 10);

        // Deduce vertical resolution (height)
        let height = 0;
        if (resolution && resolution.includes("x")) {
          height = parseInt(resolution.split("x")[1], 10);
        } else if (name) {
          height = parseInt(name, 10);
        }

        let label = height ? `${height}p` : name || "Unknown";
        let sub = "";

        if (height >= 1080) {
          label = "Full HD";
          sub = "Up to 1080p";
        } else if (height >= 720) {
          label = "HD";
          sub = "Up to 720p";
        } else if (height >= 480) {
          label = "SD";
          sub = "Up to 480p";
        } else if (height <= 360 && height > 0) {
          label = "Data Saver";
          sub = `Up to ${height}p`;
        } else if (height > 0) {
          label = `${height}p`;
        }

        streams.push({
          id: resolution || name || url,
          label,
          sub,
          resolution,
          bandwidth,
          url: resolvedUrl,
        });
      }
    }
  }

  // Sort by bandwidth descending (highest quality first)
  streams.sort((a, b) => b.bandwidth - a.bandwidth);

  return streams;
}
