import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CHUNK_SIZE_BYTES,
  buildChunkRanges,
  computeProgressPercent,
  formatBytesMB,
  parseContentRangeTotal,
  parseRangeHeader,
  verifyDownloadedChunks,
} from './rangeDownload';

test('parseRangeHeader handles standard inclusive byte ranges', () => {
  const res = parseRangeHeader('bytes=0-2097151', 10_000_000);
  assert.equal(res.status, 'ok');
  if (res.status === 'ok') {
    assert.equal(res.range.start, 0);
    assert.equal(res.range.end, 2097151);
    assert.equal(res.range.chunkLength, CHUNK_SIZE_BYTES);
  }
});

test('parseRangeHeader clamps end to fileSize - 1 and handles open-ended ranges', () => {
  const openEnded = parseRangeHeader('bytes=500-', 1000);
  assert.equal(openEnded.status, 'ok');
  if (openEnded.status === 'ok') {
    assert.deepEqual(openEnded.range, { start: 500, end: 999, chunkLength: 500 });
  }

  const clamped = parseRangeHeader('bytes=900-5000', 1000);
  assert.equal(clamped.status, 'ok');
  if (clamped.status === 'ok') {
    assert.deepEqual(clamped.range, { start: 900, end: 999, chunkLength: 100 });
  }
});

test('parseRangeHeader rejects invalid or out-of-bounds ranges', () => {
  assert.equal(parseRangeHeader(undefined, 1000).status, 'none');
  assert.equal(parseRangeHeader('bytes=1000-1200', 1000).status, 'invalid');
  assert.equal(parseRangeHeader('bytes=500-400', 1000).status, 'invalid');
  assert.equal(parseRangeHeader('items=0-10', 1000).status, 'invalid');
});

test('buildChunkRanges tiles exact 2 MiB chunks without gaps or overlaps', () => {
  const totalBytes = 5 * 1024 * 1024 + 12345;
  const ranges = buildChunkRanges(totalBytes, CHUNK_SIZE_BYTES);
  assert.equal(ranges.length, 3);
  assert.equal(ranges[0].start, 0);
  assert.equal(ranges[0].end, CHUNK_SIZE_BYTES - 1);
  assert.equal(ranges[1].start, CHUNK_SIZE_BYTES);
  assert.equal(ranges[1].end, 2 * CHUNK_SIZE_BYTES - 1);
  assert.equal(ranges[2].start, 2 * CHUNK_SIZE_BYTES);
  assert.equal(ranges[2].end, totalBytes - 1);

  let covered = 0;
  for (let i = 0; i < ranges.length; i++) {
    if (i > 0) {
      assert.equal(ranges[i].start, ranges[i - 1].end + 1);
    }
    covered += ranges[i].length;
  }
  assert.equal(covered, totalBytes);
});

test('verifyDownloadedChunks verifies exact byte-for-byte completeness', () => {
  const c1 = new Uint8Array(1024);
  const c2 = new Uint8Array(512);
  assert.deepEqual(verifyDownloadedChunks([c1, c2], 1536), {
    ok: true,
    receivedBytes: 1536,
    expectedBytes: 1536,
  });
  assert.deepEqual(verifyDownloadedChunks([c1, c2], 1537), {
    ok: false,
    receivedBytes: 1536,
    expectedBytes: 1537,
  });
});

test('parseContentRangeTotal and formatting helpers work accurately', () => {
  assert.equal(parseContentRangeTotal('bytes 0-2097151/14680064'), 14680064);
  assert.equal(parseContentRangeTotal('invalid'), null);
  assert.equal(formatBytesMB(2 * 1024 * 1024), '2.00 MB');
  assert.equal(computeProgressPercent(1024, 2048), 50);
  assert.equal(computeProgressPercent(2500, 2048), 100);
});
