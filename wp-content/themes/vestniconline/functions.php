<?php
/**
 * VestnicOnline functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package VestnicOnline
 */

if ( ! defined( '_S_VERSION' ) ) {
	// Replace the version number of the theme on each release.
	define( '_S_VERSION', '1.0.0' );
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which
 * runs before the init hook. The init hook is too late for some features, such
 * as indicating support for post thumbnails.
 */
function vestniconline_setup() {
	/*
		* Make theme available for translation.
		* Translations can be filed in the /languages/ directory.
		* If you're building a theme based on VestnicOnline, use a find and replace
		* to change 'vestniconline' to the name of your theme in all the template files.
		*/
	load_theme_textdomain( 'vestniconline', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	/*
		* Let WordPress manage the document title.
		* By adding theme support, we declare that this theme does not use a
		* hard-coded <title> tag in the document head, and expect WordPress to
		* provide it for us.
		*/
	add_theme_support( 'title-tag' );

	/*
		* Enable support for Post Thumbnails on posts and pages.
		*
		* @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		*/
	add_theme_support( 'post-thumbnails' );

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus(
		array(
			'menu-1' => esc_html__( 'Primary', 'vestniconline' ),
		)
	);

	/*
		* Switch default core markup for search form, comment form, and comments
		* to output valid HTML5.
		*/
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);

	// Set up the WordPress core custom background feature.
	add_theme_support(
		'custom-background',
		apply_filters(
			'vestniconline_custom_background_args',
			array(
				'default-color' => 'ffffff',
				'default-image' => '',
			)
		)
	);

	// Add theme support for selective refresh for widgets.
	add_theme_support( 'customize-selective-refresh-widgets' );

	/**
	 * Add support for core custom logo.
	 *
	 * @link https://codex.wordpress.org/Theme_Logo
	 */
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 250,
			'width'       => 250,
			'flex-width'  => true,
			'flex-height' => true,
		)
	);
}
add_action( 'after_setup_theme', 'vestniconline_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function vestniconline_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'vestniconline_content_width', 640 );
}
add_action( 'after_setup_theme', 'vestniconline_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function vestniconline_widgets_init() {
	register_sidebar(
		array(
			'name'          => esc_html__( 'Sidebar', 'vestniconline' ),
			'id'            => 'sidebar-1',
			'description'   => esc_html__( 'Add widgets here.', 'vestniconline' ),
			'before_widget' => '<section id="%1$s" class="widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="widget-title">',
			'after_title'   => '</h2>',
		)
	);
}
add_action( 'widgets_init', 'vestniconline_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function vestniconline_scripts() {
	wp_enqueue_style( 'vestniconline-style', get_stylesheet_uri(), array(), _S_VERSION );
	wp_style_add_data( 'vestniconline-style', 'rtl', 'replace' );

	wp_enqueue_script( 'vestniconline-navigation', get_template_directory_uri() . '/js/navigation.js', array(), _S_VERSION, true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'vestniconline_scripts' );

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require get_template_directory() . '/inc/jetpack.php';
}

/**
 * Load WooCommerce compatibility file.
 */
if ( class_exists( 'WooCommerce' ) ) {
	require get_template_directory() . '/inc/woocommerce.php';
}


require get_template_directory() . '/inc/vo-functions.php';


add_filter('wpcf7_autop_or_not', '__return_false');

// микроразметка для картинок
function add_image_microdata($content) {
    // Ищем все изображения в контенте
    preg_match_all('/<img[^>]+>/i', $content, $images);

    foreach ($images[0] as $img_tag) {
        // Извлекаем URL изображения
        preg_match('/src="([^"]+)"/i', $img_tag, $img_url);
        preg_match('/alt="([^"]+)"/i', $img_tag, $img_alt);

        // Если изображение найдено и есть alt текст
        if (isset($img_url[1])) {
            $image_url = esc_url($img_url[1]);
            // Если alt текст отсутствует, можно использовать название изображения или оставить пустым
            $image_name = isset($img_alt[1]) ? esc_html($img_alt[1]) : 'Изображение';

            // Формируем микроразметку
            $microdata = '
            <script type="application/ld+json">
                {
                    "@context": "https://schema.org/",
                    "@type": "ImageObject",
                    "contentUrl": "' . $image_url . '",
                    "name": "' . $image_name . '", 
                    "creator": {
                        "@type": "Organization", 
                        "name": "Вестник Онлайн"
                    }
                }
            </script>';

            // Вставляем микроразметку сразу после тега изображения
            $content = str_replace($img_tag, $img_tag . $microdata, $content);
        }
    }

    return $content;
}

