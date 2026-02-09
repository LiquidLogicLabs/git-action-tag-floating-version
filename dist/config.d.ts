import { ActionInputs } from './types';
export type ParsedInputs = ActionInputs & {
    refTagProvided: boolean;
    debugMode: boolean;
};
export declare function getInputs(): ParsedInputs;
