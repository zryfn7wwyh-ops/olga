<?php
/**
 * Установка и наполнение локального WordPress.
 * Запуск: php scripts/seed.php <путь к ядру WordPress>
 *
 * Принцип: создаётся только то, что подтверждено исходниками темы
 * (ID страниц, адреса, заголовки форм). Содержимое, которого нет в архиве,
 * не сочиняется — на его месте ставится маркер [vo_gap]. Служебные тестовые
 * страницы и записи (slug начинается с test-) нужны только для проверки шаблонов.
 */
if ( PHP_SAPI !== 'cli' ) {
	exit( 1 );
}
$wp_core = rtrim( $argv[1] ?? '', '/' );
if ( ! is_file( "$wp_core/wp-load.php" ) ) {
	fwrite( STDERR, "Укажите путь к WordPress\n" );
	exit( 1 );
}
$cfg = array();
foreach ( file( __DIR__ . '/versions.env' ) as $line ) {
	if ( preg_match( '/^([A-Z_]+)=(.*)$/', trim( $line ), $m ) ) {
		$cfg[ $m[1] ] = $m[2];
	}
}
$_SERVER['HTTP_HOST']   = $cfg['HOST'] . ':' . $cfg['PORT'];
$_SERVER['REQUEST_URI'] = '/';
define( 'WP_INSTALLING', true );
require "$wp_core/wp-load.php";
require_once ABSPATH . 'wp-admin/includes/upgrade.php';
require_once ABSPATH . 'wp-admin/includes/plugin.php';

// Скрипт работает без пользователя, и kses вырезал бы атрибуты Vue (@click) из разметки
// сниппетов и главной. Администратор сайта (unfiltered_html) сохраняет их как есть — делаем так же.
kses_remove_filters();

function say( $m ) { fwrite( STDOUT, "  - $m\n" ); }

if ( ! is_blog_installed() ) {
	wp_install( 'Вестник Онлайн', 'admin', 'admin@vestnic.local', false, '', 'admin', 'ru_RU' );
	say( 'WordPress установлен (admin / admin)' );
	// Удаляем стандартный демо-контент, чтобы он не смешивался с восстановленным.
	foreach ( array( 1, 2, 3 ) as $id ) {
		wp_delete_post( $id, true );
	}
}

// Новые записи получают ID от 10000: исходные ID (10, 1986, 2019, 2028, 4977) задаются явно,
// и служебные записи не должны случайно занять ID, на которые завязана логика footer.php.
global $wpdb;
$wpdb->query( "ALTER TABLE {$wpdb->posts} AUTO_INCREMENT = 10000" );

update_option( 'permalink_structure', '/%postname%/' );
update_option( 'WPLANG', 'ru_RU' );
update_option( 'blog_public', '0' );
update_option( 'default_comment_status', 'closed' );
switch_theme( 'vestniconline' );
foreach ( array( 'contact-form-7/wp-contact-form-7.php', 'advanced-custom-fields/acf.php' ) as $p ) {
	if ( ! is_plugin_active( $p ) ) {
		$r = activate_plugin( $p, '', false, true );
		say( is_wp_error( $r ) ? "$p: " . $r->get_error_message() : "активирован $p" );
	}
}
// Плагины подключаются только при следующем запросе; для создания форм CF7 подгружаем вручную.
if ( ! class_exists( 'WPCF7_ContactForm' ) ) {
	require_once WP_PLUGIN_DIR . '/contact-form-7/wp-contact-form-7.php';
	do_action( 'plugins_loaded' );
	if ( function_exists( 'wpcf7_register_post_types' ) ) {
		wpcf7_register_post_types();
	}
}

