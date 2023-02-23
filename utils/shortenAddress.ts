export function shortenAddress(
  address: string,
  startLength = 6,
  endLength = 4
) {
  if (address.length <= startLength + endLength) {
    return address;
  }
  return `${address.slice(0, startLength)}...${address.slice(-1 * endLength)}`;
}
