export const randomBytesHex = (length = 32): string => {
  const randomBuffer = new Uint32Array(length);
  const randomValues = window.crypto.getRandomValues(randomBuffer);

  return Array.from(randomValues)
    .map((value: number): string => {
      return value.toString(16);
    })
    .join('');
};
