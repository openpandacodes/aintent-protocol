declare global {
  interface Window {
    env: {
      REACT_APP_CLAUDE_API_KEY?: string;
      REACT_APP_CLAUDE_MODEL?: string;
      REACT_APP_CLAUDE_TEMPERATURE?: string;
      REACT_APP_CLAUDE_MAX_TOKENS?: string;
    };
  }
} 