<div class="fComponent-modal overlay" v-show="options.modals.publication.visible" style="display:none;">
      <div class="content d-flex p-3 p-lg-5 flex-column rgap-30px" style="width:600px;">
		  <div class="col-12 d-flex justify-content-center"><div class="text-center h2" style="
    width: fit-content;
    padding: 10px 0;
		">
			   {{options.modals.publication.title}}
			  </div></div>
        <button type="button" class="swal2-close" aria-label="Close this dialog" style="display: block;" @click="closeCurrentModal">×</button>
		  <?=do_shortcode('[contact-form-7 id="" title="Рассчитать стоимость объявления - vestnic.online"]')?>
       
      </div>
</div>

<div class="fComponent-modal overlay" v-show="options.modals.consultingModal.visible" style="display:none;">
      <div class="content d-flex p-3 p-lg-5 flex-column rgap-30px" style="width:600px;">
		  <div class="col-12 d-flex justify-content-center"><div class="text-center h2" style="
    width: fit-content;
    padding: 10px 0;
		">
			   {{options.modals.consultingModal.title}}
			  </div></div>
        <button type="button" class="swal2-close" aria-label="Close this dialog" style="display: block;" @click="closeCurrentModal">×</button>
		  <?=do_shortcode('[contact-form-7 id="" title="Получить консультацию - vestnic.online"]')?>
       
      </div>
</div>

<div class="fComponent-modal overlay" v-show="options.modals.callModal.visible" style="display:none;">
      <div class="content d-flex p-3 p-lg-5 flex-column rgap-30px" style="width:600px;">
		  <div class="col-12 d-flex justify-content-center"><div class="text-center h2" style="
    width: fit-content;
    padding: 10px 0;
		">
			   {{options.modals.callModal.title}}
			  </div></div>
        <button type="button" class="swal2-close" aria-label="Close this dialog" style="display: block;" @click="closeCurrentModal">×</button>
		  <?=do_shortcode('[contact-form-7 id="" title="Заказать звонок - vestnic.online"]')?>
       
      </div>
</div>


<!-- счёт -->
<div class="fComponent-modal overlay" v-show="options.modals.payment_1.visible" style="display:none;">
      <div class="content d-flex p-3 p-lg-5 flex-column rgap-30px" style="width:600px;">
		  <div class="col-12 d-flex justify-content-center"><div class="text-center h2" style="
    width: fit-content;
    padding: 10px 0;
		">
			   {{options.modals.payment_1.title}}
			  </div></div>
        <button type="button" class="swal2-close" aria-label="Close this dialog" style="display: block;" @click="closeCurrentModal">×</button>
		  <?=do_shortcode('[contact-form-7 id="" title="Рассчитать стоимость публикации (Оплата по реквизитам через перевод) - vestnic.online"]')?>
       
      </div>
</div>



<!-- карта -->
<div class="fComponent-modal overlay" v-show="options.modals.payment_2.visible" style="display:none;">
      <div class="content d-flex p-3 p-lg-5 flex-column rgap-30px" style="width:600px;">
		  <div class="col-12 d-flex justify-content-center"><div class="text-center h2" style="
    width: fit-content;
    padding: 10px 0;
		">
			   {{options.modals.payment_2.title}}
			  </div></div>
        <button type="button" class="swal2-close" aria-label="Close this dialog" style="display: block;" @click="closeCurrentModal">×</button>
		  <?=do_shortcode('[contact-form-7 id="" title="Рассчитать стоимость публикации (Оплата банковской картой) - vestnic.online"]')?>
       
      </div>
</div>


<!-- письмо -->
<div class="fComponent-modal overlay" v-show="options.modals.payment_3.visible" style="display:none;">
      <div class="content d-flex p-3 p-lg-5 flex-column rgap-30px" style="width:600px;">
		  <div class="col-12 d-flex justify-content-center"><div class="text-center h2" style="
    width: fit-content;
    padding: 10px 0;
		">
			   {{options.modals.payment_3.title}}
			  </div></div>
        <button type="button" class="swal2-close" aria-label="Close this dialog" style="display: block;" @click="closeCurrentModal">×</button>
		  <?=do_shortcode('[contact-form-7 id="" title="Рассчитать стоимость публикации (Отсрочка оплаты по гарантийному письму) - vestnic.online"]')?>
       
      </div>
