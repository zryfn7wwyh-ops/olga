import { Header } from "@/components/Header";
import { MobileCallBar } from "@/components/MobileCallBar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-paper pb-16 pt-28 lg:pb-20">
        <Container className="max-w-2xl text-center">
          <span className="font-display text-6xl font-semibold text-bronze sm:text-7xl">404</span>
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink sm:text-3xl">
            Страница не найдена
          </h1>
          <p className="mt-3 text-base leading-relaxed text-text-muted">
            Возможно, страница была перемещена или такого адреса никогда не существовало.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href="/" variant="primary" size="lg">
              На главную
            </Button>
            <Button href="/blog" variant="outline" size="lg">
              Все статьи
            </Button>
          </div>
        </Container>
      </main>
      <MobileCallBar />
      <Footer />
    </>
  );
}
