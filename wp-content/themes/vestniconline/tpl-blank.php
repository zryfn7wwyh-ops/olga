<?php
/*
Template Name: Без вставок
*/
get_header(); 
?>
<main>
	<div class="container" id="header_gv">
		<?php 
		$field_value = get_field('field_61233a9cf3c38');
		if (empty($field_value)) {
			?>
			<h1 class="textSize-46px-600 pb-2">
				<?php the_title(); ?>
			</h1>
			<?php
		}
		?>
	</div>
    <?php the_content(); ?>
</main>
<?php
get_footer();
?>
