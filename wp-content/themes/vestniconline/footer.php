<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package VestnicOnline
 */

?>

<footer class="mb-40px mt-40px">
<div class="container">
    <div class="row rgap-30px">
        <div class="col-12 col-lg-3 d-flex flex-column rgap-20px">
           <a href="/">
                <img class="logotype" src="/wp-content/themes/vestniconline/images/logotype.png" alt="Логотип вестник.онлайн" />
            </a>
            <script type="application/ld+json">
                {
                    "@context": "https://schema.org/",
                    "@type": "ImageObject",
                    "contentUrl": "/wp-content/themes/vestniconline/images/logotype.png",
                    "name": "Логотип вестник.онлайн",
                    "creator": {
                        "@type": "Organization",
                        "name": "Вестник Онлайн"
                    }
                }
            </script>

<div class="textSize-18px-400">Все права защищены<br />© АО «Консалтинг онлайн»<br />2008-2026</div>
        </div>
        <div class="col-12 col-lg-7 row rgap-20px text-black justify-content-center justify-content-lg-start">
            <div class="col-12 col-md-6 col-lg-4 d-flex gap-15px justify-content-center justify-content-lg-start">
                <a href="https://vk.com/fedresurs.online" class="w-fit socials"><i class="fab fa-vk"></i></a>
                <a href="https://ok.ru/group/61082272792720" class="w-fit socials"><i class="fab fa-odnoklassniki"></i></a>
            </div>
            <div class="col-12 col-lg-4">
				<div class="textSize-18px-700"><a class="text-decoration-none text-black" href="tel:79284289700">+7 928 428-97-00</a></div>
                <p class="textSize-14px-400">Телефон</p>
            </div>
            <div class="col-12 col-lg-4">
				<div class="textSize-18px-700"><a class="text-decoration-none text-black" href="mailto:info@vestnic.online">info@vestnic.online</a></div>
                <p class="textSize-14px-400">Электронная почта</p>
            </div>
            <div class="col-12 row rgap-15px">
                <p class="textSize-16px-400">350000, Краснодарский кр., г. Краснодар, ул. Им. Орджоникидзе, д. 41</p>
                <p class="textSize-16px-400">Онлайн сервис публикации объявлений в Вестнике и Федресурсе</p>
                <p class="textSize-14px-400 clr-vo-gray">Данный сайт является сервисом по публикации сообщений в журнале Вестник государственной регистрации и Едином федеральном реестре сведений о фактах деятельности юридических лиц (ЕФРСФДЮЛ) в соответствии с требованиями законодательства. Официальный сайт Вестника государственной регистрации - vestnik-gosreg.ru, ЕФРСФДЮЛ - fedresurs.ru</p>
            </div>
        </div>
        <div class="col-12 col-lg-2 d-flex flex-column rgap-20px text-black">
            <div class="d-flex flex-column rgap-15px align-items-center">
                <div class="textSize-18px-700"><a class="text-decoration-none text-black" href="tel:88007752042">8 (800) 775-20-42</a></div>
                <p class="textSize-14px-400">Бесплатно по РФ</p>
                <button class="vo-btn bg-vo-primary-linear type-2 py-2 w-fit px-3 textSize-13px-400" @click="options.modals.callModal.visible=true, options.modals.callModal.title = 'Заказать звонок'">Обратный звонок</button>
				<div class="footer__links" style="display: flex;flex-direction: column;">
                    <a href="/politika-konfidencialnosti/" class="mt-5px textSize-12px-400 text-nowrap" style="color:#000">Политика конфиденциальности</a>
                    <a href="/soglasie-pers-dannyh/" class="mt-5px textSize-12px-400 text-nowrap" style="color:#000">Согласие на обработку персональных данных</a>
                    <a href="/soglasie-cookies/" class="mt-5px textSize-12px-400 text-nowrap" style="color:#000">Согласие на обработку файлов cookies</a>
                    <a href="/soglasie-rassylki/" class="mt-5px textSize-12px-400 text-nowrap" style="color:#000">Согласие на получение информационных <br>и рекламных рассылок</a>
			     </div>
            </div>
        </div>
    </div>
