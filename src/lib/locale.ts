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
    selected: 'Selected work', lab: 'Interactive lab', illustrative: 'Illustrative demo', illustrativeOverview: 'Illustrative overview',
    pending: 'Case study in preparation', verified: 'Implementation reviewed',
    problem: 'The problem', role: 'Project focus', solution: 'The approach', architecture: 'System overview',
    challenges: 'Engineering challenges', outcome: 'What the code shows', verification: 'What still needs verification', next: 'Next steps', stack: 'Technologies used',
    back: 'All projects', nextProject: 'Next project', education: 'Education & certifications',
    certificate: 'Technion Certified Big Data Analyst',
    certIssuer: 'Azrieli School of Continuing Studies of the Technion',
    certTraining: '200 hours of professional training',
    certDate: 'January 21, 2026',
    certImage: 'Technion professional training certificate issued to Yotam Friedman',
    certView: 'View full-size certificate',
    capabilities: 'Capabilities', aboutHeading: 'About me', contactHeading: 'Let’s talk.',
    footer: 'Personal portfolio', generated: 'AI-generated illustration',
  },
  he: {
    name: 'יותם פרידמן', work: 'עבודות', about: 'עליי', contact: 'יצירת קשר', allWork: 'כל הפרויקטים',
    skip: 'דילוג לתוכן הראשי', nav: 'ניווט ראשי', language: 'English', caseStudy: 'למקרה הבוחן',
    selected: 'עבודות נבחרות', lab: 'מעבדה אינטראקטיבית', illustrative: 'הדגמה', illustrativeOverview: 'תהליך להמחשה',
    pending: 'מקרה הבוחן בהכנה', verified: 'המימוש נבדק בקוד המקור',
    problem: 'הבעיה', role: 'מוקד הפרויקט', solution: 'הגישה', architecture: 'סקירת המערכת',
    challenges: 'האתגרים ההנדסיים', outcome: 'מה מופיע בקוד המקור', verification: 'מה עוד צריך לאמת', next: 'השלבים הבאים', stack: 'טכנולוגיות בפרויקט',
    back: 'כל הפרויקטים', nextProject: 'הפרויקט הבא', education: 'השכלה והסמכות',
    certificate: 'תעודת הכשרה מקצועית בניתוח ביג דאטה',
    certIssuer: 'בית הספר ללימודי המשך ע״ש עזריאלי של הטכניון',
    certTraining: 'הכשרה מקצועית בת 200 שעות',
    certDate: '21 בינואר 2026',
    certImage: 'תעודת ההכשרה המקצועית שהנפיק הטכניון ליותם פרידמן',
    certView: 'הצגת התעודה בגודל מלא',
    capabilities: 'תחומי עיסוק', aboutHeading: 'קצת עליי', contactHeading: 'בואו נדבר.',
    footer: 'תיק עבודות אישי', generated: 'תמונת המחשה שנוצרה בבינה מלאכותית',
  },
} as const
