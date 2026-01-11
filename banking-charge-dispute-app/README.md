# Banking Charge Dispute Application

A production-quality prototype web application for a banking credit/debit card dispute system. This app demonstrates an enterprise-ready conversational interface for handling charge disputes through an intelligent banking assistant.

## Features

- **WhatsApp-style Chat Interface**: Clean, modern chat UI with message bubbles
- **Single Agent Architecture**: Frontend communicates only with the Dispute Orchestrator Agent
- **Real-time Messaging**: Send and receive messages through the agent API
- **Quick Actions**: Pre-defined actions for common tasks (view transactions, dispute charges)
- **Resolution Cards**: Visual status cards for fraud detection and dispute resolution
- **Observability Dashboard**: Analytics and monitoring view for demo purposes
- **Dark Mode Support**: Full theme switching capability
- **Responsive Design**: Mobile-first, works on all screen sizes

## Tech Stack

- **Next.js 15.5.7** (App Router)
- **React 19.1.0**
- **TypeScript 5**
- **Tailwind CSS v4**
- **shadcn/ui** (New York style)
- **Radix UI** primitives
- **Lucide React** icons
- **next-themes** (theme switching)
- **Recharts** (charts for observability)
- **date-fns** (date formatting)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd banking-charge-dispute-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
banking-charge-dispute-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with theme provider
│   │   ├── page.tsx            # Main chat page
│   │   ├── observability/
│   │   │   └── page.tsx        # Observability dashboard
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatLayout.tsx      # Main chat container
│   │   │   ├── ChatHeader.tsx      # Header with bank/customer info
│   │   │   ├── ChatMessages.tsx    # Messages container
│   │   │   ├── MessageBubble.tsx   # Individual message component
│   │   │   ├── QuickActions.tsx    # Quick action buttons
│   │   │   ├── ChatInput.tsx       # Message input component
│   │   │   └── ResolutionCard.tsx  # Status card for resolutions
│   │   ├── observability/
│   │   │   └── ObservabilityDashboard.tsx
│   │   └── ui/                 # shadcn/ui components
│   ├── lib/
│   │   ├── api.ts              # Agent API service wrapper
│   │   └── utils.ts            # Utility functions
│   └── types/
│       └── index.ts            # TypeScript type definitions
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## Architecture

### Core Constraints

1. **Single API Endpoint**: The frontend ONLY communicates with the Dispute Orchestrator Agent API
2. **No Direct Sub-Agent Calls**: The frontend never directly calls:
   - Transaction Identification Agent
   - Fraud Screening Agent
   - Dispute De-escalation Agent
3. **Orchestrator Pattern**: The Dispute Orchestrator Agent internally coordinates all sub-agents
4. **Dumb Client**: The frontend only sends user text and renders assistant replies

### API Integration

The app uses the Dispute Orchestrator Agent API endpoint:
- **Base URL**: `https://agent-prod.studio.lyzr.ai/v3/inference/chat/`
- **Method**: POST
- **Headers**: 
  - `Content-Type: application/json`
  - `x-api-key: [API_KEY]`

### State Management

- **Session ID**: Persisted in localStorage per chat session
- **Messages**: Array of message objects with role, content, and timestamp
- **Observability Data**: Stored in localStorage for dashboard access
- **Resolution State**: Managed for fraud/dispute outcomes

## Usage

### Chat Interface

1. The app opens with a greeting message from the banking assistant
2. Users can:
   - Click quick action buttons (sends predefined messages)
   - Type freely in the input box
3. All messages are sent to the Dispute Orchestrator Agent
4. Responses are rendered as assistant messages

### Quick Actions

- **Show last transaction**: Requests the most recent transaction
- **Show last 5 transactions**: Requests the last 5 transactions
- **Dispute a charge**: Initiates a dispute flow

### Resolution Cards

When a dispute reaches a resolution state, a card appears showing:
- Transaction ID
- Status (Fraud Confirmed, Not Fraud, Case Resolved, etc.)
- Card Status (if applicable)
- Action buttons (e.g., "Forward to Human Agent")

### Observability Dashboard

Navigate to `/observability` to view:
- Message timeline
- Agent latency metrics
- Step-by-step breakdown
- Final outcome visualization
- Charts and analytics

## Configuration

### API Configuration

Edit `src/lib/api.ts` to update:
- API endpoint URL
- API key
- User ID
- Agent ID

### Theme

The app supports light/dark mode. Toggle using the theme button in the top-right corner.

## Development

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Linting

```bash
npm run lint
```

## Important Notes

- This is a **prototype/demo** application for enterprise client presentations
- The frontend is intentionally "dumb" - it does not make business logic decisions
- All fraud detection, transaction identification, and dispute logic is handled by the backend agent
- The observability dashboard is for demo purposes only
- Session data is stored in localStorage (not suitable for production)

## License

Private - For Accenture Banking Charge Dispute project