</div>

<!-- exitpopup -->
<!-- письмо -->
<div class="fComponent-modal overlay" v-show="options.modals.exitPopup.visible" style="display:none;">
      <div class="content d-flex p-0 flex-column rgap-30px" style="width:945px;border-radius: 10px;background: #E3EAF8;" >
		  <div class="col-12 d-flex flex-wrap flex-lg-nowrap">
			  <div class="col-12 col-lg-6 p-3 p-lg-5">
					<h4 class="textSize-20px-900 mt-40px">
						Экономия 30% стоимости публикации в Вестнике при самостоятельном размещении
				  </h4>
				  <p class="textSize=13px-400">
					  Сформируем такой текст сообщения, который не даст редакции Вестника продать вам площадь публикации в журнале на 30% дороже. Сравните стоимость публикаций в Вестнике гос. регистрации через наш сервис и сэкономьте 30% затрат
				  </p>
				     <button class="vo-btn bg-vo-primary-linear type-2 py-2 w-fit px-3 textSize-16px-400"
						@click="closeCurrentModal(), options.modals.generationForm.visible=true, options.modals.generationForm.title = 'Сгенерировать текст'"
						>Сгенерировать оптимизированный текст сообщения</button>
			  </div>
				
			   <div class="col-12 col-lg-6 d-flex justify-content-end align-items-end align-content-end">
				   <img src="/wp-content/uploads/2024/01/Group-1.png" />
			  </div>
		  </div>
        <button type="button" class="swal2-close" aria-label="Close this dialog" style="display: block;" @click="closeCurrentModal">×</button>

		  
       
      </div>
</div>



<!-- генерация -->
<div class="fComponent-modal overlay" v-show="options.modals.generationForm.visible" style="display:none;">
      <div class="content d-flex p-3 p-lg-5 flex-column rgap-30px" style="width:600px;">
		  <div class="col-12 d-flex justify-content-center"><div class="text-center h2" style="
    width: fit-content;
    padding: 10px 0;
		">
			   {{options.modals.generationForm.title}}
			  </div></div>
        <button type="button" class="swal2-close" aria-label="Close this dialog" style="display: block;" @click="closeCurrentModal">×</button>
		  <?=do_shortcode('[contact-form-7 id="" title="Форма при выходе с сайта"]')?>
       
      </div>
</div>


<!-- Второй экзит попап -->
<div class="fComponent-modal overlay" v-show="options.modals.exitPopup_2.visible" style="display:none;">	
	<div class="customCuntent bg" v-show="options.modals.exitPopup_2.formVisible">
		<div class="w-60">
	<?=do_shortcode('[contact-form-7 id="7296ed5" title="Форма при выходе с сайта (новая версия)"]');?>
		</div>
					</div>
</div>



<!-- картинка -->
<div class="fComponent-modal overlay" v-show="options.modals.imageModal.visible" style="display:none;">
      <div class="content d-flex p-3 p-lg-5 flex-column rgap-30px" style="width:600px;">
		  <div class="col-12 d-flex justify-content-center"></div>
        <button type="button" class="swal2-close" aria-label="Close this dialog" style="display: block;" @click="closeCurrentModal">×</button>
		
		  
		          <div class="swiper-container docModalSwiper" v-if="arrayImagesModal!=[]">
                <div class="swiper-wrapper">
 
                        <div class="swiper-slide" v-for="(i, index) in arrayImagesModal">
                            <img  :alt="'Слайд '+index" :src="i">
                        </div>

                </div>
                <div class="swiper-pagination"></div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
       
      </div>
</div>

