#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import {
  access,
  mkdir,
  readFile,
  readdir,
  stat,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const VITE_CONTENTFUL_SPACE_ID = process.env.VITE_CONTENTFUL_SPACE_ID || '';
const VITE_CONTENTFUL_UPLOAD_ACCESS_TOKEN =
  process.env.VITE_CONTENTFUL_UPLOAD_ACCESS_TOKEN || '';
const VITE_CONTENTFUL_ENVIRONMENT =
  process.env.VITE_CONTENTFUL_ENVIRONMENT || 'master';

const DEFAULT_SOURCE_DIR = path.join(os.homedir(), 'Downloads', 'AmazonPhotos');
const DEFAULT_CONCURRENCY = 3;
const DEFAULT_LOCALE = 'en-US';
const API_BASE_URL = 'https://api.contentful.com';
const UPLOAD_BASE_URL = 'https://upload.contentful.com';
const MANIFEST_DIR = path.join(process.cwd(), '.contentful-upload');
const MANIFEST_PATH = path.join(MANIFEST_DIR, 'upload-manifest.json');
const FAILURES_PATH = path.join(MANIFEST_DIR, 'upload-failures.json');

const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.heic',
  '.mp4',
  '.mov',
  '.m4v',
  '.webm',
]);

const MIME_BY_EXTENSION = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.heic': 'image/heic',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.m4v': 'video/x-m4v',
  '.webm': 'video/webm',
};

function parseArgs(argv) {
  const options = {
    sourceDir: DEFAULT_SOURCE_DIR,
    concurrency: DEFAULT_CONCURRENCY,
    locale: DEFAULT_LOCALE,
    dryRun: false,
    resume: true,
    maxSizeMb: 0,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (arg === '--no-resume') {
      options.resume = false;
      continue;
    }
    if (arg === '--source' && next) {
      options.sourceDir = next;
      index += 1;
      continue;
    }
    if (arg === '--concurrency' && next) {
      options.concurrency = Number(next);
      index += 1;
      continue;
    }
    if (arg === '--locale' && next) {
      options.locale = next;
      index += 1;
      continue;
    }
    if (arg === '--max-size-mb' && next) {
      options.maxSizeMb = Number(next);
      index += 1;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      options.help = true;
      continue;
    }
  }

  return options;
}

function printHelp() {
  console.log(`Upload local images/videos to Contentful Assets.

Usage:
  node scripts/upload-contentful-assets.mjs [options]

Options:
  --source <path>          Source directory (default: ~/Downloads/AmazonPhotos)
  --concurrency <number>   Parallel uploads (default: 3)
  --locale <code>          Contentful locale (default: en-US)
  --max-size-mb <number>   Skip files larger than this size (default: 0 = no limit)
  --dry-run                Scan only, do not upload
  --no-resume              Ignore previous manifest and upload all matching files
  --help, -h               Show this help
`);
}

function assertConfig() {
  if (
    !VITE_CONTENTFUL_SPACE_ID ||
    !VITE_CONTENTFUL_UPLOAD_ACCESS_TOKEN ||
    !VITE_CONTENTFUL_ENVIRONMENT
  ) {
    throw new Error(
      'Missing Contentful upload config. Set VITE_CONTENTFUL_SPACE_ID, VITE_CONTENTFUL_UPLOAD_ACCESS_TOKEN, and VITE_CONTENTFUL_ENVIRONMENT in process environment'
    );
  }
}

async function pathExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function walkFiles(rootDir) {
  const output = [];
  const entries = await readdir(rootDir, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      const nested = await walkFiles(absolutePath);
      output.push(...nested);
      continue;
    }
    if (entry.isFile()) {
      output.push(absolutePath);
    }
  }

  return output;
}

function normalizePath(inputPath) {
  if (inputPath.startsWith('~/')) {
    return path.join(os.homedir(), inputPath.slice(2));
  }
  return path.resolve(inputPath);
}

function toFingerprint(relativePath, fileStats) {
  const raw = `${relativePath}|${fileStats.size}|${Math.floor(fileStats.mtimeMs)}`;
  return createHash('sha1').update(raw).digest('hex');
}

function getMimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return MIME_BY_EXTENSION[extension] || 'application/octet-stream';
}

async function loadJson(filePath, fallbackValue) {
  if (!(await pathExists(filePath))) {
    return fallbackValue;
  }
  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return fallbackValue;
  }
}

async function saveJson(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function sleep(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}

class ContentfulAuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ContentfulAuthError';
  }
}

function parseContentfulErrorId(bodyText) {
  try {
    const parsed = JSON.parse(bodyText);
    return parsed?.sys?.id ? String(parsed.sys.id) : '';
  } catch {
    return '';
  }
}

function isAuthResponse(status) {
  return status === 401 || status === 403;
}

function buildAuthErrorMessage(url, bodyText) {
  const errorId = parseContentfulErrorId(bodyText);
  const idSuffix = errorId ? ` (${errorId})` : '';
  return `Authentication failed for ${url}${idSuffix}. Use a Contentful Management API token (CMA), not a Delivery token, and ensure org access grants are approved.`;
}

