/**
 * LazAI Combined System Demo
 * 
 * This demo shows how Alith AI agents and GMPayer payment system
 * work together to provide a pay-per-use AI service.
 * 
 * Architecture:
 * 1. User submits content analysis request
 * 2. Orchestrator plans execution and authorizes payment via GMPayer
 * 3. Multiple Alith agents execute (sentiment, fact-check, summary)
 * 4. Each agent triggers x402 micropayment upon completion
 * 5. Results aggregated and returned to user
 * 
 * DEMO USES:
 * - REAL Alith Agent SDK with Groq LLM (Production)
 * - MOCK GMPayer payment operations
 */

import { Agent } from "alith";
import 'dotenv/config';

// ===========================
// MOCK GMPAYER CLIENT
// ===========================
// In production, this would be the actual GMPayer SDK
interface PaymentAuthorization {
  authToken: string;
  lockedAmount: number;
  transactionId: string;
}

interface SettlementReceipt {
  agentId: string;
  amount: number;
  txHash: string;
  network: string;
}

class GMPayerClient {
  private apiKey: string;
  private userWallet: string;
  private network: string;

  constructor(apiKey: string, userWallet: string, network: string) {
    this.apiKey = apiKey;
    this.userWallet = userWallet;
    this.network = network;
  }

  /**
   * Authorize payment for upcoming agent execution
   * Locks funds in x402 smart contract
   */
  async authorizePayment(estimatedCost: number): Promise<PaymentAuthorization> {
    console.log(`\n💰 [GMPayer] Authorizing payment of $${estimatedCost}`);
    console.log(`   Locking funds from wallet: ${this.userWallet}`);
    console.log(`   Network: ${this.network}`);
    
    // Simulate network delay
    await this.delay(500);
    
    const auth: PaymentAuthorization = {
      authToken: `x402_${this.generateId()}`,
      lockedAmount: estimatedCost,
      transactionId: `0x${this.generateId()}`
    };
    
    console.log(`   ✅ Payment authorized: ${auth.authToken}`);
    return auth;
  }

  /**
   * Settle payment to specific agent after successful execution
   * Triggers x402 micropayment
   */
  async settlePayment(
    authToken: string,
    agentId: string,
    amount: number,
    agentWallet: string
  ): Promise<SettlementReceipt> {
    console.log(`\n💸 [GMPayer] Settling $${amount} to ${agentId}`);
    console.log(`   Recipient wallet: ${agentWallet}`);
    console.log(`   Using authorization: ${authToken}`);
    
    await this.delay(300);
    
    const receipt: SettlementReceipt = {
      agentId,
      amount,
      txHash: `0x${this.generateId()}`,
      network: this.network
    };
    
    console.log(`   ✅ Payment settled: ${receipt.txHash}`);
    return receipt;
  }

