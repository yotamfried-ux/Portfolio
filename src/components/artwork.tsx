import type { Media } from '@/lib/media'

export function Artwork({ kind }: { kind: Media['fallback'] }) {
  return <div className={`art art-${kind}`} aria-hidden="true">
    {kind === 'booking' && <div className="calendar-art">
      <div className="calendar-top"><i /><span /><i /></div>
      <div className="calendar-grid">{Array.from({ length: 28 }, (_, i) => <i key={i} />)}</div>
      <div className="calendar-slots"><i /><i /><i /></div>
    </div>}
    {kind === 'agent' && <div className="network-art">
      <span className="network-line line-a" /><span className="network-line line-b" />
      <span className="network-line line-c" /><span className="network-line line-d" />
      <i className="node node-a">›</i><i className="node node-b">+</i><i className="node node-c">⌘</i>
      <i className="node node-d">✓</i><i className="node node-e">↗</i>
    </div>}
    {kind === 'churn' && <div className="bars-art">
      {[28, 45, 35, 60, 52, 72, 60, 83, 70, 95, 82].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}
    </div>}
    {kind === 'etl' && <div className="etl-art">
      <span><i /><i /><i /></span><b>→</b><span className="etl-middle">◇</span><b>→</b><span><i /><i /><i /></span>
    </div>}
  </div>
}
