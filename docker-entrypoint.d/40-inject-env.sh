#!/bin/sh
set -e

# Regenerate env.js from the API_URL environment variable at container
# startup, so the same built image can be pointed at a different backend
# (docker-compose locally vs. a real deployment) without a rebuild.
# nginx's base image runs every executable script under
# /docker-entrypoint.d/ automatically before nginx starts.
: "${API_URL:=http://localhost:8080/api}"

cat > /usr/share/nginx/html/env.js <<EOF
window.__env__ = {
  apiUrl: "${API_URL}"
};
EOF

echo "40-inject-env.sh: wrote env.js with apiUrl=${API_URL}"
