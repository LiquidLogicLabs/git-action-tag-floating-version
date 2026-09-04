## [2.0.6](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/compare/v2.0.5...v2.0.6) (2026-09-04)



## [2.0.5](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/compare/v2.0.4...v2.0.5) (2026-09-04)


### Bug Fixes

* reject tag names git would read as an option or a refspec ([b6b00c9](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/commit/b6b00c96b2c9a146f7ad2bc50cc8f249197309bf))



## [2.0.4](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/compare/v2.0.3...v2.0.4) (2026-09-03)


* feat!: default update-minor to true, and make the docs match the manifest ([011fa87](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/commit/011fa876b12f3eefe9fab3d2acba80af9f7c548b))


### Bug Fixes

* **lint:** quote eslint glob so all of src/ is linted ([ff2db80](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/commit/ff2db80e473941fb6da16ddebd18e9b17961cbee))


### BREAKING CHANGES

* update-minor now defaults to true, so the minor floating tag
(vX.Y) is created and updated unless a caller opts out with update-minor: false.

The old default was the cause of a defect in every consuming repository: all
sixteen wanted minor tags, none set the input, so vX.Y stayed frozen at an old
release — six releases back in one case, and two repos had no vX.Y at all —
while each release summary asserted the tag had just been created. The README
had it right all along: its input table said the default was false, but every
one of its examples passed update-minor: true.

The docs were wrong in a way that could not work, too: all thirteen README
examples pinned @v1, and v1's action.yml has no update-minor input at all, so
every example passing that input was broken as written. Repinned to @v3.

Adds a manifest test rather than trusting prose, since the runner (not
@actions/core) applies action.yml defaults and no unit test could observe them:
it pins the update-minor default, asserts the README input table agrees with
action.yml for every documented default, and rejects an example pinned below the
current major. Each guard was checked by planting its violation and confirming
it fails.

js-yaml was already present transitively and is now declared, rather than
parsing the manifest by hand.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019MZbNnkmphxiskyz6g2eyi



## [2.0.3](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/compare/v2.0.2...v2.0.3) (2026-07-05)



## [2.0.2](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/compare/v2.0.1...v2.0.2) (2026-04-21)



## [2.0.1](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/compare/v2.0.0...v2.0.1) (2026-02-17)



# [2.0.0](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/compare/v1.1.0...v2.0.0) (2026-02-09)



# [1.1.0](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/compare/v1.0.11...v1.1.0) (2026-02-07)


### Bug Fixes

* parse inputs for floating tag updates ([ecfcfaa](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/commit/ecfcfaac33089f45079e895a53fcace20b4263bf))



## [1.0.11](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/compare/v1.0.10...v1.0.11) (2026-01-30)



## [1.0.10](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/compare/v1.0.9...v1.0.10) (2026-01-30)



## [1.0.9](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/compare/v1.0.8...v1.0.9) (2026-01-30)



## [1.0.8](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/compare/v1.0.7...v1.0.8) (2026-01-30)



## [1.0.7](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/compare/v1.0.6...v1.0.7) (2026-01-30)


### Bug Fixes

* **ci:** add event_name to concurrency group for workflow_call from release ([8876f6d](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/commit/8876f6db128ac7cb57807c3d8ae6aa4aec238a3c))
* **e2e:** add contents: write so action can push floating tags ([ef3ee8e](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/commit/ef3ee8e213d064d9f8fbb34e32d599a5efd79b31))
* **release:** verify only runtime bundle (index.js), allow .d.ts.map drift ([e95e46f](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/commit/e95e46f7c47f585ecadbd6d4b0c349dc40c4e94a))



## [1.0.6](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/compare/v1.0.5...v1.0.6) (2026-01-27)



## [1.0.5](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/compare/v1.0.4...v1.0.5) (2026-01-27)



## [1.0.4](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/compare/v1.0.3...v1.0.4) (2026-01-08)


### Bug Fixes

* update version tests to use Logger instance ([e8b4256](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/commit/e8b4256964e468a578bc2db9bdeb98634079f0e2))



## [1.0.3](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/compare/v1.0.0...v1.0.3) (2026-01-08)


### Bug Fixes

* allow prerelease tags for version extraction when refTag is provided separately ([f1f6c5a](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/commit/f1f6c5a9a84f13d5e5da4fded65e636c4cd1a22c))



# [1.0.0](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/compare/v1.0.1...v1.0.0) (2026-01-07)



## 1.0.1 (2026-01-07)