</div>
    </footer>
    
   <div class="quizDiv">
      <div style="font-weight: 700; font-size: 20px; line-height: 1.25; margin-bottom: 5px;">Нужна публикация в Вестнике?</div>
      <button id="openQuizButton">Продолжить
<img src="https://vestnic.online/wp-content/uploads/2024/07/chevron-right-svgrepo-com.png" />
          </button>
       </div>
<!--        <div class="quizDiv__mobile hidden" id="openQuizButton_1">
      <div class="flex">
    <div class="d-flex">
        <div>Поможем разместить публикацию</div>
    </div>
    <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
   <path fill-rule="evenodd" clip-rule="evenodd" d="M12.2929 4.29289C12.6834 3.90237 13.3166 3.90237 13.7071 4.29289L20.7071 11.2929C21.0976 11.6834 21.0976 12.3166 20.7071 12.7071L13.7071 19.7071C13.3166 20.0976 12.6834 20.0976 12.2929 19.7071C11.9024 19.3166 11.9024 18.6834 12.2929 18.2929L17.5858 13H4C3.44772 13 3 12.5523 3 12C3 11.4477 3.44772 11 4 11H17.5858L12.2929 5.70711C11.9024 5.31658 11.9024 4.68342 12.2929 4.29289Z" fill="#fff"/>
   </svg>
   </div>
       </div> -->
    	<link rel="stylesheet" href="/wp-content/themes/vestniconline/quiz/quizfed__module.css?v=5.5">
<script src="/wp-content/themes/vestniconline/quiz/quizfed__module.js?v=9.2"></script>
<div class="mobileMenu w-fit" :class="{showMenu: openMobileMenu}">
<nav class="container overflow-y-auto h-100">
            
	
	<div class="row rgap-20px justify-content-center">
	<div class="hd-col-5-1 w-fit mt-30px">
		<a href="/"><img src="/wp-content/themes/vestniconline/images/logotype.png" data-src="/wp-content/themes/vestniconline/images/logotype.png" alt="Логотип vestnic.online" class="mw-100 lazy loaded" data-was-processed="true" /></a>
	</div>
	<div class="hd-col-5-1 text-center"><p>Онлайн сервис публикации объявлений в Вестнике и Федресурсе</p></div>
	<div class="hd-col-5 d-flex align-items-center align-items-lg-start flex-column">
		<a href="tel:78612069096" class="link-dark text-decoration-none"></a>
		<div class="textSize-18px-700">
			<a href="tel:78612069096" class="link-dark text-decoration-none"><i class="fas fa-phone-alt" style="font-size: 14px;"></i></a><a href="tel:79284289700" class="text-black text-decoration-none">+7 928 428-97-00</a>
		</div>
	</div>
	<div class="hd-col-5 d-flex align-items-center align-items-lg-start flex-column">
		<div class="textSize-18px-800"><a href="mailto:info@vestnic.online" class="text-black text-decoration-none">info@vestnic.online</a></div>
		<p class="textSize-14px-400">Электронная почта</p>
	</div>
	<div class="hd-col-5 d-flex align-items-center flex-column align-items-lg-start">
		<div class="textSize-25px-700 clr-vo-primary-dark"><a href="tel:88007752042" class="text-black text-decoration-none">8 (800) 775-20-42</a></div>
	</div>
</div>

	
	
            <div class="row justify-content-start d-flex py-4">
                <!-- <button class="mobileMenuToggle" @click="isMobileMenu=!isMobileMenu">
                    <i class="fa"
                       :class="{'fa-bars': !isMobileMenu, 'fa-close': isMobileMenu}"
                    ></i>
                </button> -->
                <?php wp_nav_menu( array( 'theme_location' => 'max_mega_menu_1' ) ); ?>
            </div>
	<div class="row justify-content-center mb-30px">
		
		<button @click="openMobileMenu=false" class="vo-btn bg-vo-primary-linear type-2 mt-40px">Закрыть</button>
	</div>
           <!--  <div class="row justify-content-between gap-20px pb-4 menuHeader" :class="{show: isMobileMenu}">
               <ul class="nav gap-20px textSize-17px-600 clr-vo-primary">
                   <li>Главная</li>
                   <li>О сервисе</li>
                   <li>Публикация в Вестнике</li>
                   <li>Публикация в Федресурсе</li>
                   <li>График выхода</li>
                   <li>Контакты</li>
               </ul>
           </div> -->
           
        </nav>
