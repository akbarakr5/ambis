// Suppress non-critical React Native Web warnings
if (typeof window !== 'undefined') {
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  console.error = function (...args: any[]) {
    // Suppress harmless React Native Web touch tracking warning
    if (
      args[0]?.includes?.('Cannot record touch end without a touch start') ||
      args[0]?.includes?.('ResponderTouchHistoryStore')
    ) {
      return;
    }
    originalConsoleError.apply(console, args);
  };

  console.warn = function (...args: any[]) {
    // Suppress non-critical warnings
    if (
      args[0]?.includes?.('ViewPropTypes will be removed') ||
      args[0]?.includes?.('Non-serializable values')
    ) {
      return;
    }
    originalConsoleWarn.apply(console, args);
  };
}
