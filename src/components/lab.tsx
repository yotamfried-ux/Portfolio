'use client'

import Image from 'next/image'
import { useState } from 'react'
import { flaggedCount, sampleScores, etlRows } from '@/lib/demo'
import { labels, type Bilingual, type Locale } from '@/lib/locale'
import type { projectBySlug } from '@/lib/projects'
import { Arrow } from './arrow'

type Project = NonNullable<ReturnType<typeof projectBySlug>>
type LabProject = Pick<Project, 'slug' | 'steps'>

function SportComparison({ locale }: { locale: Locale }) {
  const [zoom, setZoom] = useState(0)
  const he = locale === 'he'
  const t = zoom / 100
  const scale = 1 + 1.2 * t
  // The zoom is anchored on the cyclist; the right edge stays pinned so the frame never shows blank space.
  const transform = `translate(${-21 * (scale - 1)}%, ${-18.5 * t}%) scale(${scale})`
  return <div className="comparison">
    <div className="compare-frame" dir="ltr">
      <div className="compare-zoom" style={{ transform }}>
        <Image src="/media/aerial-hero.webp" fill alt={he ? 'מבט אווירי על כביש ויער עם רוכב אופניים, בחיתוך שמשתנה לפי הסליידר' : 'Aerial view of a forest road with a cyclist, cropped in as the slider moves'} sizes="(max-width: 760px) 100vw, 65vw" />
      </div>
      <span className="compare-label compare-before" dir={he ? 'rtl' : 'ltr'}>{he ? 'תמונה רחבה' : 'Wide view'}</span>
      <span className="compare-label compare-after" dir={he ? 'rtl' : 'ltr'}>{he ? 'חיתוך לדוגמה' : 'Cropped view'}</span>
    </div>
    <label className="range-label" htmlFor="split">{he ? 'השוואת התמונה לפני ואחרי החיתוך' : 'Compare the wide and cropped views'}</label>
    <input id="split" type="range" min={0} max={100} value={zoom} dir="ltr" onChange={event => setZoom(event.target.valueAsNumber)} />
  </div>
}

function ChurnDemo({ locale }: { locale: Locale }) {
  const [threshold, setThreshold] = useState(60)
  const he = locale === 'he'
  return <div className="churn-demo">
    <div className="chart-controls">
      <label className="range-label" htmlFor="threshold">{he ? 'סף סיכון לבדיקה' : 'Risk threshold'} <output htmlFor="threshold">{threshold}</output></label>
      <input id="threshold" type="range" min={0} max={100} value={threshold} onChange={event => setThreshold(event.target.valueAsNumber)} />
      <p role="status">{he ? `${flaggedCount(threshold)} מתוך 5 חשבונות מסומנים לבדיקה` : `${flaggedCount(threshold)} of 5 sample accounts flagged for review`}</p>
    </div>
    <figure className="risk-chart">
      <div className="chart-plot" dir="ltr">
        <span className="chart-threshold" aria-hidden="true" style={{ insetBlockEnd: `${threshold}%` }} />
        <ul className="chart-bars" aria-label={he ? 'ציוני סיכון סינתטיים' : 'Synthetic risk scores'}>
          {sampleScores.map((score, index) => <li key={score} data-flagged={score >= threshold}>
            <div className="chart-bar" style={{ height: `${score}%` }}><span>{score}</span></div>
            <small>A0{index + 1}</small>
            <span className="sr-only">{score >= threshold ? (he ? 'מסומן לבדיקה' : 'Flagged for review') : (he ? 'מתחת לסף' : 'Below threshold')}</span>
          </li>)}
        </ul>
      </div>
      <figcaption className="chart-key">
        <span>{he ? 'סף לבדיקה' : 'Review threshold'}</span>
        <span>{he ? 'מסומן לבדיקה' : 'Flagged for review'}</span>
      </figcaption>
    </figure>
  </div>
}

function BookingDemo({ stage, time, setTime, locale }: {
  stage: number; time: string; setTime: (time: string) => void; locale: Locale
}) {
  const he = locale === 'he'
  const service = he ? 'פגישת ייעוץ לדוגמה' : 'Sample consultation'
  const duration = he ? '30 דקות' : '30 minutes'
  const calendar = he ? 'יומן העסק לדוגמה' : 'Sample business calendar'
  return <div className="booking-demo">
    <p className="eyebrow">{he ? 'קביעת תור לדוגמה' : 'Booking example'}</p>
    <h3>{service}</h3>
    {stage === 0 && <p>{he ? 'משך הפגישה: 30 דקות.' : 'Appointment length: 30 minutes.'}</p>}
    {stage === 1 && <div className="sample-times" role="group" aria-label={he ? 'שעות פנויות לדוגמה' : 'Example time slots'}>
      {['09:30', '11:00', '14:30'].map(option => <button type="button" key={option} aria-pressed={option === time} onClick={() => setTime(option)}>{option}</button>)}
    </div>}
    {stage === 2 && <dl className="sample-details">
      <div><dt>{he ? 'השעה שנבחרה' : 'Selected time'}</dt><dd><bdi>{time}</bdi></dd></div>
      <div><dt>{he ? 'משך הפגישה' : 'Duration'}</dt><dd>{duration}</dd></div>
    </dl>}
    {stage === 3 && <div className="booking-outcome">
      <section className="sample-calendar" aria-label={calendar}>
        <h4>{calendar}</h4>
        <dl>
          <dt><bdi>{time}</bdi></dt>
          <dd>{service} <span>{duration}</span></dd>
        </dl>
      </section>
      <section className="sample-reminder">
        <h4>{he ? 'תזכורת לדוגמה' : 'Sample reminder'}</h4>
        <p>{he ? 'תזכורת: פגישת הייעוץ שלך בשעה' : 'Reminder: your consultation is at'} <bdi>{time}</bdi>.</p>
      </section>
      <p className="booking-note">{he ? 'בהדגמה לא נקבע תור ולא נשלחת הודעה.' : 'The walkthrough does not book an appointment or send a reminder.'}</p>
    </div>}
  </div>
}

