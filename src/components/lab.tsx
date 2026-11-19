'use client'

import Image from 'next/image'
import { useState } from 'react'
import { flaggedCount, sampleScores, etlRows } from '@/lib/demo'
import { labels, type Locale } from '@/lib/locale'
import type { projectBySlug } from '@/lib/projects'

type Project = NonNullable<ReturnType<typeof projectBySlug>>
type LabProject = Pick<Project, 'slug' | 'steps'>

function SportComparison({ locale }: { locale: Locale }) {
  const [split, setSplit] = useState(46)
  const he = locale === 'he'
  return <div className="comparison">
    <div className="compare-frame" dir="ltr">
      <Image src="/media/aerial-hero.webp" fill alt={he ? 'תמונת נוף רחבה להמחשה' : 'Illustrative wide aerial view'} sizes="(max-width: 760px) 100vw, 65vw" />
      <Image src="/media/sportreel.webp" fill alt={he ? 'אותה תמונה בחיתוך ממוקד יותר' : 'A tighter crop of the same still'} sizes="(max-width: 760px) 100vw, 65vw"
        style={{ clipPath: `inset(0 0 0 ${split}%)` }} />
      <span className="compare-divider" style={{ left: `${split}%` }} aria-hidden="true"><i>↔</i></span>
      <span className="compare-label compare-before" dir={he ? 'rtl' : 'ltr'}>{he ? 'פריים רחב' : 'Wide frame'}</span>
      <span className="compare-label compare-after" dir={he ? 'rtl' : 'ltr'}>{he ? 'חיתוך לדוגמה' : 'Sample crop'}</span>
    </div>
    <label className="range-label" htmlFor="split">{he ? 'השוואת מסגור' : 'Compare framing'}</label>
    <input id="split" type="range" min={0} max={100} value={split} dir="ltr" onChange={event => setSplit(event.target.valueAsNumber)} />
  </div>
}

function ChurnDemo({ locale }: { locale: Locale }) {
  const [threshold, setThreshold] = useState(60)
  const he = locale === 'he'
  return <div className="churn-demo">
    <div className="chart-controls">
      <label className="range-label" htmlFor="threshold">{he ? 'סף סימון' : 'Flagging threshold'} <output htmlFor="threshold">{threshold}</output></label>
      <input id="threshold" type="range" min={0} max={100} value={threshold} onChange={event => setThreshold(event.target.valueAsNumber)} />
      <p role="status">{he ? `${flaggedCount(threshold)} מתוך 5 חשבונות מסומנים` : `${flaggedCount(threshold)} of 5 sample accounts flagged`}</p>
    </div>
    <ul className="chart-bars" dir="ltr" aria-label={he ? 'ציונים סינתטיים לדוגמה' : 'Synthetic sample scores'}>
      {sampleScores.map((score, index) => <li key={score} data-flagged={score >= threshold}>
        <span>{score}</span><i aria-hidden="true" style={{ height: `${score}%` }} /><small>A0{index + 1}</small>
        <span className="sr-only">{score >= threshold ? (he ? 'מסומן' : 'Flagged') : (he ? 'מתחת לסף' : 'Below threshold')}</span>
      </li>)}
    </ul>
  </div>
}

function BookingDemo({ stage, time, setTime, locale }: {
  stage: number; time: string; setTime: (time: string) => void; locale: Locale
}) {
  const he = locale === 'he'
  const service = he ? 'פגישת ייעוץ לדוגמה' : 'Sample consultation'
  return <div className="booking-demo">
    <p className="eyebrow">{he ? 'הזמנה לדוגמה' : 'Sample booking'}</p>
    <h3>{service}</h3>
    {stage === 0 && <p>{he ? 'משך הפגישה בדוגמה הוא 30 דקות.' : 'The sample appointment lasts 30 minutes.'}</p>}
    {stage === 1 && <div className="sample-times" role="group" aria-label={he ? 'שעות לדוגמה' : 'Sample times'}>
      {['09:30', '11:00', '14:30'].map(option => <button type="button" key={option} aria-pressed={option === time} onClick={() => setTime(option)}>{option}</button>)}
    </div>}
    {stage === 2 && <p>{he ? 'שעת הפגישה לדוגמה' : 'Example appointment time'} <strong>{time}</strong></p>}
    {stage === 3 && <p>{he ? 'תצוגת יומן ותזכורת להמחשה' : 'Illustrative calendar entry and reminder'} <strong>{time}</strong></p>}
  </div>
}

function EtlDemo({ stage, locale }: { stage: number; locale: Locale }) {
  const he = locale === 'he'
  return <table className="etl-table">
    <caption className="sr-only">{he ? 'רשומות בדויות עבור השלב הנבחר' : 'Fictional records for the selected stage'}</caption>
    <thead><tr><th scope="col">{he ? 'מזהה' : 'ID'}</th><th scope="col">{he ? 'ערך' : 'Value'}</th><th scope="col">{he ? 'מצב' : 'State'}</th></tr></thead>
    <tbody>{etlRows[stage].map(row => <tr key={row.id}>
      <th scope="row">{row.id}</th><td><bdi>{row.value || '—'}</bdi></td>
      <td>{stage === 0 ? (he ? 'גולמי' : 'Raw') : !row.value ? (he ? 'נדחה' : 'Rejected') : stage === 1 ? (he ? 'תקין' : 'Valid') : (he ? 'נטען' : 'Loaded')}</td>
    </tr>)}</tbody>
  </table>
}

export function Lab({ project, locale }: { project: LabProject; locale: Locale }) {
  const [stage, setStage] = useState(0)
  const [time, setTime] = useState('09:30')
  const he = locale === 'he'
  const sport = project.slug === 'sportreel'
  const churn = project.slug === 'customer-churn-prediction'
  return <div className="lab-shell">
    <div className="lab-heading"><p className="eyebrow"><i aria-hidden="true" />{labels[locale].illustrative}</p>
      {churn && <p>{he ? 'נתונים סינתטיים בלבד' : 'Synthetic data only'}</p>}
    </div>
    {sport ? <SportComparison locale={locale} /> : churn ? <ChurnDemo locale={locale} /> : <>
      <div className="step-controls" role="group" aria-label={he ? 'שלבי ההדגמה' : 'Demo stages'}>
        {project.steps.map((step, i) => <button key={step.title.en} type="button" aria-pressed={i === stage} onClick={() => setStage(i)}><span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>{step.title[locale]}</button>)}
      </div>
      <div className="lab-active" aria-live="polite">
        {project.slug === 'tori' && <BookingDemo stage={stage} time={time} setTime={setTime} locale={locale} />}
        {project.slug === 'etl-pipeline' && <EtlDemo stage={stage} locale={locale} />}
        {project.slug === 'ai-agent-system' && <h3>{project.steps[stage].title[locale]}</h3>}
        <p>{project.steps[stage].detail[locale]}</p>
      </div>
    </>}
  </div>
}
