import type { CaseItem } from "@/content/cases";
import s from "./showcase.module.css";

/**
 * Макет концепта. Одна вёрстка: на широкой рамке — версия для компьютера,
 * на узкой (контейнерный запрос) — для телефона.
 */
export function CasePreview({ item }: { item: CaseItem }) {
  const View = VIEWS[item.preview];
  return <View id={item.id} />;
}

const Detail = ({ id, className, children }: { id: string; className: string; children: React.ReactNode }) => (
  <div className={className} data-motion="detail-focus" data-motion-id={`detail-${id}`}>
    {children}
  </div>
);

const Head = ({ brand, links, cta, dark }: { brand: string; links: string[]; cta: string; dark?: boolean }) => (
  <div className={s.mHead}>
    <b>{brand}</b>
    <div className={s.mNav}>
      {links.map((l) => (
        <span key={l}>{l}</span>
      ))}
    </div>
    <span className={`${s.mBtn} ${dark ? s.mBtnDark : ""}`}>{cta}</span>
  </div>
);

const PhoneHead = ({ brand }: { brand: string }) => (
  <div className={s.mPhoneHead}>
    <span>{brand}</span>
    <i />
  </div>
);

const Product = ({ name }: { name: string }) => (
  <div className={s.mItem}>
    <div className={s.mImg} />
    <b>{name}</b>
    <span>Запросить цену →</span>
  </div>
);

const VIEWS: Record<CaseItem["preview"], (p: { id: string }) => React.ReactNode> = {
  landing: ({ id }) => (
    <>
      <div className={s.mDesk}>
        <Head brand="Инженерные системы" links={["Услуги", "Этапы", "Вопросы"]} cta="Рассчитать" />
        <div className={s.mHero}>
          <div>
            <p className={s.mTitle}>Монтаж отопления и вентиляции для коммерческих объектов</p>
            <p className={s.mText}>Проектирование, подбор оборудования и монтаж под ключ. Смету готовим по данным объекта.</p>
            <div className={s.mList}>
              <span>Выезд инженера на объект</span>
              <span>Смета с перечнем оборудования</span>
              <span>Исполнительная документация</span>
            </div>
          </div>
          <Detail id={`${id}-form`} className={s.mCard}>
            <b>Рассчитать смету</b>
            <span className={s.mInput}>Площадь объекта, м²</span>
            <span className={s.mInput}>Телефон</span>
            <span className={s.mBtn}>Получить смету</span>
          </Detail>
        </div>
      </div>
      <div className={s.mPhone}>
        <PhoneHead brand="Инженерные системы" />
        <div className={s.mPhoneBody}>
          <p className={s.mTitle}>Монтаж отопления и вентиляции</p>
          <span className={s.mInput}>Площадь объекта, м²</span>
          <span className={s.mInput}>Телефон</span>
          <span className={s.mBtn}>Получить смету</span>
        </div>
      </div>
    </>
  ),
  corporate: ({ id }) => (
    <>
      <div className={s.mDesk}>
        <Head brand="Консалтинг" links={["Услуги", "Отрасли", "О компании", "Контакты"]} cta="Обсудить задачу" dark />
        <div className={s.mIntro}>
          <p className={s.mTitle} style={{ maxWidth: 760 }}>
            Управленческий консалтинг для производственных компаний
          </p>
          <p className={s.mText} style={{ maxWidth: 560 }}>
            Помогаем выстроить процессы, планирование и финансовый контроль — от диагностики до внедрения.
          </p>
        </div>
        <Detail id={`${id}-cards`} className={s.mThree}>
          {[
            ["01", "Стратегия", "Цели, приоритеты и план развития"],
            ["02", "Операции", "Процессы, роли и регламенты"],
            ["03", "Финансы", "Бюджетирование и управленческий учёт"],
          ].map(([n, t, d]) => (
            <div key={n}>
              <i>{n}</i>
              <b>{t}</b>
              <span>{d}</span>
            </div>
          ))}
        </Detail>
        <div className={s.mBand}>
          <b>Обсудим задачу вашей компании</b>
          <p>Оставьте контакт — договоримся о встрече.</p>
        </div>
      </div>
      <div className={s.mPhone}>
        <PhoneHead brand="Консалтинг" />
        <div className={s.mPhoneBody}>
          <p className={s.mTitle}>Управленческий консалтинг</p>
          <div className={s.mStack}>
            <b>Стратегия</b>
            <span>Цели и план развития</span>
          </div>
          <div className={s.mStack}>
            <b>Операции</b>
            <span>Процессы и регламенты</span>
          </div>
          <span className={s.mBtn}>Обсудить задачу</span>
        </div>
      </div>
    </>
  ),
  catalog: ({ id }) => (
    <>
      <div className={s.mDesk}>
        <Head brand="Каталог оборудования" links={["Каталог", "Доставка", "Сервис"]} cta="Запросить КП" dark />
        <div className={s.mCatalog}>
          <Detail id={`${id}-filters`} className={s.mFilters}>
            <b>Категории</b>
            <span className={s.on}>Компрессоры</span>
            <span>Насосы</span>
            <span>Генераторы</span>
            <span>Сварочное</span>
            <b>Привод</b>
            <span className={s.on}>Электрический</span>
            <span>Дизельный</span>
          </Detail>
          <div className={s.mProducts}>
            {["Компрессор винтовой", "Компрессор поршневой", "Осушитель воздуха", "Ресивер", "Компрессор безмасляный", "Фильтр магистральный"].map(
              (n) => (
                <Product key={n} name={n} />
              ),
            )}
          </div>
        </div>
      </div>
      <div className={s.mPhone}>
        <PhoneHead brand="Каталог" />
        <div className={s.mPhoneBody}>
          <span className={s.mInput}>Поиск по каталогу</span>
          <Product name="Компрессор винтовой" />
          <Product name="Осушитель воздуха" />
        </div>
      </div>
    </>
  ),
};
