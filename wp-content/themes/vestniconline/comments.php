<?php
/**
 * The template for displaying comments
 *
 * This is the template that displays the area of the page that contains both the current comments
 * and the comment form.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package VestnicOnline
 */

/*
 * If the current post is protected by a password and
 * the visitor has not yet entered the password we will
 * return early without loading the comments.
 */
if ( post_password_required() ) {
	return;
}
?>

<div id="comments" class="comments-area container mt-50px">

	<?php
	// You can start editing here -- including this comment!
	if ( have_comments() ) :
		?>
		<h2 class="comments-title">
			<?php
			$vestniconline_comment_count = get_comments_number();
			if ( '1' === $vestniconline_comment_count ) {
				printf(
					/* translators: 1: title. */
					esc_html__( 'One thought on &ldquo;%1$s&rdquo;', 'vestniconline' ),
					'<span>' . wp_kses_post( get_the_title() ) . '</span>'
				);
			} else {
				printf( 
					/* translators: 1: comment count number, 2: title. */
					esc_html( _nx( '%1$s thought on &ldquo;%2$s&rdquo;', '%1$s thoughts on &ldquo;%2$s&rdquo;', $vestniconline_comment_count, 'comments title', 'vestniconline' ) ),
					number_format_i18n( $vestniconline_comment_count ), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					'<span>' . wp_kses_post( get_the_title() ) . '</span>'
				);
			}
			?>
		</h2><!-- .comments-title -->

		<?php the_comments_navigation(); ?>

		<ol class="comment-list">
			<?php
			wp_list_comments(
				array(
					'style'      => 'ol',
					'short_ping' => true,
				)
			);
			?>
		</ol><!-- .comment-list -->

		<?php
		the_comments_navigation();

		// If comments are closed and there are comments, let's leave a little note, shall we?
		if ( ! comments_open() ) :
			?>
			<p class="no-comments"><?php esc_html_e( 'Comments are closed.', 'vestniconline' ); ?></p>
			<?php
		endif;

	endif; // Check for have_comments().

	$comment_consent_fields = '
	<div class="comment-form-consent comment-form-consent-personal">
		<label for="comment_consent_personal">
			<input type="checkbox" name="comment_consent_personal" id="comment_consent_personal" value="1" required>
			<span>Нажимая кнопку «Отправить комментарий», я даю свое <a href="/soglasie-pers-dannyh/" target="_blank">Согласие на обработку моих персональных данных</a> в соответствии с Федеральным законом от 27.07.2006 года № 152-ФЗ «О персональных данных» на условиях и для целей, определенных <a href="/politika-konfidencialnosti/" target="_blank">Политикой конфиденциальности</a>.</span>
		</label>
	</div>
	<div class="comment-form-consent comment-form-consent-marketing">
		<label for="comment_consent_marketing">
			<input type="checkbox" name="comment_consent_marketing" id="comment_consent_marketing" value="1">
			<span>Нажимая кнопку «Отправить комментарий», я даю свое согласие на получение сообщений информационного (рекламного) характера в соответствии с Федеральным законом от 13.03.2006 г № 38-ФЗ «О рекламе» на условиях и для целей, определенных <a href="/politika-konfidencialnosti/" target="_blank">Политикой конфиденциальности</a>, <a href="/soglasie-rassylki/" target="_blank">Согласием на осуществление рекламной рассылки</a>.</span>
		</label>
	</div>';

	comment_form(
		array(
			'submit_field' => $comment_consent_fields . '<p class="form-submit">%1$s %2$s</p>',
		)
	);
	?>

</div><!-- #comments -->
