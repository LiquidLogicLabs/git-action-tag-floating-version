import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

const root = path.resolve(__dirname, '..', '..');

interface ActionManifest {
  inputs: Record<string, { description: string; required?: boolean; default?: string }>;
}

const manifest = yaml.load(fs.readFileSync(path.join(root, 'action.yml'), 'utf8')) as ActionManifest;
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');

describe('action.yml manifest', () => {
  it('defaults update-minor to true', () => {
    // The runner, not @actions/core, applies this default, so no test of getBooleanInput
    // can observe it. Pin the manifest value instead. Leaving it false is what left every
    // consuming repo's vX.Y tag frozen at an old release.
    expect(manifest.inputs['update-minor'].default).toBe('true');
  });

  it('documents every input default exactly as the README input table does', () => {
    // The README table and the manifest drifted before: the table said false while the
    // examples all passed true. Compare them rather than trusting either alone.
    const rows = new Map<string, string>();
    for (const line of readme.split('\n')) {
      const m = line.match(/^\|\s*`([a-z-]+)`\s*\|.*\|\s*(?:`([^`]*)`|-)\s*\|\s*$/);
      if (m) rows.set(m[1], m[2] ?? '-');
    }
    expect(rows.size).toBeGreaterThan(0);

    for (const [name, spec] of Object.entries(manifest.inputs)) {
      if (!rows.has(name)) continue;
      if (spec.default !== undefined) {
        expect(`${name}=${rows.get(name)}`).toBe(`${name}=${spec.default}`);
      }
    }
  });

  it('has no README example pinning a version older than the current major', () => {
    // Examples pinned @v1 for two majors. v1 has no update-minor input at all, so every
    // example that passed update-minor could not have worked as written.
    const pins = [...readme.matchAll(/git-action-tag-floating-version@v(\d+)/g)].map((m) => Number(m[1]));
    expect(pins.length).toBeGreaterThan(0);
    const major = Number(JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version.split('.')[0]);
    for (const p of pins) {
      expect(p).toBeGreaterThanOrEqual(major);
    }
  });
});