function EtlDemo({ stage, locale }: { stage: number; locale: Locale }) {
  const he = locale === 'he'
  return <table className="etl-table">
    <caption className="sr-only">{he ? 'רשומות לדוגמה בשלב הנבחר' : 'Sample records at the selected stage'}</caption>
    <thead><tr><th scope="col">{he ? 'מזהה' : 'ID'}</th><th scope="col">{he ? 'ערך' : 'Value'}</th><th scope="col">{he ? 'מצב הרשומה' : 'Record status'}</th></tr></thead>
    <tbody>{etlRows[stage].map(row => <tr key={row.id}>
      <th scope="row">{row.id}</th><td><bdi>{row.value || '—'}</bdi></td>
      <td>{stage === 0 ? (he ? 'גולמי' : 'Raw') : !row.value ? (he ? 'נדחה' : 'Rejected') : stage === 1 ? (he ? 'תקין' : 'Valid') : (he ? 'נטען' : 'Loaded')}</td>
    </tr>)}</tbody>
  </table>
}

const agentArtifacts: { input: Bilingual; output: Bilingual }[] = [
  { input: { en: 'A request to improve an error message', he: 'בקשה לשיפור הודעת שגיאה' },
    output: { en: 'A task description and criteria for review', he: 'תיאור המשימה וקריטריונים לבדיקה' } },
  { input: { en: 'The task description and review criteria', he: 'תיאור המשימה והקריטריונים לבדיקה' },
    output: { en: 'A task assigned to an agent that drafts copy', he: 'משימה שהוקצתה לסוכן שמנסח את ההודעה' } },
  { input: { en: 'The proposed copy and the workflow definition', he: 'הנוסח המוצע והגדרת תהליך העבודה' },
    output: { en: 'A result for review with the validation checks recorded', he: 'תוצאה לסקירה הכוללת תיעוד של בדיקות האימות' } },
  { input: { en: 'The proposed change and the recorded checks', he: 'השינוי המוצע ותיעוד הבדיקות' },
    output: { en: 'A reviewer’s decision to approve or request changes', he: 'החלטה של הסוקר לאשר או לבקש שינויים' } },
]

function AgentDemo({ stage, locale }: { stage: number; locale: Locale }) {
  const he = locale === 'he'
  const artifact = agentArtifacts[stage]
  return <dl className="sample-details">
    <div><dt>{he ? 'קלט לדוגמה' : 'Sample input'}</dt><dd>{artifact.input[locale]}</dd></div>
    <div><dt>{he ? 'תוצר לדוגמה' : 'Sample output'}</dt><dd>{artifact.output[locale]}</dd></div>
  </dl>
}

export function Lab({ project, locale }: { project: LabProject; locale: Locale }) {
  const [stage, setStage] = useState(0)
  const [time, setTime] = useState('09:30')
  const he = locale === 'he'
  const sport = project.slug === 'sportreel'
  const churn = project.slug === 'customer-churn-prediction'
  const agent = project.slug === 'ai-agent-system'
  const etl = project.slug === 'etl-pipeline'
  const flowLabel = agent
    ? (he ? 'תרשים תהליך עבודה עם סוכנים' : 'Agent workflow diagram')
    : etl ? (he ? 'שלבי תהליך ה־ETL' : 'ETL pipeline stages') : (he ? 'שלבי קביעת התור' : 'Booking walkthrough stages')
  return <div className="lab-shell">
    <div className="lab-heading"><p className="eyebrow"><i aria-hidden="true" />{labels[locale].illustrative}</p>
      {churn && <p>{he ? 'נתונים סינתטיים בלבד' : 'Synthetic data only'}</p>}
    </div>
    {sport ? <SportComparison locale={locale} /> : churn ? <ChurnDemo locale={locale} /> : <>
      <ol className="lab-flow" role="list" aria-label={flowLabel}>
        {project.steps.map((step, i) => <li key={step.title.en}>
          <button type="button" aria-pressed={i === stage} aria-controls="lab-stage" onClick={() => setStage(i)}>
            <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>{step.title[locale]}
          </button>
          {i < project.steps.length - 1 && <Arrow />}
        </li>)}
      </ol>
      <div className="lab-active" id="lab-stage">
        <div role="status">
          <h3>{project.steps[stage].title[locale]}</h3>
          <p>{project.steps[stage].detail[locale]}</p>
        </div>
        {project.slug === 'tori' && <BookingDemo stage={stage} time={time} setTime={setTime} locale={locale} />}
        {etl && <EtlDemo stage={stage} locale={locale} />}
        {agent && <AgentDemo stage={stage} locale={locale} />}
      </div>
    </>}
  </div>
}