add_filter('the_content', 'add_image_microdata');

function add_organization_schema_on_pages() {
    if (is_page(1986) || is_page(10)) { // 1986 — Контакты, 10 — Главная
        ?>
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "url": "https://vestnic.online/",
          "logo": "https://vestnic.online/wp-content/themes/vestniconline/images/logotype.png",
          "name": "Example",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "Россия",
            "postalCode": "350000",
            "streetAddress": "Им. Орджоникидзе, д. 41",
            "addressLocality": "Краснодар"
          },
          "telephone": "+73433647026",
          "email": "info@vestnic.online"
        }
        </script>
        <?php
    }
}
add_action('wp_head', 'add_organization_schema_on_pages');


/**
 * Article extra blocks meta.
 */

add_action( 'add_meta_boxes', 'vestniconline_register_article_extra_blocks_metabox' );
function vestniconline_register_article_extra_blocks_metabox() {
	add_meta_box(
		'vestniconline_article_extra_blocks',
		'Дополнительные блоки статьи',
		'vestniconline_render_article_extra_blocks_metabox',
		'post',
		'normal',
		'default'
	);
}

function vestniconline_get_article_extra_blocks_meta( $post_id ) {
	$meta = get_post_meta( $post_id, '_vestniconline_article_extra_blocks', true );
	$meta = is_array( $meta ) ? $meta : array();

	if ( empty( $meta['faq_items'] ) || ! is_array( $meta['faq_items'] ) ) {
		$legacy_faq = array();
		for ( $i = 1; $i <= 50; $i++ ) {
			$question = isset( $meta[ 'faq_' . $i . '_question' ] ) ? $meta[ 'faq_' . $i . '_question' ] : '';
			$answer   = isset( $meta[ 'faq_' . $i . '_answer' ] ) ? $meta[ 'faq_' . $i . '_answer' ] : '';
			if ( '' === $question && '' === $answer ) {
				if ( $i > 2 ) {
					break;
				}
				continue;
			}
			$legacy_faq[] = array(
				'question' => $question,
				'answer'   => $answer,
			);
		}
		$meta['faq_items'] = $legacy_faq;
	}

	if ( empty( $meta['download_items'] ) || ! is_array( $meta['download_items'] ) ) {
		$legacy_downloads = array();
		for ( $i = 1; $i <= 100; $i++ ) {
			$title = isset( $meta[ 'download_' . $i . '_title' ] ) ? $meta[ 'download_' . $i . '_title' ] : '';
			$url   = isset( $meta[ 'download_' . $i . '_url' ] ) ? $meta[ 'download_' . $i . '_url' ] : '';
			if ( '' === $title && '' === $url ) {
				if ( $i > 5 ) {
					break;
				}
				continue;
			}
			$legacy_downloads[] = array(
				'title' => $title,
				'url'   => $url,
			);
		}
		$meta['download_items'] = $legacy_downloads;
	}

	$meta['faq_items']      = array_values( array_filter( $meta['faq_items'], 'is_array' ) );
	$meta['download_items'] = array_values( array_filter( $meta['download_items'], 'is_array' ) );

	return $meta;
}

