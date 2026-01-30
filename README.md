# MiniMax - Raycast Extension

Extensión de Raycast "Bring Your Own Key" para chat con IA. Actualmente soporta **MiniMax M2.1** con streaming de respuestas.

## Características

- **Chat conversacional** con historial persistente
- **Streaming de respuestas** en tiempo real
- **Pregunta rápida** (Ask AI) para consultas simples
- **Historial de conversaciones** integrado en la vista principal
- **Filtrado automático** de contenido de "thinking" del modelo

## Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd raycast_ia_byk

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

## Configuración

Abre Raycast → Busca "AI Chat" → `Cmd + ,` para abrir preferencias:

| Preferencia | Tipo | Descripción |
|-------------|------|-------------|
| **MiniMax API Key** | password | Tu API key de MiniMax (requerida) |
| **System Prompt** | texto | Prompt de sistema personalizado (opcional) |
| **Temperature** | dropdown | 0.3 / 0.7 / 1.0 / 1.5 |
| **Max Tokens** | dropdown | 1024 / 2048 / 4096 / 8192 |
| **Stream Responses** | checkbox | Habilitar streaming (default: true) |

## Comandos

### AI Chat
Chat conversacional con historial integrado.

- **Barra superior**: Escribe tu mensaje
- **Enter**: Envía el mensaje
- **Panel izquierdo**: New Chat + historial de conversaciones
- **Panel derecho**: Conversación actual
- `Cmd + N`: Nueva conversación
- `Cmd + Backspace`: Eliminar conversación
- `Cmd + C`: Copiar conversación

### Ask AI
Pregunta rápida con respuesta en streaming.

- Escribe tu pregunta en el formulario
- Ve la respuesta en tiempo real
- Acciones: Copiar, Pegar, Continuar en Chat

## Estructura del Proyecto

```
raycast_ia_byk/
├── package.json              # Manifest de Raycast
├── tsconfig.json
├── assets/
│   └── icon.png
├── src/
│   ├── ask-ai.tsx            # Comando: pregunta rápida
│   ├── ai-chat.tsx           # Comando: chat con historial
│   ├── providers/
│   │   ├── base.ts           # Interface del provider
│   │   └── minimax.ts        # Implementación MiniMax M2.1
│   ├── hooks/
│   │   └── useChat.ts        # Hook principal de chat
│   ├── components/
│   │   ├── ChatView.tsx      # Vista de chat
│   │   └── QuickAIResult.tsx # Vista de respuesta rápida
│   └── utils/
│       ├── storage.ts        # Persistencia LocalStorage
│       └── errors.ts         # Manejo de errores
```

## API MiniMax M2.1

**Endpoint:** `https://api.minimax.io/v1/chat/completions`

**Modelo:** `MiniMax-M2.1`

El provider filtra automáticamente el contenido `<think>...</think>` que el modelo genera durante su razonamiento interno.

## Manejo de Errores

- **401**: API key inválida → Abre preferencias automáticamente
- **429**: Rate limit → Mensaje de espera
- **500+**: Error de servidor → Mensaje de reintento

## Desarrollo

```bash
# Desarrollo con hot-reload
npm run dev

# Build
npm run build

# Lint
npm run lint

# Fix lint
npm run fix-lint
```

## Dependencias

- `@raycast/api`: ^1.93.0
- `@raycast/utils`: ^1.19.0

## Licencia

MIT
