import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const circuitBreaker: PatternDefinition = {
  slug: createPatternSlug("circuit-breaker"),
  name: "Circuit Breaker",
  category: createCategoryId("resilience"),
  icon: "shield-alert",
  summary:
    "Prevent cascading failures across a distributed system by temporarily halting requests to an unresponsive service.",
  intent:
    "Detect failures and encapsulate the logic of preventing a failure from constantly recurring during maintenance, temporary outages, or unexpected system degradation.",
  problem:
    "In a microservices architecture, a failing downstream service can cause upstream services to exhaust thread pools or connection limits while waiting for timeouts, leading to a cascading failure across the entire application ecosystem.",
  solution:
    "Wrap remote service calls in a proxy object (the circuit breaker) that monitors for failures. When the number of consecutive failures exceeds a specified threshold, the circuit trips open, immediately failing fast without hitting the remote service, and periodically probes to see if the service has recovered.",
  participants: [
    "Closed State — requests flow normally to the downstream service",
    "Open State — requests fail immediately without invoking the remote service",
    "Half-Open State — a limited number of test requests are allowed through to check recovery",
  ],
  consequences: {
    advantages: [
      "Prevents cascading failures and resource exhaustion across distributed services",
      "Fails fast to improve user experience instead of hanging indefinitely on timeouts",
      "Automatically recovers when the downstream service becomes healthy again",
    ],
    disadvantages: [
      "Adds architectural complexity and state management overhead",
      "Requires careful tuning of failure thresholds, timeouts, and reset intervals",
      "May drop legitimate requests if thresholds are set too aggressively",
    ],
  },
  realWorldAnalogy:
    "An electrical circuit breaker in a home safety panel. If an appliance draws too much current or causes a short, the breaker trips to cut off the flow of electricity, preventing an electrical fire until the issue is fixed and the switch is reset.",
  useCases: [
    "Calling external third-party APIs with inconsistent availability",
    "Inter-service communication in a microservices mesh",
    "Database or cache queries prone to latency spikes",
  ],
  // relatedPatterns: [
  //   createPatternSlug("proxy"),
  //   createPatternSlug("retry"),
  //   createPatternSlug("bulkhead"),
  // ],
  decisionTreeQuestion: "Need to prevent cascading failures from unstable downstream services?",
  codeExamples: [
    {
      language: "typescript",
      filename: "circuit-breaker.ts",
      description:
        "A lightweight TypeScript implementation of a circuit breaker managing Closed, Open, and Half-Open states with failure counting and a reset timeout.",
      code: `enum CircuitState {
  Closed,
  Open,
  HalfOpen,
}

class CircuitBreaker {
  private state: CircuitState = CircuitState.Closed;
  private failureCount = 0;
  private nextAttempt: number = Date.now();

  constructor(
    private readonly threshold: number = 3,
    private readonly timeoutMs: number = 5000
  ) {}

  async execute<T>(action: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.Open) {
      if (Date.now() >= this.nextAttempt) {
        this.state = CircuitState.HalfOpen;
      } else {
        throw new Error("Circuit breaker is OPEN. Fast failing.");
      }
    }

    try {
      const result = await action();
      this.reset();
      return result;
    } catch (error) {
      this.handleFailure();
      throw error;
    }
  }

  private handleFailure() {
    this.failureCount++;
    if (this.failureCount >= this.threshold || this.state === CircuitState.HalfOpen) {
      this.state = CircuitState.Open;
      this.nextAttempt = Date.now() + this.timeoutMs;
    }
  }

  private reset() {
    this.failureCount = 0;
    this.state = CircuitState.Closed;
  }
}`,
    },
  ],
  antiPatternNotices: [],
};