export const toolDefinitions = <any>[
  {
    name: "get_revenue_summary",
    description:
      "Returns total revenue, total orders, total sessions, total items sold, and average order value for a given date range.",
    parameters: {
      type: "object" as const,
      properties: {
        p_date_from: {
          type: "string",
          description: "Start date (YYYY-MM-DD)",
        },
        p_date_to: { type: "string", description: "End date (YYYY-MM-DD)" },
      },
      required: ["p_date_from", "p_date_to"],
    },
  },
  {
    name: "get_top_products",
    description:
      "Returns best-selling products ranked by revenue, including quantity sold, quantity back-ordered, total revenue, and order count.",
    parameters: {
      type: "object" as const,
      properties: {
        p_date_from: {
          type: "string",
          description: "Start date (YYYY-MM-DD)",
        },
        p_date_to: { type: "string", description: "End date (YYYY-MM-DD)" },
        p_limit: {
          type: "number",
          description: "How many products to return (default 10)",
        },
      },
      required: ["p_date_from", "p_date_to"],
    },
  },
  {
    name: "get_top_stores",
    description:
      "Returns top-performing stores ranked by revenue, quantity sold, or visit count. Includes province, city, and back-order totals.",
    parameters: {
      type: "object" as const,
      properties: {
        p_date_from: {
          type: "string",
          description: "Start date (YYYY-MM-DD)",
        },
        p_date_to: { type: "string", description: "End date (YYYY-MM-DD)" },
        p_limit: {
          type: "number",
          description: "How many stores to return (default 10)",
        },
        p_sort_by: {
          type: "string",
          enum: ["revenue", "quantity", "visits"],
          description:
            "Sort stores by: 'revenue' (default), 'quantity' (items sold), or 'visits' (number of visits)",
        },
      },
      required: ["p_date_from", "p_date_to"],
    },
  },
  {
    name: "get_bo_summary",
    description:
      "Returns back-order (BO) summary: total sold, total BO, BO rate percentage, and top 10 products with the most back-orders.",
    parameters: {
      type: "object" as const,
      properties: {
        p_date_from: {
          type: "string",
          description: "Start date (YYYY-MM-DD)",
        },
        p_date_to: { type: "string", description: "End date (YYYY-MM-DD)" },
      },
      required: ["p_date_from", "p_date_to"],
    },
  },
  {
    name: "get_agent_performance",
    description:
      "Returns performance metrics for each sales agent: total sessions, completed sessions, stores visited vs planned, total revenue, items sold, and back-orders.",
    parameters: {
      type: "object" as const,
      properties: {
        p_date_from: {
          type: "string",
          description: "Start date (YYYY-MM-DD)",
        },
        p_date_to: { type: "string", description: "End date (YYYY-MM-DD)" },
      },
      required: ["p_date_from", "p_date_to"],
    },
  },
  {
    name: "get_product_sales_trend",
    description:
      "Returns daily sales trend for a specific product: quantity sold, quantity back-ordered, and revenue per day.",
    parameters: {
      type: "object" as const,
      properties: {
        p_product_id: {
          type: "string",
          description: "UUID of the product to look up",
        },
        p_date_from: {
          type: "string",
          description: "Start date (YYYY-MM-DD)",
        },
        p_date_to: { type: "string", description: "End date (YYYY-MM-DD)" },
      },
      required: ["p_product_id", "p_date_from", "p_date_to"],
    },
  },
  {
    name: "get_store_sales_trend",
    description:
      "Returns daily sales trend for a specific store: quantity sold, quantity back-ordered, revenue, and number of distinct products ordered per day.",
    parameters: {
      type: "object" as const,
      properties: {
        p_store_id: {
          type: "string",
          description: "ID of the store to look up",
        },
        p_date_from: {
          type: "string",
          description: "Start date (YYYY-MM-DD)",
        },
        p_date_to: { type: "string", description: "End date (YYYY-MM-DD)" },
      },
      required: ["p_store_id", "p_date_from", "p_date_to"],
    },
  },
  {
    name: "get_daily_breakdown",
    description:
      "Returns a full breakdown for a single day: total revenue, items sold, back-orders, session count, stores visited, per-agent stats, and top 10 products.",
    parameters: {
      type: "object" as const,
      properties: {
        p_date: {
          type: "string",
          description: "The date to get breakdown for (YYYY-MM-DD)",
        },
      },
      required: ["p_date"],
    },
  },
  {
    name: "get_slow_moving_products",
    description:
      "Returns products with low sales (at or below a threshold) in a date range. Includes days since last sale to identify dead stock.",
    parameters: {
      type: "object" as const,
      properties: {
        p_date_from: {
          type: "string",
          description: "Start date (YYYY-MM-DD)",
        },
        p_date_to: { type: "string", description: "End date (YYYY-MM-DD)" },
        p_threshold: {
          type: "number",
          description:
            "Max total quantity sold to be considered slow-moving (default 10)",
        },
      },
      required: ["p_date_from", "p_date_to"],
    },
  },
  {
    name: "get_store_visit_coverage",
    description:
      "Returns store visit coverage stats: total stores, visited stores, coverage rate %, planned vs completed visits, completion rate %, and a list of up to 20 unvisited stores.",
    parameters: {
      type: "object" as const,
      properties: {
        p_date_from: {
          type: "string",
          description: "Start date (YYYY-MM-DD)",
        },
        p_date_to: { type: "string", description: "End date (YYYY-MM-DD)" },
      },
      required: ["p_date_from", "p_date_to"],
    },
  },
];