</div>

<!--     <button @click="options.modals.publication.visible=!options.modals.publication.visible">Open Modal</button> -->

<?php require 'blocks/modals.php'; ?>

</div>
<!-- Roistat Counter Start --> 
<script> 
(function(w, d, s, h, id) { 
    w.roistatProjectId = id; w.roistatHost = h; 
    var p = d.location.protocol == "https:" ? "https://" : "http://"; 
    var u = /^.*roistat_visit=[^;]+(.*)?$/.test(d.cookie) ? "/dist/module.js" : "/api/site/1.0/"+id+"/init?referrer="+encodeURIComponent(d.location.href); 
    var js = d.createElement(s); js.charset="UTF-8"; js.async = 1; js.src = p+h+u; var js2 = d.getElementsByTagName(s)[0]; js2.parentNode.insertBefore(js, js2); 
})(window, document, 'script', 'cloud.roistat.com', '4010ef500804eedd67bfe0662d77ed58'); 
</script> 
<!-- Roistat Counter End -->
<?php wp_footer(); ?>

</body>
<img src="https://vestnic.online/wp-content/uploads/2024/07/phone.svg" class="phone__icon_form" id="phone__icon_form" onclick="togglePhoneForm()"/>
<div class="call_me_block" id="call_me_block">
    <span class="close_button" onclick="togglePhoneForm()">✖</span>
    <img src="https://vestnic.online/wp-content/uploads/2026/08/IMG_6995.JPG.png" class="avatar" />
    <h3 class="hello_text">Здравствуйте, мы перезвоним вам через 40 секунд?</h3>
    <p class="text_select" id="text_select" onclick="toggleSelectTime()">Выбрать удобное время звонка</p>
    <p class="time_select" id="time_select" style="display: none;">
        <select class="day_sel" id="day_select">
            <option>Понедельник</option>
            <option>Вторник</option>
            <option>Среда</option>
            <option>Четверг</option>
            <option>Пятница</option>
            <option>Суббота</option>
            <option>Воскресенье</option>
        </select>
        <select class="time_sel" id="time_select_dropdown">
            <option>08:00</option>
            <option>09:00</option>
            <option>10:00</option>
            <option>11:00</option>
            <option>12:00</option>
            <option>13:00</option>
            <option>14:00</option>
            <option>15:00</option>
            <option>16:00</option>
            <option>17:00</option>
        </select>
    </p>
    <input type="text" class="phone_field" id="phone_field" placeholder="Номер телефона"/>
    <button class="call_me" onclick="sendFormData()">Позвоните мне</button>
    <div class="ps_end_pol" style="display: flex; gap:10px;">
        <input type="checkbox" style="flex-shrink: 0;">
        <label style="font-size:12px;">
        Нажимая кнопку «Позвоните мне», я даю свое <a href="/soglasie-pers-dannyh/" target="_blank">Согласие на обработку моих персональных данных</a> в соответствии с Федеральным законом от 27.07.2006 года № 152-ФЗ «О персональных данных» на условиях и для целей, определенных <a href="/politika-konfidencialnosti/" target="_blank">Политикой конфиденциальности</a>.</label>
    </div>

    <div class="ps_end_pol" style="display: flex; gap:10px;">
        <input type="checkbox" style="flex-shrink: 0;">
        <label style="font-size:12px;">Нажимая кнопку «Позвоните мне», я даю свое согласие на получение сообщений информационного (рекламного) характера в соответствии с Федеральным законом от 13.03.2006 г № 38-ФЗ «О рекламе» на условиях и для целей, определенных <a href="/politika-konfidencialnosti/" target="_blank">Политикой конфиденциальности</a>, <a href="/soglasie-rassylki/" target="_blank">Согласием на осуществление рекламной рассылки</a>.</label>
    </div>

</div>

