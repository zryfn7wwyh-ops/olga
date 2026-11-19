"use client";

import Script from "next/script";
import { useEffect } from "react";
import { METRIKA_ID } from "@/lib/analytics";
import { captureUtm } from "@/lib/utm";

/**
 * Яндекс Метрика подключается только при заданном NEXT_PUBLIC_YANDEX_METRIKA_ID.
 * Вебвизор выключен: он записывает ввод в формы (персональные данные).
 * Cookie-баннер и порядок согласия — после утверждения юридических требований (см. TODO_BEFORE_LAUNCH.md).
 */
export function Analytics() {
  useEffect(() => {
    captureUtm();
  }, []);

  if (!METRIKA_ID) return null;
  return (
    <Script id="yandex-metrika" strategy="afterInteractive">
      {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
ym(${METRIKA_ID},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:false});`}
    </Script>
  );
}
