import type { PatternDefinition } from "@/_lib/domain/Pattern";
import { createPatternSlug } from "@/_lib/domain/PatternSlug";
import { createCategoryId } from "@/_lib/domain/PatternCategory";

export const domainDrivenDesign: PatternDefinition = {
  slug: createPatternSlug("bounded-context"),
  name: "Domain-Driven Design (Bounded Contexts)",
  category: createCategoryId("decomposition"),
  icon: "layout-grid",
  summary:
    "Deconstruct monolithic systems by explicitly defining boundaries around distinct business domains and models.",
  intent:
    "Isolate complex domain logic and decouple teams by establishing clear conceptual boundaries and ubiquitous language per subdomain.",
  problem:
    "When an application grows, a single shared data model and unified codebase become bloated, tightly coupled, and hard to reason about. Different business units use the same terms (like 'Customer' or 'Product') with conflicting meanings, causing communication friction and deployment gridlock.",
  solution:
    "Divide the system into distinct Bounded Contexts, where each context has an explicit boundary, an independent data model, and a dedicated ubiquitous language tailored specifically to that business capability.",
  participants: [
    "Bounded Context — the boundary within which a domain model applies universally and terms have a singular meaning",
    "Ubiquitous Language — a standardized, shared vocabulary used by developers and domain experts inside the context",
    "Context Map — the structural blueprint describing relationships and integration points between different bounded contexts",
  ],
  consequences: {
    advantages: [
      "Aligns software architecture directly with organizational business subdomains",
      "Empowers independent development teams to evolve their schemas without cross-domain impact",
      "Eliminates ambiguity by enforcing strict context-specific definitions for domain entities",
    ],
    disadvantages: [
      "Requires deep, ongoing collaboration with domain experts to define boundaries accurately",
      "Introduces data duplication and mapping complexity when communicating across boundaries",
      "Incorrectly drawn boundaries can result in chatty, highly dependent microservices (distributed monolith)",
    ],
  },
  realWorldAnalogy:
    "A large corporation structured into autonomous departments like Accounting, Logistics, and Human Resources. Each department uses the term 'Employee' differently—HR cares about benefits and compliance, Accounting cares about payroll brackets, and Logistics cares about warehouse security clearance. They maintain separate records rather than forcing a single bloated spreadsheet for the whole company.",
  useCases: [
    "Refactoring a large enterprise monolith into microservices architecture",
    "Isolating legacy core engines from modern customer-facing digital experiences",
    "Managing complex domain rules across multi-tenant enterprise platforms",
  ],
  // relatedPatterns: [
  //   createPatternSlug("api-gateway"),
  //   createPatternSlug("saga"),
  //   createPatternSlug("cqrs"),
  // ],
  decisionTreeQuestion: "Need to partition a large domain into independent, business-aligned boundaries?",
  codeExamples: [
    {
      language: "typescript",
      filename: "bounded-context-boundary.ts",
      description:
        "Example showing isolated domain models where the Shipping context handles fulfillment independently from the Billing context, communicating only via clean DTO contracts.",
      code: `// Shipping Bounded Context Model
namespace ShippingContext {
  export interface ShipmentOrder {
    orderId: string;
    shippingAddress: string;
    items: { sku: string; weightKg: number }[];
  }

  export function dispatchShipment(order: ShipmentOrder): string {
    return \`Dispatching order \${order.orderId} to \${order.shippingAddress}\`;
  }
}

// Billing Bounded Context Model
namespace BillingContext {
  export interface InvoiceRecord {
    invoiceId: string;
    totalAmountCents: number;
    isPaid: boolean;
  }

  export function generateInvoice(orderId: string, amount: number): InvoiceRecord {
    return { invoiceId: \`INV-\${orderId}\`, totalAmountCents: amount, isPaid: true };
  }
}

// Cross-context integration contract
const orderId = "ORD-9921";
const shipmentLog = ShippingContext.dispatchShipment({
  orderId,
  shippingAddress: "123 Tech Way, AZ",
  items: [{ sku: "SKU-PRO", weightKg: 1.5 }]
});
const invoice = BillingContext.generateInvoice(orderId, 14999);

console.log(shipmentLog);
console.log(\`Generated \${invoice.invoiceId} for status paid: \${invoice.isPaid}\`);`,
    },
  ],
  antiPatternNotices: [],
};