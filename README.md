# Git Floating Version Tags Action

[![CI](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/actions/workflows/ci.yml/badge.svg)](https://github.com/LiquidLogicLabs/git-action-tag-floating-version/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

A GitHub Action that creates or updates floating version tag aliases (major and minor) pointing to a reference commit, extracting version information from a tag. This action supports tags with or without the 'v' prefix and includes comprehensive logging capabilities.

## Features

- ✅ **Simplified input design**: `tag` (required) for version extraction, optional `ref-tag` (defaults to `tag`) for commit reference
- ✅ **Auto v-prefix handling**: Automatically handles tags with or without 'v' prefix (v1.2.3 or 1.2.3)
- ✅ **Floating tag support**: Creates/updates major (`v2`) and optional minor (`v2.3`) version tags
- ✅ **Version parsing**: Extracts semantic version from tag with configurable prefix for output tags
- ✅ **Prerelease handling**: Optional filtering of prerelease versions
- ✅ **Comprehensive logging**: Basic info logging always enabled, verbose debug logging via input flag
- ✅ **Git CLI integration**: Uses native git commands for reliable tag operations

## Usage

### Basic Example

```yaml
- name: Update Floating Tags
  uses: LiquidLogicLabs/git-action-tag-floating-version@v1
  with:
    tag: 'v2.3.4'
    update-minor: true
```

This will:

- Extract version `2.3.4` from tag `v2.3.4`
- Create/update tag `v2` pointing to the same commit as `v2.3.4`
- Create/update tag `v2.3` pointing to the same commit as `v2.3.4`

### Tag Without 'v' Prefix

```yaml
- name: Update Floating Tags
  uses: LiquidLogicLabs/git-action-tag-floating-version@v1
  with:
    tag: '2.3.4'  # Works with or without 'v'
    update-minor: true
```

### Different Reference Tag

Use a different commit/branch for floating tags than the version tag:

```yaml
- name: Update Floating Tags
  uses: LiquidLogicLabs/git-action-tag-floating-version@v1
  with:
    tag: 'v2.3.4'  # Extract version from this
    ref-tag: 'main'  # Point floating tags to this commit
    update-minor: true
```

### With Verbose Debug Logging

```yaml
- name: Update Floating Tags
  uses: LiquidLogicLabs/git-action-tag-floating-version@v1
  with:
    tag: 'v2.3.4'
    update-minor: true
    verbose: true  # Enables detailed debug logging
```

### In a Release Workflow

```yaml
name: Release

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Update Floating Tags
        uses: LiquidLogicLabs/git-action-tag-floating-version@v1
        with:
          tag: ${{ github.ref_name }}
          update-minor: true
          verbose: true

      - name: Create Release
        uses: LiquidLogicLabs/git-action-release@v1
        with:
          tag: ${{ github.ref_name }}
          token: ${{ secrets.GITHUB_TOKEN }}
```

## Inputs

| Input | Description | Required | Default |
| ------- | ------------- | ---------- | --------- |
| `tag` | The tag from which to extract version information (used to determine major/minor versions). Supports tags with or without 'v' prefix (e.g., 'v1.2.3' or '1.2.3'). **Note**: This is parsed for version info only - not used to find the commit when `ref-tag` is provided. | Yes | - |
| `ref-tag` | The tag/commit that floating tags should point to (can be tag name, refs/tags/v1.2.3, or SHA). If not provided, uses the value from `tag`. **Note**: This is used ONLY to resolve the commit SHA via `git rev-parse` - it is never parsed for version information. | No | Value of `tag` |
| `prefix` | Version prefix for tag names when creating floating tags | No | `v` |
| `update-minor` | Whether to update minor version tags (v1.2) | No | `false` |
| `ignore-prerelease` | Whether to skip prerelease versions | No | `true` |
| `verbose` | Enable verbose debug logging. Sets ACTIONS_STEP_DEBUG=true environment variable and enables detailed debug output | No | `false` |

## Outputs

| Output | Description |
| -------- | ------------- |
| `major-tag` | The major version tag that was created/updated (e.g., 'v2') |
| `minor-tag` | The minor version tag that was created/updated (e.g., 'v2.3'), if update-minor is true |

## Permissions

When the action creates or updates tags, the job must have `contents: write`. For read-only use (e.g. only reading version from an existing tag), `contents: read` is sufficient.

## Examples

### Create Major Tag Only

```yaml
- uses: LiquidLogicLabs/git-action-tag-floating-version@v1
  with:
    tag: 'v1.2.3'
    # update-minor defaults to false, so only v1 will be created/updated
```

### Create Major and Minor Tags

```yaml
- uses: LiquidLogicLabs/git-action-tag-floating-version@v1
  with:
    tag: 'v1.2.3'
    update-minor: true
    # Creates/updates both v1 and v1.2
```

### Custom Prefix

```yaml
- uses: LiquidLogicLabs/git-action-tag-floating-version@v1
  with:
    tag: 'release-1.2.3'
    prefix: 'release-'
    update-minor: true
    # Creates/updates release-1 and release-1.2
```

### Handle Prerelease Versions

By default, prerelease versions are ignored:

```yaml
- uses: LiquidLogicLabs/git-action-tag-floating-version@v1
  with:
    tag: 'v2.0.0-beta.1'
    # Will fail because ignore-prerelease defaults to true
```

To allow prerelease versions:

```yaml
- uses: LiquidLogicLabs/git-action-tag-floating-version@v1
  with:
    tag: 'v2.0.0-beta.1'
    ignore-prerelease: false
    update-minor: true
    # Creates/updates v2 and v2.0 even for prerelease
```

**Important**: When `ref-tag` is provided separately, prerelease tags are automatically allowed for version extraction, even when `ignore-prerelease=true`. This is because `ref-tag` is used only to find the commit, while `tag` is used only for version extraction:

```yaml
- uses: LiquidLogicLabs/git-action-tag-floating-version@v1
  with:
    tag: '3.23.0-d34fa4d2.ls4'  # Prerelease tag for version extraction
    ref-tag: '3.23-d34fa4d2-ls4'  # Different tag/commit for floating tags to point to
    update-minor: true
    ignore-prerelease: true  # Still works! ref-tag is separate, so prerelease tag is allowed
    # Creates/updates v3 and v3.23 pointing to ref-tag commit
```

### Point Floating Tags to a Different Commit

```yaml
- uses: LiquidLogicLabs/git-action-tag-floating-version@v1
  with:
    tag: 'v1.2.3'  # Extract version from this tag
    ref-tag: 'HEAD'  # But point floating tags to HEAD
    update-minor: true
    # v1 and v1.2 will point to HEAD, not v1.2.3
```

## How It Works

1. **Version Extraction**: The action parses the `tag` input to extract semantic version components (major, minor, patch). **Note**: `ref-tag` is never parsed for version information - it is only used to find the commit.
2. **Commit Resolution**: Resolves the commit SHA from `ref-tag` (or `tag` if `ref-tag` is not provided) using `git rev-parse`. This is the commit that floating tags will point to.
3. **Prerelease Handling**: If `ref-tag` is provided separately (different from `tag`), prerelease tags are allowed for version extraction even when `ignore-prerelease=true`, since `ref-tag` is used only to find the commit, not for version parsing.
4. **Tag Creation/Update**: Creates or updates floating tags:
   - Major tag: `{prefix}{major}` (e.g., `v2`)
   - Minor tag: `{prefix}{major}.{minor}` (e.g., `v2.3`) if `update-minor` is true
5. **Tag Push**: Pushes the created/updated tags to the remote repository

## Version Format Support

The action supports standard semantic versioning formats:

- `v1.2.3` (with v prefix)
- `1.2.3` (without v prefix)
- `v2.0.0-beta.1` (prerelease with v prefix)
- `2.0.0-beta.1` (prerelease without v prefix)
- `v1.2.3+build.123` (with build metadata)

The `prefix` input only affects the output floating tag names, not the parsing of the input tag.

## Logging

### Basic Logging (Always Enabled)

The action provides informative logging at each step:

- Version extraction
- Commit SHA resolution
- Tag creation/update operations
- Tag push operations

### Verbose Debug Logging

Enable verbose logging by setting `verbose: true`:

```yaml
- uses: LiquidLogicLabs/git-action-tag-floating-version@v1
  with:
    tag: 'v1.2.3'
    verbose: true
```

This enables:

- Detailed debug output via `core.debug()`
- Sets `ACTIONS_STEP_DEBUG=true` for GitHub Actions debug logging
- Shows parsed version components, git command outputs, and intermediate steps

## Security

- The action requires `contents: write` permission to push tags
- Tags are force-updated if they already exist (using `git push --force`)
- The action validates all inputs before execution
- Git commands are executed with proper error handling

## License

This project is licensed under the MIT License.

## Credits

This action is inspired by [zyactions/update-semver](https://github.com/zyactions/update-semver), extending its functionality with:

- Simplified input design
- Auto v-prefix handling
- Comprehensive logging
- Node.js/TypeScript implementation
- Git CLI integration tests

## Documentation

For developers and contributors:

- **[Development Guide](docs/DEVELOPMENT.md)** - Setup, development workflow, and contributing guidelines
- **[Testing Guide](docs/TESTING.md)** - Complete testing documentation, including all test scenarios

## Contributing

Contributions are welcome! Please see the [Development Guide](docs/DEVELOPMENT.md) for information on how to contribute.
