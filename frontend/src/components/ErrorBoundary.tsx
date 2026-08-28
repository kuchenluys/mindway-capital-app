import React, { ReactNode } from 'react';
import Button from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught:', error, errorInfo);
    this.setState({
      errorInfo,
    });

    // Log to error reporting service (e.g., Sentry)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-dark-800 border border-red-500/20 rounded-2xl p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h1 className="text-2xl font-bold text-dark-100 mb-2">
                  Algo salió mal
                </h1>
                <p className="text-dark-400 text-sm mb-6">
                  {this.state.error?.message ||
                    'Ocurrió un error inesperado. Intenta recargar la página.'}
                </p>

                {process.env.NODE_ENV === 'development' && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
                    <p className="text-xs text-red-400 font-mono break-words">
                      {this.state.error?.toString()}
                    </p>
                    {this.state.errorInfo?.componentStack && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs text-red-400 font-medium">
                          Stack Trace
                        </summary>
                        <pre className="text-xs text-red-300 mt-2 overflow-auto max-h-32">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={this.handleReset}
                    fullWidth
                  >
                    Intentar de Nuevo
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => (window.location.href = '/')}
                  >
                    Inicio
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
