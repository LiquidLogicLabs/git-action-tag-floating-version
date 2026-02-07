import * as core from '@actions/core';
import { ActionInputs } from './types';

export type ParsedInputs = ActionInputs & {
  refTagProvided: boolean;
};

export function getInputs(): ParsedInputs {
  const tag = core.getInput('tag', { required: true });
  const refTagInput = core.getInput('refTag');
  const prefix = core.getInput('prefix') || 'v';
  const updateMinor = core.getBooleanInput('updateMinor');
  const ignorePrerelease = core.getBooleanInput('ignorePrerelease');
  const verboseInput = core.getBooleanInput('verbose');
  const envStepDebug = (process.env.ACTIONS_STEP_DEBUG || '').toLowerCase();
  const stepDebugEnabled = core.isDebug() || envStepDebug === 'true' || envStepDebug === '1';
  const verbose = verboseInput || stepDebugEnabled;

  return {
    tag,
    refTag: refTagInput || tag,
    prefix,
    updateMinor,
    ignorePrerelease,
    verbose,
    refTagProvided: refTagInput !== '',
  };
}
