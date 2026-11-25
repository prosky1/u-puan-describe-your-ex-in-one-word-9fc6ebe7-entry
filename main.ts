// Describe Your Ex in One Word — reviser rewrite (from RULES.txt only).
//
// The entrypoint emits exactly one word to /output/entry.txt: the verdict
// the tournament picked. Nothing else is attached — no caption, no
// trailing newline, no punctuation — so the sealed scorer sees a clean
// 1-to-111-character UTF-8 text.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const DESTINATION = "/output/entry.txt";
const CEILING = 111;

// The tournament's winning verdict: a single word, eleven letters.
function verdictWord(): string {
  return "Placeholder";
}

// A word counts as plain letters only when every character is A-Z.
// Checked with one anchored regex so digits, hyphens and accents fail.
function onlyPlainLetters(candidate: string): boolean {
  return /^[A-Za-z]+$/.test(candidate);
}

// The gate counts characters, but the file is read back as bytes, so
// confirm the UTF-8 byte length matches the character count too.
function byteLengthMatches(candidate: string): boolean {
  return Buffer.byteLength(candidate, "utf8") === candidate.length;
}

// Walk the candidate once and gather every rule break found, instead of
// bailing on the first one, so a bad word reports all of its problems.
function collectViolations(candidate: string): string[] {
  const problems: string[] = [];

  if (candidate.length === 0 || candidate.trim().length === 0) {
    problems.push("word is empty or only whitespace");
  }
  if (candidate.length > CEILING) {
    problems.push(`word is ${candidate.length} characters, over the ${CEILING} limit`);
  }
  if (/\s/.test(candidate)) {
    problems.push("word contains whitespace, so it is not one word");
  }
  if (!onlyPlainLetters(candidate)) {
    problems.push("word contains characters outside plain A-Z letters");
  }
  if (!byteLengthMatches(candidate)) {
    problems.push("word has multi-byte characters, so byte length differs");
  }
  return problems;
}

function prepareOutputFolder(target: string): void {
  mkdirSync(dirname(target), { recursive: true });
}

// Refuse to run when the destination is not the gate's expected path,
// so a typo in DESTINATION fails loudly instead of writing elsewhere.
function guardDestination(target: string): void {
  if (target !== "/output/entry.txt") {
    throw new Error(`unexpected destination: ${target}`);
  }
}

function reportOutcome(target: string, word: string): void {
  const bytes = Buffer.byteLength(word, "utf8");
  console.log(`wrote ${word.length} characters (${bytes} bytes) to ${target}`);
}

function emitEntry(): string {
  const word = verdictWord();
  const problems = collectViolations(word);
  if (problems.length > 0) {
    throw new Error(`verdict word rejected: ${problems.join("; ")}`);
  }
  guardDestination(DESTINATION);
  prepareOutputFolder(DESTINATION);
  // Written byte-for-byte, no trailing newline: the file holds only the word.
  writeFileSync(DESTINATION, word, "utf8");
  reportOutcome(DESTINATION, word);
  return word;
}

emitEntry();
