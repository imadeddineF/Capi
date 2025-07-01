import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log the received payload for debugging
    console.log("Received database query payload:", body);

    const { connection_string, selections, message, model } = body;

    if (!connection_string) {
      return NextResponse.json(
        { error: "Connection string is required" },
        { status: 400 }
      );
    }

    // Simulate database connection process
    console.log("🔄 Connecting to database...");
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate query processing
    console.log("🔍 Processing query...");
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Simulate AI analysis
    console.log("🤖 Analyzing data with AI...");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate dynamic response based on the query
    const query = message?.toLowerCase() || "";
    let response, top_customers, total_revenue;

    if (
      query.includes("top customer") ||
      query.includes("customer") ||
      query.includes("order")
    ) {
      // Realistic customer data response
      response = `Based on the analysis of your database, here are the top customers by total order value:

**Top Customers by Total Order Value:**

| Customer Name | Total Orders | Total Value | Average Order |
|---------------|--------------|-------------|---------------|
| Amina Selmi | 3 | $224.99 | $74.99 |
| Nour El Houda | 2 | $219.98 | $109.99 |
| Yacine Bouzid | 2 | $179.90 | $89.95 |
| Lina Kherbache | 1 | $59.98 | $59.98 |
| Riad Bensaid | 1 | $59.00 | $59.00 |

**Key Insights:**
- **Total Revenue:** $743.85
- **Average Order Value:** $82.65
- **Top Performer:** Amina Selmi with $224.99 in total orders
- **Most Orders:** Amina Selmi (3 orders)

**Recommendations:**
1. Focus retention efforts on Amina Selmi and Nour El Houda
2. Consider loyalty programs for high-value customers
3. Analyze Amina Selmi's purchasing patterns for cross-selling opportunities

The data shows a healthy distribution with your top customer contributing 30% of total revenue.`;

      top_customers = [
        { customer_name: "Amina Selmi", total: 224.99 },
        { customer_name: "Nour El Houda", total: 219.98 },
        { customer_name: "Yacine Bouzid", total: 179.9 },
        { customer_name: "Lina Kherbache", total: 59.98 },
        { customer_name: "Riad Bensaid", total: 59.0 },
      ];
      total_revenue = 743.85;
    } else if (query.includes("revenue") || query.includes("sales")) {
      response = `**Revenue Analysis Report**

**Total Revenue:** $743.85
**Period:** Last 30 days
**Growth Rate:** +12.5% vs previous month

**Revenue Breakdown:**
- Online Orders: $521.70 (70.1%)
- In-store Sales: $222.15 (29.9%)

**Top Revenue Contributors:**
1. Amina Selmi: $224.99 (30.2%)
2. Nour El Houda: $219.98 (29.6%)
3. Yacine Bouzid: $179.90 (24.2%)

**Trends:**
- Peak sales on weekends
- Highest average order value: $82.65
- Customer retention rate: 85%`;

      top_customers = [
        { customer_name: "Amina Selmi", total: 224.99 },
        { customer_name: "Nour El Houda", total: 219.98 },
        { customer_name: "Yacine Bouzid", total: 179.9 },
      ];
      total_revenue = 743.85;
    } else {
      // Generic response for other queries
      response = `I've analyzed your database and found the following insights:

**Database Overview:**
- **Tables Analyzed:** ${
        selections?.map((s: any) => s.table).join(", ") || "orders, customers"
      }
- **Total Records:** 1,247
- **Date Range:** March 1-31, 2024

**Key Metrics:**
- Total Revenue: $743.85
- Average Order Value: $82.65
- Customer Count: 156
- Repeat Customer Rate: 23%

**Top Performers:**
1. Amina Selmi - $224.99
2. Nour El Houda - $219.98
3. Yacine Bouzid - $179.90

The data shows strong performance with consistent growth patterns and healthy customer engagement metrics.`;

      top_customers = [
        { customer_name: "Amina Selmi", total: 224.99 },
        { customer_name: "Nour El Houda", total: 219.98 },
        { customer_name: "Yacine Bouzid", total: 179.9 },
      ];
      total_revenue = 743.85;
    }

    // Simulate final processing
    console.log("✅ Generating final report...");
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockResponse = {
      response,
      history: [
        {
          role: "user",
          content: message || "Analyze my database",
        },
        {
          role: "ai",
          content: response,
        },
      ],
      total_revenue,
      top_customers,
      metadata: {
        query_time: "2.3s",
        records_analyzed: 1247,
        tables_queried: selections?.length || 2,
        model_used: model || "gpt-4",
        connection_status: "success",
      },
    };

    console.log("🎉 Query completed successfully!");
    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error("Error processing database query:", error);
    return NextResponse.json(
      { error: "Failed to process database query" },
      { status: 500 }
    );
  }
}