async function requestWithRetry(url, init, attempt = 1) {
  const maxAttempts = 5;
  const response = await fetch(url, init);

  if (response.ok) {
    return response;
  }

  if (response.status === 429 || response.status >= 500) {
    if (attempt < maxAttempts) {
      const retrySeconds = Number(
        response.headers.get('x-contentful-ratelimit-reset')
      );
      const delayMs =
        Number.isFinite(retrySeconds) && retrySeconds > 0
          ? retrySeconds * 1000
          : Math.min(1000 * 2 ** (attempt - 1), 8000);
      await sleep(delayMs);
      return requestWithRetry(url, init, attempt + 1);
    }
  }

  const bodyText = await response.text();
  if (isAuthResponse(response.status)) {
    throw new ContentfulAuthError(buildAuthErrorMessage(url, bodyText));
  }
  throw new Error(`HTTP ${response.status} for ${url}: ${bodyText}`);
}

async function runPreflightAuthCheck() {
  const url = `${API_BASE_URL}/spaces/${VITE_CONTENTFUL_SPACE_ID}/environments/${VITE_CONTENTFUL_ENVIRONMENT}`;
  await requestWithRetry(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${VITE_CONTENTFUL_UPLOAD_ACCESS_TOKEN}`,
    },
  });
}

async function createUpload(filePath) {
  const uploadUrl = `${UPLOAD_BASE_URL}/spaces/${VITE_CONTENTFUL_SPACE_ID}/uploads`;
  const fileStream = createReadStream(filePath);

  const response = await requestWithRetry(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${VITE_CONTENTFUL_UPLOAD_ACCESS_TOKEN}`,
      'Content-Type': 'application/octet-stream',
    },
    body: fileStream,
    duplex: 'half',
  });

  return response.json();
}

async function createAsset({ fileName, mimeType, locale, uploadId, title }) {
  const url = `${API_BASE_URL}/spaces/${VITE_CONTENTFUL_SPACE_ID}/environments/${VITE_CONTENTFUL_ENVIRONMENT}/assets`;

  const payload = {
    fields: {
      title: {
        [locale]: title,
      },
      file: {
        [locale]: {
          contentType: mimeType,
          fileName,
          uploadFrom: {
            sys: {
              type: 'Link',
              linkType: 'Upload',
              id: uploadId,
            },
          },
        },
      },
    },
  };

  const response = await requestWithRetry(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${VITE_CONTENTFUL_UPLOAD_ACCESS_TOKEN}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
    },
    body: JSON.stringify(payload),
  });

  return response.json();
}

async function processAsset(assetId, locale) {
  const url = `${API_BASE_URL}/spaces/${VITE_CONTENTFUL_SPACE_ID}/environments/${VITE_CONTENTFUL_ENVIRONMENT}/assets/${assetId}/files/${locale}/process`;

  await requestWithRetry(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${VITE_CONTENTFUL_UPLOAD_ACCESS_TOKEN}`,
    },
  });
}

async function getAsset(assetId) {
  const url = `${API_BASE_URL}/spaces/${VITE_CONTENTFUL_SPACE_ID}/environments/${VITE_CONTENTFUL_ENVIRONMENT}/assets/${assetId}`;
  const response = await requestWithRetry(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${VITE_CONTENTFUL_UPLOAD_ACCESS_TOKEN}`,
    },
  });
  return response.json();
}

async function waitUntilProcessed(assetId, locale) {
  const maxChecks = 30;

  for (let attempt = 0; attempt < maxChecks; attempt += 1) {
    const asset = await getAsset(assetId);
    const file = asset?.fields?.file?.[locale];
    if (file?.url) {
      return asset;
    }
    await sleep(1000);
  }

  throw new Error(`Timed out waiting for asset ${assetId} to process`);
}

