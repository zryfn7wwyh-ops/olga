<?php
/**
 * Plugin Name: Вестник Онлайн — совместимость и локальная среда
 * Description: Замещает недостающие плагины исходного сайта (Shortcoder, Max Mega Menu, поля ACF)
 *              и изолирует локальную среду от рабочей (приёмник заявок, отключение аналитики).
 *              Тему vestniconline не изменяет.
 *
 * Разделение сред: всё, что меняет поведение относительно рабочего сайта, включается только
 * при define( 'VO_ENV', 'local' ) в wp-config.php. Блоки совместимости (раздел 1) безопасны
 * и на рабочем сервере: каждый из них отключается сам, если установлен настоящий плагин.
 */

defined( 'ABSPATH' ) || exit;

function vo_is_local() {
	return defined( 'VO_ENV' ) && 'local' === VO_ENV;
}

/**
 * Маркер «не хватает данных». Виден только в локальной среде при VO_SHOW_GAPS.
 * На рабочем сервере возвращает пустую строку (или HTML-комментарий).
 */
function vo_gap( $what, $need = '', $inline = false ) {
	if ( ! vo_is_local() || ! ( defined( 'VO_SHOW_GAPS' ) && VO_SHOW_GAPS ) ) {
		return '<!-- vo-gap: ' . esc_html( $what ) . ' -->';
	}
	$tag = $inline ? 'span' : 'div';
	return sprintf(
		'<%1$s class="vo-gap%4$s" data-vo-gap="%2$s"><b>Не хватает данных:</b> %2$s%3$s</%1$s>',
		$tag,
		esc_html( $what ),
		$need ? '<br><small>Нужно: ' . esc_html( $need ) . '</small>' : '',
		$inline ? ' vo-gap--inline' : ''
	);
}
add_shortcode( 'vo_gap', function ( $atts ) {
	$atts = shortcode_atts( array( 'what' => '', 'need' => '' ), $atts );
	return vo_gap( $atts['what'], $atts['need'] );
} );

add_action( 'wp_head', function () {
	if ( ! vo_is_local() ) {
		return;
	}
	echo '<style id="vo-gap-css">.vo-gap{box-sizing:border-box;margin:12px auto;max-width:100%;padding:12px 16px;border:2px dashed #c98a00;border-radius:8px;background:repeating-linear-gradient(135deg,#fff8e1 0 12px,#fff3cc 12px 24px);color:#5c4300;font:14px/1.4 system-ui,sans-serif;text-align:left}.vo-gap small{color:#7a5a00}.vo-gap--inline{display:inline-block;margin:0;padding:4px 8px;font-size:12px}</style>' . "\n";
}, 1 );

/* ---------------------------------------------------------------------------
 * 1. Совместимость с плагинами, которых нет в архиве
 * ------------------------------------------------------------------------- */

/**
 * 1.1 Shortcoder: [sc name="..."][/sc].
 * Настоящий плагин хранит сниппеты как записи типа `shortcoder` (post_name = name).
 * Здесь — тот же контракт: если сниппет импортирован, он выводится; иначе — маркер пробела.
 */
add_action( 'init', function () {
	if ( shortcode_exists( 'sc' ) ) {
		return; // установлен настоящий Shortcoder
	}
	if ( ! post_type_exists( 'shortcoder' ) ) {
		register_post_type( 'shortcoder', array(
			'label'        => 'Сниппеты (Shortcoder, совместимость)',
			'public'       => false,
			'show_ui'      => true,
			'show_in_menu' => true,
			'menu_icon'    => 'dashicons-editor-code',
			'supports'     => array( 'title', 'editor' ),
		) );
	}
	add_shortcode( 'sc', function ( $atts ) {
		$atts = shortcode_atts( array( 'name' => '' ), $atts );
		$name = sanitize_title( $atts['name'] );
		$post = $name ? get_page_by_path( $name, OBJECT, 'shortcoder' ) : null;
		if ( $post && 'publish' === $post->post_status ) {
			return do_shortcode( $post->post_content );
		}
		return vo_gap(
			'сниппет Shortcoder «' . $atts['name'] . '»',
			'экспорт сниппета «' . $atts['name'] . '» (таблица wp_posts, post_type=shortcoder) или сохранённый HTML этого блока'
		);
	} );
}, 20 );

