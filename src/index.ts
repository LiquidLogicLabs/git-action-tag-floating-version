import * as core from "@actions/core";
import { getInputs } from "./config";
import { parseVersion, createTagName } from "./version";
import { getCommitSha, createOrUpdateTag, pushTag, verifyTag } from "./git";
import { Logger } from "./logger";

/**
 * Main action entry point
 */
export async function run(): Promise<void> {
	try {
		const inputs = getInputs();

		// Create logger instance
		const logger = new Logger(inputs.verbose);
		const { tag, refTag, prefix, updateMinor, ignorePrerelease } = inputs;

		if (inputs.verbose) {
			logger.info("🔍 Verbose logging enabled");
		}
		logger.debug("Action inputs:");
		logger.debug(`  tag: ${inputs.tag}`);
		logger.debug(`  refTag: ${inputs.refTag}`);
		logger.debug(`  prefix: ${inputs.prefix}`);
		logger.debug(`  updateMinor: ${inputs.updateMinor}`);
		logger.debug(`  ignorePrerelease: ${inputs.ignorePrerelease}`);
		logger.debug(`  verbose: ${inputs.verbose}`);

		// Determine if we're using a separate refTag for commit resolution
		// IMPORTANT: refTag is ONLY used to find the commit SHA - it is NEVER parsed for version information
		const usingSeparateRefTag = inputs.refTagProvided && inputs.refTag !== inputs.tag;

		if (usingSeparateRefTag) {
			core.info(`Using refTag "${refTag}" to find commit SHA (different from version tag "${tag}")`);
			logger.debug(`refTag will be used ONLY to resolve commit SHA (not parsed for version)`);
		}

		// Extract version information from tag ONLY
		// NOTE: We parse tag for version info, NOT refTag. refTag is only used to find the commit.
		core.info(`Extracting version from tag: ${tag}`);
		const versionInfo = parseVersion(tag, logger);

		// Check for prerelease
		// Only apply prerelease check if we're using the same tag for both version extraction and commit reference
		// If refTag is provided separately, we allow prerelease tags for version extraction
		if (versionInfo.isPrerelease && ignorePrerelease && !usingSeparateRefTag) {
			core.warning(`Tag ${tag} is a prerelease version (${versionInfo.prerelease}). Skipping due to ignorePrerelease=true`);
			core.setFailed(`Prerelease versions are ignored. Tag "${tag}" contains prerelease identifier "${versionInfo.prerelease}"`);
			return;
		}

		if (versionInfo.isPrerelease) {
			if (usingSeparateRefTag) {
				if (logger.verbose) {
					logger.info(`ℹ️  Prerelease version detected in tag "${tag}" but proceeding (using separate refTag "${refTag}" for commit reference): ${versionInfo.prerelease}`);
				}
				logger.debug(`Prerelease version detected in tag "${tag}" but proceeding (using separate refTag "${refTag}" for commit reference): ${versionInfo.prerelease}`);
			} else {
				logger.debug(`Prerelease version detected but proceeding (ignorePrerelease=false): ${versionInfo.prerelease}`);
			}
		}

		// Get commit SHA for reference tag
		// IMPORTANT: refTag is used ONLY to resolve the commit SHA (via git rev-parse)
		// We do NOT parse refTag for version information - only tag is parsed for that
		const commitSha = await getCommitSha(inputs.refTag, logger);

		// Show initial summary of what will be done
		const majorTagName = createTagName(prefix, versionInfo.major);
		core.info(`📋 Plan: Will create/update floating tags pointing to commit ${commitSha.substring(0, 7)}`);
		core.info(`   - Major tag: ${majorTagName}`);
		if (updateMinor) {
			const plannedMinorTagName = createTagName(prefix, versionInfo.major, versionInfo.minor);
			core.info(`   - Minor tag: ${plannedMinorTagName}`);
		}

		// Create/update major version tag
		core.info(`Creating/updating major tag: ${majorTagName}`);

		const majorTagResult = await createOrUpdateTag(majorTagName, commitSha, logger);

		// Push major tag
		await pushTag(majorTagName, majorTagResult.updated, logger);

		// Verify major tag (only in verbose mode to avoid unnecessary git calls)
		if (logger.verbose) {
			const verified = await verifyTag(majorTagName, commitSha, logger);
			if (!verified) {
				core.warning(`Tag ${majorTagName} verification failed`);
			}
		}

		// Set major tag output
		core.setOutput("majorTag", majorTagName);

		// Track results for final summary
		const results: Array<{ tag: string; created: boolean; updated: boolean }> = [{ tag: majorTagName, created: majorTagResult.created, updated: majorTagResult.updated }];

		// Create/update minor version tag if requested
		if (updateMinor) {
			const minorTagName = createTagName(prefix, versionInfo.major, versionInfo.minor);
			core.info(`Creating/updating minor tag: ${minorTagName}`);

			const minorTagResult = await createOrUpdateTag(minorTagName, commitSha, logger);

			// Push minor tag
			await pushTag(minorTagName, minorTagResult.updated, logger);

			// Verify minor tag (only in verbose mode to avoid unnecessary git calls)
			if (logger.verbose) {
				const verified = await verifyTag(minorTagName, commitSha, logger);
				if (!verified) {
					core.warning(`Tag ${minorTagName} verification failed`);
				}
			}

			// Set minor tag output
			core.setOutput("minorTag", minorTagName);
			results.push({ tag: minorTagName, created: minorTagResult.created, updated: minorTagResult.updated });
		}

		// Final summary
		core.info("✅ Successfully completed floating version tag operations");
		core.info(`📊 Summary (all tags point to commit ${commitSha.substring(0, 7)}):`);
		for (const result of results) {
			if (result.created) {
				core.info(`   ✓ Created: ${result.tag}`);
			} else if (result.updated) {
				core.info(`   ↻ Updated: ${result.tag}`);
			}
		}
		logger.debug("Action completed successfully");
	} catch (error) {
		if (error instanceof Error) {
			core.error(error.message);
			core.setFailed(error.message);
		} else {
			const message = "Unknown error occurred";
			core.error(message);
			core.setFailed(message);
		}
	}
}

// Run the action (only when executed directly, not when imported for testing)
if (require.main === module) {
	run();
}
