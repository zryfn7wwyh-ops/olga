<?php
// Маршрутизатор для `php -S`: статические файлы отдаются как есть,
// остальное — через index.php WordPress (постоянные ссылки /%postname%/).
$path = urldecode( parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH ) );
$file = $_SERVER['DOCUMENT_ROOT'] . $path;

if ( $path !== '/' && is_file( $file ) ) {
	if ( substr( $file, -4 ) === '.php' ) {
		$_SERVER['SCRIPT_NAME']     = $path;
		$_SERVER['SCRIPT_FILENAME'] = $file;
		chdir( dirname( $file ) );
		require $file;
		return true;
	}
	return false; // статика
}
if ( is_dir( $file ) && is_file( rtrim( $file, '/' ) . '/index.php' ) ) {
	if ( substr( $path, -1 ) !== '/' ) {
		header( 'Location: ' . $path . '/', true, 301 );
		return true;
	}
	$_SERVER['SCRIPT_NAME']     = $path . 'index.php';
	$_SERVER['SCRIPT_FILENAME'] = $file . 'index.php';
	chdir( $file );
	require $file . 'index.php';
	return true;
}
$_SERVER['SCRIPT_NAME']     = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = $_SERVER['DOCUMENT_ROOT'] . '/index.php';
require $_SERVER['DOCUMENT_ROOT'] . '/index.php';
