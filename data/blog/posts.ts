import type { BlogPost } from "@/data/blog/types";
import { razdelImushchestvaPriRazvode } from "@/data/blog/articles/razdel-imushchestva-pri-razvode";
import { poryadokObshcheniyaSRebenkom } from "@/data/blog/articles/poryadok-obshcheniya-s-rebenkom";
import { kakPodgotovitsyaKKonsultacii } from "@/data/blog/articles/kak-podgotovitsya-k-konsultacii";
import { advokatPoDtpKrasnodar } from "@/data/blog/articles/advokat-po-dtp-krasnodar";
import { semeynyyAdvokatKrasnodar } from "@/data/blog/articles/semeynyy-advokat-krasnodar";
import { grazhdanskiyAdvokatKrasnodar } from "@/data/blog/articles/grazhdanskiy-advokat-krasnodar";
import { advokatVKrasnodareAksyonova } from "@/data/blog/articles/advokat-v-krasnodare-aksyonova";
import { advokatPoUgolovnymDelamKrasnodar } from "@/data/blog/articles/advokat-po-ugolovnym-delam-krasnodar";

/**
 * Чтобы добавить новую статью: создайте файл в data/blog/articles/,
 * опишите в нём объект типа BlogPost и добавьте его сюда — без правок компонентов.
 */
export const posts: BlogPost[] = [
  razdelImushchestvaPriRazvode,
  poryadokObshcheniyaSRebenkom,
  kakPodgotovitsyaKKonsultacii,
  advokatPoDtpKrasnodar,
  semeynyyAdvokatKrasnodar,
  grazhdanskiyAdvokatKrasnodar,
  advokatVKrasnodareAksyonova,
  advokatPoUgolovnymDelamKrasnodar,
];
