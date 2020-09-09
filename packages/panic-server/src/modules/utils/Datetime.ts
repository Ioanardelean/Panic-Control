export function withoutTimestamp(time: any) {
  return time
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
}