/** Создаёт/обновляет запись с заданным ID и адресом. */
function vo_upsert( array $p, array $meta = array() ) {
	$existing = ! empty( $p['import_id'] ) ? get_post( $p['import_id'] ) : null;
	if ( ! $existing && ! empty( $p['post_name'] ) ) {
		$existing = get_page_by_path( $p['post_name'], OBJECT, $p['post_type'] ?? 'page' );
	}
	$p += array( 'post_type' => 'page', 'post_status' => 'publish', 'comment_status' => 'closed' );
	if ( $existing ) {
		$p['ID'] = $existing->ID;
		unset( $p['import_id'] );
		$id = wp_update_post( wp_slash( $p ), true );
	} else {
		$id = wp_insert_post( wp_slash( $p ), true );
	}
	if ( is_wp_error( $id ) ) {
		say( 'ОШИБКА: ' . $id->get_error_message() );
		return 0;
	}
	foreach ( $meta as $k => $v ) {
		update_post_meta( $id, $k, $v );
	}
	return $id;
}

/* ---------- Страницы, подтверждённые исходниками ---------- */

/** Читает файл из content/ без служебных HTML-комментариев. */
function vo_content( $rel ) {
	$html = file_get_contents( dirname( __DIR__ ) . '/content/' . $rel );
	return trim( preg_replace( '/<!--.*?-->\s*/s', '', $html ) );
}

// Сниппеты Shortcoder из page.php — реконструкция по скриншотам vestnic.online (content/snippets/).
foreach ( array( 'baner-header', 'messages_list', 'pochemuvigodno', 'formandprice', 'payments_method' ) as $sc ) {
	vo_upsert( array(
		'post_type'    => 'shortcoder',
		'post_title'   => $sc,
		'post_name'    => $sc,
		'post_content' => vo_content( "snippets/$sc.html" ),
	) );
	say( "сниппет [sc name=\"$sc\"]" );
}

// ID 10 — главная (functions.php: «10 — Главная»), шаблон tpl-main.php («Главная»).
// Содержимое — content/home.html (перенесено со скриншотов vestnic.online).
$home = vo_upsert( array(
	'import_id'    => 10,
	'post_title'   => 'Главная',
	'post_name'    => 'glavnaya',
	'post_content' => vo_content( 'home.html' ),
), array( '_wp_page_template' => 'tpl-main.php' ) );
update_option( 'show_on_front', 'page' );
update_option( 'page_on_front', $home );
say( "главная: ID $home" );

// ID 1986 — «Контакты» (functions.php). Адрес и шаблон в исходниках не указаны.
$contacts = vo_upsert( array(
	'import_id'    => 1986,
	'post_title'   => 'Контакты',
	'post_name'    => 'kontakty',
	'post_content' => '[vo_gap what="содержимое страницы «Контакты» (ID 1986); адрес /kontakty/ и шаблон не подтверждены" need="запись ID 1986 из БД (post_name, _wp_page_template, post_content) или сохранённый HTML"]',
) );
say( "контакты: ID $contacts" );

// Юридические страницы — адреса и названия из ссылок footer.php. Шаблон не указан → page.php.
$legal = array(
	'politika-konfidencialnosti' => 'Политика конфиденциальности',
	'soglasie-pers-dannyh'       => 'Согласие на обработку персональных данных',
	'soglasie-cookies'           => 'Согласие на обработку файлов cookies',
	'soglasie-rassylki'          => 'Согласие на получение информационных и рекламных рассылок',
);
foreach ( $legal as $slug => $title ) {
	vo_upsert( array(
		'post_title'   => $title,
		'post_name'    => $slug,
		'post_content' => '[vo_gap what="текст документа «' . $title . '»; шаблон страницы не подтверждён" need="запись /' . $slug . '/ из БД или сохранённый HTML"]',
	) );
	say( "/$slug/" );
}

