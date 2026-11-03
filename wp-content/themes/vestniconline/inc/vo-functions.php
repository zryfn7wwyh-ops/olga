<?php
function assets_register() {
    // Регистрация JS
    wp_enqueue_script( 'bootstrap', get_template_directory_uri() . '/js/bootstrap.js', array(), '1.0', true );
    wp_enqueue_script( 'swiper', get_template_directory_uri() . '/js/swiper-bundle.min.js', array(), '1.0', true );
    wp_enqueue_script( 'vue', get_template_directory_uri() . '/js/vue@2.7.8.js', array(), '2.7.8', true );
    wp_enqueue_script( 'inputmask', get_template_directory_uri() . '/js/jquery.inputmask.min.js', array(), '5.0.6', true );
    wp_enqueue_script( 'app', get_template_directory_uri() . '/js/app.js', array(), '1.7.2', true );
    // Регистрация CSS
    wp_enqueue_style( 'bootstrap', get_template_directory_uri() . '/css/bootstrap.css', array(), '1.0' );
    wp_enqueue_style( 'custom-style', get_template_directory_uri() . '/css/style.css', array(), '1.8' );
    wp_enqueue_style( 'swiper-style', get_template_directory_uri() . '/css/swiper-bundle.min.css', array(), '1.0' );
    wp_enqueue_style( 'front-old',  get_template_directory_uri() . '/css/frontend.min.css?ver=3.7.1', array(), '1.0' );
}

add_action( 'wp_enqueue_scripts', 'assets_register' );

remove_filter( 'the_content', 'wpautop' );

function header_title_shortcode() {
    $field_value = get_field('field_61233a9cf3c38');
    return $field_value;
	
}
//get_the_title()
add_shortcode('header_title', 'header_title_shortcode');

function subheader_title_shortcode() {
    $field_value = get_field('field_61233aa3f3c39');
    if ($field_value) {
    	return $field_value;
	} else {
		return get_the_title();
	}
}
add_shortcode('subheader_title', 'subheader_title_shortcode');


// Отключаем поля в WC
add_filter( 'woocommerce_checkout_fields' , 'custom_override_checkout_fields' );
function custom_override_checkout_fields( $fields ) {
    unset($fields['billing']['billing_company']);
    unset($fields['billing']['billing_address_2']);
    unset($fields['billing']['billing_city']);
	unset($fields['billing']['billing_address_1']);
    unset($fields['billing']['billing_postcode']);
    unset($fields['billing']['billing_country']);
    unset($fields['billing']['billing_state']);
    unset($fields['shipping']['shipping_address_2']);
	unset( $fields['shipping'] );
	

    return $fields;
}
// очистка корзины
add_filter( 'woocommerce_add_to_cart_validation', 'clear_cart_before_adding_product', 10, 3 );

function clear_cart_before_adding_product( $passed, $product_id, $quantity ) {
    if ( $passed ) {
        WC()->cart->empty_cart();
    }
    return $passed;
}

add_filter( 'wc_add_to_cart_message_html', '__return_null');

// Шорткод slider_r

function slider_r_shortcode($atts) {
    $atts = shortcode_atts( array(
        'title' => '',
        'description' => '',
        'images' => '',
    ), $atts, 'slider_r' );

    $title = $atts['title'];
    $description = $atts['description'];
    $images = explode(";", $atts['images']);

    ob_start(); ?>

    <div class="row mt-30px justify-content-between align-items-center">
		        <div class="col-12 col-lg-3">
            <div class="swiper-container docSwiper">
                <div class="swiper-wrapper">
                    <?php foreach ($images as $key => $image) : ?>
                        <div class="swiper-slide">
                            <img @click="openGallerySlider('<?=$atts['images']?>')" src="<?=$image;?>" alt="Слайд <?php echo $key; ?>">
                        </div>
                    <?php endforeach; ?>
                </div>
                <div class="swiper-pagination"></div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
        </div>
        <div class="col-12 col-lg-8">
            <h2><?php echo $title; ?></h2>
            <p><?php echo $description; ?></p>
        </div>

    </div>

    <?php
    return ob_get_clean();
}
add_shortcode('slider_r', 'slider_r_shortcode');


function add_button_to_content($content) {
    if (is_singular() && empty($content)) {
        $button_code = '<button class="vo-btn bg-vo-primary-linear mt-40px d-block mx-auto" @click="options.modals.consultingModal.visible=true,options.modals.consultingModal.title=\'Получить консультацию\'">Получить консультацию специалиста</button>';
        $content .= $button_code;
    }

    return $content;
}

add_filter('the_content', 'add_button_to_content');

