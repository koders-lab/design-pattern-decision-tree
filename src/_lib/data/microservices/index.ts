import { circuitBreaker } from "./circuit-breaker";
import { saga } from "./saga";
import { decompositionByBusinessCapability } from "./decomposition";

export const microservicesPatterns = [
  circuitBreaker,
  saga,
  decompositionByBusinessCapability,
];

export { circuitBreaker, saga, decompositionByBusinessCapability };