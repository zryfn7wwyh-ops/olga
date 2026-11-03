<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package VestnicOnline
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">

	<?php wp_head(); ?>
	<!-- <script src="https://cdn.jsdelivr.net/npm/imask"></script> -->
</head>

<body <?php body_class(); ?>>
	
<?php wp_body_open(); ?>
	
<div id="app" :class="{dev: isDev}">
    <header class="mt-30px">
        <nav class="container">
            <div class="row rgap-20px justify-content-center">
                <div class="hd-col-5-1 fv justify-content-between px-4 px-lg-0 align-items-center">
                    <a href="/">
                        <img class="mw-100" src="/wp-content/themes/vestniconline/images/logotype.png" alt="Логотип vestnic.online" />
                    </a>
                    <script type="application/ld+json">
                        {
                            "@context": "https://schema.org/",
                            "@type": "ImageObject",
                            "contentUrl": "/wp-content/themes/vestniconline/images/logotype.png",
                            "name": "Логотип vestnic.online",
                            "creator": {
                                "@type": "Organization",
                                "name": "Вестник Онлайн"
                            }
                        }
                    </script>
				<div class="row d-lg-none">
				<div @click="openMobileMenu=!openMobileMenu" id="mega-toggle-block-1" justify-content-start  class="mega-toggle-block mega-menu-toggle-animated-block mega-toggle-block-1">
					<i class="fa fa-bars" style="font-size:28px;"></i>
					</div>
			</div>
				
				</div>
                <div class="hd-col-5-1 d-none  d-lg-flex"><p>Онлайн сервис публикации объявлений в Вестнике и Федресурсе</p></div>
                <div class="hd-col-5 align-items-center align-items-lg-start flex-column d-none  d-lg-flex gap-10px">
                    
                        <div class="textSize-18px-400">
							<i class="fas fa-phone-alt" style="font-size:14px;"></i><a class="text-black text-decoration-none" href="tel:79284289700">+7 928 428-97-00</a></div>
                </div>
                <div class="hd-col-5 align-items-center align-items-lg-start flex-column d-none  d-lg-flex">
					<div class="textSize-18px-400"><a class="text-black text-decoration-none" href="mailto:info@vestnic.online">info@vestnic.online</a></div>
                    <p class="textSize-14px-400">Электронная почта</p>

                </div>
                <div class="hd-col-5 align-items-center flex-column align-items-lg-start d-none  d-lg-flex">
                    <div class="textSize-25px-400 clr-vo-primary-dark"><a class="text-black text-decoration-none text-nowrap" href="tel:88007752042">8 (800) 775-20-42</a></div>
                    <p class="text-decoration-underline textSize-14px-400 clr-vo-primary-dark cursor-pointer"  role="button" @click="options.modals.callModal.visible=true, options.modals.callModal.title = 'Заказать звонок'">Перезвоните мне</p>
                </div>
            </div>
            <div class="row justify-content-start d-none py-4 d-lg-flex">
                <!-- <button class="mobileMenuToggle" @click="isMobileMenu=!isMobileMenu">
                    <i class="fa"
                       :class="{'fa-bars': !isMobileMenu, 'fa-close': isMobileMenu}"
                    ></i>
                </button> -->
                <?php wp_nav_menu( array( 'theme_location' => 'max_mega_menu_1' ) ); ?>
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
        </header>
        