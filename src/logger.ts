import * as core from '@actions/core';

/**
 * Logger utility with verbose/debug support
 * Provides consistent logging across the action
 *
 * - verboseInfo(): operational info (input values, tag parsing, calculated tags) —
 *   shown when verbose is true (either via input or debug mode).
 * - debug(): data dumps, HTTP details, low-level diagnostics —
 *   prefixed with [DEBUG] when debugMode is true, otherwise routed to core.debug().
 */
export class Logger {
	public readonly verbose: boolean;
	public readonly debugMode: boolean;

	constructor(verbose: boolean = false, debugMode: boolean = false) {
		this.verbose = verbose || debugMode;
		this.debugMode = debugMode;
	}

	/**
	 * Log an info message
	 */
	info(message: string): void {
		core.info(message);
	}

	/**
	 * Log a warning message
	 */
	warning(message: string): void {
		core.warning(message);
	}

	/**
	 * Log an error message
	 */
	error(message: string): void {
		core.error(message);
	}

	/**
	 * Log verbose operational info - only shown when verbose is true
	 */
	verboseInfo(message: string): void {
		if (this.verbose) {
			core.info(message);
		}
	}

	/**
	 * Log a debug message - uses core.info() with [DEBUG] prefix when debugMode is true
	 * Falls back to core.debug() otherwise (for when ACTIONS_STEP_DEBUG is set at workflow level)
	 */
	debug(message: string): void {
		if (this.debugMode) {
			core.info(`[DEBUG] ${message}`);
		} else {
			core.debug(message);
		}
	}

	isVerbose(): boolean {
		return this.verbose;
	}

	isDebug(): boolean {
		return this.debugMode;
	}
}