async function publishAsset(assetId, version) {
  const url = `${API_BASE_URL}/spaces/${VITE_CONTENTFUL_SPACE_ID}/environments/${VITE_CONTENTFUL_ENVIRONMENT}/assets/${assetId}/published`;
  const response = await requestWithRetry(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${VITE_CONTENTFUL_UPLOAD_ACCESS_TOKEN}`,
      'X-Contentful-Version': String(version),
    },
  });
  return response.json();
}

async function uploadOneFile(fileRecord, options) {
  const fileName = path.basename(fileRecord.absolutePath);
  const title = path.parse(fileName).name;
  const mimeType = getMimeType(fileName);

  const upload = await createUpload(fileRecord.absolutePath);
  const uploadId = upload?.sys?.id;
  if (!uploadId) {
    throw new Error(
      `Upload succeeded but no upload ID returned for ${fileName}`
    );
  }

  const createdAsset = await createAsset({
    fileName,
    mimeType,
    locale: options.locale,
    uploadId,
    title,
  });

  const assetId = createdAsset?.sys?.id;
  if (!assetId) {
    throw new Error(`Failed to create asset for ${fileName}`);
  }

  await processAsset(assetId, options.locale);
  const processedAsset = await waitUntilProcessed(assetId, options.locale);
  const publishedAsset = await publishAsset(
    assetId,
    processedAsset.sys.version
  );
  const fileUrl = publishedAsset?.fields?.file?.[options.locale]?.url;

  return {
    assetId,
    fileUrl: fileUrl
      ? String(fileUrl).startsWith('//')
        ? `https:${fileUrl}`
        : String(fileUrl)
      : '',
    contentType: mimeType,
  };
}

async function runPool(items, worker, concurrency, shouldStop = () => false) {
  const queue = [...items];
  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (queue.length > 0) {
      if (shouldStop()) {
        return;
      }
      const item = queue.shift();
      if (!item) return;
      await worker(item);
    }
  });
  await Promise.all(workers);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  assertConfig();

  console.log('Running Contentful auth preflight...');
  await runPreflightAuthCheck();
  console.log('Preflight OK.');

  const sourceDir = normalizePath(options.sourceDir);
  if (!(await pathExists(sourceDir))) {
    throw new Error(`Source directory does not exist: ${sourceDir}`);
  }

  const previousManifest = await loadJson(MANIFEST_PATH, {
    uploads: [],
    generatedAt: null,
  });
  const previousSuccessByFingerprint = new Map(
    (previousManifest.uploads || []).map((item) => [item.fingerprint, item])
  );

  const allFiles = await walkFiles(sourceDir);
  const candidates = [];
  let skippedByExtension = 0;
  let skippedBySize = 0;
  let skippedByResume = 0;

  for (const absolutePath of allFiles) {
    const extension = path.extname(absolutePath).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      skippedByExtension += 1;
      continue;
    }

    const fileStats = await stat(absolutePath);
    const maxSizeBytes =
      options.maxSizeMb > 0 ? options.maxSizeMb * 1024 * 1024 : 0;
    if (maxSizeBytes > 0 && fileStats.size > maxSizeBytes) {
      skippedBySize += 1;
      continue;
    }

    const relativePath = path.relative(sourceDir, absolutePath);
    const fingerprint = toFingerprint(relativePath, fileStats);
    if (options.resume && previousSuccessByFingerprint.has(fingerprint)) {
      skippedByResume += 1;
      continue;
    }

    candidates.push({
      absolutePath,
      relativePath,
      size: fileStats.size,
      fingerprint,
    });
  }

  console.log(`Source: ${sourceDir}`);
  console.log(`Scanned files: ${allFiles.length}`);
  console.log(`Eligible files: ${candidates.length}`);
  console.log(`Skipped by extension: ${skippedByExtension}`);
  console.log(`Skipped by size: ${skippedBySize}`);
  console.log(`Skipped by resume: ${skippedByResume}`);

  if (options.dryRun) {
    console.log('\nDry run only. No files uploaded.');
    return;
  }

  const successful = [];
  const failures = [];
  let authFailed = false;

  await runPool(
    candidates,
    async (fileRecord) => {
      if (authFailed) {
        return;
      }
      const label = `${fileRecord.relativePath} (${Math.round(fileRecord.size / 1024)} KB)`;
      try {
        console.log(`Uploading: ${label}`);
        const result = await uploadOneFile(fileRecord, options);
        successful.push({
          fingerprint: fileRecord.fingerprint,
          relativePath: fileRecord.relativePath,
          size: fileRecord.size,
          assetId: result.assetId,
          fileUrl: result.fileUrl,
          contentType: result.contentType,
          uploadedAt: new Date().toISOString(),
        });
        console.log(
          `Uploaded: ${fileRecord.relativePath} -> ${result.assetId}`
        );
      } catch (error) {
        const message = getErrorMessage(error);
        if (error instanceof ContentfulAuthError) {
          authFailed = true;
        }
        failures.push({
          fingerprint: fileRecord.fingerprint,
          relativePath: fileRecord.relativePath,
          size: fileRecord.size,
          error: message,
          failedAt: new Date().toISOString(),
        });
        console.error(`Failed: ${fileRecord.relativePath}`);
        console.error(`  ${message}`);
        if (authFailed) {
          console.error(
            'Stopping remaining uploads due to authentication failure.'
          );
        }
      }
    },
    options.concurrency,
    () => authFailed
  );

  const mergedUploads = options.resume
    ? [...(previousManifest.uploads || []), ...successful]
    : successful;

  await saveJson(MANIFEST_PATH, {
    generatedAt: new Date().toISOString(),
    sourceDir,
    uploads: mergedUploads,
  });

  await saveJson(FAILURES_PATH, {
    generatedAt: new Date().toISOString(),
    sourceDir,
    failures,
  });

  console.log('\nUpload summary');
  console.log(`Uploaded: ${successful.length}`);
  console.log(`Failed: ${failures.length}`);
  console.log(`Manifest: ${MANIFEST_PATH}`);
  console.log(`Failures: ${FAILURES_PATH}`);
}

main().catch((error) => {
  console.error(getErrorMessage(error));
  process.exit(1);
});
