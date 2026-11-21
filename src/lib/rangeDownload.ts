export const CHUNK_SIZE_BYTES = 2 * 1024 * 1024; // 2 MiB

export interface ByteRange {
  start: number;
  end: number;
  length: number;
}

export interface ParsedHttpRange {
  start: number;
  end: number;
  chunkLength: number;
}

export type RangeParseResult =
  | { status: 'ok'; range: ParsedHttpRange }
  | { status: 'none' }
  | { status: 'invalid' };

/**
 * Parses an HTTP Range header (`bytes=start-end`) against a known file size.
 * Strictly validates boundaries per RFC 7233.
 */
export function parseRangeHeader(
  rangeHeader: string | undefined,
  fileSize: number,
): RangeParseResult {
  if (!rangeHeader) {
    return { status: 'none' };
  }
  if (!Number.isInteger(fileSize) || fileSize <= 0) {
    return { status: 'invalid' };
  }

  const trimmed = rangeHeader.trim();
  const match = /^bytes=(\d*)-(\d*)$/.exec(trimmed);
  if (!match) {
    return { status: 'invalid' };
  }

  const [, startStr, endStr] = match;
  if (startStr === '' && endStr === '') {
    return { status: 'invalid' };
  }

  let start: number;
  let end: number;

  if (startStr === '') {
    // Suffix byte range: bytes=-N (last N bytes)
    const suffixLength = Number.parseInt(endStr, 10);
    if (!Number.isFinite(suffixLength) || suffixLength <= 0) {
      return { status: 'invalid' };
    }
    start = Math.max(0, fileSize - suffixLength);
    end = fileSize - 1;
  } else {
    start = Number.parseInt(startStr, 10);
    end = endStr === '' ? fileSize - 1 : Number.parseInt(endStr, 10);
    if (!Number.isFinite(start) || !Number.isFinite(end)) {
      return { status: 'invalid' };
    }
    if (start < 0 || start >= fileSize) {
      return { status: 'invalid' };
    }
    if (end >= fileSize) {
      end = fileSize - 1;
    }
    if (end < start) {
      return { status: 'invalid' };
    }
  }

  return {
    status: 'ok',
    range: {
      start,
      end,
      chunkLength: end - start + 1,
    },
  };
}

/**
 * Splits a file of `totalBytes` into contiguous inclusive [start, end] ranges
 * of at most `chunkSize` bytes (default 2 MiB).
 */
export function buildChunkRanges(
  totalBytes: number,
  chunkSize: number = CHUNK_SIZE_BYTES,
): ByteRange[] {
  if (!Number.isInteger(totalBytes) || totalBytes <= 0) {
    throw new RangeError('totalBytes must be a positive integer');
  }
  if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
    throw new RangeError('chunkSize must be a positive integer');
  }

  const ranges: ByteRange[] = [];
  let offset = 0;
  while (offset < totalBytes) {
    const start = offset;
    const end = Math.min(totalBytes - 1, offset + chunkSize - 1);
    ranges.push({
      start,
      end,
      length: end - start + 1,
    });
    offset = end + 1;
  }
  return ranges;
}

/**
 * Parses total file size from an HTTP Content-Range response header
 * (e.g. `bytes 0-2097151/15432100`).
 */
export function parseContentRangeTotal(contentRange: string | null): number | null {
  if (!contentRange) return null;
  const match = /^bytes\s+(\d+)-(\d+)\/(\d+)$/.exec(contentRange.trim());
  if (!match) return null;
  const total = Number.parseInt(match[3], 10);
  return Number.isFinite(total) && total > 0 ? total : null;
}

/**
 * Verifies that downloaded Uint8Array chunks match the exact expected totalBytes
 * byte-for-byte before assembling a downloadable Blob.
 */
export function verifyDownloadedChunks(
  chunks: readonly Uint8Array[],
  expectedTotalBytes: number,
): { ok: boolean; receivedBytes: number; expectedBytes: number } {
  let receivedBytes = 0;
  for (const chunk of chunks) {
    receivedBytes += chunk.byteLength;
  }
  return {
    ok: expectedTotalBytes > 0 && receivedBytes === expectedTotalBytes,
    receivedBytes,
    expectedBytes: expectedTotalBytes,
  };
}

export function formatBytesMB(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function computeProgressPercent(receivedBytes: number, totalBytes: number): number {
  if (totalBytes <= 0) return 0;
  const pct = (receivedBytes / totalBytes) * 100;
  return Math.max(0, Math.min(100, Math.round(pct * 10) / 10));
}
