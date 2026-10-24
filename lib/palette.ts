const PALETTE: Record<string, { accent: string, fill: string }> = {
  ch01: { accent: '#24578a', fill: '#d7e4f2' },
  ch02: { accent: '#b8610a', fill: '#f8e3cc' },
  ch03: { accent: '#0f6b63', fill: '#d4efe9' },
  ch04: { accent: '#a61b1b', fill: '#f6d6d4' },
  ch05: { accent: '#6d28a8', fill: '#eadcf8' },
  ch06: { accent: '#a3165a', fill: '#f8d6e6' },
  ch07: { accent: '#0b6794', fill: '#d4eaf5' },
  ch08: { accent: '#4a7c12', fill: '#e1f0cc' },
  ch09: { accent: '#8a5a10', fill: '#f3e4c6' },
  ch10: { accent: '#3730a3', fill: '#e0e0f8' },
  ch11: { accent: '#0f6f86', fill: '#d3eef3' },
}

export function unitColors(unit: string): { accent: string, fill: string } {
  const known = PALETTE[unit]
  if (known) return known
  let hash = 0
  for (const char of unit) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  const hue = hash % 360
  return {
    accent: `hsl(${hue} 42% 32%)`,
    fill: `hsl(${hue} 48% 88%)`,
  }
}
