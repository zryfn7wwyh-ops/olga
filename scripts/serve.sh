#!/usr/bin/env bash
# Запускает локальный сайт встроенным веб-сервером PHP.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
source "$ROOT/scripts/versions.env"
SUDO=""; [ "$(id -u)" -ne 0 ] && SUDO="sudo"
if ! $SUDO mysqladmin ping >/dev/null 2>&1; then
  ($SUDO service mariadb start || $SUDO service mysql start) >/dev/null 2>&1 || true
fi
echo "http://$HOST:$PORT/   (Ctrl+C — остановить; PHP-журнал: .build/logs/php-debug.log)"
cd "$ROOT/.build/wordpress"
exec php -d display_errors=0 -d log_errors=1 -d error_log="$ROOT/.build/logs/php-server.log" \
  -d upload_max_filesize=64M -d post_max_size=64M \
  -S "$HOST:$PORT" "$ROOT/scripts/router.php"
