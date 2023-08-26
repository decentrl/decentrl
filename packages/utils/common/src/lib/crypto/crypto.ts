import * as jose from '@decentrl/jose';

/**
 * @author Filip Skokan
 */

export const encoder = new TextEncoder();
export const decoder = new TextDecoder();

export function concat(...buffers: Uint8Array[]): Uint8Array {
  const size = buffers.reduce((acc, { length }) => acc + length, 0);
  const buf = new Uint8Array(size);
  let i = 0;
  buffers.forEach((buffer) => {
    buf.set(buffer, i);
    i += buffer.length;
  });
  return buf;
}

const MAX_INT32 = 2 ** 32;

function writeUInt32BE(buf: Uint8Array, value: number, offset?: number) {
  if (value < 0 || value >= MAX_INT32) {
    throw new RangeError(
      `value must be >= 0 and <= ${MAX_INT32 - 1}. Received ${value}`
    );
  }
  buf.set([value >>> 24, value >>> 16, value >>> 8, value & 0xff], offset);
}

export function uint32be(value: number) {
  const buf = new Uint8Array(4);
  writeUInt32BE(buf, value);
  return buf;
}

export async function concatKdf(
  secret: Uint8Array,
  bits: number,
  value: Uint8Array
) {
  const iterations = Math.ceil((bits >> 3) / 32);
  const res = new Uint8Array(iterations * 32);
  for (let iter = 0; iter < iterations; iter++) {
    const buf = new Uint8Array(4 + secret.length + value.length);
    buf.set(uint32be(iter + 1));
    buf.set(secret, 4);
    buf.set(value, 4 + secret.length);
    res.set(await jose.digest('sha256', buf), iter * 32);
  }
  return res.slice(0, bits >> 3);
}
export function lengthAndInput(input: Uint8Array) {
  return concat(uint32be(input.length), input);
}
