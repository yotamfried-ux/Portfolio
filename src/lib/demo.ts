export const sampleScores = [18, 36, 57, 72, 88]

export function flaggedCount(threshold: number) {
  return sampleScores.filter(score => score >= threshold).length
}

export const etlRows = [
  [{ id: 'A01', value: '  Dani' }, { id: 'A02', value: 'Noa  ' }, { id: 'A03', value: '' }],
  [{ id: 'A01', value: 'Dani' }, { id: 'A02', value: 'Noa' }, { id: 'A03', value: '' }],
  [{ id: 'A01', value: 'Dani' }, { id: 'A02', value: 'Noa' }],
]
