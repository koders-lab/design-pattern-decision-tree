import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const decompositionByBusinessCapability: PatternDefinition = {
  slug: createPatternSlug("decomposition-by-business-capability"),
  name: "Decomposition by Business Capability",
  category: createCategoryId("decomposition"),
  icon: "layers",
  summary:
    "Deconstruct a monolithic application by aligning microservices around distinct business capabilities.",
  intent:
    "Organize software architecture to reflect core business functions rather than technical layers, maximizing team autonomy and maintainability.",
  problem:
    "Monolithic systems group all functionality into a single deployment unit, making it difficult for independent teams to develop, test, and deploy features without stepping on each other's toes or causing system-wide regressions.",
  solution:
    "Identify the distinct business capabilities of the organization—such as Order Management, Customer Service, and Inventory Control—and build a dedicated, autonomous microservice for each capability.",
  participants: [
    "Business Capability — an autonomous functional grouping that a business engages in to generate value",
    "Service Boundary — the logical and technical line surrounding the code and database dedicated to a specific capability",
  ],
  consequences: {
    advantages: [
      "Services are smaller, easier to understand, and independently deployable",
      "Teams can align directly with business domains and work with minimal coordination friction",
      "Failures in one capability are isolated from the rest of the application",
    ],
    disadvantages: [
      "Requires a deep understanding of the business domain prior to slicing architecture",
      "Cross-service communication replaces internal function calls, introducing network latency and complexity",
      "Managing distributed data consistency becomes necessary",
    ],
  },
  realWorldAnalogy:
    "Splitting a massive general store into specialized boutique shops—a bakery, a clothing boutique, and a hardware store—where each shop operates independently with its own inventory and staff, rather than trying to manage everything out of one chaotic warehouse counter.",
  useCases: [
    "Breaking down legacy enterprise monoliths during cloud migration",
    "Scaling engineering organizations from a single team to multiple cross-functional squads",
  ],
  // relatedPatterns: [
  //   createPatternSlug("bounded-context"),
  //   createPatternSlug("api-gateway"),
  //   createPatternSlug("saga"),
  // ],
  decisionTreeQuestion: "Need to split a monolith based on organizational business functions?",
  codeExamples: [
    {
      language: "typescript",
      filename: "capability-service-structure.ts",
      description:
        "Example illustrating structural separation where the Inventory Capability manages its own database models completely separate from Order Processing.",
      code: `// Inventory Capability Module
namespace InventoryCapability {
  export interface StockItem {
    sku: string;
    quantityAvailable: number;
  }

  const inventoryStore: Map<string, number> = new Map([["SKU-100", 45]]);

  export function checkStock(sku: string): boolean {
    return (inventoryStore.get(sku) || 0) > 0;
  }
}

// Order Processing Capability Module
namespace OrderProcessingCapability {
  export function placeOrder(sku: string): string {
    if (InventoryCapability.checkStock(sku)) {
      return \`Order successfully placed for \${sku}\`;
    }
    return \`Order failed: Out of stock for \${sku}\`;
  }
}

console.log(OrderProcessingCapability.placeOrder("SKU-100"));`,
    },
  ],
  antiPatternNotices: [],
};