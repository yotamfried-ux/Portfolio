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
    summary: b('From wide drone footage to athlete-focused sports edits.', 'מצילומי רחפן רחבים לעריכת וידאו המתמקדת בספורטאי.'),
    status: 'verified', demoStatus: 'illustrative',
    problem: b('In wide drone footage, the action can be a small part of the frame. Turning that material into a focused reel means finding the athlete and choosing where each clip should start and end.', 'בצילומי רחפן רחבים, האקשן תופס לעיתים חלק קטן מהפריים. כדי ליצור סרטון ממוקד צריך לאתר את הספורטאי ולבחור היכן כל קליפ מתחיל ומסתיים.'),
    role: b('Computer vision and video pipeline engineering, from source footage through clip preparation and export.', 'פיתוח תהליכי ראייה ממוחשבת ועיבוד וידאו, מהצילומים המקוריים ועד להכנת קליפים וייצואם.'),
    solution: b('The pipeline uses subject tracks to inform framing, selects clip windows, and builds an edit decision list for the reel.', 'תהליך העיבוד נעזר במעקב אחר המצולם לקביעת המסגור, בוחר טווחי זמן לקליפים ובונה רשימת החלטות עריכה לסרטון.'),
    challenges: b('Maintain useful framing as the subject moves and keep clip timing and export geometry consistent.', 'לשמור על מסגור שימושי כשהמצולם בתנועה, ולתאם בין תזמון הקליפים למידות הייצוא.'),
    outcome: b('The source includes tracking and crop logic, clip-window checks, and edit decision list export with contract tests.', 'קוד המקור כולל לוגיקה למעקב ולחיתוך הפריים, בדיקות לטווחי הקליפים וייצוא רשימת החלטות עריכה עם בדיקות חוזה.'),
    next: b('Add approved source footage alongside the corresponding export and show where an editor reviews the result.', 'להוסיף צילומי מקור מאושרים לצד התוצר שיוצא מהם, ולהראות היכן העורך בודק את התוצאה.'),
    stack: ['Python', 'FFmpeg'], media: projectMedia.sportreel,
    steps: [
      step('Source frame', 'פריים מקורי', 'Start from a wide shot that contains the athlete and surrounding terrain.', 'מתחילים בשוט רחב הכולל את הספורטאי ואת השטח שסביבו.'),
      step('Subject framing', 'מסגור המצולם', 'The crop puts more emphasis on the cyclist. This comparison uses an AI-generated still.', 'החיתוך מדגיש את רוכב האופניים. ההשוואה מבוססת על תמונת המחשה שנוצרה בבינה מלאכותית.'),
      step('Clip selection', 'בחירת קליפים', 'Select useful time windows around the action.', 'בחירת טווחי זמן שימושיים סביב רגעי האקשן.'),
      step('Reel export', 'ייצוא הסרטון', 'Assemble the selected shots and record the editing decisions.', 'הרכבת השוטים שנבחרו ותיעוד החלטות העריכה.'),
    ],
  },
  {
    slug: 'tori', title: b('Tori', 'תורי'), category: b('Full stack · Scheduling', 'פיתוח מקצה לקצה · תורים'),
    summary: b('Appointment booking with customer-facing availability and a business calendar.', 'מערכת להזמנת תורים עם זמינות ללקוחות ויומן לניהול העסק.'),
    status: 'verified', demoStatus: 'illustrative',
    problem: b('Customers need to see times they can book, while businesses need a calendar that reflects what was actually scheduled.', 'לקוחות צריכים לראות אילו שעות זמינות להזמנה, ובעלי עסקים זקוקים ליומן המשקף את התורים שנקבעו בפועל.'),
    role: b('Full-stack scheduling, including booking routes, availability rules, and business-facing appointment management.', 'פיתוח מערכת תורים מקצה לקצה, כולל מסלולי הזמנה, כללי זמינות וניהול תורים לעסק.'),
    solution: b('A public booking flow offers time slots under availability rules. Business-facing tools manage appointments, while notification jobs handle reminders separately.', 'תהליך הזמנה ציבורי מציע משבצות זמן לפי כללי זמינות. כלי הניהול של העסק מטפלים בתורים, ומשימות נפרדות מטפלות בתזכורות.'),
    challenges: b('Keep offered start times aligned with availability rules and keep booking state independent of notification delivery.', 'להבטיח ששעות ההתחלה שמוצעות תואמות לכללי הזמינות, ולשמור על הפרדה בין סטטוס ההזמנה למסירת הודעות.'),
    outcome: b('The source contains public booking routes, availability logic, owner calendar views, reminder jobs, and booking and availability test coverage.', 'קוד המקור כולל מסלולי הזמנה ציבוריים, לוגיקת זמינות, תצוגות יומן לעסק, משימות תזכורת ובדיקות להזמנה ולזמינות.'),
    next: b('Record a walkthrough using an approved sample business with demonstration data.', 'להקליט סיור במערכת עם עסק לדוגמה ונתוני הדגמה מאושרים.'),
    stack: ['Next.js', 'TypeScript', 'PostgreSQL'], media: projectMedia.tori,
    steps: [
      step('Choose a service', 'בחירת שירות', 'Start with the service the customer wants to book.', 'מתחילים בשירות שהלקוח רוצה להזמין.'),
      step('Check availability', 'בדיקת זמינות', 'Review example time slots that could be offered for that service.', 'מוצגות משבצות זמן לדוגמה שאפשר להציע עבור השירות.'),
      step('Review the booking', 'סקירת התור', 'Summarize the chosen service and time before confirmation.', 'מציגים את השירות והשעה שנבחרו לפני האישור.'),
      step('Calendar & reminders', 'יומן ותזכורות', 'The business manages the appointment and the reminder job handles customer notifications.', 'העסק מנהל את התור, ומשימת התזכורת מטפלת בהודעות ללקוח.'),
    ],
  },
  {
    slug: 'ai-agent-system', title: b('AI Agent System', 'מערכת סוכני AI'), category: b('AI · Orchestration', 'בינה מלאכותית · תזמור'),
    summary: b('Experiments in coordinating software tasks, validation, and review.', 'ניסויים בתיאום משימות תוכנה, אימות ובקרה.'),
    status: 'verified', demoStatus: 'illustrative',
    problem: b('A multi-step agent workflow needs clear handoffs and a way to tell whether a result is ready for review.', 'תהליך רב־שלבי של סוכנים דורש העברת אחריות ברורה ודרך לדעת אם התוצאה מוכנה לסקירה.'),
    role: b('Design and evaluation of experimental engineering workflows and their validation rules.', 'תכנון והערכה של תהליכי עבודה הנדסיים ניסיוניים ושל כללי האימות שלהם.'),
    solution: b('The experiments define task roles and validate workflow definitions before execution. Evidence records give reviewers a place to inspect results.', 'הניסויים מגדירים תפקידים ובודקים את הגדרות תהליך העבודה לפני הרצה. רשומות ראיות מספקות מקום לבחון את התוצאות.'),
    challenges: b('Make failures visible, keep handoffs reviewable, and distinguish an automated step from an end-to-end autonomous run.', 'להציג כשלים, לאפשר בדיקה של העברות עבודה, ולהבחין בין שלב אוטומטי להרצה אוטונומית מלאה.'),
    outcome: b('The repositories contain task agents, workflow validation tests, and evidence schemas.', 'המאגרים כוללים סוכני משימות, בדיקות לאימות תהליכי עבודה וסכמות לתיעוד ראיות.'),
    next: b('Publish a redacted run with approval points and execution evidence. n8n integration and end-to-end autonomy are pending verification.', 'לפרסם תיעוד הרצה מטושטש עם נקודות אישור וראיות ביצוע. שילוב n8n ואוטונומיה מקצה לקצה ממתינים לאימות.'),
    stack: ['Python', 'TypeScript'], media: projectMedia['ai-agent-system'],
    steps: [
      step('Plan', 'תכנון', 'Describe the task and the evidence a reviewer would need.', 'מגדירים את המשימה ואת הראיות הנחוצות לסקירה.'),
      step('Assign', 'שיוך', 'Hand a bounded task to an agent with an explicit role.', 'מעבירים משימה מוגדרת לסוכן בעל תפקיד מפורש.'),
      step('Validate', 'אימות', 'Check workflow structure and collect the result for review.', 'בודקים את מבנה התהליך ואוספים את התוצאה לסקירה.'),
      step('Review', 'סקירה', 'A reviewer examines the evidence and decides how to proceed.', 'הגורם הסוקר בוחן את הראיות ומחליט כיצד להמשיך.'),
    ],
  },
  {
    slug: 'customer-churn-prediction', title: b('Customer Churn Prediction', 'חיזוי נטישת לקוחות'),
    category: b('Machine learning', 'למידת מכונה'),
    summary: b('A machine learning case study in preparation, with an interactive synthetic example.', 'מקרה בוחן בלמידת מכונה בהכנה, עם דוגמה סינתטית אינטראקטיבית.'),
    status: 'pending', demoStatus: 'illustrative',
    problem: b('Which accounts might stop using a service, and how could a team decide which to review?', 'אילו לקוחות עשויים להפסיק להשתמש בשירות, ואיך אפשר להחליט באילו מהם להתמקד?'),
    role: b('Project scope and individual contribution are pending verification.', 'היקף הפרויקט והתרומה האישית ממתינים לאימות.'),
    solution: b('The lab uses synthetic scores to illustrate how a decision threshold changes which sample accounts are flagged.', 'המעבדה משתמשת בציונים סינתטיים כדי להמחיש איך שינוי סף ההחלטה משפיע על סימון חשבונות לדוגמה.'),
    challenges: b('A verified case study needs a clear target definition, evaluation split, and an explanation of the decision threshold.', 'מקרה בוחן מאומת דורש הגדרה ברורה של משתנה המטרה, חלוקת נתונים להערכה והסבר על סף ההחלטה.'),
    outcome: b('Repository mapping, dataset, model, and evaluation results are pending verification.', 'שיוך המאגר, מערך הנתונים, המודל ותוצאות ההערכה ממתינים לאימות.'),
    next: b('Confirm the repository mapping and approve any dataset summary, metrics, and demo assets for publication.', 'לאמת את שיוך המאגר ולאשר לפרסום תקציר של הנתונים, מדדי הערכה וחומרי הדגמה.'),
    stack: [], media: projectMedia['customer-churn-prediction'],
    steps: [
      step('Sample scores', 'ציונים לדוגמה', 'Illustrative scores assigned to synthetic accounts.', 'ציוני המחשה המשויכים לחשבונות סינתטיים.'),
      step('Threshold', 'סף החלטה', 'Adjust the threshold to change how scores are grouped.', 'שנו את הסף כדי לשנות את חלוקת החשבונות לקבוצות.'),
      step('Review queue', 'תור לבדיקה', 'Accounts at or above the threshold are flagged in the example.', 'בדוגמה מסומנים חשבונות שהציון שלהם שווה לסף או גבוה ממנו.'),
    ],
  },
  {
    slug: 'etl-pipeline', title: b('ETL Pipeline', 'תהליך ETL'), category: b('Data engineering', 'הנדסת נתונים'),
    summary: b('An interactive extract, transform, and load schematic while the case study is prepared.', 'תרשים אינטראקטיבי של חילוץ, עיבוד וטעינה, בזמן שמקרה הבוחן נמצא בהכנה.'),
    status: 'pending', demoStatus: 'illustrative',
    problem: b('Raw records often need consistent formats and checks before downstream teams can work with them.', 'רשומות גולמיות דורשות לעיתים אחידות ובדיקות לפני שצוותים בהמשך התהליך יכולים להשתמש בהן.'),
    role: b('Project scope and individual contribution are pending verification.', 'היקף הפרויקט והתרומה האישית ממתינים לאימות.'),
    solution: b('The lab walks through extract, transform, and load using a small fictional input and an explicit example of a rejected row.', 'המעבדה מציגה חילוץ, עיבוד וטעינה עם קלט בדיוני קטן ודוגמה מפורשת לשורה שנדחתה.'),
    challenges: b('A verified case study needs to show how invalid records are handled and how retries affect loaded data.', 'מקרה בוחן מאומת צריך להראות מה קורה לרשומות לא תקינות וכיצד ניסיונות חוזרים משפיעים על הנתונים שנטענו.'),
    outcome: b('The repository association, technology choices, and project outcomes are pending verification.', 'שיוך המאגר, הטכנולוגיות ותוצאות הפרויקט ממתינים לאימות.'),
    next: b('Confirm the repository mapping and verify the implementation before documenting its stack or publishing real output.', 'לאמת את שיוך המאגר ואת המימוש לפני תיעוד הטכנולוגיות או פרסום תוצרים אמיתיים.'),
    stack: [], media: projectMedia['etl-pipeline'],
    steps: [
      step('Extract', 'חילוץ', 'Read three fictional input records.', 'קוראים שלוש רשומות קלט בדיוניות.'),
      step('Transform', 'עיבוד', 'Normalize names and set aside the row with a missing value.', 'מאחדים את פורמט השמות ומפרידים את השורה שחסר בה ערך.'),
      step('Load', 'טעינה', 'Write the two valid records to an illustrative destination.', 'כותבים את שתי הרשומות התקינות ליעד לדוגמה.'),
    ],
  },
]

export function projectBySlug(slug: string) {
  return projects.find(project => project.slug === slug)
}
