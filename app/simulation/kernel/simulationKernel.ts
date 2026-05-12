export {};
import { aiCEOAgent } from "../agents/ai-ceo-agent";
import { marketingAgent } from "../agents/marketing-agent";
import { crmAgent } from "../agents/crm-agent";
import { customerAgent } from "../agents/customer-agent";

export type SimulationState = {
  tick: number;

  company: {
    cash: number;
    mrr: number;
    churnRate: number;
    acquisitionRate: number;
  };

  leads: Array<{
    id: string;
    stage: "new" | "contacted" | "qualified" | "won" | "lost";
    conversionProbability: number;
  }>;

  events: string[];
};

export class SimulationKernel {
  private state: SimulationState;

  constructor(initialState: SimulationState) {
    this.state = initialState;
  }

  getState() {
    return this.state;
  }

  dispatch(event: any) {
    switch (event.type) {
      case "TICK":
        this.tick();
        break;

      case "GENERATE_LEADS":
        this.generateLeads(event.payload.count);
        break;

      case "ADVANCE_PIPELINE":
        this.advancePipeline();
        break;

      case "UPDATE_PROBABILITIES":
        this.updateProbabilities();
        break;

      case "MARKETING_BLAST":
        this.marketingBoost();
        break;
    }
  }

  private tick() {
    this.state.tick++; this.state.events.push(`Tick ${this.state.tick}`);

    // Run agents
    const agents = [
      aiCEOAgent,
      marketingAgent,
      crmAgent,
      customerAgent,
    ];

    agents.forEach(agent => {
      const action = agent(this.state);
      if (action) this.dispatch(action);
    });
  }

  private generateLeads(count: number) {
    for (let i = 0; i < count; i++) {
      this.state.events.push("New lead generated"); this.state.leads.push({
        id: Math.random().toString(36),
        stage: "new",
        conversionProbability: Math.random() * 0.3,
      });
    }
  }

  private advancePipeline() {
    this.state.leads = this.state.leads.map(l => {
      if (l.stage === "new" && l.conversionProbability > 0.2)
        return { ...l, stage: "contacted" };

      if (l.stage === "contacted" && l.conversionProbability > 0.4)
        return { ...l, stage: "qualified" };

      if (l.stage === "qualified" && l.conversionProbability > 0.7) {
        this.state.company.mrr += 100; this.state.events.push("Closed deal → +$100 MRR");
        return { ...l, stage: "won" };
      }

      return l;
    });
  }

  private updateProbabilities() {
    this.state.leads = this.state.leads.map(l => ({
      ...l,
      conversionProbability: Math.min(
        1,
        l.conversionProbability + (Math.random() - 0.4) * 0.1
      ),
    }));
  }

  private marketingBoost() {
    this.state.leads = this.state.leads.map(l => ({
      ...l,
      conversionProbability: l.conversionProbability + 0.05,
    }));
  }
}
