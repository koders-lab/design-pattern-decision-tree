import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const saga: PatternDefinition = {
  slug: createPatternSlug("saga"),
  name: "Saga",
  category: createCategoryId("data-management"),
  icon: "git-commit",
  summary:
    "Manage distributed transactions across multiple microservices using a sequence of local transactions and compensating actions.",
  intent:
    "Maintain data consistency across services in a distributed architecture without relying on heavy, resource-intensive two-phase commit (2PC) locks.",
  problem:
    "In microservices architectures, data is partitioned across independent databases. A business operation often spans multiple services, but traditional ACID transactions cannot scale across network boundaries, leaving systems prone to partial failures and inconsistent states.",
  solution:
    "Break the distributed transaction down into a series of local transactions where each step updates data within a single service. If a step fails, the saga executes a sequence of compensating transactions in reverse order to undo the changes made by preceding steps.",
  participants: [
    "Saga Coordinator — orchestrates the execution order of local steps and triggers compensating transactions on failure",
    "Local Transaction — a self-contained database transaction executed within a single microservice boundary",
    "Compensating Transaction — an action designed to semantically reverse the effects of a previously completed local transaction",
  ],
  consequences: {
    advantages: [
      "Achieves eventual consistency across decentralized microservices without distributed locks",
      "Improves system availability and throughput by avoiding long-held database locks",
      "Encourages high service autonomy since each service manages its own local data stores",
    ],
    disadvantages: [
      "Provides eventual consistency rather than immediate consistency, introducing temporary data anomalies",
      "Demands complex error-handling and idempotency logic for rollback compensations",
      "Debugging and tracking execution traces across multiple asynchronous events is difficult",
    ],
  },
  realWorldAnalogy:
    "Booking a vacation package involving a flight, a hotel, and a rental car. Each is booked as an independent local transaction. If the flight and hotel succeed but the car rental fails, the system triggers compensations to cancel the hotel and refund the flight rather than rolling back via a global database lock.",
  useCases: [
    "E-commerce order fulfillment spanning inventory, billing, and shipping services",
    "Financial transfers and multi-account ledger updates across banking microservices",
    "Complex user onboarding workflows involving CRM, identity provider, and billing engines",
  ],
  relatedPatterns: [
    createPatternSlug("cqrs"),
    createPatternSlug("api-gateway"),
    createPatternSlug("event-sourcing"),
  ],
  decisionTreeQuestion: "Need to manage distributed transactions across multiple database boundaries?",
  codeExamples: [
    {
      language: "typescript",
      filename: "saga-orchestrator.ts",
      description:
        "An orchestration-based Saga pattern coordinator managing sequential step execution and automated rollback compensations upon failure.",
      code: `interface SagaStep {
  name: string;
  action: () => Promise<void>;
  compensate: () => Promise<void>;
}

class OrderSagaOrchestrator {
  private executedSteps: SagaStep[] = [];

  async execute(steps: SagaStep[]): Promise<boolean> {
    for (const step of steps) {
      try {
        console.log(\`Executing: \${step.name}\`);
        await step.action();
        this.executedSteps.push(step);
      } catch (error) {
        console.error(\`Failed at \${step.name}. Initiating rollbacks...\`);
        await this.rollback();
        return false;
      }
    }
    console.log("Saga completed successfully.");
    return true;
  }

  private async rollback() {
    // Execute compensations in reverse order
    while (this.executedSteps.length > 0) {
      const step = this.executedSteps.pop()!;
      try {
        console.log(\`Compensating: \${step.name}\`);
        await step.compensate();
      } catch (compensateError) {
        console.error(\`Critical: Compensation failed for \${step.name}\`, compensateError);
      }
    }
  }
}`,
    },
  ],
  antiPatternNotices: [],
};