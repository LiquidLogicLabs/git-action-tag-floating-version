/**
 * Logger utility with verbose/debug support
 * Provides consistent logging across the action
 *
 * - verboseInfo(): operational info (input values, tag parsing, calculated tags) —
 *   shown when verbose is true (either via input or debug mode).
 * - debug(): data dumps, HTTP details, low-level diagnostics —
 *   prefixed with [DEBUG] when debugMode is true, otherwise routed to core.debug().
 */
export declare class Logger {
    readonly verbose: boolean;
    readonly debugMode: boolean;
    constructor(verbose?: boolean, debugMode?: boolean);
    /**
     * Log an info message
     */
    info(message: string): void;
    /**
     * Log a warning message
     */
    warning(message: string): void;
    /**
     * Log an error message
     */
    error(message: string): void;
    /**
     * Log verbose operational info - only shown when verbose is true
     */
    verboseInfo(message: string): void;
    /**
     * Log a debug message - uses core.info() with [DEBUG] prefix when debugMode is true
     * Falls back to core.debug() otherwise (for when ACTIONS_STEP_DEBUG is set at workflow level)
     */
    debug(message: string): void;
    isVerbose(): boolean;
    isDebug(): boolean;
}