  /**
   * Refund unused funds back to user
   */
  async refundUnused(authToken: string, amount: number): Promise<void> {
    if (amount > 0) {
      console.log(`\n↩️  [GMPayer] Refunding $${amount} to user`);
      await this.delay(300);
      console.log(`   ✅ Refund completed`);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ===========================
// ALITH AGENT DEFINITIONS
// ===========================

interface AgentMetadata {
  id: string;
  name: string;
  cost: number;
  walletAddress: string;
}

const AGENT_CONFIGS: Record<string, AgentMetadata> = {
  sentiment: {
    id: "sentiment-agent-001",
    name: "SentimentAgent",
    cost: 0.50,
    walletAddress: "0x1234...sentimentAgent"
  },
  factCheck: {
    id: "factcheck-agent-002",
    name: "FactCheckerAgent",
    cost: 2.00,
    walletAddress: "0x5678...factCheckAgent"
  },
  summary: {
    id: "summary-agent-003",
    name: "SummarizerAgent",
    cost: 0.30,
    walletAddress: "0x9abc...summaryAgent"
  }
};

// ===========================
// AGENT EXECUTION FUNCTIONS
// ===========================

/**
 * Sentiment Analysis Agent
 * Uses Alith + Groq to analyze content sentiment
 */
async function executeSentimentAgent(content: string): Promise<string> {
  console.log(`\n🤖 [${AGENT_CONFIGS.sentiment.name}] Starting analysis...`);
  
  const agent = new Agent({
    model: "openai/gpt-oss-120b",
    apiKey: process.env.GROQ_API_KEY!,
    baseUrl: "https://api.groq.com/openai/v1",
  });

  const prompt = `Analyze the sentiment of this content in one concise sentence:
"${content}"

Provide: Tone, Sentiment, and Score (-1 to +1)`;

  const result = await agent.prompt(prompt);
  console.log(`   ✅ Analysis complete`);
  return result;
}

/**
 * Fact Checking Agent
 * Simulates verification of claims (in production, would query data sources)
 */
async function executeFactCheckAgent(content: string): Promise<string> {
  console.log(`\n🔍 [${AGENT_CONFIGS.factCheck.name}] Verifying claims...`);
  
  const agent = new Agent({
    model: "openai/gpt-oss-120b",
    apiKey: process.env.GROQ_API_KEY!,
    baseUrl: "https://api.groq.com/openai/v1",
  });

  const prompt = `Extract and evaluate factual claims from this content:
"${content}"

For each claim, indicate if it's verifiable, disputed, or opinion-based.`;

  const result = await agent.prompt(prompt);
  console.log(`   ✅ Verification complete`);
  return result;
}

/**
 * Summary Agent
 * Generates concise summary of content
 */
async function executeSummaryAgent(content: string): Promise<string> {
  console.log(`\n📝 [${AGENT_CONFIGS.summary.name}] Generating summary...`);
  
  const agent = new Agent({
    model: "openai/gpt-oss-120b",
    apiKey: process.env.GROQ_API_KEY!,
    baseUrl: "https://api.groq.com/openai/v1",
  });

  const prompt = `Provide a concise 2-3 sentence summary of this content:
"${content}"`;

  const result = await agent.prompt(prompt);
  console.log(`   ✅ Summary generated`);
  return result;
}

// ===========================
// MASTER ORCHESTRATOR
// ===========================

interface OrchestratedResult {
  sentiment: string;
  factCheck: string;
  summary: string;
  totalCost: number;
  settlements: SettlementReceipt[];
}

/**
 * Master Orchestrator
 * Coordinates agent execution and payment settlement
 */
async function orchestrateAnalysis(content: string): Promise<OrchestratedResult> {
  console.log("\n" + "=".repeat(70));
  console.log("🎭 MASTER ORCHESTRATOR - Starting Request");
  console.log("=".repeat(70));

  // Step 1: Calculate total cost
  const totalCost = AGENT_CONFIGS.sentiment.cost + 
                    AGENT_CONFIGS.factCheck.cost + 
                    AGENT_CONFIGS.summary.cost;
  
  console.log(`\n📊 Request Analysis:`);
  console.log(`   - Services: Sentiment, Fact Check, Summary`);
  console.log(`   - Estimated cost: $${totalCost.toFixed(2)}`);

  // Step 2: Initialize GMPayer and authorize payment
  const gmPayer = new GMPayerClient(
    process.env.GMPAYER_API_KEY || "mock_key",
    process.env.USER_WALLET_ADDRESS || "0x742d35Cc...",
    process.env.PAYMENT_NETWORK || "metis"
  );

  const paymentAuth = await gmPayer.authorizePayment(totalCost);
  
  // Step 3: Execute agents sequentially and settle payments
  const settlements: SettlementReceipt[] = [];

  // Execute Sentiment Agent
  const sentimentResult = await executeSentimentAgent(content);
  const sentimentReceipt = await gmPayer.settlePayment(
    paymentAuth.authToken,
    AGENT_CONFIGS.sentiment.id,
    AGENT_CONFIGS.sentiment.cost,
    AGENT_CONFIGS.sentiment.walletAddress
  );
  settlements.push(sentimentReceipt);

  // Execute Fact Check Agent
  const factCheckResult = await executeFactCheckAgent(content);
  const factCheckReceipt = await gmPayer.settlePayment(
    paymentAuth.authToken,
    AGENT_CONFIGS.factCheck.id,
    AGENT_CONFIGS.factCheck.cost,
    AGENT_CONFIGS.factCheck.walletAddress
  );
  settlements.push(factCheckReceipt);

  // Execute Summary Agent
  const summaryResult = await executeSummaryAgent(content);
  const summaryReceipt = await gmPayer.settlePayment(
    paymentAuth.authToken,
    AGENT_CONFIGS.summary.id,
    AGENT_CONFIGS.summary.cost,
    AGENT_CONFIGS.summary.walletAddress
  );
  settlements.push(summaryReceipt);

  // Step 4: Calculate and refund unused funds (if any)
  const actualCost = settlements.reduce((sum, s) => sum + s.amount, 0);
  const refundAmount = paymentAuth.lockedAmount - actualCost;
  await gmPayer.refundUnused(paymentAuth.authToken, refundAmount);

  console.log("\n" + "=".repeat(70));
  console.log("✅ ORCHESTRATION COMPLETE");
  console.log("=".repeat(70));

  return {
    sentiment: sentimentResult,
    factCheck: factCheckResult,
    summary: summaryResult,
    totalCost: actualCost,
    settlements
  };
}

// ===========================
// MAIN DEMO EXECUTION
// ===========================

(async () => {
  console.log("\n╔════════════════════════════════════════════════════════════╗");
  console.log("║     LazAI Combined System Demo: Alith + GMPayer           ║");
  console.log("║     Multi-Agent Content Analysis with Micropayments        ║");
  console.log("╚════════════════════════════════════════════════════════════╝");

  // Sample content to analyze
  const sampleContent = `
    Recent breakthroughs in quantum computing have led researchers to 
    believe that practical quantum computers could be available within 
    the next decade. These machines promise to revolutionize fields like 
    cryptography, drug discovery, and climate modeling by performing 
    calculations that are impossible for classical computers.
  `.trim();

  console.log("\n📄 Content to analyze:");
  console.log(`"${sampleContent}"`);

  try {
    // Execute the orchestrated analysis
    const result = await orchestrateAnalysis(sampleContent);

    // Display results
    console.log("\n" + "=".repeat(70));
    console.log("📊 ANALYSIS RESULTS");
    console.log("=".repeat(70));

    console.log("\n🎭 Sentiment Analysis:");
    console.log(result.sentiment);

    console.log("\n🔍 Fact Check:");
    console.log(result.factCheck);

    console.log("\n📝 Summary:");
    console.log(result.summary);

    console.log("\n" + "=".repeat(70));
    console.log("💰 PAYMENT SUMMARY");
    console.log("=".repeat(70));
    console.log(`Total Cost: $${result.totalCost.toFixed(2)}`);
    console.log(`\nSettlements:`);
    result.settlements.forEach((settlement) => {
      console.log(`  - ${settlement.agentId}: $${settlement.amount.toFixed(2)}`);
      console.log(`    TX: ${settlement.txHash}`);
    });

    console.log("\n✅ Demo completed successfully!");
    console.log("\nThis demonstrates:");
    console.log("  1. Alith agents providing AI services");
    console.log("  2. GMPayer handling micropayments per agent");
    console.log("  3. x402 protocol settling transactions");
    console.log("  4. Orchestrated multi-agent workflow");

  } catch (error) {
    console.error("\n❌ Error during execution:", error);
    console.log("\nNote: Make sure to set GROQ_API_KEY in .env file");
    console.log("Get your free API key at: https://console.groq.com/");
  }
})();
