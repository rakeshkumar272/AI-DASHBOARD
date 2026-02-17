(function () {
    // Global error handler to suppress extension errors
    window.addEventListener('error', function (event) {
        if (
            event.filename?.includes('chrome-extension') ||
            event.message?.includes('MetaMask') ||
            event.message?.includes('ethereum') ||
            (event.error && event.error.stack && event.error.stack.includes('chrome-extension'))
        ) {
            event.stopImmediatePropagation();
            event.preventDefault();
            // console.warn('Suppressed extension error:', event.message);
        }
    }, true); // Capture phase

    window.addEventListener('unhandledrejection', function (event) {
        const reason = event.reason?.message || event.reason?.toString() || '';
        const stack = event.reason?.stack || '';
        if (
            reason.includes('MetaMask') ||
            reason.includes('ethereum') ||
            stack.includes('chrome-extension')
        ) {
            event.stopImmediatePropagation();
            event.preventDefault();
            // console.warn('Suppressed extension rejection:', reason);
        }
    }, true); // Capture phase
})();
