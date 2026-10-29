import React from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('HeatShield ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fafafc] dark:bg-[#101114] flex flex-col items-center justify-center p-6 text-[#1d1d1f] dark:text-[#f5f5f7]">
          <div className="bg-white dark:bg-[#191b20] max-w-lg w-full p-6 sm:p-8 rounded-[28px] border border-[#dc2626]/30 shadow-2xl flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#dc2626]/10 dark:bg-[#dc2626]/20 border border-[#dc2626]/30 flex items-center justify-center text-[#dc2626] dark:text-[#ef4444]">
              <AlertOctagon size={28} />
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="font-semibold text-xl text-[#1d1d1f] dark:text-[#f5f5f7]">
                Telemetry Module Interrupted
              </h2>
              <p className="text-xs text-[#6e6e73] dark:text-[#a5a9b4] leading-relaxed">
                An unexpected component error occurred while rendering this view.
              </p>
            </div>

            {this.state.error && (
              <div className="w-full bg-[#f5f5f7] dark:bg-[#22252b] p-3 rounded-xl border border-black/[0.08] dark:border-white/[0.08] text-left font-mono text-xs text-[#dc2626] dark:text-[#ef4444] overflow-x-auto max-h-36">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2 w-full sm:w-auto">
              <button
                onClick={this.handleReload}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#0071e3] dark:bg-[#2997ff] text-white text-xs font-semibold hover:bg-[#0076df] dark:hover:bg-[#58a6ff] transition-colors shadow-sm"
              >
                <RotateCcw size={14} />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#f5f5f7] dark:bg-[#22252b] hover:bg-[#e8e8ed] dark:hover:bg-[#2e323b] text-[#1d1d1f] dark:text-[#f5f5f7] text-xs font-semibold border border-black/[0.08] dark:border-white/[0.1] transition-colors"
              >
                <Home size={14} />
                <span>Go to Overview</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