/* ---------- Формы Contact Form 7 из blocks/modals.php ---------- */
// Тела форм в архиве отсутствуют. Поля восстановлены минимально по признакам из темы:
// your-tel (id/class your-tel — маска в js/app.js и правила в style.css), согласие
// (.wpcf7-list-item a в style.css). Нужен экспорт форм CF7.
$forms = array(
	// ID 1260: под форму с этим ID написаны правила div#wpcf7-f1260-o1 в style.css темы.
	array( 'title' => 'Рассчитать стоимость объявления - vestnic.online', 'id' => 1260, 'file' => '1260.txt' ),
	array( 'title' => 'Получить консультацию - vestnic.online' ),
	array( 'title' => 'Заказать звонок - vestnic.online' ),
	array( 'title' => 'Рассчитать стоимость публикации (Оплата по реквизитам через перевод) - vestnic.online', 'file' => 'payment_1.txt' ),
	array( 'title' => 'Рассчитать стоимость публикации (Оплата банковской картой) - vestnic.online', 'file' => 'payment_2.txt' ),
	array( 'title' => 'Рассчитать стоимость публикации (Отсрочка оплаты по гарантийному письму) - vestnic.online', 'file' => 'payment_3.txt' ),
	array( 'title' => 'Форма при выходе с сайта' ),
	array( 'title' => 'Форма при выходе с сайта (новая версия)', 'hash' => '7296ed5' ),
	array( 'title' => 'Баннер - Упрощенная или добровольная ликвидация - vestnic.online', 'hash' => '7d9f984', 'file' => '7d9f984.txt' ),
	// ID 4977 указан в footer.php как форма внутри licvidationsModal.
	array( 'title' => 'Консультация по процедуре ликвидации или подготовке документов для ФНС - vestnic.online', 'hash' => '8af1134', 'id' => 4977 ),
	array( 'title' => 'Баннер - 10 ошибок, из-за которых сообщение не публикуют - vestnic.online', 'hash' => 'd69330d' ),
);
foreach ( $forms as $f ) {
	$found = get_posts( array( 'post_type' => 'wpcf7_contact_form', 'title' => $f['title'], 'post_status' => 'any', 'numberposts' => 1 ) );
	// Формы, видимые на скриншотах vestnic.online, — из content/forms/; остальные — временные.
	$body  = ! empty( $f['file'] ) ? vo_content( 'forms/' . $f['file'] ) : '<!-- Временная форма: нужен экспорт формы CF7 «' . esc_html( $f['title'] ) . '». -->' . "\n"
		. '<p>[tel* your-tel id:your-tel class:your-tel placeholder "+7(___)___-__-__"]</p>' . "\n"
		. '<p>[acceptance acceptance-pd] Согласен(на) на обработку <a href="/soglasie-pers-dannyh/" target="_blank">персональных данных</a> [/acceptance]</p>' . "\n"
		. '<p>[submit "Отправить"]</p>';
	$mail = array(
		'active'             => true,
		'subject'            => '[_site_title] ' . $f['title'],
		'sender'             => '[_site_title] <wordpress@vestnic.local>',
		'recipient'          => 'leads@vestnic.local',
		'body'               => "Форма: {$f['title']}\nИмя: [your-name]\nТелефон: [your-tel]\nE-mail: [your-email]\nВид объявления: [form-choose]\nСтраница: [_url]\n",
		'additional_headers' => '',
		'attachments'        => '',
		'use_html'           => false,
		'exclude_blank'      => false,
	);
	$id = vo_upsert( array(
		'import_id'    => $f['id'] ?? 0,
		'post_type'    => 'wpcf7_contact_form',
		'post_title'   => $f['title'],
		'post_name'    => 'cf7-' . substr( md5( $f['title'] ), 0, 10 ),
		'post_content' => $body,
		'ID'           => $found ? $found[0]->ID : 0,
	), array(
		'_form'   => $body,
		'_mail'   => $mail,
		'_mail_2' => array( 'active' => false ),
		'_locale' => 'ru_RU',
		// На скриншотах кнопка отправки активна при неотмеченных согласиях: согласие
		// проверяется при отправке, а не блокирует кнопку.
		'_additional_settings' => ! empty( $f['file'] ) ? 'acceptance_as_validation: on' : '',
	) );
	if ( $id && ! empty( $f['hash'] ) ) {
		update_post_meta( $id, '_hash', $f['hash'] . substr( sha1( $f['title'] ), 0, 33 ) );
	} elseif ( $id && ! get_post_meta( $id, '_hash', true ) ) {
		update_post_meta( $id, '_hash', sha1( $f['title'] . $id ) );
	}
	say( "CF7 #$id «{$f['title']}»" );
}

