'use client'

export default function ErrorState({ reset }: { reset: () => void }) {
  return <main className="wrap state-page">
    <h1><span className="only-en">This page couldn’t load.</span><span className="only-he">לא הצלחנו לטעון את העמוד.</span></h1>
    <button className="button button-primary" onClick={reset}><span className="only-en">Try again</span><span className="only-he">טעינה מחדש</span></button>
  </main>
}
