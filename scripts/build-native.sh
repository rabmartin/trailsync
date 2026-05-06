#!/bin/bash
# Build Next.js static export then sync to Capacitor native platforms.
set -e
echo "→ Building Next.js static export..."
npm run build
echo "→ Syncing web assets to native platforms..."
npx cap sync
echo "✓ Done."
echo "  iOS: open Xcode with  →  npx cap open ios"
echo "  Android: open Android Studio  →  npx cap open android"
