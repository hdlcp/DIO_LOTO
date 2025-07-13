export function formatGainsForDisplay(gains: any): string {
  if (gains && typeof gains === 'object') {
    if ('win' in gains && 'machine' in gains) {
      return `${gains.win} (Win) / ${gains.machine} (Machine) XOF`;
    }
    if ('value' in gains) {
      return `${gains.value} XOF`;
    }
  }
  if (typeof gains === 'number' || typeof gains === 'string') {
    return `${gains} XOF`;
  }
  return '0 XOF';
}

export function getGainsForApi(gains: string, isDoubleChance: boolean): any {
  if (isDoubleChance) {
    const match = gains.match(/([\d.]+)\s*\(Win\)\s*\/\s*([\d.]+)\s*\(Machine\)/);
    if (match) {
      return { win: parseFloat(match[1]), machine: parseFloat(match[2]) };
    }
    const simpleMatch = gains.match(/([\d.]+)\s*\/\s*([\d.]+)/);
    if (simpleMatch) {
      return { win: parseFloat(simpleMatch[1]), machine: parseFloat(simpleMatch[2]) };
    }
    return { win: 0, machine: 0 };
  } else {
    const value = parseFloat(gains);
    return isNaN(value) ? 0 : value;
  }
} 