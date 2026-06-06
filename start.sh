#!/bin/bash

echo "🚀 بدء تشغيل BOROZ..."
echo ""
echo "📋 المتطلبات:"
node --version
npm --version
echo ""

cd /home/claude/salla-marketing-mvp

echo "📦 التحقق من المكتبات..."
if [ ! -d "node_modules" ]; then
    echo "📥 تثبيت المكتبات..."
    npm install
fi

echo ""
echo "🎬 تشغيل التطبيق..."
echo ""
echo "═══════════════════════════════════════════════════════"
echo "  🌐 BOROZ Platform"
echo "  📱 http://localhost:3000"
echo "═══════════════════════════════════════════════════════"
echo ""

npm run dev
