const DANGEROUS = [
  /(^|[;&|\s])rm\s+(-[A-Za-z]*r[A-Za-z]*f|-[A-Za-z]*f[A-Za-z]*r|--recursive)/i,
  /(^|[;&|\s])git\s+push\s+.*(--force(?:-with-lease)?|-f(?:\s|$))/i,
  /(^|[;&|\s])git\s+reset\s+--hard/i,
  /\bDROP\s+(TABLE|DATABASE|SCHEMA)\b/i,
  /(^|[;&|\s])(mkfs|dd)\s+/i,
  /curl\s+.*\|\s*(sudo|sh|bash|zsh|python[23]?|perl|ruby)/i
];

const SECRET = [
  /sk-[A-Za-z0-9]{20}/,
  /gh[po]_[A-Za-z0-9]{20}/,
  /AIza[0-9A-Za-z_-]{30}/,
  /AKIA[0-9A-Z]{16}/
];

let raw = '';
for await (const chunk of process.stdin) raw += chunk;

let payload;
try {
  payload = JSON.parse(raw);
} catch (error) {
  process.stderr.write(`GreatPM safety hook could not parse input; allowing tool use: ${error.message}\n`);
  process.exit(0);
}

function stringValues(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(stringValues);
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(stringValues);
  }
  return [];
}

const input = stringValues(payload.tool_input ?? {}).join('\n');

if (DANGEROUS.some((pattern) => pattern.test(input))) {
  process.stderr.write(
    'GreatPM blocked this tool call: Dangerous command pattern. Review the command and choose a recoverable operation.\n'
  );
  process.exit(2);
}

if (SECRET.some((pattern) => pattern.test(input))) {
  process.stderr.write(
    'GreatPM blocked this tool call: Potential API key or token. Move secrets to approved secret storage before continuing.\n'
  );
  process.exit(2);
}

process.exit(0);