/**
 * 1.2 Max Mega Menu: тема вызывает wp_nav_menu( theme_location = max_mega_menu_1 ).
 * Плагин регистрирует эту область и оборачивает меню в #mega-menu-wrap-max_mega_menu_1
 * (на этот id есть правило в style.css темы). Сам плагин и его сгенерированный CSS
 * в архиве отсутствуют, поэтому здесь — только регистрация области и та же обёртка.
 */
add_action( 'after_setup_theme', function () {
	if ( class_exists( 'Mega_Menu' ) ) {
		return;
	}
	register_nav_menus( array( 'max_mega_menu_1' => 'Главное меню (max_mega_menu_1)' ) );
}, 20 );

add_filter( 'wp_nav_menu_args', function ( $args ) {
	if ( class_exists( 'Mega_Menu' ) || 'max_mega_menu_1' !== ( $args['theme_location'] ?? '' ) ) {
		return $args;
	}
	$args['container']       = 'div';
	$args['container_id']    = 'mega-menu-wrap-max_mega_menu_1';
	$args['container_class'] = 'mega-menu-wrap';
	$args['menu_id']         = 'mega-menu-max_mega_menu_1';
	$args['menu_class']      = 'mega-menu max-mega-menu mega-menu-horizontal';
	// Не подставляем список страниц вместо меню: состав меню не подтверждён.
	$args['fallback_cb']     = function () {
		echo vo_gap(
			'главное меню max_mega_menu_1 (пункты и вложенность)',
			'таблицы wp_terms/wp_term_taxonomy/wp_posts (nav_menu_item) и опции megamenu_* из БД, либо сохранённый HTML шапки'
		);
	};
	return $args;
} );

/**
 * 1.3 ACF: тема читает поля по ключам field_61233a9cf3c38 и field_61233aa3f3c39
 * (шорткоды [header_title] и [subheader_title], условие показа H1 в tpl-blank*.php).
 * Группа полей в архиве отсутствует; ключи сохранены точно, имена полей — реконструкция.
 */
add_action( 'acf/include_fields', function () {
	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}
	acf_add_local_field_group( array(
		'key'      => 'group_vo_headers_reconstructed',
		'title'    => 'Заголовки страницы (реконструкция по ключам из темы)',
		'fields'   => array(
			array(
				'key'          => 'field_61233a9cf3c38',
				'label'        => 'Заголовок (header_title)',
				'name'         => 'header_title',
				'type'         => 'text',
				'instructions' => 'Если заполнено, шаблоны «Без вставок» не выводят H1 с названием страницы.',
			),
			array(
				'key'   => 'field_61233aa3f3c39',
				'label' => 'Подзаголовок (subheader_title)',
				'name'  => 'subheader_title',
				'type'  => 'text',
			),
		),
		'location' => array(
			array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'page' ) ),
			array( array( 'param' => 'post_type', 'operator' => '==', 'value' => 'post' ) ),
		),
	) );
} );

// Без ACF шаблоны tpl-blank*.php и шорткоды падали бы с фатальной ошибкой get_field().
// Объявляется только при выводе страницы, когда все плагины уже загружены.
add_action( 'wp', function () {
	if ( ! function_exists( 'get_field' ) ) {
		function get_field( $selector, $post_id = false ) {
			return '';
		}
	}
} );

/**
 * 1.4 jQuery. js/app.js вызывает jQuery(...).inputmask(), а jquery.inputmask.min.js —
 * плагин jQuery. Тема jQuery не подключает: на исходном сайте его подключали плагины.
 */
add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_script( 'jquery' );
}, 5 );

/* ---------------------------------------------------------------------------
 * 2. Только локальная среда (VO_ENV = local)
 * ------------------------------------------------------------------------- */
if ( ! vo_is_local() ) {
	return;
}

function vo_spool_dir( $sub ) {
	$base = defined( 'VO_LOCAL_SPOOL' ) ? VO_LOCAL_SPOOL : WP_CONTENT_DIR . '/vo-local';
	$dir  = trailingslashit( $base ) . $sub;
	wp_mkdir_p( $dir );
	return $dir;
}

function vo_spool_write( $sub, $data ) {
	$file = vo_spool_dir( $sub ) . '/' . gmdate( 'Ymd-His' ) . '-' . wp_generate_password( 6, false ) . '.json';
	file_put_contents( $file, wp_json_encode( $data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) );
	return $file;
}