<!-- Дополнительная форма ликвидация -->
<div class="fComponent-modal overlay" v-show="options.modals.licvidationsModal.visible" style="display:none;">
  <div class="content" style="width:880px;">
    <div class="inner_new_modal_leads">
        <div class="column_info_leads">
            <div class="title_new_modal_lead">Вам нужна консультация по процедуре ликвидации или подготовке документов для ФНС?</div>
        </div>
        <div class="column_form_leads">
            <?=do_shortcode('[contact-form-7 id="8af1134" title="Консультация по процедуре ликвидации или подготовке документов для ФНС - vestnic.online"]')?>
        </div>
    </div>
    <button type="button" class="swal2-close" aria-label="Close this dialog" style="display: block;" @click="closeCurrentModal">×</button>
  </div>
</div>

<!-- BLAGO -->
<div class="fComponent-modal overlay" v-show="options.modals.blagoPopup.visible" style="display:none;">
      <div class="content d-flex p-3 p-lg-5 flex-column rgap-30px" style="width:600px;">
		  <div class="col-12 d-flex justify-content-center"></div>
        <button type="button" class="swal2-close" aria-label="Close this dialog" style="display: block;" @click="closeCurrentModal">×</button>
		
		  
 <div class="elementor-image-carousel-wrapper swiper-container blagoPopup swiper-container-initialized swiper-container-horizontal"
             dir="ltr">
            <div class="elementor-image-carousel swiper-wrapper blago"
                 style="transition-duration: 0ms; transform: translate3d(-5320px, 0px, 0px);">
				
				 <div class="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="21"
                     style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="/wp-content/uploads/2024/02/Снимок-отзыв-1.png"
                                                            alt="Отзыв вестник онлайн 2024 02"></figure>
                </div>
				
				 <div class="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="21"
                     style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="/wp-content/uploads/2024/02/image-348.png"
                                                            alt="review386"></figure>
                </div>
				
				
                <div class="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="20"
                     style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review07.jpg"
                                                            alt="review07.jpg"></figure>
                </div>
                <div class="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="21"
                     style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review06.jpg"
                                                            alt="review06.jpg"></figure>
                </div>
                <div class="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="22"
                     style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review05.jpg"
                                                            alt="review05.jpg"></figure>
                </div>
                <div class="swiper-slide" data-swiper-slide-index="0" style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review01.jpg"
                                                            alt="review01.jpg"></figure>
                </div>
                <div class="swiper-slide" data-swiper-slide-index="1" style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review24.jpg"
                                                            alt="review24.jpg"></figure>
                </div>
                <div class="swiper-slide" data-swiper-slide-index="2" style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review02.jpg"
                                                            alt="review02.jpg"></figure>
                </div>
                <div class="swiper-slide" data-swiper-slide-index="3" style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review04.jpg"
                                                            alt="review04.jpg"></figure>
                </div>
                <div class="swiper-slide" data-swiper-slide-index="4" style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review03.jpg"
                                                            alt="review03.jpg"></figure>
                </div>
                <div class="swiper-slide" data-swiper-slide-index="5" style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review23.jpg"
                                                            alt="review23.jpg"></figure>
                </div>
                <div class="swiper-slide" data-swiper-slide-index="6" style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review22.jpg"
                                                            alt="review22.jpg"></figure>
                </div>
                <div class="swiper-slide" data-swiper-slide-index="7" style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review21.jpg"
                                                            alt="review21.jpg"></figure>
                </div>
                <div class="swiper-slide" data-swiper-slide-index="8" style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review20.jpg"
                                                            alt="review20.jpg"></figure>
                </div>
                <div class="swiper-slide" data-swiper-slide-index="9" style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review19.jpg"
                                                            alt="review19.jpg"></figure>
                </div>
                <div class="swiper-slide swiper-slide-prev" data-swiper-slide-index="10"
                     style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review18.jpg"
                                                            alt="review18.jpg"></figure>
                </div>
                <div class="swiper-slide swiper-slide-active" data-swiper-slide-index="11"
                     style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review17.jpg"
                                                            alt="review17.jpg"></figure>
                </div>
                <div class="swiper-slide swiper-slide-next" data-swiper-slide-index="12"
                     style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review16.jpg"
                                                            alt="review16.jpg"></figure>
                </div>
                <div class="swiper-slide" data-swiper-slide-index="13" style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review14.jpg"
                                                            alt="review14.jpg"></figure>
                </div>
                <div class="swiper-slide" data-swiper-slide-index="14" style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review13.jpg"
                                                            alt="review13.jpg"></figure>
                </div>
                <div class="swiper-slide" data-swiper-slide-index="15" style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review12.jpg"
                                                            alt="review12.jpg"></figure>
                </div>
                <div class="swiper-slide" data-swiper-slide-index="16" style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review11.jpg"
                                                            alt="review11.jpg"></figure>
                </div>
                <div class="swiper-slide" data-swiper-slide-index="17" style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review10.jpg"
                                                            alt="review10.jpg"></figure>
                </div>
                <div class="swiper-slide" data-swiper-slide-index="18" style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review09.jpg"
                                                            alt="review09.jpg"></figure>
                </div>
                <div class="swiper-slide" data-swiper-slide-index="19" style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review08.jpg"
                                                            alt="review08.jpg"></figure>
                </div>
                <div class="swiper-slide" data-swiper-slide-index="20" style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review07.jpg"
                                                            alt="review07.jpg"></figure>
                </div>
                <div class="swiper-slide" data-swiper-slide-index="21" style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review06.jpg"
                                                            alt="review06.jpg"></figure>
                </div>
                <div class="swiper-slide" data-swiper-slide-index="22" style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review05.jpg"
                                                            alt="review05.jpg"></figure>
                </div>
                <div class="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="0"
                     style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review01.jpg"
                                                            alt="review01.jpg"></figure>
                </div>
                <div class="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="1"
                     style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review24.jpg"
                                                            alt="review24.jpg"></figure>
                </div>
                <div class="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="2"
                     style="width: 360px; margin-right: 20px;">
                    <figure class="swiper-slide-inner"><img class="swiper-slide-image"
                                                            src="https://vestnic.online/wp-content/uploads/2021/08/review02.jpg"
                                                            alt="review02.jpg"></figure>
                </div>
            </div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
		
		</div>
       
      </div>
