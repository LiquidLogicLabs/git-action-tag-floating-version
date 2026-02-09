import * as core from '@actions/core';
import { ActionInputs } from './types';

function parseBoolean(value: string | undefined): boolean {
  if (!value) return false;
  const lower = value.toLowerCase().trim();
  return lower === 'true' || lower === '1';
}

export type ParsedInputs = ActionInputs & {
  refTagProvided: boolean;
  debugMode: boolean;
};

export function getInputs(): ParsedInputs {
  const tag = core.getInput('tag', { required: true });
  const refTagInput = core.getInput('ref-tag');
  const prefix = core.getInput('prefix') || 'v';
  const updateMinor = core.getBooleanInput('update-minor');
  const ignorePrerelease = core.getBooleanInput('ignore-prerelease');
  const verboseInput = core.getBooleanInput('verbose');
  const debugMode =
    (typeof core.isDebug === 'function' && core.isDebug()) ||
    parseBoolean(process.env.ACTIONS_STEP_DEBUG) ||
    parseBoolean(process.env.ACTIONS_RUNNER_DEBUG) ||
    parseBoolean(process.env.RUNNER_DEBUG);
  const verbose = verboseInput || debugMode;

  return {
    tag,
    refTag: refTagInput || tag,
    prefix,
    updateMinor,
    ignorePrerelease,
    verbose,
    refTagProvided: refTagInput !== '',
    debugMode,
  };
}
