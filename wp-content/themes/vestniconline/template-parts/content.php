<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package VestnicOnline
 */

?>

<?php
if (is_single()) :
    // Отдельная запись
    ?>
    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?> itemprop="blogPosts" itemscope itemtype="http://schema.org/BlogPosting">
        <div class="container">
            <div class="row rgap-20px">
                <div class="col-12">
                    <h1 class="entry-title"><?php the_title(); ?></h1>
                    <?php the_post_thumbnail('medium', array('class' => 'single-post-image')); ?>
                    <div class="entry-content">
                        <?php the_content(); ?>
                        <?php if ( function_exists( 'vestniconline_render_article_extra_blocks' ) ) : ?>
                            <?php echo vestniconline_render_article_extra_blocks( get_the_ID() ); ?>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </article>
    <?php
else :
    // Не отдельная запись
    ?>
    <article id="post-<?php the_ID(); ?>" <?php post_class('col-12 col-md-6 col-lg-4'); ?> itemprop="blogPosts" itemscope itemtype="http://schema.org/BlogPosting">
        <div class="card">
            <div class="card__header">
                <?php
                if (has_post_thumbnail()) {
                    the_post_thumbnail('medium', array('class' => 'card__image'));
                } else {
                    // Placeholder image or any other default content
                }
                ?>
                <?php vestniconline_post_thumbnail(); ?>
            </div>
            <div class="card__body">
                <span class="tag tag-blue bg-vo-primary-linear text-decoration-none"><?php the_category(', '); ?></span>
                <h2 class="card__title" itemprop="headline"><a class="text-decoration-none text-black" href="<?php the_permalink(); ?>" rel="bookmark"><?php the_title(); ?></a></h2>
                <p><?php the_excerpt(); ?></p>
            </div>
            <div class="card__footer">
				<a href="<?php the_permalink(); ?>" class="vo-btn bg-vo-primary-linear type-2 py-2 w-fit px-3 textSize-16px-400 w-100 text-center text-decoration-none">Читать статью</a>
				<hr />
                <div class="user">
                    <div class="user__info">
                        <div style="font-size: 20px; font-weight: 500; margin-bottom: 5px;"><?php the_author(); ?></div>
                        
                        <small><?php echo human_time_diff(get_the_time('U'), current_time('timestamp')) . ' назад'; ?></small>
                    </div>
                </div>
            </div>
        </div>
        <meta itemprop="description" content="<?php the_excerpt(); ?>" />
        <meta itemprop="author" content="<?php the_author(); ?>" />
        <meta itemprop="datePublished" content="<?php $timestamp = get_the_time('U'); echo date('Y-m-d\TH:i:s+03:00', $timestamp); ?>"/>
        <div itemprop="publisher" itemscope itemtype="https://schema.org/Organization" class="”DisplaNone”">
        <div itemprop="logo" itemscope itemtype="https://schema.org/ImageObject">
        <img itemprop="url image" src="/wp-content/themes/vestniconline/images/logotype.png" />
      </div>
      <meta itemprop="name" content="Вестник Онлайн" />
      <meta
        itemscope
        itemprop="mainEntityOfPage"
        itemtype="https://schema.org/WebPage"
        itemid="<?php the_permalink(); ?>"
       />
    </div>
    </article>
    <?php
endif;
?>
