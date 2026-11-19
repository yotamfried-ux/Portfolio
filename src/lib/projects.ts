import type { Bilingual } from './locale'
import { projectMedia, type Media } from './media'

type Step = { title: Bilingual; detail: Bilingual }
type Project = {
  slug: keyof typeof projectMedia
  title: Bilingual
  category: Bilingual
  summary: Bilingual
  status: 'verified' | 'pending'
  demoStatus: 'illustrative'
  problem: Bilingual
  role: Bilingual
  solution: Bilingual
  challenges: Bilingual
  outcome: Bilingual
  next: Bilingual
  stack: string[]
  steps: Step[]
  media: Media
}

const b = (en: string, he: string): Bilingual => ({ en, he })
const step = (en: string, he: string, detailEn: string, detailHe: string): Step => ({
  title: b(en, he), detail: b(detailEn, detailHe),
})

export const projects: Project[] = [
  {
    slug: 'sportreel', title: b('SportReel', 'SportReel'), category: b('Computer vision · Video', 'ראייה ממוחשבת · וידאו'),
    summary: b('Turn wide drone footage into sports clips that keep the athlete in focus.', 'מצילומי רחפן רחבים לקליפים שבהם הספורטאי במרכז.'),
    status: 'verified', demoStatus: 'illustrative',
    problem: b('In wide drone shots, the athlete can be hard to spot. A focused highlight reel needs to keep the athlete in frame and capture the right moments.', 'בצילומי רחפן רחבים לפעמים קשה להבחין בספורטאי. כדי ליצור סרטון רגעי שיא צריך להבליט אותו בפריים ולבחור את הרגעים המתאימים.'),
    role: b('Computer vision and video processing, from analyzing the source footage to preparing and exporting clips.', 'ראייה ממוחשבת ועיבוד וידאו, מניתוח צילומי המקור ועד להכנת קליפים ולייצואם.'),
    solution: b('The pipeline tracks the athlete to guide framing, chooses where each clip starts and ends, and exports an edit decision list (EDL) for the reel.', 'המערכת עוקבת אחר הספורטאי כדי לקבוע את המסגור, בוחרת את נקודת ההתחלה והסיום של כל קליפ ומייצאת רשימת החלטות עריכה (EDL) לסרטון.'),
    challenges: b('Keep the moving athlete in frame and preserve the chosen timing and crop when exporting.', 'לשמור על הספורטאי בפריים בזמן התנועה ולוודא שהתזמון והחיתוך שנבחרו נשמרים בייצוא.'),
    outcome: b('The code implements tracking, cropping, clip timing checks, and EDL export. Contract tests cover the export format.', 'קוד המקור כולל מעקב, חיתוך תמונה, בדיקת תזמון של קליפים וייצוא רשימת החלטות עריכה. בדיקות חוזה מכסות את פורמט הייצוא.'),
    next: b('Show approved source footage alongside the exported edit, with the point where an editor reviews the result.', 'להציג צילומי מקור מאושרים לצד הסרטון הערוך ולהראות באיזה שלב העורך בודק את התוצאה.'),
    stack: ['Python', 'FFmpeg'], media: projectMedia.sportreel,
    steps: [
      step('Source frame', 'תמונת מקור', 'Begin with a wide shot of the athlete and the surrounding terrain.', 'מתחילים בתמונה רחבה שבה רואים את הספורטאי ואת השטח שסביבו.'),
      step('Subject framing', 'מסגור הספורטאי', 'Crop the frame around the cyclist. This comparison uses an AI-generated image.', 'חותכים את התמונה כדי להבליט את רוכב האופניים. תמונת ההשוואה נוצרה בבינה מלאכותית.'),
      step('Clip selection', 'בחירת קליפים', 'Choose the start and end of each clip around a key moment.', 'בוחרים נקודת התחלה וסיום לכל קליפ לפי הרגע שרוצים להציג.'),
      step('Reel export', 'ייצוא הסרטון', 'Put the clips in sequence and record the edit decisions.', 'מסדרים את הקליפים ברצף ומתעדים את החלטות העריכה.'),
    ],
  },
  {
    slug: 'tori', title: b('Tori', 'תורי'), category: b('Full stack · Scheduling', 'פיתוח מקצה לקצה · תורים'),
    summary: b('Customers book available appointments. Businesses manage those bookings in a calendar.', 'לקוחות קובעים תורים בשעות פנויות ובעלי עסקים מנהלים את התורים ביומן.'),
    status: 'verified', demoStatus: 'illustrative',
    problem: b('Customers need to see which times are available. Businesses need an up-to-date view of the appointments customers have booked.', 'לקוחות צריכים לדעת אילו שעות פנויות, ובעלי עסקים צריכים יומן שמשקף את התורים שנקבעו בפועל.'),
    role: b('Full-stack development of the booking flow, availability rules, and tools for managing appointments.', 'פיתוח מקצה לקצה של תהליך קביעת התורים, כללי הזמינות וכלי ניהול התורים לעסק.'),
    solution: b('The booking page shows times based on the business’s availability rules. The business manages appointments in its calendar. A separate job handles customer reminders.', 'עמוד קביעת התורים מציג שעות לפי כללי הזמינות של העסק. העסק מנהל את התורים ביומן, ותהליך נפרד מטפל בתזכורות ללקוחות.'),
    challenges: b('Offer only valid start times and keep an appointment’s status independent of reminder delivery.', 'להציע רק שעות התחלה שעומדות בכללי הזמינות ולשמור על מצב התור גם אם התזכורת לא נמסרה.'),
    outcome: b('The code includes public booking routes, availability rules, calendar views for business owners, and reminder jobs. Tests cover booking and availability.', 'קוד המקור כולל נקודות קצה לקביעת תורים, כללי זמינות, תצוגות יומן לבעלי עסקים ותהליכי תזכורת. הבדיקות מכסות קביעת תורים ובדיקת זמינות.'),
    next: b('Record a walkthrough with an example business and approved demo data.', 'להקליט הדגמה של המערכת עם עסק לדוגמה ונתונים שאושרו לשימוש בהדגמה.'),
    stack: ['Next.js', 'TypeScript', 'PostgreSQL'], media: projectMedia.tori,
    steps: [
      step('Choose a service', 'בחירת שירות', 'Choose the service to book.', 'בוחרים את השירות שעבורו רוצים לקבוע תור.'),
      step('Check availability', 'בדיקת זמינות', 'Choose from the sample times for this service.', 'בוחרים שעה מתוך השעות שמוצגות בדוגמה.'),
      step('Review the booking', 'סקירת התור', 'Check the selected service and time before confirmation.', 'בודקים את השירות והשעה שנבחרו לפני אישור התור.'),
      step('Calendar & reminders', 'יומן ותזכורות', 'The business manages the appointment in its calendar. A separate job handles the reminder.', 'העסק מנהל את התור ביומן, ותהליך נפרד מטפל בתזכורת ללקוח.'),
    ],
  },
  {
    slug: 'ai-agent-system', title: b('AI Agent System', 'מערכת סוכני בינה מלאכותית'), category: b('AI · Orchestration', 'בינה מלאכותית · תזמור'),
    summary: b('Experiments in assigning software tasks to AI agents, checking their work, and reviewing the results.', 'ניסויים בחלוקת משימות תוכנה בין סוכני בינה מלאכותית, בבדיקת עבודתם ובסקירת התוצאות.'),
    status: 'verified', demoStatus: 'illustrative',
    problem: b('When agents work in stages, each needs to know what it receives, what it hands off, and when the result is ready for review.', 'כשסוכנים עובדים בשלבים, צריך להגדיר מה כל סוכן מקבל, מה הוא מעביר הלאה ומתי התוצאה מוכנה לבדיקה.'),
    role: b('Designing and evaluating experimental workflows for software engineering tasks.', 'תכנון והערכה של תהליכי עבודה ניסיוניים למשימות פיתוח תוכנה.'),
    solution: b('The experiments assign roles, validate workflow definitions before execution, and define how to record evidence for review.', 'הניסויים מגדירים תפקידים, בודקים את הגדרות התהליך לפני ההרצה וקובעים איך לתעד ממצאים שאפשר לבדוק בהמשך.'),
    challenges: b('Surface failures, make handoffs easy to review, and identify which steps ran automatically.', 'להציג כשלים, לאפשר בדיקה של מה שעבר בין הסוכנים ולהבהיר אילו שלבים רצו אוטומטית.'),
    outcome: b('The repositories include agents for specific tasks, workflow validation tests, and schemas for recording evidence.', 'המאגרים כוללים סוכנים למשימות מוגדרות, בדיקות לתהליכי העבודה וסכמות לתיעוד ממצאים.'),
    next: b('Share a run log with sensitive details removed, showing where approval was needed and what actually ran. n8n integration and fully autonomous execution still need verification.', 'לפרסם תיעוד הרצה לאחר הסרת פרטים רגישים, ולהראות באילו שלבים נדרש אישור ומה רץ בפועל. החיבור ל־n8n והרצה אוטונומית מלאה עדיין טעונים אימות.'),
    stack: ['Python', 'TypeScript'], media: projectMedia['ai-agent-system'],
    steps: [
      step('Plan', 'תכנון', 'Define the task and what a reviewer needs to check.', 'מגדירים את המשימה ואת מה שצריך לבדוק בתוצאה.'),
      step('Assign', 'הקצאת משימה', 'Give a clearly scoped task to an agent with a specific role.', 'מקצים משימה מוגדרת לסוכן שמתאים לה.'),
      step('Validate', 'אימות', 'Check the workflow structure and save the result for review.', 'בודקים את מבנה התהליך ושומרים את התוצאה לסקירה.'),
      step('Review', 'סקירה', 'A reviewer examines the results and decides what to do next.', 'הסוקר בוחן את התוצאות ומחליט כיצד להמשיך.'),
    ],
  },
  {
    slug: 'customer-churn-prediction', title: b('Customer Churn Prediction', 'חיזוי נטישת לקוחות'),
    category: b('Machine learning', 'למידת מכונה'),
    summary: b('Explore how a risk threshold changes which customer accounts are flagged for review.', 'הדגמה של השפעת סף הסיכון על בחירת חשבונות הלקוחות לבדיקה.'),
    status: 'pending', demoStatus: 'illustrative',
    problem: b('How can a team identify customers who may stop using a service and decide which accounts to review first?', 'איך אפשר לזהות לקוחות שעשויים להפסיק להשתמש בשירות ולהחליט אילו חשבונות כדאי לבדוק קודם?'),
    role: b('Project scope and individual contributions still need verification.', 'היקף הפרויקט והתרומה האישית עדיין טעונים אימות.'),
    solution: b('The demo assigns synthetic risk scores to sample accounts. Moving the threshold changes which accounts qualify for review.', 'ההדגמה מציגה ציוני סיכון סינתטיים לחשבונות לדוגמה. שינוי הסף קובע אילו חשבונות יסומנו לבדיקה.'),
    challenges: b('Define what counts as churn, decide which data to hold out for evaluation, and explain how the threshold is chosen.', 'להגדיר מה נחשב לנטישה, לבחור אילו נתונים יישמרו להערכה ולהסביר איך נקבע סף ההחלטה.'),
    outcome: b('The source repository, dataset, model, and evaluation results still need verification.', 'מאגר הקוד, מערך הנתונים, המודל ותוצאות ההערכה עדיין טעונים אימות.'),
    next: b('Confirm the source repository and review the dataset summary, evaluation metrics, and demo material before publication.', 'לאמת את מאגר הקוד ולבדוק את תקציר הנתונים, מדדי ההערכה וחומרי ההדגמה לפני הפרסום.'),
    stack: [], media: projectMedia['customer-churn-prediction'],
    steps: [
      step('Sample scores', 'ציונים לדוגמה', 'Each sample account has a synthetic risk score.', 'לכל חשבון בדוגמה יש ציון סיכון סינתטי.'),
      step('Threshold', 'סף החלטה', 'Move the threshold to see which accounts are flagged.', 'מזיזים את הסף ורואים אילו חשבונות מסומנים.'),
      step('Accounts to review', 'חשבונות לבדיקה', 'Accounts with a score at or above the threshold are flagged for review.', 'חשבונות עם ציון ששווה לסף או גבוה ממנו מסומנים לבדיקה.'),
    ],
  },
  {
    slug: 'etl-pipeline', title: b('ETL Pipeline', 'תהליך ETL'), category: b('Data engineering', 'הנדסת נתונים'),
    summary: b('An interactive example of extracting, cleaning, and loading data.', 'דוגמה אינטראקטיבית לחילוץ נתונים, ניקוי שלהם וטעינתם ליעד.'),
    status: 'pending', demoStatus: 'illustrative',
    problem: b('Raw records can arrive in different formats or with missing values. They need to be checked and standardized before other teams can use them.', 'רשומות גולמיות עלולות להגיע בפורמטים שונים או עם ערכים חסרים. צריך לבדוק אותן ולהאחיד את הפורמט לפני שצוותים אחרים יוכלו להשתמש בהן.'),
    role: b('Project scope and individual contributions still need verification.', 'היקף הפרויקט והתרומה האישית עדיין טעונים אימות.'),
    solution: b('The demo follows three fictional records through extraction, transformation, and loading. A record with a missing value is rejected before loading.', 'ההדגמה עוקבת אחר שלוש רשומות לדוגמה בשלבי החילוץ, העיבוד והטעינה. הרשומה עם הערך החסר נדחית לפני הטעינה.'),
    challenges: b('Decide how to handle invalid records and what should happen to data that has already been loaded when a run is retried.', 'לקבוע איך לטפל ברשומות לא תקינות ומה יקרה לנתונים שכבר נטענו אם מריצים את התהליך שוב.'),
    outcome: b('The source repository, technologies, and project outcomes still need verification.', 'מאגר הקוד, הטכנולוגיות ותוצאות הפרויקט עדיין טעונים אימות.'),
    next: b('Confirm the source repository and check how the pipeline works before documenting its technologies or sharing actual output.', 'לאמת את מאגר הקוד ולבדוק איך התהליך פועל לפני שמתעדים את הטכנולוגיות או מפרסמים תוצאות מהמערכת.'),
    stack: [], media: projectMedia['etl-pipeline'],
    steps: [
      step('Extract', 'חילוץ', 'Read three fictional records from the example input.', 'קוראים שלוש רשומות מקלט לדוגמה.'),
      step('Transform', 'עיבוד', 'Trim spaces from names and reject the record with a missing value.', 'מסירים רווחים מיותרים מהשמות ודוחים את הרשומה שחסר בה ערך.'),
      step('Load', 'טעינה', 'Load the two valid records into the example destination.', 'טוענים את שתי הרשומות התקינות ליעד לדוגמה.'),
    ],
  },
]

export function projectBySlug(slug: string) {
  return projects.find(project => project.slug === slug)
}
