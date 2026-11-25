import type { Bilingual } from './locale'
import { projectMedia, type Media } from './media'

type Step = { title: Bilingual; detail: Bilingual }
type Project = {
  slug: keyof typeof projectMedia
  title: Bilingual
  category: Bilingual
  discipline: 'ai' | 'full-stack' | 'data'
  summary: Bilingual
  status: 'verified' | 'pending'
  hidden?: boolean
  liveUrl?: string
  badge: Bilingual
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

const allProjects: Project[] = [
  {
    slug: 'sportreel', title: b('SportReel', 'SportReel'), category: b('Computer vision · Video', 'ראייה ממוחשבת · וידאו'),
    discipline: 'ai',
    summary: b('Turn wide drone footage into sports clips that keep the athlete in focus.', 'מצילומי רחפן רחבים לקליפים שבהם הספורטאי במרכז.'),
    badge: b('Computer vision pipeline', 'צינור עיבוד לראייה ממוחשבת'),
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
      step('Detection and tracking', 'זיהוי ומעקב', 'Locate the athlete in successive frames and follow their movement.', 'מזהים את הספורטאי בתמונות עוקבות ועוקבים אחר תנועתו.'),
      step('Subject framing', 'מסגור הספורטאי', 'Crop the frame around the cyclist. This comparison uses an illustrative image.', 'חותכים את התמונה כדי להבליט את רוכב האופניים. תמונת ההשוואה היא תמונת המחשה.'),
      step('Clip selection', 'בחירת קליפים', 'Choose the start and end of each clip around a key moment.', 'בוחרים נקודת התחלה וסיום לכל קליפ לפי הרגע שרוצים להציג.'),
      step('Reel export', 'ייצוא הסרטון', 'Put the clips in sequence and record the edit decisions.', 'מסדרים את הקליפים ברצף ומתעדים את החלטות העריכה.'),
    ],
  },
  {
    liveUrl: 'https://turim.d2ryf.com', slug: 'tori', title: b('Tori', 'תורי'), category: b('Full stack · Scheduling', 'פיתוח מקצה לקצה · תורים'),
    discipline: 'full-stack',
    summary: b('Customers book available appointments. Businesses manage those bookings in a calendar.', 'לקוחות קובעים תורים בשעות פנויות ובעלי עסקים מנהלים את התורים ביומן.'),
    badge: b('Full-stack product', 'מוצר מקצה לקצה'),
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
    discipline: 'ai',
    summary: b('Experiments in assigning software tasks to AI agents, checking their work, and reviewing the results.', 'ניסויים בחלוקת משימות תוכנה בין סוכני בינה מלאכותית, בבדיקת עבודתם ובסקירת התוצאות.'),
    badge: b('AI workflow experiments', 'ניסויים בתהליכי עבודה עם בינה מלאכותית'),
    status: 'verified', demoStatus: 'illustrative',
    problem: b('When agents work in stages, each needs to know what it receives, what it hands off, and when the result is ready for review.', 'כשסוכנים עובדים בשלבים, צריך להגדיר מה כל סוכן מקבל, מה הוא מעביר הלאה ומתי התוצאה מוכנה לבדיקה.'),
    role: b('Designing and evaluating experimental workflows for software engineering tasks.', 'תכנון והערכה של תהליכי עבודה ניסיוניים למשימות פיתוח תוכנה.'),
    solution: b('The experiments assign roles, validate workflow definitions before execution, and define how to record evidence for review.', 'הניסויים מגדירים תפקידים, בודקים את הגדרות התהליך לפני ההרצה וקובעים איך לתעד ממצאים שאפשר לבדוק בהמשך.'),
    challenges: b('Surface failures, make handoffs easy to review, and identify which steps ran automatically.', 'להציג כשלים, לאפשר בדיקה של מה שעבר בין הסוכנים ולהבהיר אילו שלבים רצו אוטומטית.'),
    outcome: b('The repositories include agents for specific tasks, workflow validation tests, and schemas for recording evidence.', 'המאגרים כוללים סוכנים למשימות מוגדרות, בדיקות לתהליכי העבודה וסכמות לתיעוד ממצאים.'),
    next: b('Publish a run log with sensitive details removed, showing where approval was needed and what actually ran.', 'לפרסם תיעוד הרצה לאחר הסרת פרטים רגישים, ולהראות באילו שלבים נדרש אישור ומה רץ בפועל.'),
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
    discipline: 'data',
    category: b('Machine learning', 'למידת מכונה'),
    summary: b('A churn model for telecom customers that reached 80.2% accuracy on customers it had not seen, and a scoring flow that runs on a MongoDB database.', 'מודל לחיזוי נטישה של לקוחות חברת תקשורת שהגיע ל־80.2% דיוק על לקוחות שלא נראו, ותהליך מתן ציונים שרץ על מסד נתונים MongoDB.'),
    badge: b('Machine learning project', 'פרויקט למידת מכונה'),
    status: 'verified', demoStatus: 'illustrative',
    problem: b('How can a team identify customers who may stop using a service and decide which accounts to review first?', 'איך אפשר לזהות לקוחות שעשויים להפסיק להשתמש בשירות ולהחליט אילו חשבונות כדאי לבדוק קודם?'),
    role: b('Final project in the Big Data Analyst course at the Technion, built on a public telecom churn dataset.', 'פרויקט גמר בקורס אנליסט ביג דאטה בטכניון, על מערך נתונים ציבורי של לקוחות חברת תקשורת.'),
    solution: b('The data was cleaned and encoded, and 61 configurations across three model families were compared. A random forest of 200 trees performed best. The interactive demo below uses synthetic scores to show how a decision threshold changes which accounts are flagged.', 'הנתונים נוקו וקודדו, ו־61 הגדרות בשלוש משפחות מודלים הושוו. יער אקראי של 200 עצים השיג את התוצאה הטובה ביותר. ההדגמה האינטראקטיבית למטה משתמשת בציונים סינתטיים כדי להראות איך סף ההחלטה משנה אילו חשבונות מסומנים.'),
    challenges: b('Define what counts as churn, decide which data to hold out for evaluation, and explain how the threshold is chosen.', 'להגדיר מה נחשב לנטישה, לבחור אילו נתונים יישמרו להערכה ולהסביר איך נקבע סף ההחלטה.'),
    outcome: b('On 1,409 held-out customers a random forest reached 80.2% accuracy (73.5% without a model), found 193 of 374 churners and raised 98 false alarms (AUC 0.84). The source repository is private and not linked.', 'על 1,409 לקוחות מקבוצת הבדיקה יער אקראי הגיע לדיוק של 80.2% (73.5% ללא מודל), זיהה 193 מתוך 374 נוטשים והעלה 98 התראות שווא (AUC 0.84). מאגר הקוד פרטי ואינו מקושר.'),
    next: b('Let visitors explore the decision threshold on the real test-set scores instead of synthetic ones.', 'לאפשר לבחון את סף ההחלטה על ציוני קבוצת הבדיקה האמיתיים במקום על ציונים סינתטיים.'),
    stack: ['Python', 'scikit-learn', 'MongoDB'], media: projectMedia['customer-churn-prediction'],
    steps: [
      step('Sample scores', 'ציונים לדוגמה', 'Each sample account has a synthetic risk score.', 'לכל חשבון בדוגמה יש ציון סיכון סינתטי.'),
      step('Threshold', 'סף החלטה', 'Move the threshold to see which accounts are flagged.', 'מזיזים את הסף ורואים אילו חשבונות מסומנים.'),
      step('Accounts to review', 'חשבונות לבדיקה', 'Accounts with a score at or above the threshold are flagged for review.', 'חשבונות עם ציון ששווה לסף או גבוה ממנו מסומנים לבדיקה.'),
    ],
  },
  {
    hidden: true, slug: 'etl-pipeline', title: b('ETL Pipeline', 'תהליך ETL'), category: b('Data engineering', 'הנדסת נתונים'),
    discipline: 'data',
    summary: b('An interactive example of extracting, cleaning, and loading data.', 'דוגמה אינטראקטיבית לחילוץ נתונים, ניקוי שלהם וטעינתם ליעד.'),
    badge: b('Data pipeline example', 'דוגמה לתהליך עיבוד נתונים'),
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

export const projects: Project[] = allProjects.filter(project => !project.hidden)

export function projectBySlug(slug: string) {
  return projects.find(project => project.slug === slug)
}