</div>


<!-- WRITER -->

<div class="fComponent-modal overlay" v-show="options.modals.writerPopup.visible" style="display:none;">
      <div class="content d-flex p-3 p-lg-5 flex-column rgap-30px" style="width:600px;">
          <div class="col-12 d-flex justify-content-center"></div>
        <button type="button" class="swal2-close" aria-label="Close this dialog" style="display: block;" @click="closeCurrentModal">×</button>
        
          
<div class="elementor-image-carousel-wrapper writerPopup swiper-container swiper-container-initialized swiper-container-horizontal" dir="ltr">
    <div class="elementor-image-carousel swiper-wrapper" style="transition-duration: 0ms; transform: translate3d(-3542.5px, 0px, 0px);">
        <div class="swiper-slide swiper-slide-duplicate" style="width: 252.5px; margin-right: 20px;" data-swiper-slide-index="4">
            <figure class="swiper-slide-inner">
                <img
                    class="swiper-slide-image"
                    src="https://vestnic.online/wp-content/uploads/2026/08/5-red.jpg"
                    alt="Письменная благодарность 5"
                />
            </figure>
        </div>
        <div class="swiper-slide swiper-slide-duplicate" style="width: 252.5px; margin-right: 20px;" data-swiper-slide-index="5">
            <figure class="swiper-slide-inner">
                <img
                    class="swiper-slide-image"
                    src="https://vestnic.online/wp-content/uploads/2026/08/6-red.jpg"
                    alt="Письменная благодарность 6"
                />
            </figure>
        </div>
        <div class="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-prev" style="width: 252.5px; margin-right: 20px;" data-swiper-slide-index="6">
            <figure class="swiper-slide-inner">
                <img
                    class="swiper-slide-image"
                    src="https://vestnic.online/wp-content/uploads/2026/08/7-red.jpg"
                    alt="Письменная благодарность 7"
                />
            </figure>
        </div>
        <div class="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-active" style="width: 252.5px; margin-right: 20px;" data-swiper-slide-index="7">
            <figure class="swiper-slide-inner">
                <img
                    class="swiper-slide-image"
                    src="https://vestnic.online/wp-content/uploads/2026/08/8-red.jpg"
                    alt="Письменная благодарность 8"
                />
            </figure>
        </div>
        <div class="swiper-slide" style="width: 252.5px; margin-right: 20px;" data-swiper-slide-index="0">
            <figure class="swiper-slide-inner">
                <img class="swiper-slide-image" src="https://vestnic.online/wp-content/uploads/2026/08/1-red.jpg" alt="Письменная благодарность 1" />
            </figure>
        </div>
        <div class="swiper-slide" style="width: 252.5px; margin-right: 20px;" data-swiper-slide-index="1">
            <figure class="swiper-slide-inner">
                <img class="swiper-slide-image" src="https://vestnic.online/wp-content/uploads/2026/08/2-red.jpg" alt="Письменная благодарность 2" />
            </figure>
        </div>
        <div class="swiper-slide" style="width: 252.5px; margin-right: 20px;" data-swiper-slide-index="2">
            <figure class="swiper-slide-inner">
                <img class="swiper-slide-image" src="https://vestnic.online/wp-content/uploads/2026/08/3-red.jpg" alt="Письменная благодарность 3" />
            </figure>
        </div>
        <div class="swiper-slide" style="width: 252.5px; margin-right: 20px;" data-swiper-slide-index="3">
            <figure class="swiper-slide-inner">
                <img class="swiper-slide-image" src="https://vestnic.online/wp-content/uploads/2026/08/4-red.jpg" alt="Письменная благодарность 4" />
            </figure>
        </div>
        <div class="swiper-slide" style="width: 252.5px; margin-right: 20px;" data-swiper-slide-index="4">
            <figure class="swiper-slide-inner">
                <img
                    class="swiper-slide-image"
                    src="https://vestnic.online/wp-content/uploads/2026/08/5-red.jpg"
                    alt="Письменная благодарность 5"
                />
            </figure>
        </div>
        <div class="swiper-slide" style="width: 252.5px; margin-right: 20px;" data-swiper-slide-index="5">
            <figure class="swiper-slide-inner">
                <img
                    class="swiper-slide-image"
                    src="https://vestnic.online/wp-content/uploads/2026/08/6-red.jpg"
                    alt="Письменная благодарность 6"
                />
            </figure>
        </div>
        <div class="swiper-slide" style="width: 252.5px; margin-right: 20px;" data-swiper-slide-index="6">
            <figure class="swiper-slide-inner">
                <img
                    class="swiper-slide-image"
                    src="https://vestnic.online/wp-content/uploads/2026/08/7-red.jpg"
                    alt="Письменная благодарность 7"
                />
            </figure>
        </div>
        <div class="swiper-slide" style="width: 252.5px; margin-right: 20px;" data-swiper-slide-index="7">
            <figure class="swiper-slide-inner">
                <img
                    class="swiper-slide-image"
                    src="https://vestnic.online/wp-content/uploads/2026/08/8-red.jpg"
                    alt="Письменная благодарность 8"
                />
            </figure>
        </div>
        <div class="swiper-slide swiper-slide-duplicate" style="width: 252.5px; margin-right: 20px;" data-swiper-slide-index="0">
            <figure class="swiper-slide-inner">
                <img class="swiper-slide-image" src="https://vestnic.online/wp-content/uploads/2026/08/1-red.jpg" alt="Письменная благодарность 1" />
            </figure>
        </div>
        <div class="swiper-slide swiper-slide-duplicate" style="width: 252.5px; margin-right: 20px;" data-swiper-slide-index="1">
            <figure class="swiper-slide-inner">
                <img class="swiper-slide-image" src="https://vestnic.online/wp-content/uploads/2026/08/2-red.jpg" alt="Письменная благодарность 2" />
            </figure>
        </div>
        <div class="swiper-slide swiper-slide-duplicate" style="width: 252.5px; margin-right: 20px;" data-swiper-slide-index="2">
            <figure class="swiper-slide-inner">
                <img class="swiper-slide-image" src="https://vestnic.online/wp-content/uploads/2026/08/3-red.jpg" alt="Письменная благодарность 3" />
            </figure>
        </div>
        <div class="swiper-slide swiper-slide-duplicate" style="width: 252.5px; margin-right: 20px;" data-swiper-slide-index="3">
            <figure class="swiper-slide-inner">
                <img class="swiper-slide-image" src="https://vestnic.online/wp-content/uploads/2026/08/4-red.jpg" alt="Письменная благодарность 4" />
            </figure>
        </div>
    </div>
