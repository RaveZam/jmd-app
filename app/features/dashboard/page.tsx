import React from "react";

export function DashboardPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f7fafc", padding: 24 }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>Dashboard</h1>
        <p style={{ margin: "6px 0 0", color: "#4a5568" }}>
          Welcome back — here's a quick overview of your bakery.
        </p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 }}>
        <aside
          style={{
            background: "#fff",
            borderRadius: 8,
            padding: 16,
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            height: "fit-content",
          }}
        >
          <nav>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 8 }}>
                <a href="#" style={{ color: "#1a202c", textDecoration: "none" }}>
                  Overview
                </a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <a href="#" style={{ color: "#4a5568", textDecoration: "none" }}>
                  Orders
                </a>
              </li>
              <li style={{ marginBottom: 8 }}>
                <a href="#" style={{ color: "#4a5568", textDecoration: "none" }}>
                  Products
                </a>
              </li>
              <li>
                <a href="#" style={{ color: "#4a5568", textDecoration: "none" }}>
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <section>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div style={cardStyle}>
              <h3 style={cardTitle}>Today's Orders</h3>
              <p style={cardValue}>24</p>
            </div>
            <div style={cardStyle}>
              <h3 style={cardTitle}>Pending</h3>
              <p style={cardValue}>3</p>
            </div>
            <div style={cardStyle}>
              <h3 style={cardTitle}>Revenue</h3>
              <p style={cardValue}>$1,420</p>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 8, padding: 16, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
            <h2 style={{ marginTop: 0 }}>Recent Orders</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ textAlign: "left", color: "#4a5568" }}>
                <tr>
                  <th style={{ padding: "8px 6px" }}>Order</th>
                  <th style={{ padding: "8px 6px" }}>Customer</th>
                  <th style={{ padding: "8px 6px" }}>Total</th>
                  <th style={{ padding: "8px 6px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "8px 6px" }}>#1024</td>
                  <td style={{ padding: "8px 6px" }}>A. Johnson</td>
                  <td style={{ padding: "8px 6px" }}>$34.00</td>
                  <td style={{ padding: "8px 6px" }}>Completed</td>
                </tr>
                <tr>
                  <td style={{ padding: "8px 6px" }}>#1023</td>
                  <td style={{ padding: "8px 6px" }}>B. Lee</td>
                  <td style={{ padding: "8px 6px" }}>$18.50</td>
                  <td style={{ padding: "8px 6px" }}>Pending</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 8,
  padding: 16,
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  minHeight: 84,
};

const cardTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: "#4a5568",
};

const cardValue: React.CSSProperties = {
  margin: "8px 0 0",
  fontSize: 20,
  fontWeight: 600,
  color: "#1a202c",
};

export default DashboardPage;

