import { site } from "@/data/site";
import { TrackedLink } from "./TrackedLink";

/** Компактный переход к B2C-направлению. Намеренно не центральный. */
export function BankruptcyCTA() {
  return (
    <section aria-labelledby="b2c-title" className="bg-stone pb-16 lg:pb-24">
      <div className="container-x">
        <div className="flex flex-col gap-6 border border-line bg-ivory px-6 py-7 sm:px-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="b2c-title" className="text-[18px] font-semibold">
              Нужно списать долги как физическому лицу?
            </h2>
            <p className="mt-1 text-[15px] text-muted">Банкротство граждан — отдельное направление нашей практики.</p>
          </div>
          <TrackedLink
            goal="bankruptcy_page_click"
            params={{ placement: "b2c_block" }}
            href={site.bankruptcyUrl}
            className="btn btn-ghost group w-full shrink-0 !whitespace-normal text-center md:w-auto md:!whitespace-nowrap"
          >
            Перейти на страницу банкротства <span className="arrow" aria-hidden>→</span>
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
