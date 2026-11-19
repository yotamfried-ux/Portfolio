export const locales = ['en', 'he'] as const
export type Locale = typeof locales[number]
export type Bilingual<T = string> = Record<Locale, T>

export function isLocale(value: string): value is Locale {
  return value === 'en' || value === 'he'
}

export function href(locale: Locale, path = '') {
  return (locale === 'he' ? '/he' + path : path) || '/'
}

export const labels = {
  en: {
    name: 'Yotam Friedman', work: 'Work', about: 'About', contact: 'Contact', allWork: 'All projects',
    skip: 'Skip to content', nav: 'Main navigation', language: 'עברית', caseStudy: 'View case study',
    selected: 'Selected work', lab: 'Interactive lab', illustrative: 'Illustrative demo',
    pending: 'Case study in preparation', verified: 'Repository-backed case study',
    problem: 'The problem', role: 'Project focus', solution: 'The approach', architecture: 'System overview',
    challenges: 'Engineering challenges', outcome: 'What the source shows', next: 'Next steps', stack: 'Verified stack',
    back: 'All projects', nextProject: 'Next project', education: 'Education & certifications',
    certificate: 'Data Analyst professional training certificate', technion: 'Technion',
    certDetail: 'Official program title, completion year, and certificate image are pending verification.',
    capabilities: 'Capabilities', aboutHeading: 'About me', contactHeading: 'Let’s talk.',
    footer: 'Personal portfolio', generated: 'AI-generated concept still',
  },
  he: {
    name: 'יותם פרידמן', work: 'עבודות', about: 'אודות', contact: 'יצירת קשר', allWork: 'כל הפרויקטים',
    skip: 'דילוג לתוכן', nav: 'ניווט ראשי', language: 'English', caseStudy: 'למקרה הבוחן',
    selected: 'עבודות נבחרות', lab: 'מעבדה אינטראקטיבית', illustrative: 'הדגמה להמחשה',
    pending: 'מקרה הבוחן בהכנה', verified: 'מקרה בוחן המבוסס על קוד המקור',
    problem: 'הבעיה', role: 'מוקד הפרויקט', solution: 'הגישה', architecture: 'סקירת המערכת',
    challenges: 'האתגרים ההנדסיים', outcome: 'מה מופיע בקוד המקור', next: 'השלבים הבאים', stack: 'טכנולוגיות שאומתו',
    back: 'כל הפרויקטים', nextProject: 'הפרויקט הבא', education: 'השכלה והסמכות',
    certificate: 'תעודת הכשרה מקצועית בתחום ניתוח נתונים', technion: 'הטכניון',
    certDetail: 'שם התוכנית הרשמי, שנת הסיום ותמונת התעודה ממתינים לאימות.',
    capabilities: 'תחומי עיסוק', aboutHeading: 'קצת עליי', contactHeading: 'בואו נדבר.',
    footer: 'תיק עבודות אישי', generated: 'תמונת המחשה שנוצרה בבינה מלאכותית',
  },
} as const