function vestniconline_render_article_extra_blocks_metabox( $post ) {
	wp_nonce_field( 'vestniconline_article_extra_blocks_action', 'vestniconline_article_extra_blocks_nonce' );

	$meta = vestniconline_get_article_extra_blocks_meta( $post->ID );
	$get_value = static function( $key, $default = '' ) use ( $meta ) {
		return isset( $meta[ $key ] ) ? $meta[ $key ] : $default;
	};
	$faq_items      = ! empty( $meta['faq_items'] ) && is_array( $meta['faq_items'] ) ? $meta['faq_items'] : array( array( 'question' => '', 'answer' => '' ) );
	$download_items = ! empty( $meta['download_items'] ) && is_array( $meta['download_items'] ) ? $meta['download_items'] : array( array( 'title' => '', 'url' => '' ) );
	?>
	<style>
		.vo-extra-meta-box {
			display: flex;
			flex-direction: column;
			gap: 24px;
		}
		.vo-extra-meta-box__section {
			padding: 18px 20px;
			border: 1px solid #d8ddea;
			border-radius: 22px;
			background: linear-gradient(180deg, rgba(219,223,244,.35) 0%, rgba(255,255,255,1) 100%);
		}
		.vo-extra-meta-box__section h3 {
			margin: 0 0 16px;
			font-size: 18px;
		}
		.vo-extra-meta-box__field {
			margin-bottom: 14px;
		}
		.vo-extra-meta-box__field label {
			display: block;
			margin-bottom: 6px;
			font-weight: 600;
		}
		.vo-extra-meta-box__field input[type="text"],
		.vo-extra-meta-box__field input[type="url"],
		.vo-extra-meta-box__field textarea {
			width: 100%;
		}
		.vo-extra-meta-box__rows {
			display: flex;
			flex-direction: column;
			gap: 12px;
		}
		.vo-extra-meta-box__row {
			position: relative;
			padding: 16px;
			border: 1px solid #d8ddea;
			border-radius: 18px;
			background: #fff;
		}
		.vo-extra-meta-box__row-title {
			margin: 0 0 12px;
			font-size: 14px;
			font-weight: 700;
		}
		.vo-extra-meta-box__actions {
			display: flex;
			gap: 10px;
			margin-top: 10px;
			flex-wrap: wrap;
		}
		.vo-extra-meta-box__remove {
			color: #b32d2e;
		}
	</style>

	<div class="vo-extra-meta-box">
		<div class="vo-extra-meta-box__section">
			<h3>Блок «Эксперт»</h3>
			<p>
				<label>
					<input type="checkbox" name="vestniconline_article_extra_blocks[show_expert]" value="1" <?php checked( $get_value( 'show_expert' ), '1' ); ?>>
					Показывать блок
				</label>
			</p>

			<div class="vo-extra-meta-box__field">
				<label for="vo_expert_name">Имя</label>
				<input type="text" id="vo_expert_name" name="vestniconline_article_extra_blocks[expert_name]" value="<?php echo esc_attr( $get_value( 'expert_name' ) ); ?>">
			</div>
			<div class="vo-extra-meta-box__field">
				<label for="vo_expert_position">Должность</label>
				<input type="text" id="vo_expert_position" name="vestniconline_article_extra_blocks[expert_position]" value="<?php echo esc_attr( $get_value( 'expert_position' ) ); ?>">
			</div>
			<div class="vo-extra-meta-box__field">
				<label for="vo_expert_description">Доп. описание</label>
				<input type="text" id="vo_expert_description" name="vestniconline_article_extra_blocks[expert_description]" value="<?php echo esc_attr( $get_value( 'expert_description' ) ); ?>">
			</div>
			<div class="vo-extra-meta-box__field">
				<label for="vo_expert_image">URL изображения</label>
				<input type="url" id="vo_expert_image" name="vestniconline_article_extra_blocks[expert_image]" value="<?php echo esc_attr( $get_value( 'expert_image' ) ); ?>">
			</div>
			<div class="vo-extra-meta-box__field">
				<label for="vo_expert_text">Текст</label>
				<textarea id="vo_expert_text" name="vestniconline_article_extra_blocks[expert_text]" rows="6"><?php echo esc_textarea( $get_value( 'expert_text' ) ); ?></textarea>
			</div>
		</div>

		<div class="vo-extra-meta-box__section">
			<h3>Блок «FAQ»</h3>
			<p>
				<label>
					<input type="checkbox" name="vestniconline_article_extra_blocks[show_faq]" value="1" <?php checked( $get_value( 'show_faq' ), '1' ); ?>>
					Показывать блок
				</label>
			</p>
			<div class="vo-extra-meta-box__rows" data-vo-repeater="faq">
				<?php foreach ( $faq_items as $index => $item ) : ?>
					<div class="vo-extra-meta-box__row" data-vo-row>
						<p class="vo-extra-meta-box__row-title">Блок FAQ</p>
						<div class="vo-extra-meta-box__field">
							<label>Вопрос</label>
							<input type="text" name="vestniconline_article_extra_blocks[faq_items][<?php echo esc_attr( $index ); ?>][question]" value="<?php echo esc_attr( isset( $item['question'] ) ? $item['question'] : '' ); ?>">
						</div>
						<div class="vo-extra-meta-box__field">
							<label>Ответ</label>
							<textarea name="vestniconline_article_extra_blocks[faq_items][<?php echo esc_attr( $index ); ?>][answer]" rows="4"><?php echo esc_textarea( isset( $item['answer'] ) ? $item['answer'] : '' ); ?></textarea>
						</div>
						<button type="button" class="button-link-delete vo-extra-meta-box__remove" data-vo-remove-row>Удалить</button>
					</div>
				<?php endforeach; ?>
			</div>
			<div class="vo-extra-meta-box__actions">
				<button type="button" class="button button-secondary" data-vo-add-row="faq">Добавить вопрос</button>
			</div>
		</div>

		<div class="vo-extra-meta-box__section">
			<h3>Блок «Скачивания»</h3>
			<p>
				<label>
					<input type="checkbox" name="vestniconline_article_extra_blocks[show_downloads]" value="1" <?php checked( $get_value( 'show_downloads' ), '1' ); ?>>
					Показывать блок
				</label>
			</p>
			<div class="vo-extra-meta-box__field">
				<label for="vo_downloads_title">Заголовок блока</label>
				<input type="text" id="vo_downloads_title" name="vestniconline_article_extra_blocks[downloads_title]" value="<?php echo esc_attr( $get_value( 'downloads_title' ) ); ?>">
			</div>
			<div class="vo-extra-meta-box__field">
				<label for="vo_downloads_button_text">Текст кнопки «Скачать все»</label>
				<input type="text" id="vo_downloads_button_text" name="vestniconline_article_extra_blocks[downloads_button_text]" value="<?php echo esc_attr( $get_value( 'downloads_button_text', 'Скачать все' ) ); ?>">
			</div>
			<div class="vo-extra-meta-box__rows" data-vo-repeater="downloads">
				<?php foreach ( $download_items as $index => $item ) : ?>
					<div class="vo-extra-meta-box__row" data-vo-row>
						<p class="vo-extra-meta-box__row-title">Файл</p>
						<div class="vo-extra-meta-box__field">
							<label>Название файла</label>
							<input type="text" name="vestniconline_article_extra_blocks[download_items][<?php echo esc_attr( $index ); ?>][title]" value="<?php echo esc_attr( isset( $item['title'] ) ? $item['title'] : '' ); ?>">
						</div>
						<div class="vo-extra-meta-box__field">
							<label>Ссылка на файл</label>
							<input type="url" name="vestniconline_article_extra_blocks[download_items][<?php echo esc_attr( $index ); ?>][url]" value="<?php echo esc_attr( isset( $item['url'] ) ? $item['url'] : '' ); ?>">
						</div>
						<button type="button" class="button-link-delete vo-extra-meta-box__remove" data-vo-remove-row>Удалить</button>
					</div>
				<?php endforeach; ?>
			</div>
			<div class="vo-extra-meta-box__actions">
				<button type="button" class="button button-secondary" data-vo-add-row="downloads">Добавить файл</button>
			</div>
		</div>
	</div>

	<script>
	(function() {
		const box = document.currentScript.previousElementSibling;
		if (!box) return;

		const templates = {
			faq(index) {
				return `
					<div class="vo-extra-meta-box__row" data-vo-row>
						<p class="vo-extra-meta-box__row-title">Пара FAQ</p>
						<div class="vo-extra-meta-box__field">
							<label>Вопрос</label>
							<input type="text" name="vestniconline_article_extra_blocks[faq_items][${index}][question]" value="">
						</div>
						<div class="vo-extra-meta-box__field">
							<label>Ответ</label>
							<textarea name="vestniconline_article_extra_blocks[faq_items][${index}][answer]" rows="4"></textarea>
						</div>
						<button type="button" class="button-link-delete vo-extra-meta-box__remove" data-vo-remove-row>Удалить</button>
					</div>`;
			},
			downloads(index) {
				return `
					<div class="vo-extra-meta-box__row" data-vo-row>
						<p class="vo-extra-meta-box__row-title">Файл</p>
						<div class="vo-extra-meta-box__field">
							<label>Название файла</label>
							<input type="text" name="vestniconline_article_extra_blocks[download_items][${index}][title]" value="">
						</div>
						<div class="vo-extra-meta-box__field">
							<label>Ссылка на файл</label>
							<input type="url" name="vestniconline_article_extra_blocks[download_items][${index}][url]" value="">
						</div>
						<button type="button" class="button-link-delete vo-extra-meta-box__remove" data-vo-remove-row>Удалить</button>
					</div>`;
			}
		};

		box.addEventListener('click', function(event) {
			const addButton = event.target.closest('[data-vo-add-row]');
			if (addButton) {
				const type = addButton.getAttribute('data-vo-add-row');
				const repeater = box.querySelector('[data-vo-repeater="' + type + '"]');
				if (!repeater || !templates[type]) return;
				const index = repeater.querySelectorAll('[data-vo-row]').length;
				repeater.insertAdjacentHTML('beforeend', templates[type](index));
				return;
			}

			const removeButton = event.target.closest('[data-vo-remove-row]');
			if (removeButton) {
				const row = removeButton.closest('[data-vo-row]');
				const repeater = row ? row.parentElement : null;
				if (!row || !repeater) return;
				if (repeater.querySelectorAll('[data-vo-row]').length === 1) {
					row.querySelectorAll('input, textarea').forEach(function(field) { field.value = ''; });
					return;
				}
				row.remove();
			}
		});
	})();
	</script>
	<?php
}

