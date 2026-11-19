import Link from 'next/link'

export default function NotFound() {
  return <main className="wrap state-page">
    <h1><span className="only-en">Page not found.</span><span className="only-he">העמוד לא נמצא.</span></h1>
    <Link href="/" className="button button-primary only-en">Back to the homepage</Link>
    <Link href="/he" className="button button-primary only-he">חזרה לדף הבית</Link>
  </main>
}
