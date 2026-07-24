import type { Metadata } from "next";
import { contacts } from "@/data/contacts";
import { Header } from "@/components/Header";
import { MobileCallBar } from "@/components/MobileCallBar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description:
    "Политика конфиденциальности, обработки персональных данных и использования файлов cookie сайта адвоката Аксёновой Аниты Георгиевны.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-paper pb-16 pt-28 lg:pb-20">
        <Container className="max-w-3xl">
          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            Политика конфиденциальности
          </h1>
          <p className="mt-3 text-sm text-text-muted">Действует с момента публикации сайта</p>

          <div className="mt-10 space-y-10 text-sm leading-relaxed text-text sm:text-base">
            <section>
              <h2 className="text-xl font-semibold text-ink">1. Общие положения</h2>
              <p className="mt-3">
                Настоящая политика описывает, как обрабатывается информация посетителей сайта
                адвоката {contacts.fullName} (далее — «Адвокат»). Сайт не содержит форм сбора
                контактных данных: единственный способ связи — телефонный звонок, а также переход
                в мессенджеры Telegram и MAX по инициативе посетителя.
              </p>
            </section>

            <section id="personal-data">
              <h2 className="text-xl font-semibold text-ink">
                2. Политика обработки персональных данных
              </h2>
              <p className="mt-3">
                Персональные данные, которые посетитель сообщает Адвокату по телефону, в
                мессенджере или на личной встрече, используются исключительно для рассмотрения
                обращения, подготовки правовой позиции и оказания юридической помощи. Такие
                данные, а также обстоятельства обращения, защищены адвокатской тайной в
                соответствии с Федеральным законом «Об адвокатской деятельности и адвокатуре в
                Российской Федерации».
              </p>
              <p className="mt-3">
                Сайт не передаёт персональные данные третьим лицам, за исключением случаев,
                прямо предусмотренных законодательством Российской Федерации.
              </p>
            </section>

            <section id="cookies">
              <h2 className="text-xl font-semibold text-ink">3. Файлы cookie и аналитика</h2>
              <p className="mt-3">
                Сайт может использовать файлы cookie и обезличенные данные веб-аналитики (в том
                числе сервиса Яндекс.Метрика) для оценки посещаемости и удобства сайта — например,
                для понимания того, какие разделы вызывают наибольший интерес. Эти данные не
                позволяют напрямую идентифицировать личность посетителя.
              </p>
              <p className="mt-3">
                Вы можете ограничить или отключить использование cookie в настройках своего
                браузера — это не помешает пользоваться основными функциями сайта.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-ink">4. Контакты</h2>
              <p className="mt-3">
                Вопросы, связанные с этой политикой, можно направить по телефону{" "}
                {contacts.phoneDisplay} или на email {contacts.email}.
              </p>
            </section>
          </div>
        </Container>
      </main>
      <MobileCallBar />
      <Footer />
    </>
  );
}
