import { ActionInputs } from './types';
export type ParsedInputs = ActionInputs & {
    refTagProvided: boolean;
};
export declare function getInputs(): ParsedInputs;
