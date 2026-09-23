import fs from "node:fs";

if (process.argv.length < 3) {
  console.error("Usage: node scripts/score-findings.mjs normalized-findings.json");
  process.exit(2);
}

const truth = JSON.parse(fs.readFileSync(new URL("../ground-truth/findings.json", import.meta.url), "utf8"));
const reported = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));

if (!Array.isArray(reported.findings)) {
  throw new Error("Expected { findings: [{ file, ... }] }");
}

const expectedByFile = new Map(truth.findings.map(f => [f.file, f]));
const matched = new Map();
const extras = [];

for (const finding of reported.findings) {
  const normalized = String(finding.file ?? "").replace(/^\.\//, "");
  if (expectedByFile.has(normalized)) matched.set(normalized, finding);
  else extras.push(finding);
}

const tp = matched.size;
const fn = truth.findings.length - tp;
const fp = extras.length;
const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
const recall = tp / truth.findings.length;
const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);

const missed = truth.findings.filter(f => !matched.has(f.file)).map(f => ({ id: f.id, file: f.file, title: f.title }));
console.log(JSON.stringify({ tp, fp, fn, precision, recall, f1, missed, extras }, null, 2));
