export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span className={diagonal ? 'arrow arrow-diagonal' : 'arrow'} aria-hidden="true" />
}
