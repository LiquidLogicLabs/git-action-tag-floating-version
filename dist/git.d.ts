import { TagOperationResult } from "./types";
import { Logger } from "./logger";
/**
 * Gets the commit SHA for a given reference (tag, branch, or SHA)
 */
/**
 * Reject a value git would read as an option rather than as data.
 *
 * An argv array stops the SHELL interpreting a value; it does nothing about git's own
 * option parser, which reads a leading "-" as an option wherever it appears. Some of those
 * options execute commands. Verified against real git:
 *
 *   git push origin --delete '--receive-pack=touch /tmp/PWNED' v9  ->  the file is created
 *
 * (The trailing real ref is required; without it git aborts before connecting.)
 */
export declare function assertNotOptionLike(value: string, label: string): void;
/**
 * Reject a tag name git would read as a REFSPEC rather than as a ref.
 *
 * Not covered by the option check. "+" is the force prefix and ":" separates source from
 * destination, so `git push origin '+main'` force-updates the remote BRANCH — verified
 * against a real remote. `git check-ref-format` accepts refs/tags/+main and `git tag`
 * creates it, so the value otherwise passes every check.
 *
 * Reachable here through the `prefix` input, which becomes part of the tag name.
 */
export declare function assertNotRefspecLike(value: string, label: string): void;
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
