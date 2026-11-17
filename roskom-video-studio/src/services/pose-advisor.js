// Подбор позы маскота по смыслу сцены. Использует всю библиотеку — первоначальные позы (2–20.png,
// включая красного маскота) и новые (greeting, pointing, warning, joy, surprise, goodbye).
import { loadMascotManifest } from './asset-manager.js';

// [регулярное выражение по тексту сцены, позы по убыванию уместности]
const RULES = [
  [/штраф|санкци|наказ|нарушени|опасн|риск|ответственност|предписани/i, ['alarm', 'angry-coffee', 'warning']],
  [/утечк|слив|взлом|инцидент/i, ['overwhelmed', 'alarm', 'hurry']],
  [/хаос|завал|бумаг|куча|много документ/i, ['overwhelmed', 'documents', 'tired']],
  [/документ|политик|согласи|положени|приказ|папк|пакет/i, ['documents', 'reading', 'overwhelmed']],
  [/сайт|форм[аеуы]|онлайн|интернет|cookie|куки|crm|аналитик/i, ['laptop', 'phone', 'pointing']],
  [/клиент|телефон|заявк|звон|мессендж|рассылк/i, ['phone', 'laptop']],
  [/срок|успе|быстр|час[аов]|дн[еяй]|до \d|немедлен|сразу/i, ['hurry', 'alarm']],
  [/новост|изменени|поправк|вступ|с \d+ (январ|феврал|март|апрел|ма|июн|июл|август|сентябр|октябр|ноябр|декабр)/i, ['news', 'surprise']],
  [/миф|на самом деле|не так|заблужд/i, ['skeptical', 'shrug']],
  [/думаете|почему|зачем|как быть|что делать|\?/i, ['thinking', 'shrug', 'skeptical']],
  [/провер|аудит|изуч|прочит|разбер/i, ['reading', 'laptop', 'thinking']],
  [/проблем|потер|грустн|плохая новост|не работает/i, ['sad', 'tired', 'shrug']],
  [/рутин|устал|опять|надоел/i, ['tired', 'angry-coffee']],
  [/готов|решени|легко|просто|в порядке|правильн|защищ/i, ['cool', 'joy', 'happy']],
];
const BY_ROLE = {
  hook: ['surprise', 'skeptical', 'alarm', 'thinking', 'shrug'],
  problem: ['warning', 'sad', 'overwhelmed', 'alarm', 'tired'],
  mistake: ['alarm', 'shrug', 'overwhelmed', 'sad', 'angry-coffee'],
  myth: ['skeptical', 'shrug'],
  truth: ['reading', 'cool'],
  question: ['thinking', 'shrug'],
  answer: ['reading', 'cool'],
  headline: ['news', 'surprise'],
  value: ['reading', 'pointing', 'documents', 'laptop'],
  explain: ['reading', 'documents', 'pointing'],
  details: ['documents', 'reading', 'laptop'],
  what: ['reading', 'documents'], who: ['documents', 'phone'], todo: ['hurry', 'reading'],
  solution: ['cool', 'joy', 'happy', 'reading'],
  conclusion: ['cool', 'joy', 'happy'],
  cta: ['love', 'goodbye', 'happy'],
};
export const NEW_POSES = ['greeting', 'pointing', 'warning', 'joy', 'surprise', 'goodbye'];

/** Баллы поз для сцены: совпадения по смыслу (3/2/1 по порядку уместности) + бонус роли сцены. */
export function scorePoses(text, role) {
  const score = {};
  for (const [re, list] of RULES) {
    const hits = (text.match(new RegExp(re.source, 'gi')) || []).length;
    if (hits) list.forEach((p, i) => (score[p] = (score[p] || 0) + (3 - i) * Math.min(2, hits)));
  }
  const r = BY_ROLE[role] || BY_ROLE[String(role).replace(/\d+$/, '')] || [];
  r.forEach((p, i) => (score[p] = (score[p] || 0) + (role === 'cta' ? 100 : 5) - i * 0.5));
  return score;
}

/** Подсказка позы: смысл текста + роль сцены, без повторов. В призыве — только дружелюбные позы. */
export function suggestPose(text, role, used = []) {
  const poses = loadMascotManifest().poses;
  const ok = (p) => poses[p] && !poses[p].lipsync && !p.startsWith('talk') && !used.includes(p);
  const sc = scorePoses(text, role);
  const ranked = Object.entries(sc).filter(([p]) => ok(p) && (role !== 'cta' || BY_ROLE.cta.includes(p))).sort((a, b) => b[1] - a[1]);
  if (ranked.length) return ranked[0][0];
  return (BY_ROLE[role] || BY_ROLE[String(role).replace(/\d+$/, '')] || []).find(ok) || Object.keys(poses).find(ok) || 'neutral';
}

/** Предупреждения о разнообразии поз в раскадровке. */
export function poseVarietyWarnings(sb) {
  const used = sb.scenes.map((s) => s.mascot?.pose).filter(Boolean);
  const w = [];
  const distinct = new Set(used);
  if (used.length >= 4 && distinct.size < Math.min(4, used.length)) w.push(`Мало разных поз маскота (${distinct.size} на ${used.length} сцен) — используйте всю библиотеку`);
  if (used.length >= 4 && used.every((p) => NEW_POSES.includes(p))) w.push('Все позы — из новых (greeting, pointing, warning, joy, surprise, goodbye). Используйте и первоначальные: красный alarm для штрафов/рисков, documents для документов, laptop/phone для сайта, overwhelmed для утечек, hurry для сроков, news для новостей');
  sb.scenes.forEach((s, i) => {
    const prev = sb.scenes[i - 1];
    if (prev?.mascot && s.mascot && prev.mascot.pose === s.mascot.pose) w.push(`Сцены ${i} и ${i + 1}: одна и та же поза «${s.mascot.pose}» подряд`);
  });
  return w;
}
