#!/usr/bin/env node
/*
Batch-optimize images stored in Supabase Storage.

Usage:
  - Copy `.env.example` to `.env` and fill values.
  - Install deps: `npm install @supabase/supabase-js node-fetch sharp dotenv`
  - Run: `node scripts/optimize_supabase_images.js`

Options (via env):
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
  - SUPABASE_BUCKET (e.g. "images")
  - SOURCE_PREFIX (e.g. "public/images/committee")
  - TARGET_PREFIX (e.g. "public/images/committee/optimized")
  - SIZES (comma-separated widths, e.g. 180,256,320)
  - UPDATE_DB (true|false) : if true, will attempt to update `committee` table photo_url fields

NOTE: This script requires a Supabase service role key with permissions to read/write storage
and update the database if `UPDATE_DB=true`. Test carefully.
*/

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

const fetch = globalThis.fetch;

dotenv.config({ path: path.join(process.cwd(), ".env.local") });
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_BUCKET || "images";
const normalizeStoragePrefix = (prefix) =>
  prefix
    .replace(new RegExp(`^public/${BUCKET}/`), "")
    .replace(new RegExp(`^${BUCKET}/`), "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

const SOURCE_PREFIX = normalizeStoragePrefix(
  process.env.SOURCE_PREFIX || "public/images/committee",
);
const TARGET_PREFIX = normalizeStoragePrefix(
  process.env.TARGET_PREFIX || `${SOURCE_PREFIX}/optimized`,
);
const SIZES = (process.env.SIZES || "180,232,320").split(",").map((s) => parseInt(s, 10));
const UPDATE_DB = (process.env.UPDATE_DB || "false") === "true";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment. Checked .env.local and .env in the current working directory.",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

async function listFiles(prefix, page = 1, results = []) {
  const PAGE_SIZE = 100;
  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    sortBy: { column: "name", order: "asc" },
  });
  if (error) throw error;
  if (!data || data.length === 0) return results;
  results.push(...data);
  if (data.length === PAGE_SIZE) {
    return listFiles(prefix, page + 1, results);
  }
  return results;
}

async function optimizeOne(file) {
  try {
    const sourcePath = path.posix.join(SOURCE_PREFIX, file.name);
    const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(sourcePath);
    const publicUrl = publicData?.publicUrl;
    if (!publicUrl) {
      console.warn("No public URL for", sourcePath);
      return;
    }

    const res = await fetch(publicUrl);
    if (!res.ok) {
      console.warn("Failed to fetch", publicUrl, res.status);
      return;
    }
    const buffer = await res.arrayBuffer();
    const input = Buffer.from(buffer);

    for (const w of SIZES) {
      const outBuf = await sharp(input).resize({ width: w, withoutEnlargement: true }).webp({ quality: 75 }).toBuffer();
      const extName = path.parse(file.name).name + `-w${w}.webp`;
      const targetPath = path.posix.join(TARGET_PREFIX, extName);

      const { data: uploadData, error: uploadError } = await supabase.storage.from(BUCKET).upload(targetPath, outBuf, {
        contentType: "image/webp",
        upsert: true,
      });
      if (uploadError) {
        console.error("Upload error for", targetPath, uploadError.message || uploadError);
      } else {
        console.log("Uploaded:", targetPath);
      }
    }

    if (UPDATE_DB) {
      // Attempt to update a 'committee' table photo_url field that exactly matches the original publicUrl.
      // This is best-effort — adapt as needed for your schema.
      const { data: optimizedData } = supabase.storage.from(BUCKET).getPublicUrl(
        path.posix.join(TARGET_PREFIX, path.parse(file.name).name + `-w${SIZES[0]}.webp`),
      );
      const optimizedUrl = optimizedData?.publicUrl;
      if (optimizedUrl) {
        const { data: members, error: selectErr } = await supabase.from("committee").select("id,photo_url").eq("photo_url", publicUrl);
        if (selectErr) {
          console.warn("DB lookup error:", selectErr.message || selectErr);
        } else if (members && members.length > 0) {
          for (const m of members) {
            const { error: updErr } = await supabase.from("committee").update({ photo_url: optimizedUrl }).eq("id", m.id);
            if (updErr) console.warn("DB update error for id", m.id, updErr.message || updErr);
            else console.log("Updated DB photo_url for committee id", m.id);
          }
        }
      }
    }
  } catch (err) {
    console.error("Error optimizing", file.name, err.message || err);
  }
}

async function main() {
  console.log("Listing files under:", SOURCE_PREFIX);
  const files = await listFiles(SOURCE_PREFIX);
  const filtered = files.filter((f) => f.name && /\.(jpg|jpeg|png|webp|gif)$/i.test(f.name));
  console.log(`Found ${filtered.length} candidate files.`);

  for (const file of filtered) {
    if (file.metadata && file.metadata.mimetype && file.metadata.mimetype.startsWith("image")) {
      await optimizeOne(file);
    } else if (/(jpg|jpeg|png|webp|gif)$/i.test(file.name)) {
      await optimizeOne(file);
    } else {
      console.log("Skipping non-image:", file.name);
    }
  }
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
