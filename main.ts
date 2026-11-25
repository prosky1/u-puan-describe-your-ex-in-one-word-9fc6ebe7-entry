// Describe Your Ex in One Word — entry program (Node 22, TypeScript run as-is).
// Writes exactly one word to /output/entry.txt and verifies the write by
// reading the file back byte-for-byte before exiting.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const WORD = "Placeholder";
const OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 111;

function validate(word: string): void {
  if (word.length === 0) {
    throw new Error("word must not be empty");
  }
  if (word.length > MAX_CHARS) {
    throw new Error(`word is ${word.length} characters, over the ${MAX_CHARS} limit`);
  }
  if (/\s/.test(word)) {
    throw new Error("word must be a single word with no whitespace");
  }
  if (!/^[\x20-\x7e]+$/.test(word)) {
    throw new Error("word must be printable ASCII only");
  }
  // The judge brief rewards exactly one clean word: no punctuation tricks
  // (hyphens, apostrophes, dots) that smuggle in extra words.
  if (/[^A-Za-z]/.test(word)) {
    throw new Error("word must contain letters only, no punctuation or digits");
  }
}

function main(): void {
  validate(WORD);
  mkdirSync("/output", { recursive: true });
  writeFileSync(OUTPUT_PATH, WORD, "utf8");
  const back = readFileSync(OUTPUT_PATH, "utf8");
  if (back !== WORD) {
    throw new Error("read-back verification failed: output differs from the word");
  }
  // Byte-level check: the file must hold exactly the word, no trailing
  // newline or extra bytes, or the gate could read a different string.
  const bytes = Buffer.byteLength(back, "utf8");
  if (bytes !== WORD.length) {
    throw new Error(`read-back byte length ${bytes} != word length ${WORD.length}`);
  }
  console.log(`wrote ${WORD.length}-character word to ${OUTPUT_PATH}`);
}

main();
