#!/usr/bin/env bash
# Разворачивает локальную копию vestnic.online с нуля:
#   1) ставит PHP-расширения и MariaDB (Ubuntu/Debian, apt) — если их нет;
#   2) скачивает ядро WordPress и плагины по закреплённым коммитам в .build/;
#   3) создаёт БД, wp-config.php, устанавливает WordPress и наполняет его (scripts/seed.php).
# Повторный запуск безопасен. Полный сброс: scripts/setup.sh --reset
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
source "$ROOT/scripts/versions.env"
BUILD="$ROOT/.build"
WP="$BUILD/wordpress"

log() { printf '\n==> %s\n' "$*"; }
SUDO=""; [ "$(id -u)" -ne 0 ] && SUDO="sudo"

if [ "${1:-}" = "--reset" ]; then
  log "Сброс: удаляю .build и базу $DB_NAME"
  rm -rf "$BUILD" "$ROOT/wp-content/plugins"
  $SUDO mysql -e "DROP DATABASE IF EXISTS \`$DB_NAME\`;" 2>/dev/null || true
fi

# 1. Системные зависимости
need_pkgs=()
command -v php >/dev/null || need_pkgs+=(php-cli)
php -m 2>/dev/null | grep -qi '^mysqli$' || need_pkgs+=(php-mysql)
for ext in gd mbstring xml curl zip intl; do php -m 2>/dev/null | grep -qi "^$ext$" || need_pkgs+=("php-$ext"); done
command -v mysqld >/dev/null || command -v mariadbd >/dev/null || need_pkgs+=(mariadb-server)
command -v git >/dev/null || need_pkgs+=(git)
if [ ${#need_pkgs[@]} -gt 0 ]; then
  log "Устанавливаю пакеты: ${need_pkgs[*]}"
  $SUDO apt-get update -qq
  DEBIAN_FRONTEND=noninteractive $SUDO apt-get install -y -qq "${need_pkgs[@]}"
fi

# 2. MariaDB
if ! $SUDO mysqladmin ping >/dev/null 2>&1; then
  log "Запускаю MariaDB"
  ($SUDO service mariadb start || $SUDO service mysql start) >/dev/null 2>&1 || {
    $SUDO mkdir -p /run/mysqld && $SUDO chown mysql:mysql /run/mysqld
    $SUDO sh -c 'nohup mysqld_safe >/dev/null 2>&1 &'
  }
  for _ in $(seq 1 30); do $SUDO mysqladmin ping >/dev/null 2>&1 && break; sleep 1; done
fi
$SUDO mysql -e "CREATE DATABASE IF NOT EXISTS \`$DB_NAME\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
CREATE USER IF NOT EXISTS '$DB_USER'@'127.0.0.1' IDENTIFIED BY '$DB_PASS';
GRANT ALL ON \`$DB_NAME\`.* TO '$DB_USER'@'localhost';
GRANT ALL ON \`$DB_NAME\`.* TO '$DB_USER'@'127.0.0.1'; FLUSH PRIVILEGES;"

# 3. Исходники по закреплённым коммитам
fetch() { # dir repo commit
  local dir="$1" repo="$2" commit="$3"
  if [ -d "$dir/.git" ] && [ "$(git -C "$dir" rev-parse HEAD)" = "$commit" ]; then return; fi
  log "Загружаю $repo@$commit"
  rm -rf "$dir"; mkdir -p "$dir"
  git -C "$dir" init -q
  git -C "$dir" remote add origin "$repo"
  git -C "$dir" fetch -q --depth 1 origin "$commit"
  git -C "$dir" -c advice.detachedHead=false checkout -q FETCH_HEAD
}
mkdir -p "$BUILD/logs" "$BUILD/mail" "$BUILD/leads"
fetch "$WP" "$WP_REPO" "$WP_COMMIT"
mkdir -p "$ROOT/wp-content/plugins"
fetch "$ROOT/wp-content/plugins/contact-form-7" "$CF7_REPO" "$CF7_COMMIT"
fetch "$ROOT/wp-content/plugins/advanced-custom-fields" "$ACF_REPO" "$ACF_COMMIT"

# wp-content ядра заменяем ссылкой на wp-content проекта: тема использует
# абсолютные пути /wp-content/themes/vestniconline/..., поэтому WordPress
# должен работать в корне сайта.
if [ ! -L "$WP/wp-content" ]; then rm -rf "$WP/wp-content"; ln -s ../../wp-content "$WP/wp-content"; fi
mkdir -p "$ROOT/wp-content/uploads"

# 4. wp-config.php (только для локальной среды)
if [ ! -f "$WP/wp-config.php" ]; then
  log "Создаю wp-config.php"
  salts=$(php -r 'for($i=0;$i<8;$i++) echo bin2hex(random_bytes(32)),"\n";')
  mapfile -t S <<<"$salts"
  cat >"$WP/wp-config.php" <<PHP
<?php
// Локальная тестовая среда. Не использовать на рабочем сервере.
define( 'DB_NAME', '$DB_NAME' );
define( 'DB_USER', '$DB_USER' );
define( 'DB_PASSWORD', '$DB_PASS' );
define( 'DB_HOST', '127.0.0.1' );
define( 'DB_CHARSET', 'utf8mb4' );
define( 'DB_COLLATE', '' );
\$table_prefix = 'wp_';
define( 'AUTH_KEY', '${S[0]}' ); define( 'SECURE_AUTH_KEY', '${S[1]}' );
define( 'LOGGED_IN_KEY', '${S[2]}' ); define( 'NONCE_KEY', '${S[3]}' );
define( 'AUTH_SALT', '${S[4]}' ); define( 'SECURE_AUTH_SALT', '${S[5]}' );
define( 'LOGGED_IN_SALT', '${S[6]}' ); define( 'NONCE_SALT', '${S[7]}' );
// Адрес берётся из запроса, чтобы сайт открывался и по 127.0.0.1, и через прокси предпросмотра.
\$vo_proto = ( ( \$_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '' ) === 'https' || ! empty( \$_SERVER['HTTPS'] ) ) ? 'https' : 'http';
if ( 'https' === \$vo_proto ) { \$_SERVER['HTTPS'] = 'on'; }
\$vo_host  = \$_SERVER['HTTP_X_FORWARDED_HOST'] ?? ( \$_SERVER['HTTP_HOST'] ?? '$HOST:$PORT' );
define( 'WP_HOME', \$vo_proto . '://' . \$vo_host );
define( 'WP_SITEURL', \$vo_proto . '://' . \$vo_host );
// Разделение сред: включает локальный приёмник заявок и отключает аналитику
// (см. wp-content/mu-plugins/vo-local-env.php).
define( 'VO_ENV', 'local' );
define( 'VO_SHOW_GAPS', true );              // показывать маркеры «не хватает данных»
define( 'VO_LOCAL_SPOOL', '$BUILD' );        // куда пишутся письма и заявки
define( 'WP_ENVIRONMENT_TYPE', 'local' );
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', '$BUILD/logs/php-debug.log' );
define( 'WP_DEBUG_DISPLAY', false );
define( 'DISALLOW_FILE_EDIT', true );
define( 'AUTOMATIC_UPDATER_DISABLED', true );
define( 'WP_HTTP_BLOCK_EXTERNAL', true );
if ( ! defined( 'ABSPATH' ) ) { define( 'ABSPATH', __DIR__ . '/' ); }
require_once ABSPATH . 'wp-settings.php';
PHP
fi

# 5. Установка и наполнение
log "Устанавливаю и наполняю WordPress"
php "$ROOT/scripts/seed.php" "$WP"

log "Готово. Запуск: scripts/serve.sh  →  http://$HOST:$PORT/  (админка: /wp-admin/, admin / admin)"
