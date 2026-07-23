import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

type Props = { children: ReactNode };
type State = { error: Error | null };

/** Evita pantalla en blanco si el wizard piloto falla en runtime. */
export class InstitutionPilotErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[InstitutionPilot]', error, info.componentStack);
  }

  private reset = () => {
    try {
      localStorage.removeItem('agigov-pilot-session-v1');
      localStorage.setItem('agigov-pilot-session-v1', JSON.stringify({
        slug: null,
        ingestToken: null,
        firstEscrowRef: null,
        ministryCode: null,
        modelId: null,
        ingestAccepted: 0,
        reconcileOk: null,
        reconcileStatus: null,
        calculoAhorroFinal: null,
        discrepancies: [],
        published: false,
        maxStepReached: 0,
      }));
    } catch {
      /* ignore */
    }
    this.setState({ error: null });
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="agigov-card border-red-500/30 bg-red-500/5 p-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-6 w-6 shrink-0 text-red-400" aria-hidden />
            <div>
              <h2 className="font-display text-lg font-semibold text-agigov-text">
                No se pudo cargar el piloto institucional
              </h2>
              <p className="mt-2 text-sm text-agigov-text-muted">
                {this.state.error.message}
              </p>
              <button type="button" className="ds-btn-app mt-4" onClick={this.reset}>
                <RefreshCw className="h-4 w-4" />
                Reiniciar sesión piloto
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
