import { useCallback, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Download, Loader2, AlertCircle, Copy, Check, ExternalLink } from 'lucide-react';
import {
  CHUNK_SIZE_BYTES,
  buildChunkRanges,
  computeProgressPercent,
  formatBytesMB,
  parseContentRangeTotal,
  verifyDownloadedChunks,
} from './lib/rangeDownload';

type DownloadPhase = 'idle' | 'downloading' | 'verified' | 'error';

interface DownloadState {
  phase: DownloadPhase;
  receivedBytes: number;
  totalBytes: number;
  percent: number;
  errorMessage: string | null;
}

const INITIAL_STATE: DownloadState = {
  phase: 'idle',
  receivedBytes: 0,
  totalBytes: 0,
  percent: 0,
  errorMessage: null,
};

const DOWNLOAD_FILENAME = 'sakib-law34-90s.mp4';

export default function App() {
  const [download, setDownload] = useState<DownloadState>(INITIAL_STATE);
  const [copied, setCopied] = useState(false);
  const inFlightRef = useRef(false);

  const directDownloadUrl = useMemo(() => {
    if (typeof window === 'undefined') return '/download';
    return `${window.location.origin}/download`;
  }, []);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(directDownloadUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback copy via temporary input for older mobile webviews
      const input = document.createElement('input');
      input.value = directDownloadUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    }
  }, [directDownloadUrl]);

  const handleVerifiedDownload = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setDownload({
      phase: 'downloading',
      receivedBytes: 0,
      totalBytes: 0,
      percent: 0,
      errorMessage: null,
    });

    try {
      const firstEnd = CHUNK_SIZE_BYTES - 1;
      const firstRes = await fetch('/api/video', {
        method: 'GET',
        cache: 'no-store',
        headers: {
          Range: `bytes=0-${firstEnd}`,
        },
      });

      if (firstRes.status !== 206 && firstRes.status !== 200) {
        throw new Error(`Unexpected HTTP status ${firstRes.status}`);
      }

      const chunks: Uint8Array[] = [];
      let totalBytes = 0;

      if (firstRes.status === 200) {
        const buf = new Uint8Array(await firstRes.arrayBuffer());
        chunks.push(buf);
        totalBytes = buf.byteLength;
        setDownload({
          phase: 'downloading',
          receivedBytes: totalBytes,
          totalBytes,
          percent: 100,
          errorMessage: null,
        });
      } else {
        const parsedTotal = parseContentRangeTotal(firstRes.headers.get('Content-Range'));
        if (!parsedTotal) {
          throw new Error('Server omitted valid Content-Range total length');
        }
        totalBytes = parsedTotal;

        const firstChunk = new Uint8Array(await firstRes.arrayBuffer());
        chunks.push(firstChunk);
        let receivedBytes = firstChunk.byteLength;

        setDownload({
          phase: 'downloading',
          receivedBytes,
          totalBytes,
          percent: computeProgressPercent(receivedBytes, totalBytes),
          errorMessage: null,
        });

        const allRanges = buildChunkRanges(totalBytes, CHUNK_SIZE_BYTES);
        const orderedChunks: Uint8Array[] = new Array(allRanges.length);
        orderedChunks[0] = firstChunk;

        const remainingIndices = allRanges.map((_, idx) => idx).slice(1);
        const MAX_CONCURRENCY = 4;
        let cursor = 0;

        const worker = async (): Promise<void> => {
          while (cursor < remainingIndices.length) {
            const idx = remainingIndices[cursor++];
            const range = allRanges[idx];
            const res = await fetch('/api/video', {
              method: 'GET',
              cache: 'no-store',
              headers: {
                Range: `bytes=${range.start}-${range.end}`,
              },
            });

            if (res.status !== 206) {
              throw new Error(`Chunk ${idx + 1}/${allRanges.length} failed (HTTP ${res.status})`);
            }

            const chunkBuf = new Uint8Array(await res.arrayBuffer());
            if (chunkBuf.byteLength !== range.length) {
              throw new Error(
                `Chunk ${idx + 1} byte mismatch: expected ${range.length}, got ${chunkBuf.byteLength}`,
              );
            }

            orderedChunks[idx] = chunkBuf;
            receivedBytes += chunkBuf.byteLength;

            setDownload({
              phase: 'downloading',
              receivedBytes,
              totalBytes,
              percent: computeProgressPercent(receivedBytes, totalBytes),
              errorMessage: null,
            });
          }
        };

        await Promise.all(
          Array.from({ length: Math.min(MAX_CONCURRENCY, remainingIndices.length) }, () => worker()),
        );

        chunks.length = 0;
        for (const c of orderedChunks) {
          chunks.push(c);
        }
      }

      const verification = verifyDownloadedChunks(chunks, totalBytes);
      if (!verification.ok) {
        throw new Error(
          `Integrity check failed (${verification.receivedBytes} / ${verification.expectedBytes} bytes)`,
        );
      }

      const blobParts: BlobPart[] = chunks.map(
        (chunk) => chunk.buffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength) as ArrayBuffer,
      );
      const blob = new Blob(blobParts, { type: 'video/mp4' });
      const blobUrl = URL.createObjectURL(blob);

      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.download = DOWNLOAD_FILENAME;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

      setDownload({
        phase: 'verified',
        receivedBytes: verification.receivedBytes,
        totalBytes: verification.expectedBytes,
        percent: 100,
        errorMessage: null,
      });
    } catch (err) {
      setDownload((prev) => ({
        ...prev,
        phase: 'error',
        errorMessage: err instanceof Error ? err.message : 'Download interrupted',
      }));
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  const isDownloading = download.phase === 'downloading';

  return (
    <div className="min-h-screen bg-[#090c10] text-[#f4f6f9] flex flex-col">
      {/* Minimal Header: Brand handle & unboxed tabular technical spec */}
      <header className="w-full border-b border-white/[0.08]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-6">
          <span className="text-[13px] sm:text-[15px] font-semibold tracking-tight text-[#f4f6f9] whitespace-nowrap shrink-0">
            @sakibexplains.bn
          </span>
          <span className="font-mono-spec text-[10px] sm:text-[13px] text-[#9aa4b2] whitespace-nowrap shrink-0">
            1080×1920 · 30fps · 01:30 · 2,700f
          </span>
        </div>
      </header>

      {/* Main Screening Room: Centered 9:16 Native Video + Verified Range-Chunk Download + Phone Direct Link */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-8">
        <div className="w-full max-w-[380px] flex flex-col items-center gap-5">
          {/* 9:16 Native Mobile-Compatible Video Stage */}
          <div className="w-full aspect-[9/16] max-h-[64vh] rounded-2xl overflow-hidden bg-[#05070a] border border-white/[0.1] shadow-[0_28px_80px_rgba(0,0,0,0.65)] flex items-center justify-center">
            <video
              data-testid="short-video-player"
              controls
              playsInline
              preload="metadata"
              poster="/api/poster?v=3"
              className="w-full h-full object-contain bg-black"
            >
              <source src="/api/video?v=3" type="video/mp4" />
            </video>
          </div>

          {/* Primary Action: Verified 2 MiB Range-Chunk MP4 Download */}
          <div className="w-full flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleVerifiedDownload}
              disabled={isDownloading}
              aria-busy={isDownloading}
              className="w-full h-12 px-5 rounded-xl bg-[#d4af37] hover:bg-[#e1be4c] active:scale-[0.99] disabled:opacity-75 disabled:cursor-wait text-[#0b0e12] font-semibold text-[15px] tracking-tight transition-all duration-150 flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3d87a]"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
                  <span>Downloading Verified MP4…</span>
                </>
              ) : download.phase === 'verified' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Full 90s MP4 Download</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Full 90s MP4 Download</span>
                </>
              )}
            </button>

            {/* Live % / MB Progress Bar & Byte-for-Byte Verification Feedback */}
            {download.phase !== 'idle' && (
              <div className="w-full space-y-1.5" aria-live="polite">
                <div className="flex items-center justify-between text-xs font-mono-spec text-[#cbd5e1]">
                  <span>
                    {download.phase === 'verified'
                      ? 'Byte-for-byte verified'
                      : download.phase === 'error'
                        ? 'Download error'
                        : 'Fetching 2 MiB chunks'}
                  </span>
                  <span>
                    {download.percent.toFixed(1)}%
                    {download.totalBytes > 0
                      ? ` · ${formatBytesMB(download.receivedBytes)} / ${formatBytesMB(download.totalBytes)}`
                      : ''}
                  </span>
                </div>

                <div
                  role="progressbar"
                  aria-label="MP4 download progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(download.percent)}
                  className="w-full h-1.5 rounded-full bg-white/[0.1] overflow-hidden"
                >
                  <div
                    className={`h-full transition-all duration-150 ${
                      download.phase === 'error'
                        ? 'bg-rose-400'
                        : download.phase === 'verified'
                          ? 'bg-emerald-400'
                          : 'bg-[#d4af37]'
                    }`}
                    style={{ width: `${download.percent}%` }}
                  />
                </div>

                {download.phase === 'error' && download.errorMessage && (
                  <p className="flex items-center gap-1.5 text-xs text-rose-300 pt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{download.errorMessage}</span>
                  </p>
                )}
              </div>
            )}

            {/* Direct Phone/Browser Download Link Bar (works outside sandboxed iframes) */}
            <div className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] p-2.5 flex items-center gap-2">
              <a
                href="/download"
                target="_blank"
                rel="noopener noreferrer"
                download={DOWNLOAD_FILENAME}
                className="flex-1 min-w-0 flex items-center gap-1.5 text-xs font-mono-spec text-[#cbd5e1] hover:text-[#f3d87a] transition-colors truncate"
                title={directDownloadUrl}
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#d4af37]" aria-hidden="true" />
                <span className="truncate">{directDownloadUrl}</span>
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-2.5 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.14] text-xs font-medium text-[#f4f6f9] flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
