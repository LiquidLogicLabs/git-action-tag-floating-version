import { exec } from "@actions/exec";
import { pushTag, createOrUpdateTag, getCommitSha } from "../git";
import { Logger } from "../logger";

jest.mock("@actions/exec");

const logger = new Logger(false, false);

/**
 * This action force-pushes the floating tags every other repository's release consumes, so
 * its argv is worth guarding twice over.
 *
 * Two attacks, both verified against real git:
 *
 *   git push origin --delete '--receive-pack=touch /tmp/PWNED' v9  -> the file is created
 *   git push origin '+main'                                        -> remote BRANCH force-updated
 *
 * The first is option injection — an argv array stops the shell, not git's option parser.
 * The second is refspec injection: "+" is the force prefix, and a leading-"-" guard does not
 * catch it. `prefix` is an action input and becomes part of the tag name, so both are
 * reachable without touching the `tag` input at all.
 */
describe("argument injection", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(exec as jest.Mock).mockResolvedValue(0);
	});

	const optionLike = ["--receive-pack=touch /tmp/pwned", "--upload-pack=id", "-v2"];
	const refspecLike = ["+v2", "v2:refs/heads/main"];

	describe.each([...optionLike, ...refspecLike])("value %s", (payload) => {
		it("is refused as a tag name when pushing", async () => {
			await expect(pushTag(payload, true, logger)).rejects.toThrow();
			expect(exec).not.toHaveBeenCalled();
		});

		it("is refused as a tag name when creating or updating", async () => {
			await expect(createOrUpdateTag(payload, "abc123", logger)).rejects.toThrow();
			expect(exec).not.toHaveBeenCalled();
		});
	});

	describe.each(optionLike)("value %s", (payload) => {
		it("is refused as a ref when resolving a commit", async () => {
			await expect(getCommitSha(payload, logger)).rejects.toThrow();
			expect(exec).not.toHaveBeenCalled();
		});
	});

	it("pushes a fully-qualified refspec so the tag name cannot be read as one", async () => {
		await pushTag("v2", false, logger);
		expect(exec).toHaveBeenCalledWith(
			"git",
			["push", "origin", "refs/tags/v2:refs/tags/v2"],
			expect.anything()
		);
	});

	it("still force-pushes when asked", async () => {
		await pushTag("v2", true, logger);
		expect(exec).toHaveBeenCalledWith(
			"git",
			["push", "origin", "refs/tags/v2:refs/tags/v2", "--force"],
			expect.anything()
		);
	});
});