<div id="thank_you_message" style="display: none;">
    Спасибо, мы Вам перезвоним
</div>

<style>
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }

    .phone__icon_form {
        animation: pulse 1s infinite;
        cursor: pointer;
    }
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap');

    .call_me_block {
        z-index: 999;
        box-shadow: 0px 7px 20.6px 0px #00000014;
        transition: .4s;
        padding: 60px 40px 42px;
        width: 350px;
        border-radius: 40px;
        background-color: #fff;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: fixed;
        bottom: 120px;
        right: 60px;
        transform: translate(400px, 0);
    }

    .call_me_block.show {
        transform: translate(0px, 0px);
        display: flex !important;
    }

    .call_me_block img.avatar {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        margin: 0 auto;
        object-fit: cover;
        object-position: top;
    }

    .call_me_block h3.hello_text {
        color: #6473B4;
        font-family: "Manrope", sans-serif;
        font-size: 18px;
        font-weight: 700;
        line-height: 24.59px;
        text-align: center;
        margin-top: 15px;
    }

    .call_me_block p.text_select {
        color: #00000080;
        font-family: "Manrope", sans-serif;
        font-size: 14px;
        font-weight: 500;
        line-height: 15px;
        text-align: center;
        text-decoration: underline;
        cursor: pointer;
    }

    .call_me_block p#time_select {
        width: 100%;
        display: flex;
        justify-content: center;
        gap: 8px;
    }

    .call_me_block p#time_select .day_sel {
        width: calc(60% - 5px);
        background: #EBEEFF;
        padding: 10px;
        border-radius: 59px;
        color: #2B3A7A;
        box-sizing: border-box;
        font-family: "Manrope", sans-serif;
        font-size: 12px;
        font-weight: 400;
        line-height: 24.59px;
        text-align: left;
        border: none;
        outline: none;
    }

    .call_me_block p#time_select .time_sel {
        width: calc(40% - 5px);
        background: #EBEEFF;
        padding: 10px;
        border-radius: 59px;
        color: #2B3A7A;
        box-sizing: border-box;
        font-family: "Manrope", sans-serif;
        font-size: 12px;
        font-weight: 400;
        line-height: 24.59px;
        text-align: left;
        border: none;
        outline: none;
    }

    .call_me_block input.phone_field {
        background: #EBEEFF;
        width: 100%;
        padding: 10px 20px;
        border-radius: 59px;
        color: #2B3A7A;
        box-sizing: border-box;
        font-family: "Manrope", sans-serif;
        font-size: 18px;
        font-weight: 400;
        line-height: 24.59px;
        text-align: left;
        border: none;
        outline: none;
    }

    .call_me_block button.call_me {
        border: none;
        outline: none;
        background: linear-gradient(90deg, #E85855 0%, #EE7F7E 100%);
        width: 100%;
        padding: 10px 20px;
        border-radius: 59px;
        color: #fff;
        margin-top: 11px;
        font-family: "Manrope", sans-serif;
        font-size: 18px;
        font-weight: 400;
        line-height: 24.59px;
        text-align: center;
        transition: .2s;
        cursor: pointer;
    }

    .call_me_block button.call_me:hover {
        filter: brightness(0.8);
    }

    .phone__icon_form {
        position: fixed;
    }

    img.phone__icon_form {
        position: fixed;
        bottom: 25px;
        right: 90px;
        width: 70px;
    }

    @media screen and (max-width: 992px) {
        img.phone__icon_form {
            bottom: 60px;
            right:10px;
        }

        .call_me_block {
            bottom: 140px;
            right:10px;
        }
    }

.close_button {
    align-self: flex-end;
    cursor: pointer;
    font-size: 15px;
    margin-bottom: 10px;
    position: absolute;
    top: 15px;
    right: 20px;
    color: #f3f3f3 !important;
}

#thank_you_message {
    z-index: 1000;
    position: fixed;
    top: 50%;
    right: calc(50% - 150px);
    background: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 7px 20.6px 0px #00000033;
    display: block;
    width: 300px;
    text-align: center;
}
    #thank_you_message.show {
        display: block !important;
    }
</style>

