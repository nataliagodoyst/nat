const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

describe('version-bump script', () => {
  test('updates manifest.json and versions.json', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'version-bump-test-'));
    // copy manifest.json and versions.json to temp dir
    fs.copyFileSync(path.join(__dirname, '..', 'manifest.json'), path.join(tmp, 'manifest.json'));
    fs.copyFileSync(path.join(__dirname, '..', 'versions.json'), path.join(tmp, 'versions.json'));

    const newVersion = '1.0.1';
    const result = spawnSync('node', [path.join(__dirname, '..', 'version-bump.mjs')], {
      cwd: tmp,
      env: { ...process.env, npm_package_version: newVersion },
      encoding: 'utf8'
    });

    if (result.error) {
      throw result.error;
    }
    expect(result.status).toBe(0);

    const manifest = JSON.parse(fs.readFileSync(path.join(tmp, 'manifest.json'), 'utf8'));
    expect(manifest.version).toBe(newVersion);

    const versions = JSON.parse(fs.readFileSync(path.join(tmp, 'versions.json'), 'utf8'));
    expect(versions[newVersion]).toBe(manifest.minAppVersion);
  });
});