/* ---------- Служебные страницы для проверки шаблонов (не контент сайта) ---------- */
$note = '<p><em>Служебная тестовая страница локальной копии. Текст — тестовые данные, не контент vestnic.online.</em></p>';
$para = '<p>Тестовый абзац для проверки типографики шаблона: ширина колонки, межстрочный интервал, переносы длинных слов и ссылки <a href="#">внутри текста</a>.</p><h2>Тестовый подзаголовок H2</h2><ul><li>Пункт списка один</li><li>Пункт списка два</li></ul>';

vo_upsert( array( 'post_title' => 'Тест: шаблон по умолчанию (page.php)', 'post_name' => 'test-page-default', 'post_content' => $note . $para ) );
vo_upsert( array( 'post_title' => 'Тест: «Без вставок» (tpl-blank.php), H1 выводится', 'post_name' => 'test-tpl-blank', 'post_content' => '<div class="container">' . $note . $para . '</div>' ),
	array( '_wp_page_template' => 'tpl-blank.php' ) );
vo_upsert( array( 'post_title' => 'Тест: «Без вставок», H1 скрыт полем', 'post_name' => 'test-tpl-blank-acf', 'post_content' => '<div class="container"><h1 class="textSize-46px-600">[header_title]</h1><p>[subheader_title]</p>' . $note . $para . '</div>' ),
	array( '_wp_page_template' => 'tpl-blank.php', 'header_title' => 'Заголовок из поля field_61233a9cf3c38', '_header_title' => 'field_61233a9cf3c38', 'subheader_title' => 'Подзаголовок из поля field_61233aa3f3c39', '_subheader_title' => 'field_61233aa3f3c39' ) );
vo_upsert( array( 'post_title' => 'Тест: «Без вставок (wc)» (tpl-blank-2.php)', 'post_name' => 'test-tpl-blank-2', 'post_content' => $note . $para ),
	array( '_wp_page_template' => 'tpl-blank-2.php' ) );
vo_upsert( array( 'post_title' => 'Тест: пустая страница (кнопка консультации)', 'post_name' => 'test-empty-content', 'post_content' => '' ) );

$cat = term_exists( 'test', 'category' ) ?: wp_insert_term( 'Тестовая рубрика', 'category', array( 'slug' => 'test' ) );
$cat_id = (int) ( is_array( $cat ) ? $cat['term_id'] : $cat );
$img = '/wp-content/themes/vestniconline/images/calculator.png';
vo_upsert( array( 'post_type' => 'post', 'post_title' => 'Тест: статья с блоками «Эксперт», FAQ и «Скачивания»', 'post_name' => 'test-article-extra',
	'post_content' => $note . $para . '<p><img src="' . $img . '" alt="Тестовое изображение"></p>', 'post_category' => array( $cat_id ) ),
	array( '_vestniconline_article_extra_blocks' => array(
		'show_expert' => '1', 'expert_name' => 'Тестовый эксперт', 'expert_position' => 'Тестовая должность',
		'expert_description' => 'Тестовое доп. описание', 'expert_image' => '/wp-content/uploads/2026/08/IMG_6995.JPG.png',
		'expert_text' => "Тестовый текст блока эксперта.\nВторая строка.",
		'show_faq' => '1', 'faq_items' => array(
			array( 'question' => 'Тестовый вопрос 1?', 'answer' => 'Тестовый ответ 1.' ),
			array( 'question' => 'Тестовый вопрос 2?', 'answer' => "Тестовый ответ 2,\nв две строки." ),
		),
		'show_downloads' => '1', 'downloads_title' => 'Тестовые файлы', 'downloads_button_text' => 'Скачать все',
		'download_items' => array(
			array( 'title' => 'Тестовый файл 1 (logotype.png)', 'url' => '/wp-content/themes/vestniconline/images/logotype.png' ),
			array( 'title' => 'Тестовый файл 2 (bg1.jpg)', 'url' => '/wp-content/themes/vestniconline/images/bg1.jpg' ),
		),
	) ) );
vo_upsert( array( 'post_type' => 'post', 'post_title' => 'Тест: статья без дополнительных блоков', 'post_name' => 'test-article-plain',
	'post_content' => $note . $para, 'post_category' => array( $cat_id ) ) );
say( 'служебные тестовые страницы и записи' );

flush_rewrite_rules( true );
say( 'постоянные ссылки: /%postname%/' );
