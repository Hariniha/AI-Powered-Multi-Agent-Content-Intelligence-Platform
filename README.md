# LazAI Combined System Demo

## 📋 Task Overview

**Idea**: Design a Combined System Using LazAI Components

This demo demonstrates a realistic system that combines **Alith AI Agent Framework** and **GMPayer** (x402 payment protocol) to create a multi-agent content analysis platform with pay-per-use micropayments.

## 🎯 What We've Built

 A **Multi-Agent Content Intelligence System** where:
- Users submit content for analysis
- Multiple specialized AI agents process the content
- Each agent is paid via micropayments after completion
- Results are aggregated and returned to the user

### Architecture Components:
1. **Alith Agents** - Three specialized AI agents (Sentiment, FactChecker, Summarizer)
2. **GMPayer** - Payment orchestration with x402 protocol
3. **Master Orchestrator** - Coordinates agent execution and payment flow

## ⚡ Implementation Status

### ✅ REAL (Production Integration):
- **Alith Agent Framework**: Using official `alith` SDK
- **LLM Integration**: Real Groq API calls (openai/gpt-oss-120b model)
- **AI Inference**: Actual content analysis and generation

### 🎭 MOCK (Demonstration):
- **GMPayer Client**: Simulated blockchain payment operations
- **x402 Protocol**: Mock transaction hashes and settlements
- **Cross-chain Operations**: Simulated network interactions

**Why?** We use real AI to show actual agent capabilities, while mocking payments to avoid requiring blockchain setup.

## 🚀 How to Run

### Prerequisites
- Node.js installed
- Internet connection (for Groq API calls)

### Steps

1. **Install dependencies**
```bash
npm install
```

2. **Run the demo**
```bash
npm start
```

The demo will:
- Analyze sample quantum computing content
- Execute 3 AI agents sequentially
- Simulate payment settlements
- Display results and payment summary

### Expected Output
```
╔════════════════════════════════════════════════════════════╗
║     LazAI Combined System Demo: Alith + GMPayer           ║
╚════════════════════════════════════════════════════════════╝

📊 Request Analysis:
   - Services: Sentiment, Fact Check, Summary
   - Estimated cost: $2.80

💰 [GMPayer] Authorizing payment...
🤖 [SentimentAgent] Starting analysis...
   ✅ Analysis complete
💸 [GMPayer] Settling $0.50...

🔍 [FactCheckerAgent] Verifying claims...
   ✅ Verification complete
💸 [GMPayer] Settling $2.00...

📝 [SummarizerAgent] Generating summary...
   ✅ Summary generated
💸 [GMPayer] Settling $0.30...

======================================================================
📊 ANALYSIS RESULTS (Real AI Output)
======================================================================
[Sentiment Analysis, Fact Check, and Summary displayed here]

💰 PAYMENT SUMMARY
Total Cost: $2.80
```

## 📁 Project Structure

```
demo/
├── index.ts           # Main demo code (TypeScript source)
├── index.js           # Compiled JavaScript (auto-generated)
├── package.json       # Dependencies and scripts
├── .env               # API keys (Groq API included)
└── README.md          # This file
```

## 🔑 Environment Variables

The `.env` file is pre-configured with:
- `GROQ_API_KEY` - Working API key for Groq LLM (real)
- `USER_WALLET_ADDRESS` - User's wallet address (demo)
- `USER_PRIVATE_KEY` - Private key for signing transactions (mocked)
- `GMPAYER_CONTRACT_ADDRESS` - x402 smart contract address (demo)
- `PAYMENT_NETWORK` - Blockchain network (metis)
- `RPC_ENDPOINT` - Blockchain RPC endpoint

**Note**: GMPayer uses blockchain-based authentication (wallet + smart contract), not Web2 API keys.

## 📖 Full Architecture

For complete system design, failure scenarios, and detailed explanations, see:
- **[Task4_System_Architecture.md](../Task4_System_Architecture.md)** - Full architectural document

## 💡 Key Takeaways

1. **Real AI Integration**: Production Alith agents with actual LLM responses
2. **Payment Architecture**: Demonstrates x402 micropayment flow
3. **Scalable Design**: Easy to add more agents or payment networks
4. **Production-Ready Pattern**: Code structure ready for real blockchain integration

---

**Built for**: LazAI Task 4 - Combined System Design  
**Components**: Alith AI Agent Framework + GMPayer (x402 Protocol)