<div class="swiper-button-prev"></div>
<div class="swiper-button-next"></div>
</div>
       
      </div>
</div>


<!-- Дополнительная форма ликвидация -->
<div class="fComponent-modal overlay" v-show="options.modals.licvidModal.visible" style="display:none;">
  <div class="content" style="width:880px;">
    <div class="wrap_modal_licvidations">
        <div class="col_info_licvidation">
            <div class="title_licvid">Компания больше не работает?</div>
            <div class="subtitle_licvid">Закройте её официально</div>
            <div class="text_licvid">Избавим от отчетности, рисков и лишних расходов</div>
            <div class="box_item_licvidation">
                <div class="little_title_licvid">Упрощенная ликвидация</div>
                <div class="sum_licvid_new">от 15 000 ₽</div>
                <div class="sum_licvid_old">вместо <span>20 000 ₽</span></div>
            </div>
            <div class="box_item_licvidation">
                <div class="little_title_licvid">Добровольная ликвидация</div>
                <div class="sum_licvid_new">от 35 000 ₽</div>
                <div class="sum_licvid_old">вместо <span>45 000 ₽</span></div>
            </div>
        </div>
        <div class="column_form_leads_licvid">
            <?=do_shortcode('[contact-form-7 id="7d9f984" title="Баннер - Упрощенная или добровольная ликвидация - vestnic.online"]')?>
        </div>
        <div class="image_licvidation">
            <img src="/wp-content/uploads/2026/06/image_licvidation.png" alt="">
        </div>
    </div>
    <button type="button" class="swal2-close" aria-label="Close this dialog" style="display: block;" @click="closeCurrentModal">×</button>
  </div>
