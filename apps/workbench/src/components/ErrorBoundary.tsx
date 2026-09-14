import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  /** Changing this key resets the boundary (e.g. when the schema changes). */
  resetKey: string;
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Keeps schema-editing mistakes (schemas RJSF cannot render) from crashing
 * the whole workbench.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="usa-alert usa-alert--error" role="alert">
          <div className="usa-alert__body">
            <h3 className="usa-alert__heading">The form could not be rendered</h3>
            <p className="usa-alert__text">{this.state.error.message}</p>
            <p className="usa-alert__text">Adjust the schema (or reset the example) to continue.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