// 2.1 Почта (Contact Form 7 и др.) не уходит наружу — пишется в .build/mail/*.json.
add_filter( 'pre_wp_mail', function ( $return, $atts ) {
	vo_spool_write( 'mail', $atts );
	return true;
}, 10, 2 );

// 2.2 Локальный приёмник заявок вместо внешних обработчиков
//     (consultings.online/api/phoneSendDataVestnic.php из footer.php,
//      vestnic.online/api/sendData.php из quiz/quizfed__module.js).
add_action( 'rest_api_init', function () {
	register_rest_route( 'vo-local/v1', '/lead', array(
		'methods'             => array( 'POST', 'GET' ),
		'permission_callback' => '__return_true',
		'callback'            => function ( WP_REST_Request $req ) {
			$file = vo_spool_write( 'leads', array(
				'target'  => $req->get_param( 'target' ),
				'json'    => $req->get_json_params(),
				'body'    => $req->get_body_params(),
				'raw'     => $req->get_body(),
				'headers' => array( 'content-type' => $req->get_header( 'content-type' ) ),
			) );
			return array( 'status' => 'ok', 'success' => true, 'local' => basename( $file ) );
		},
	) );
	register_rest_route( 'vo-local/v1', '/leads', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			$out = array();
			foreach ( array( 'leads', 'mail' ) as $sub ) {
				foreach ( glob( vo_spool_dir( $sub ) . '/*.json' ) as $f ) {
					$out[ $sub ][] = json_decode( file_get_contents( $f ), true );
				}
			}
			return $out;
		},
	) );
} );

// Перенаправление fetch() внешних обработчиков на локальный приёмник. Выводится первым в <head>.
add_action( 'wp_head', function () {
	$endpoint = esc_url_raw( rest_url( 'vo-local/v1/lead' ) );
	?>
<script id="vo-local-env">
(function () {
	var endpoint = <?php echo wp_json_encode( $endpoint ); ?>;
	var external = /^https?:\/\/(consultings\.online|vestnic\.online)\/api\//i;
	var origFetch = window.fetch;
	window.fetch = function (input, init) {
		try {
			var url = typeof input === 'string' ? input : (input && input.url) || '';
			if (external.test(url)) {
				input = endpoint + (endpoint.indexOf('?') > -1 ? '&' : '?') + 'target=' + encodeURIComponent(url);
				console.info('[local] заявка перенаправлена в локальный приёмник:', url);
			}
		} catch (e) {}
		return origFetch.call(this, input, init);
	};
	// Счётчики отключены в локальной среде; вызовы ym() только логируются.
	window.ym = function () { console.debug('[local] ym', [].slice.call(arguments)); };
})();
</script>
	<?php
}, 0 );

// 2.3 Аналитика и коллтрекинг не загружаются, абсолютные ссылки на uploads рабочего
//     домена указывают на локальную копию. Тема при этом не меняется.
add_action( 'template_redirect', function () {
	if ( is_admin() || wp_doing_ajax() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
		return;
	}
	ob_start( function ( $html ) {
		$map = array(
			// Яндекс.Метрика: тег не загружается (ym остаётся локальной заглушкой).
			'"https://mc.yandex.ru/metrika/tag.js"'           => '"data:text/javascript,"',
			'<img src="https://mc.yandex.ru/watch/82948618"'  => '<img data-disabled-src="https://mc.yandex.ru/watch/82948618"',
			// Roistat: элемент <script> вставляется без src и ничего не загружает.
			'js.async = 1; js.src = p+h+u;'                    => 'js.async = 1; /* local: roistat disabled */',
			// Mango Office: пустой скрипт вместо виджета.
			"'//widgets.mango-office.ru/widgets/mango.js'"     => "'data:text/javascript,'",
			// Изображения из uploads рабочего сайта — из локального wp-content/uploads.
			'https://vestnic.online/wp-content/'               => '/wp-content/',
		);
		return strtr( $html, $map );
	} );
}, 0 );

add_action( 'send_headers', function () {
	header( 'X-Robots-Tag: noindex, nofollow' );
} );
add_filter( 'pre_option_blog_public', function () { return '0'; } );
