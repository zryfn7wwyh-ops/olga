import { P } from './placeholders.js';

// Значения формата — демонстрационные категории для проверки работы фильтра.
export const formats = ['Очная', 'Очно-заочная', 'Дистанционная'];

const makeProgram = (n, format) => ({
  slug: `programma-${n}`,
  title: `Образовательная программа № ${n}`,
  short: 'Краткое описание программы будет добавлено после утверждения содержания. Здесь появится информация о направлении обучения.',
  description: P.text,
  format,
  hours: P.hours,
  audience: [
    'Описание первой категории слушателей будет добавлено.',
    'Описание второй категории слушателей будет добавлено.',
    'Описание третьей категории слушателей будет добавлено.',
  ],
  goal: P.text,
  results: [
    'Планируемый результат обучения № 1 [Информация уточняется]',
    'Планируемый результат обучения № 2 [Информация уточняется]',
    'Планируемый результат обучения № 3 [Информация уточняется]',
    'Планируемый результат обучения № 4 [Информация уточняется]',
  ],
  modules: [1, 2, 3, 4].map((m) => ({
    title: `Модуль ${m}. Наименование модуля`,
    hours: P.hours,
    topics: ['Тема 1. [Информация уточняется]', 'Тема 2. [Информация уточняется]', 'Тема 3. [Информация уточняется]'],
  })),
  duration: P.hours,
  form: P.tbd,
  technologies: P.tbd,
  language: P.tbd,
  teachers: [
    { name: P.person, position: P.position },
    { name: P.person, position: P.position },
  ],
  attestation: P.tbd,
  finalDocument: P.tbd,
  price: P.price,
  admission: P.text,
  documents: [
    { title: 'Учебный план', file: null },
    { title: 'Календарный учебный график', file: null },
    { title: 'Рабочие программы модулей', file: null },
  ],
});

export const programs = [
  makeProgram(1, 'Очная'),
  makeProgram(2, 'Дистанционная'),
  makeProgram(3, 'Очно-заочная'),
  makeProgram(4, 'Дистанционная'),
];

export const getProgram = (slug) => programs.find((p) => p.slug === slug);
