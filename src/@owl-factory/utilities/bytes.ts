
/**
 * Converts plain bytes as a number into a more human readable number with matching unit
 * @param bytes The raw bytes to convert into a smaller, readable value
 */
export function bytesToReadable(bytes: number): string {
  const units = [ "B", "KB", "MB", "GB" ];
  let readableBytes = bytes;
  for (let i = 0; i < units.length; i++) {
    if (readableBytes < 1024) { return `${readableBytes.toFixed(2).replace(/\.00/, "")} ${units[i]}`; }
    readableBytes = readableBytes / 1024;
  }
  return `${readableBytes.toFixed(2).replace(/\.00/, "")} TB`;
}