add_action( 'save_post', 'vestniconline_save_article_extra_blocks_meta' );
function vestniconline_save_article_extra_blocks_meta( $post_id ) {
	if ( ! isset( $_POST['vestniconline_article_extra_blocks_nonce'] ) ) {
		return;
	}

	if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['vestniconline_article_extra_blocks_nonce'] ) ), 'vestniconline_article_extra_blocks_action' ) ) {
		return;
	}

	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	if ( 'post' !== get_post_type( $post_id ) ) {
		return;
	}

	$input = isset( $_POST['vestniconline_article_extra_blocks'] ) && is_array( $_POST['vestniconline_article_extra_blocks'] )
		? wp_unslash( $_POST['vestniconline_article_extra_blocks'] )
		: array();

	$clean = array();

	foreach ( array( 'show_expert', 'show_faq', 'show_downloads' ) as $checkbox_key ) {
		$clean[ $checkbox_key ] = isset( $input[ $checkbox_key ] ) ? '1' : '0';
	}

	foreach ( array( 'expert_name', 'expert_position', 'expert_description', 'downloads_title', 'downloads_button_text' ) as $text_key ) {
		$clean[ $text_key ] = isset( $input[ $text_key ] ) ? sanitize_text_field( $input[ $text_key ] ) : '';
	}

	$clean['expert_image'] = isset( $input['expert_image'] ) ? esc_url_raw( $input['expert_image'] ) : '';
	$clean['expert_text']  = isset( $input['expert_text'] ) ? sanitize_textarea_field( $input['expert_text'] ) : '';
	$clean['faq_items'] = array();
	$clean['download_items'] = array();

	if ( ! empty( $input['faq_items'] ) && is_array( $input['faq_items'] ) ) {
		foreach ( $input['faq_items'] as $item ) {
			if ( ! is_array( $item ) ) {
				continue;
			}
			$question = isset( $item['question'] ) ? sanitize_text_field( $item['question'] ) : '';
			$answer   = isset( $item['answer'] ) ? sanitize_textarea_field( $item['answer'] ) : '';
			if ( '' === $question && '' === $answer ) {
				continue;
			}
			$clean['faq_items'][] = array(
				'question' => $question,
				'answer'   => $answer,
			);
		}
	}

	if ( ! empty( $input['download_items'] ) && is_array( $input['download_items'] ) ) {
		foreach ( $input['download_items'] as $item ) {
			if ( ! is_array( $item ) ) {
				continue;
			}
			$title = isset( $item['title'] ) ? sanitize_text_field( $item['title'] ) : '';
			$url   = isset( $item['url'] ) ? esc_url_raw( $item['url'] ) : '';
			if ( '' === $title && '' === $url ) {
				continue;
			}
			$clean['download_items'][] = array(
				'title' => $title,
				'url'   => $url,
			);
		}
	}

	update_post_meta( $post_id, '_vestniconline_article_extra_blocks', $clean );
}

