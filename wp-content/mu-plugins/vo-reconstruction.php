<?php
/**
 * Plugin Name: Вестник Онлайн — реконструкция блоков по скриншотам
 * Description: Стили и скрипт для сниппетов главной (content/snippets), восстановленных по скриншотам
 *              vestnic.online от 05.11.2026, и шрифт Source Sans Pro, на который ссылается CSS темы.
 *              Действует в любой среде; при импорте настоящих сниппетов и стилей файл можно удалить.
 */
defined( 'ABSPATH' ) || exit;

add_action( 'wp_enqueue_scripts', function () {
	$base = content_url( 'mu-plugins/vo-reconstruction' );
	$dir  = WP_CONTENT_DIR . '/mu-plugins/vo-reconstruction';
	// CSS темы использует "Source Sans Pro" в ~1450 правилах, но тема его не подключает;
	// на рабочем сайте шрифт подключался вне темы (источник не установлен).
	wp_enqueue_style( 'vo-source-sans', 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,300;0,400;0,600;0,700;0,900;1,400&display=swap', array(), null );
	wp_enqueue_style( 'vo-reconstruction', "$base/reconstruction.css", array( 'custom-style', 'front-old' ), filemtime( "$dir/reconstruction.css" ) );
	wp_enqueue_script( 'vo-reconstruction', "$base/reconstruction.js", array( 'app' ), filemtime( "$dir/reconstruction.js" ), true );
}, 20 );
