import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            background: "#fefaf6",
            color: "#4a3540",
            padding: 40,
            textAlign: "center",
            fontFamily: "'Noto Sans SC', sans-serif",
          }}
        >
          <h2 style={{ fontSize: "1.6rem", marginBottom: 12, color: "#d4628a" }}>
            💫 页面出了点小问题
          </h2>
          <p style={{ fontSize: "0.95rem", color: "#7a5d6a", marginBottom: 24, maxWidth: 400 }}>
            可能是存储空间满了或数据异常，点击下方按钮刷新即可恢复。
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              padding: "12px 32px",
              background: "linear-gradient(135deg, #e87ea0, #d4628a)",
              color: "#fff",
              border: "none",
              borderRadius: 50,
              fontSize: "0.95rem",
              cursor: "pointer",
              letterSpacing: 2,
            }}
          >
            刷新页面
          </button>
          <p style={{ marginTop: 16, fontSize: "0.75rem", color: "#b8a0ac" }}>
            { typeof this.state.error === "object" ? (this.state.error.message || JSON.stringify(this.state.error)) : String(this.state.error || "") }
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;