function vestniconline_render_article_extra_blocks( $post_id = 0 ) {
	$post_id = $post_id ? absint( $post_id ) : get_the_ID();
	if ( ! $post_id ) {
		return '';
	}

	$extra_blocks   = vestniconline_get_article_extra_blocks_meta( $post_id );
	$faq_items      = ! empty( $extra_blocks['faq_items'] ) && is_array( $extra_blocks['faq_items'] ) ? $extra_blocks['faq_items'] : array();
	$download_items = ! empty( $extra_blocks['download_items'] ) && is_array( $extra_blocks['download_items'] ) ? $extra_blocks['download_items'] : array();

	ob_start();
	?>
	<?php if ( ! empty( $extra_blocks['show_expert'] ) && ( ! empty( $extra_blocks['expert_name'] ) || ! empty( $extra_blocks['expert_text'] ) ) ) : ?>
		<section class="article-extra article-extra--expert">
			<div class="article-extra__wrapper">
				<div class="article-expert-card">
					<div class="article-expert-card__person">
						<?php if ( ! empty( $extra_blocks['expert_image'] ) ) : ?>
							<div class="article-expert-card__image-wrap">
								<img class="article-expert-card__image" src="<?php echo esc_url( $extra_blocks['expert_image'] ); ?>" alt="<?php echo esc_attr( ! empty( $extra_blocks['expert_name'] ) ? $extra_blocks['expert_name'] : 'Эксперт' ); ?>">
							</div>
						<?php endif; ?>
						<div class="article-expert-card__person-main">
							<?php if ( ! empty( $extra_blocks['expert_name'] ) ) : ?>
								<h2 class="article-expert-card__person-name"><?php echo esc_html( $extra_blocks['expert_name'] ); ?></h2>
							<?php endif; ?>
							<?php if ( ! empty( $extra_blocks['expert_position'] ) || ! empty( $extra_blocks['expert_description'] ) ) : ?>
								<div class="article-expert-card__person-info">
									<?php if ( ! empty( $extra_blocks['expert_position'] ) ) : ?>
										<p class="article-expert-card__person-position"><?php echo esc_html( $extra_blocks['expert_position'] ); ?></p>
									<?php endif; ?>
									<?php if ( ! empty( $extra_blocks['expert_description'] ) ) : ?>
										<p class="article-expert-card__person-description"><?php echo esc_html( $extra_blocks['expert_description'] ); ?></p>
									<?php endif; ?>
								</div>
							<?php endif; ?>
						</div>
					</div>
					<?php if ( ! empty( $extra_blocks['expert_text'] ) ) : ?>
						<div class="article-expert-card__body"><?php echo nl2br( esc_html( $extra_blocks['expert_text'] ) ); ?></div>
					<?php endif; ?>
				</div>
			</div>
		</section>
	<?php endif; ?>

	<?php if ( ! empty( $extra_blocks['show_faq'] ) && ! empty( $faq_items ) ) : ?>
		<section class="article-extra article-extra--faq">
			<div class="article-extra__wrapper">
				<div class="article-faq-card">
					<?php foreach ( $faq_items as $item ) : ?>
						<?php
						$question = ! empty( $item['question'] ) ? $item['question'] : '';
						$answer   = ! empty( $item['answer'] ) ? $item['answer'] : '';
						if ( '' === $question && '' === $answer ) {
							continue;
						}
						?>
						<div class="article-faq-card__item">
							<?php if ( '' !== $question ) : ?>
								<p class="article-faq-card__question"><span>Вопрос:</span> <?php echo esc_html( $question ); ?></p>
							<?php endif; ?>
							<?php if ( '' !== $answer ) : ?>
								<p class="article-faq-card__answer"><span>Ответ:</span> <?php echo nl2br( esc_html( $answer ) ); ?></p>
							<?php endif; ?>
						</div>
					<?php endforeach; ?>
				</div>
			</div>
		</section>
	<?php endif; ?>

	<?php if ( ! empty( $extra_blocks['show_downloads'] ) && ! empty( $download_items ) ) : ?>
		<section class="article-extra article-extra--downloads">
			<div class="article-extra__wrapper">
				<div class="article-downloads-card">
					<?php if ( ! empty( $extra_blocks['downloads_title'] ) ) : ?>
						<h2 class="article-downloads-card__title"><?php echo esc_html( $extra_blocks['downloads_title'] ); ?></h2>
					<?php endif; ?>
					<div class="article-downloads-card__list">
						<?php foreach ( $download_items as $item ) : ?>
							<?php if ( empty( $item['title'] ) || empty( $item['url'] ) ) { continue; } ?>
							<a class="article-downloads-card__item" href="<?php echo esc_url( $item['url'] ); ?>" download>
								<span class="article-downloads-card__icon" aria-hidden="true">
									<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M29.0275 11.425L23.0894 6.08063C21.3977 4.55803 20.5518 3.79672 19.5138 3.39844L19.5 7.50017C19.5 11.0357 19.5 12.8035 20.5983 13.9018C21.6967 15.0002 23.4645 15.0002 27 15.0002H32.3701C31.8262 13.9438 30.8526 13.0675 29.0275 11.425Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M15 33H21C26.6568 33 29.4854 33 31.2426 31.2426C33 29.4854 33 26.6568 33 21V20.3444C33 19.0352 33 18.0516 32.9361 17.2502H27H26.8577C25.212 17.2503 23.7578 17.2505 22.5854 17.0928C21.3147 16.922 20.0442 16.5297 19.0074 15.4928C17.9705 14.4559 17.5782 13.1854 17.4074 11.9147C17.2497 10.7425 17.2499 9.28811 17.25 7.64246L17.2638 3.39086C17.2643 3.2672 17.2749 3.14488 17.295 3.02499C16.6821 3 15.9537 3 15.0447 3C9.35804 3 6.51473 3 4.75736 4.75736C3 6.51473 3 9.34314 3 15V21C3 26.6568 3 29.4854 4.75736 31.2426C6.51473 33 9.34314 33 15 33ZM11.9806 28.5708C12.4133 28.9764 13.0867 28.9764 13.5194 28.5708L16.5195 25.7583C16.9727 25.3334 16.9958 24.6213 16.5708 24.168C16.1459 23.7149 15.4338 23.6918 14.9806 24.1167L13.875 25.1532V20.25C13.875 19.6287 13.3713 19.125 12.75 19.125C12.1287 19.125 11.625 19.6287 11.625 20.25V25.1532L10.5194 24.1167C10.0662 23.6918 9.35423 23.7149 8.92928 24.168C8.50433 24.6213 8.52729 25.3334 8.98056 25.7583L11.9806 28.5708Z" fill="currentColor"/></svg>
								</span>
								<span class="article-downloads-card__item-title"><?php echo esc_html( $item['title'] ); ?></span>
							</a>
						<?php endforeach; ?>
					</div>
					<?php if ( count( $download_items ) > 1 ) : ?>
						<button type="button" class="article-downloads-card__button vo-btn bg-vo-primary-linear type-2 py-2 px-3" data-download-all='<?php echo esc_attr( wp_json_encode( wp_list_pluck( $download_items, 'url' ) ) ); ?>'><?php echo esc_html( ! empty( $extra_blocks['downloads_button_text'] ) ? $extra_blocks['downloads_button_text'] : 'Скачать все' ); ?></button>
					<?php endif; ?>
				</div>
			</div>
		</section>
	<?php endif; ?>
	<?php

	return trim( ob_get_clean() );
}

add_action( 'wp_footer', 'vestniconline_article_download_all_script', 100 );
function vestniconline_article_download_all_script() {
	if ( ! is_single() ) {
		return;
	}
	?>
	<script>
	document.addEventListener('click', function (e) {
		const button = e.target.closest('[data-download-all]');
		if (!button) return;

		let urls = [];
		try {
			urls = JSON.parse(button.getAttribute('data-download-all') || '[]');
		} catch (err) {
			urls = [];
		}

		if (!Array.isArray(urls) || !urls.length) return;

		urls.forEach(function (url, index) {
			setTimeout(function () {
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', '');
				link.setAttribute('target', '_blank');
				link.setAttribute('rel', 'noopener');
				document.body.appendChild(link);
				link.click();
				link.remove();
			}, index * 250);
		});
	});
	</script>
	<?php
}
