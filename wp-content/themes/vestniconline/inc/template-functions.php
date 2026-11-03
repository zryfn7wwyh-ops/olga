<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package VestnicOnline
 */

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function vestniconline_body_classes( $classes ) {
	// Adds a class of hfeed to non-singular pages.
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}

	// Adds a class of no-sidebar when there is no sidebar present.
	if ( ! is_active_sidebar( 'sidebar-1' ) ) {
		$classes[] = 'no-sidebar';
	}

	return $classes;
}
add_filter( 'body_class', 'vestniconline_body_classes' );

/**
 * Add a pingback url auto-discovery header for single posts, pages, or attachments.
 */
function vestniconline_pingback_header() {
	if ( is_singular() && pings_open() ) {
		printf( '<link rel="pingback" href="%s">', esc_url( get_bloginfo( 'pingback_url' ) ) );
	}
}
add_action( 'wp_head', 'vestniconline_pingback_header' );

/**
 * Require personal-data consent before accepting a comment.
 *
 * @param array $commentdata Comment data.
 * @return array
 */
function vestniconline_validate_comment_consent( $commentdata ) {
	$comment_type = isset( $commentdata['comment_type'] ) ? $commentdata['comment_type'] : 'comment';

	if ( in_array( $comment_type, array( 'pingback', 'trackback' ), true ) ) {
		return $commentdata;
	}

	if ( empty( $_POST['comment_consent_personal'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing
		wp_die(
			'Для отправки комментария необходимо дать согласие на обработку персональных данных.',
			'Ошибка',
			array(
				'response'  => 403,
				'back_link' => true,
			)
		);
	}

	return $commentdata;
}
add_filter( 'preprocess_comment', 'vestniconline_validate_comment_consent' );

/**
 * Save comment consent flags as comment meta.
 *
 * @param int $comment_id Comment ID.
 */
function vestniconline_save_comment_consent( $comment_id ) {
	if ( ! empty( $_POST['comment_consent_personal'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing
		add_comment_meta( $comment_id, 'consent_personal', '1', true );
	}

	if ( ! empty( $_POST['comment_consent_marketing'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Missing
		add_comment_meta( $comment_id, 'consent_marketing', '1', true );
	}
}
add_action( 'comment_post', 'vestniconline_save_comment_consent' );
