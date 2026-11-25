// The GPS Swears It Was a Shortcut
// Writes the GPS's one-line excuse to entry.txt.
//
// Output resolution: $MAKEFUN_OUTPUT_DIR -> $OUTPUT_PATH -> local output/
// (process.cwd()/output/entry.txt). Never a hardcoded /output.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

function buildEntryLine(): string {
  return "In my defense, the map said shortcut \u2014 it never said the shortcut went through a lake, a wedding, and every life choice that led you to trust me.";
}

const MAX_CHARS = 200;

function resolveOutputPath(): string {
  const dir =
    process.env.MAKEFUN_OUTPUT_DIR ||
    process.env.OUTPUT_PATH ||
    join(process.cwd(), "output");
  return join(resolve(dir), "entry.txt");
}

function main(): void {
  const LINE = buildEntryLine();
  const outPath = resolveOutputPath();
  mkdirSync(join(outPath, ".."), { recursive: true });
  writeFileSync(outPath, LINE, "utf8");

  // Validate after writing: read back and check byte-identical,
  // within the RULES limit, and non-whitespace.
  const back = readFileSync(outPath, "utf8");
  const codePoints = [...back].length;
  if (back !== LINE) {
    console.error("FAIL: entry.txt is not byte-identical to the entry line");
    process.exit(1);
  }
  if (codePoints < 1 || codePoints > MAX_CHARS) {
    console.error(
      `FAIL: entry is ${codePoints} code points, outside the 1-${MAX_CHARS} gate`,
    );
    process.exit(1);
  }
  if (back.trim().length === 0) {
    console.error("FAIL: entry is only whitespace");
    process.exit(1);
  }

  console.log(back);
  console.log(`chars: ${codePoints}`);
}

main();
