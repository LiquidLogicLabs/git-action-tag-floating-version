import { TagOperationResult } from "./types";
import { Logger } from "./logger";
/**
 * Gets the commit SHA for a given reference (tag, branch, or SHA)
 */
export declare function getCommitSha(ref: string, logger: Logger): Promise<string>;
/**
 * Checks if a tag exists locally
 */
export declare function tagExists(tagName: string, logger: Logger): Promise<boolean>;
/**
 * Creates or updates a git tag
 */
export declare function createOrUpdateTag(tagName: string, commitSha: string, logger: Logger): Promise<TagOperationResult>;
/**
 * Pushes a tag to the remote repository
 */
export declare function pushTag(tagName: string, force: boolean, logger: Logger): Promise<void>;
/**
 * Verifies that a tag points to the expected commit
 */
export declare function verifyTag(tagName: string, expectedSha: string, logger: Logger): Promise<boolean>;
