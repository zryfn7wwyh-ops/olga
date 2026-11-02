import type { BlogPost } from "@/data/blog/types";
import { razdelImushchestvaPriRazvode } from "@/data/blog/articles/razdel-imushchestva-pri-razvode";
import { poryadokObshcheniyaSRebenkom } from "@/data/blog/articles/poryadok-obshcheniya-s-rebenkom";
import { kakPodgotovitsyaKKonsultacii } from "@/data/blog/articles/kak-podgotovitsya-k-konsultacii";

/**
 * Чтобы добавить новую статью: создайте файл в data/blog/articles/,
 * опишите в нём объект типа BlogPost и добавьте его сюда — без правок компонентов.
 */
export const posts: BlogPost[] = [
  razdelImushchestvaPriRazvode,
  poryadokObshcheniyaSRebenkom,
  kakPodgotovitsyaKKonsultacii,
];