<script>
    let stateSelectTime = false;

    function toggleSelectTime() {
        if (!stateSelectTime) {
            let text_select = document.getElementById('text_select');
            let time_select = document.getElementById('time_select');
            text_select.style.display = 'none';
            time_select.style.display = 'block';
            stateSelectTime = true;
        } else {
            let text_select = document.getElementById('text_select');
            let time_select = document.getElementById('time_select');
            text_select.style.display = 'block';
            time_select.style.display = 'none';
            stateSelectTime = false;
        }
    }

    function togglePhoneForm() {
        const phoneIconForm = document.getElementById('phone__icon_form');
        const callMeBlock = document.getElementById('call_me_block');

        if (callMeBlock.classList) {
            callMeBlock.classList.toggle('show');
        } else {
            const classes = callMeBlock.className.split(' ');
            const existingIndex = classes.indexOf('show');

            if (existingIndex >= 0) {
                classes.splice(existingIndex, 1);
            } else {
                classes.push('show');
            }

            callMeBlock.className = classes.join(' ');
        }
    }

    function showThankYouMessage() {
        const thankYouMessage = document.getElementById('thank_you_message');
        thankYouMessage.classList.add('show');
        setTimeout(() => {
            thankYouMessage.classList.remove('show');
        }, 3000);
    }

    function getUrlParams() {
        const params = {};
        window.location.search.slice(1).split('&').forEach(pair => {
            const [key, value] = pair.split('=');
            params[key] = decodeURIComponent(value || '');
        });
        return params;
    }

    function sendFormData() {
        const phoneField = document.getElementById('phone_field').value;
        const daySelect = document.getElementById('day_select').value;
        const timeSelect = document.getElementById('time_select_dropdown').value;
        let comment;
        if (!stateSelectTime) {
            comment = 'Человек не выбрал время в форме, 40 секунд на звонок';
        } else {
            comment = `День: ${daySelect}, Время: ${timeSelect}`;
        }
        const urlParams = getUrlParams();

        const data = {
            phone: phoneField,
            comment: comment,
            from_url: window.location.href,
            utm_source: urlParams['utm_source'] || '',
            utm_medium: urlParams['utm_medium'] || '',
            utm_campaign: urlParams['utm_campaign'] || '',
            utm_content: urlParams['utm_content'] || '',
            utm_term: urlParams['utm_term'] || ''
        };

        fetch('https://consultings.online/api/phoneSendDataVestnic.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            const callMeBlock = document.getElementById('call_me_block');
            callMeBlock.classList.remove('show');
            showThankYouMessage();
            ym(82948618,'reachGoal','perezvon')
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
</script>

<style>
    html.cf7-hide-swal-temp .swal-overlay,
    html.cf7-hide-swal-temp .swal-modal {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
    }
</style>

<script>

(function () {
    let swalBlockUntil = 0;
    let swalObserverStarted = false;

    // ID текущей открытой страницы WordPress
    const currentWpPageId = Number(<?php echo (int) get_queried_object_id(); ?> || 0);

    // Страницы, где ВСЕ обычные формы должны открывать licvidationsModal
    const forcedModalPageIds = new Set([2028, 2019]);

    // ВАЖНО:
    // сюда впиши ID CF7-формы, которая находится ВНУТРИ licvidationsModal
    // пример: const licvidationsModalFormIds = new Set(['1234']);
    // если таких форм несколько — добавь все
    const licvidationsModalFormIds = new Set([
        '4977'
    ]);

    function getCf7FieldValue(inputs, fieldName) {
        if (!Array.isArray(inputs)) return '';

        const field = inputs.find(function (item) {
            return item && item.name === fieldName;
        });

        if (!field || typeof field.value === 'undefined' || field.value === null) {
            return '';
        }

        return String(field.value).trim();
    }

    function getFieldValueFromEvent(event, fieldName) {
        const detail = event && event.detail ? event.detail : {};

        // 1. Пытаемся получить из detail.inputs
        let value = getCf7FieldValue(detail.inputs, fieldName);
        if (value) return value;

        // 2. Fallback: читаем прямо из DOM формы
        if (event && event.target && typeof event.target.querySelector === 'function') {
            const field = event.target.querySelector('[name="' + fieldName + '"]');
            if (field && typeof field.value !== 'undefined' && field.value !== null) {
                return String(field.value).trim();
            }
        }

        return '';
    }

    function isForcedModalPage() {
        // Основная проверка — по PHP ID текущей страницы
        if (forcedModalPageIds.has(currentWpPageId)) {
            return true;
        }

        // Резервный fallback по body class
        if (document.body) {
            for (const pageId of forcedModalPageIds) {
                if (document.body.classList.contains('page-id-' + pageId)) {
                    return true;
                }
            }
        }

        return false;
    }

    function isLicvidationsModalForm(event) {
        const detail = event && event.detail ? event.detail : {};
        const contactFormId = String(detail.contactFormId || '').trim();

        if (licvidationsModalFormIds.has(contactFormId)) {
            return true;
        }

        // Доп. fallback:
        // если форма реально находится внутри модалки licvidationsModal
        if (event && event.target && typeof event.target.closest === 'function') {
            const inModal = event.target.closest('#licvidationsModal, .licvidationsModal');
            if (inModal) {
                return true;
            }
        }

        return false;
    }

    function shouldOpenLicvidationsModal(event) {
        // Если отправлена форма ИЗ самой второй модалки —
        // не перехватываем, пусть сработает стандартная thanks-модалка от плагина
        if (isLicvidationsModalForm(event)) {
            return false;
        }

        // На страницах 2028 и 2019 — любая обычная форма
        if (isForcedModalPage()) {
            return true;
        }

        // На остальных страницах — только если выбрана "Ликвидация"
        const chooseValue = getFieldValueFromEvent(event, 'form-choose');
        return chooseValue === 'Ликвидация';
    }

    function removeSwalNodes() {
        const swalNodes = document.querySelectorAll('.swal-overlay');

        swalNodes.forEach(function (node) {
            try {
                node.remove();
            } catch (e) {
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            }
        });

        document.body.classList.remove('stop-scrolling');
        document.body.removeAttribute('style');
    }

    function blockSweetAlertTemporarily() {
        swalBlockUntil = Date.now() + 2000;
        document.documentElement.classList.add('cf7-hide-swal-temp');
        removeSwalNodes();

        setTimeout(function () {
            if (Date.now() >= swalBlockUntil) {
                document.documentElement.classList.remove('cf7-hide-swal-temp');
            }
        }, 2100);
    }

    function startSwalObserver() {
        if (swalObserverStarted || !document.body) return;

        swalObserverStarted = true;

        const observer = new MutationObserver(function () {
            if (Date.now() < swalBlockUntil) {
                removeSwalNodes();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function openLicvidationsModal() {
        if (
            typeof app === 'undefined' ||
            !app ||
            !app.options ||
            !app.options.modals ||
            !app.options.modals.licvidationsModal
        ) {
            console.warn('Модальное окно licvidationsModal не найдено в app');
            return;
        }

        if (typeof app.closeCurrentModal === 'function') {
            app.closeCurrentModal();
        }

        app.toggleModal('licvidationsModal');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startSwalObserver);
    } else {
        startSwalObserver();
    }

    // capture = true, чтобы успеть перехватить событие раньше popup-плагина
    document.addEventListener('wpcf7mailsent', function (event) {
        if (!shouldOpenLicvidationsModal(event)) {
            return;
        }

        event.stopImmediatePropagation();
        event.stopPropagation();

        blockSweetAlertTemporarily();

        setTimeout(function () {
            openLicvidationsModal();
        }, 0);
    }, true);
})();
</script>


<!-- Yandex.Metrika counter -->
<script type="text/javascript" defer >

        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();
   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(82948618, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   });

  
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/82948618" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->


<script>
    (function(w, d, u, i, o, s, p) {
        if (d.getElementById(i)) { return; } w['MangoObject'] = o;
        w[o] = w[o] || function() { (w[o].q = w[o].q || []).push(arguments) }; w[o].u = u; w[o].t = 1 * new Date();
        s = d.createElement('script'); s.async = 1; s.id = i; s.src = u;
        p = d.getElementsByTagName('script')[0]; p.parentNode.insertBefore(s, p);
    }(window, document, '//widgets.mango-office.ru/widgets/mango.js', 'mango-js', 'mgo'));
    mgo({calltracking: {id: 30982, elements: [{"numberText":"79284289700"}], domain: 'vestnic.online'}});
</script>
<script>
    window.onRoistatAllModulesLoaded = function() {
        window.roistat.leadHunter.onAfterSubmit = function(leadData) {
          ym(82948618,'reachGoal','leadHunter')
        }
    };
</script>

<script>
document.addEventListener('wpcf7mailsent', function(event) {
    if (event.detail.contactFormId == '7d9f984') {
        if (typeof ym === 'function') {
            ym(82948618, 'reachGoal', 'akchia');
        }
    }
}, false);
</script>

<style>
/*cooki*/
.window_cookie {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #ffffff;
    padding: 20px; 
    z-index: 9999999;
    box-shadow: 0 0 15px rgba(0, 0, 0, .5);
    box-sizing: border-box; 
}
.inner_cookie {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 30px;
}
.window_cookie p {
    font-size: 16px; 
    margin: 0;
    text-align: center; 
    width: 100%; 
    color: #333333;
}
.window_cookie p a {
    color: #333333;
    text-decoration: underline;
}
.window_cookie p a:hover {
    text-decoration: none;
}
.button-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 15px;
    justify-content: center;
}
.btn_cookie,
.btn_cookie-second {
    text-align: center;
    letter-spacing: 1px;
    text-transform: uppercase;
    background-color: #3898ec;
    border: 4px solid transparent;
    border-radius: 20px;
    padding: 8px 20px; 
    cursor: pointer !important;
    font-size: 12px; 
    font-weight: 600;
    color: #ffffff;
    box-sizing: border-box;
}
@media screen and (max-width: 767px) {
    .window_cookie p {
        font-size: 0.9rem;
        text-align: left;
    }
    .btn_cookie,
    .btn_cookie-second {
        max-width: 250px;
        width: 50px;
        padding: 0.5vh 1vw;
        font-size: 0.7rem;
    }
}
@media screen and (max-width: 480px) {
    .window_cookie {
        max-width: 100%;
        padding: 15px;
        bottom: 0;
    }
    .window_cookie p {
        font-size: 10px;
        line-height: normal;
    }
    .btn_cookie,
    .btn_cookie-second {
        max-width: 220px;
        padding: 0.5vh 1vw;
        font-size: 0.65rem;
    }
}
</style>

<!-- cookies -->
<div class="window_cookie">
  <div class="inner_cookie">
    <p>Мы используем файлы cookie для корректной работы сайта, анализа посещаемости и улучшения качества сервиса. <br>Продолжая пользоваться сайтом, вы соглашаетесь с использованием cookie-файлов в соответствии с <a href="/politika-konfidencialnosti/" target="_blank">Политикой конфиденциальности</a> и <a href="/soglasie-cookies/" target="_blank">Согласием на обработку файлов cookie</a>.</p>
    <div class="button-wrapper">
      <button class="btn_cookie button">ОК</button>
    </div>
  </div>
</div>

<script>
// Функция установки cookie
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days*24*60*60*1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Функция получения cookie
function getCookie(name) {
  const cname = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(cname) === 0) {
      return c.substring(cname.length, c.length);
    }
  }
  return "";
}

// Основная логика
document.addEventListener("DOMContentLoaded", function () {
  const cookieName = "cookieConsent";
  const cookieWindow = document.querySelector(".window_cookie");
  const cookieButton = document.querySelector(".btn_cookie");
  const cookieButtonSecond = document.querySelector(".btn_cookie-second");

  if (!getCookie(cookieName)) {
    cookieWindow.style.display = "block";
  } else {
    cookieWindow.style.display = "none";
  }

  cookieButton.addEventListener("click", function () {
    setCookie(cookieName, "accepted", 30);
    cookieWindow.style.display = "none";
  });

  cookieButtonSecond.addEventListener("click", function () {
    setCookie(cookieName, "accepted", 30);
    cookieWindow.style.display = "none";
  });
});
</script>

</html>
