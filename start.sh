#!/bin/bash
echo "🚀 Iniciando TokenEats..."
echo ""

# Backend
echo "📦 Iniciando backend (API en puerto 3001)..."
cd backend
npx tsx src/index.ts &
BACKEND_PID=$!
cd ..

# Esperar a que backend esté listo
for i in $(seq 1 15); do
  if curl -s http://localhost:3001/api > /dev/null 2>&1; then
    echo "✅ Backend listo después de ${i}s"
    break
  fi
  sleep 1
done

# Frontend
echo "🎨 Iniciando frontend (Vite en puerto 5173)..."
cd frontend
npx vite --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!
cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  TokenEats está corriendo:"
echo "  🌐 Frontend: http://localhost:5173"
echo "  📡 API:      http://localhost:3001/api"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Presiona Ctrl+C para detener ambos servidores"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