</div>

<!-- Дополнительная форма 10 ошибок -->
<div class="fComponent-modal overlay" v-show="options.modals.tenModal.visible" style="display:none;">
  <div class="content" style="width:880px;">
    <div class="wrap_modal_ten">
        <div class="col_ten_title">
            <div class="label_ten_title">Бесплатно</div>
            <div class="title_ten_title">10</div>
            <div class="text_ten_title">ошибок, из-за которых сообщение не публикуют</div>
            <div class="image_ten_title">
                <img src="/wp-content/uploads/2026/08/img-list-ten.png" alt="">
            </div>
        </div>
        <div class="col_ten_text">
            <div class="ten_text_title">Инструкция: Как избежать 10-ти основных ошибок при публикации сообщений в Вестнике гос. регистрации</div>
            <div class="ten_text_text">Как самостоятельно опубликовать сообщение в Вестнике гос. регистрации?</div>
            <div class="column_form_leads_ten">
                <?=do_shortcode('[contact-form-7 id="d69330d" title="Баннер - 10 ошибок, из-за которых сообщение не публикуют - vestnic.online"]')?>
            </div>
        </div>
    </div>
    <button type="button" class="swal2-close" aria-label="Close this dialog" style="display: block;" @click="closeCurrentModal">×</button>
  </div>
</div>