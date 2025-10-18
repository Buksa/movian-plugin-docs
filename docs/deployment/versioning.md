# Plugin Versioning and Update Management

This guide covers best practices for versioning Movian plugins, managing updates, and ensuring smooth migration paths for users.

## Semantic Versioning

### Overview

Movian plugins should follow [Semantic Versioning (SemVer)](https://semver.org/) principles to provide clear communication about the nature of changes between versions.

**Version Format**: `MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]`

- **MAJOR**: Incompatible API changes or breaking changes
- **MINOR**: New functionality in a backwards-compatible manner
- **PATCH**: Backwards-compatible bug fixes
- **PRERELEASE**: Optional pre-release identifier (alpha, beta, rc)
- **BUILD**: Optional build metadata

### Version Examples

```json
{
  "version": "1.0.0",        // Initial stable release
  "version": "1.1.0",        // New features added
  "version": "1.1.1",        // Bug fixes
  "version": "2.0.0",        // Breaking changes
  "version": "1.2.0-alpha.1", // Pre-release version
  "version": "1.2.0+20231201" // Build metadata
}
```

### Version Increment Guidelines

#### MAJOR Version (X.y.z)

Increment when making incompatible changes:

- Removing or renaming public APIs
- Changing function signatures
- Removing configuration options
- Changing data formats
- Requiring newer Movian API versions

```javascript
// Version 1.x.x
function searchContent(query) {
  return api.search(query);
}

// Version 2.0.0 - Breaking change
function searchContent(query, options = {}) {
  return api.search(query, options);
}
```

#### MINOR Version (x.Y.z)

Increment when adding functionality in a backwards-compatible manner:

- Adding new features
- Adding new configuration options
- Deprecating functionality (without removing)
- Adding new APIs

```javascript
// Version 1.1.0 - New feature added
function searchContent(query) {
  return api.search(query);
}

// New function added in 1.1.0
function getRecommendations(userId) {
  return api.getRecommendations(userId);
}
```

#### PATCH Version (x.y.Z)

Increment when making backwards-compatible bug fixes:

- Fixing bugs
- Performance improvements
- Security fixes
- Documentation updates

```javascript
// Version 1.1.1 - Bug fix
function searchContent(query) {
  // Fixed: Handle empty query strings
  if (!query || query.trim() === '') {
    return Promise.resolve([]);
  }
  return api.search(query);
}
```

## Version Management Tools

### Semantic Version Validator

```javascript
/**
 * Semantic Version Validator and Utilities
 */
class SemanticVersionManager {
  constructor() {
    this.versionRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
  }

  /**
   * Validate semantic version format
   */
  isValidVersion(version) {
    return this.versionRegex.test(version);
  }

  /**
   * Parse version string into components
   */
  parseVersion(version) {
    const match = version.match(this.versionRegex);
    
    if (!match) {
      throw new Error(`Invalid version format: ${version}`);
    }

    return {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2], 10),
      patch: parseInt(match[3], 10),
      prerelease: match[4] || null,
      build: match[5] || null,
      raw: version
    };
  }

  /**
   * Compare two versions
   * Returns: -1 (v1 < v2), 0 (v1 === v2), 1 (v1 > v2)
   */
  compareVersions(version1, version2) {
    const v1 = this.parseVersion(version1);
    const v2 = this.parseVersion(version2);

    // Compare major.minor.patch
    if (v1.major !== v2.major) {
      return v1.major > v2.major ? 1 : -1;
    }
    
    if (v1.minor !== v2.minor) {
      return v1.minor > v2.minor ? 1 : -1;
    }
    
    if (v1.patch !== v2.patch) {
      return v1.patch > v2.patch ? 1 : -1;
    }

    // Handle prerelease versions
    if (v1.prerelease && !v2.prerelease) return -1;
    if (!v1.prerelease && v2.prerelease) return 1;
    if (v1.prerelease && v2.prerelease) {
      return this.comparePrereleases(v1.prerelease, v2.prerelease);
    }

    return 0;
  }

  /**
   * Compare prerelease versions
   */
  comparePrereleases(pre1, pre2) {
    const parts1 = pre1.split('.');
    const parts2 = pre2.split('.');
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i];
      const part2 = parts2[i];
      
      if (part1 === undefined) return -1;
      if (part2 === undefined) return 1;
      
      const num1 = parseInt(part1, 10);
      const num2 = parseInt(part2, 10);
      
      if (!isNaN(num1) && !isNaN(num2)) {
        if (num1 !== num2) return num1 > num2 ? 1 : -1;
      } else {
        if (part1 !== part2) return part1 > part2 ? 1 : -1;
      }
    }
    
    return 0;
  }

  /**
   * Increment version
   */
  incrementVersion(version, type, prerelease = null) {
    const parsed = this.parseVersion(version);
    
    switch (type) {
      case 'major':
        return `${parsed.major + 1}.0.0${prerelease ? `-${prerelease}` : ''}`;
        
      case 'minor':
        return `${parsed.major}.${parsed.minor + 1}.0${prerelease ? `-${prerelease}` : ''}`;
        
      case 'patch':
        return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}${prerelease ? `-${prerelease}` : ''}`;
        
      case 'prerelease':
        if (parsed.prerelease) {
          const parts = parsed.prerelease.split('.');
          const lastPart = parts[parts.length - 1];
          const num = parseInt(lastPart, 10);
          
          if (!isNaN(num)) {
            parts[parts.length - 1] = (num + 1).toString();
            return `${parsed.major}.${parsed.minor}.${parsed.patch}-${parts.join('.')}`;
          }
        }
        
        return `${parsed.major}.${parsed.minor}.${parsed.patch}-${prerelease || 'alpha.1'}`;
        
      default:
        throw new Error(`Invalid increment type: ${type}`);
    }
  }

  /**
   * Check if version satisfies range
   */
  satisfiesRange(version, range) {
    // Simple range checking - could be expanded for complex ranges
    if (range.startsWith('^')) {
      // Compatible within same major version
      const targetVersion = range.slice(1);
      const target = this.parseVersion(targetVersion);
      const current = this.parseVersion(version);
      
      return current.major === target.major && 
             this.compareVersions(version, targetVersion) >= 0;
    }
    
    if (range.startsWith('~')) {
      // Compatible within same minor version
      const targetVersion = range.slice(1);
      const target = this.parseVersion(targetVersion);
      const current = this.parseVersion(version);
      
      return current.major === target.major && 
             current.minor === target.minor &&
             this.compareVersions(version, targetVersion) >= 0;
    }
    
    // Exact match
    return version === range;
  }
}
```

### Version Automation Tools

```javascript
/**
 * Automated Version Management
 */
class VersionAutomation {
  constructor(pluginPath) {
    this.pluginPath = pluginPath;
    this.versionManager = new SemanticVersionManager();
  }

  /**
   * Analyze changes and suggest version increment
   */
  async suggestVersionIncrement() {
    const changes = await this.analyzeChanges();
    
    if (changes.breaking.length > 0) {
      return {
        type: 'major',
        reason: 'Breaking changes detected',
        changes: changes.breaking
      };
    }
    
    if (changes.features.length > 0) {
      return {
        type: 'minor',
        reason: 'New features added',
        changes: changes.features
      };
    }
    
    if (changes.fixes.length > 0) {
      return {
        type: 'patch',
        reason: 'Bug fixes',
        changes: changes.fixes
      };
    }
    
    return {
      type: 'none',
      reason: 'No significant changes detected'
    };
  }

  /**
   * Analyze code changes (simplified implementation)
   */
  async analyzeChanges() {
    // This would typically integrate with git or other VCS
    // to analyze actual code changes
    
    return {
      breaking: [],
      features: [],
      fixes: []
    };
  }

  /**
   * Update plugin version
   */
  async updateVersion(newVersion) {
    const pluginJsonPath = path.join(this.pluginPath, 'plugin.json');
    const pluginJson = await fs.readJson(pluginJsonPath);
    
    const oldVersion = pluginJson.version;
    pluginJson.version = newVersion;
    
    await fs.writeJson(pluginJsonPath, pluginJson, { spaces: 2 });
    
    console.log(`Updated version: ${oldVersion} -> ${newVersion}`);
    
    return {
      oldVersion,
      newVersion,
      pluginId: pluginJson.id
    };
  }

  /**
   * Create version tag and changelog entry
   */
  async createVersionTag(version, changes) {
    const changelogPath = path.join(this.pluginPath, 'CHANGELOG.md');
    
    // Generate changelog entry
    const changelogEntry = this.generateChangelogEntry(version, changes);
    
    // Update changelog
    await this.updateChangelog(changelogPath, changelogEntry);
    
    console.log(`Created changelog entry for version ${version}`);
  }

  /**
   * Generate changelog entry
   */
  generateChangelogEntry(version, changes) {
    const date = new Date().toISOString().split('T')[0];
    let entry = `## [${version}] - ${date}\n\n`;
    
    if (changes.breaking && changes.breaking.length > 0) {
      entry += '### Breaking Changes\n';
      for (const change of changes.breaking) {
        entry += `- ${change}\n`;
      }
      entry += '\n';
    }
    
    if (changes.features && changes.features.length > 0) {
      entry += '### Added\n';
      for (const change of changes.features) {
        entry += `- ${change}\n`;
      }
      entry += '\n';
    }
    
    if (changes.fixes && changes.fixes.length > 0) {
      entry += '### Fixed\n';
      for (const change of changes.fixes) {
        entry += `- ${change}\n`;
      }
      entry += '\n';
    }
    
    return entry;
  }

  /**
   * Update changelog file
   */
  async updateChangelog(changelogPath, newEntry) {
    let content = '';
    
    if (await fs.pathExists(changelogPath)) {
      content = await fs.readFile(changelogPath, 'utf8');
    } else {
      content = '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n';
    }
    
    // Insert new entry after the header
    const lines = content.split('\n');
    const insertIndex = lines.findIndex(line => line.startsWith('## [')) || lines.length;
    
    lines.splice(insertIndex, 0, newEntry);
    
    await fs.writeFile(changelogPath, lines.join('\n'));
  }
}
```

## Update Management

### Update Detection

```javascript
/**
 * Update Detection and Management
 */
class UpdateManager {
  constructor(options = {}) {
    this.options = {
      repositoryUrl: options.repositoryUrl || 'https://plugins.movian.tv',
      checkInterval: options.checkInterval || 24 * 60 * 60 * 1000, // 24 hours
      ...options
    };
    
    this.versionManager = new SemanticVersionManager();
  }

  /**
   * Check for available updates
   */
  async checkForUpdates(pluginId, currentVersion) {
    try {
      const response = await fetch(`${this.options.repositoryUrl}/api/plugins/${pluginId}/versions`);
      const versions = await response.json();
      
      // Find the latest stable version
      const stableVersions = versions.filter(v => !v.prerelease);
      const latestVersion = stableVersions.sort((a, b) => 
        this.versionManager.compareVersions(b.version, a.version)
      )[0];
      
      if (!latestVersion) {
        return { hasUpdate: false, reason: 'No stable versions available' };
      }
      
      const hasUpdate = this.versionManager.compareVersions(latestVersion.version, currentVersion) > 0;
      
      return {
        hasUpdate,
        currentVersion,
        latestVersion: latestVersion.version,
        updateInfo: latestVersion,
        changelog: await this.getChangelog(pluginId, currentVersion, latestVersion.version)
      };
      
    } catch (error) {
      return {
        hasUpdate: false,
        error: error.message
      };
    }
  }

  /**
   * Get changelog between versions
   */
  async getChangelog(pluginId, fromVersion, toVersion) {
    try {
      const response = await fetch(
        `${this.options.repositoryUrl}/api/plugins/${pluginId}/changelog?from=${fromVersion}&to=${toVersion}`
      );
      
      return await response.json();
      
    } catch (error) {
      console.warn('Could not fetch changelog:', error.message);
      return null;
    }
  }

  /**
   * Determine update compatibility
   */
  analyzeUpdateCompatibility(currentVersion, targetVersion) {
    const current = this.versionManager.parseVersion(currentVersion);
    const target = this.versionManager.parseVersion(targetVersion);
    
    if (target.major > current.major) {
      return {
        compatible: false,
        risk: 'high',
        reason: 'Major version update may contain breaking changes',
        recommendation: 'Review changelog carefully before updating'
      };
    }
    
    if (target.minor > current.minor) {
      return {
        compatible: true,
        risk: 'low',
        reason: 'Minor version update with new features',
        recommendation: 'Safe to update, new features available'
      };
    }
    
    if (target.patch > current.patch) {
      return {
        compatible: true,
        risk: 'minimal',
        reason: 'Patch version with bug fixes',
        recommendation: 'Recommended update for bug fixes'
      };
    }
    
    return {
      compatible: true,
      risk: 'none',
      reason: 'Same version',
      recommendation: 'No update needed'
    };
  }
}
```

### Migration Guides

```javascript
/**
 * Migration Guide Generator
 */
class MigrationGuideGenerator {
  constructor() {
    this.versionManager = new SemanticVersionManager();
  }

  /**
   * Generate migration guide for version update
   */
  async generateMigrationGuide(pluginId, fromVersion, toVersion) {
    const guide = {
      pluginId,
      fromVersion,
      toVersion,
      migrationSteps: [],
      breakingChanges: [],
      deprecations: [],
      newFeatures: []
    };

    // Analyze version difference
    const compatibility = this.analyzeVersionDifference(fromVersion, toVersion);
    
    if (compatibility.majorChange) {
      guide.breakingChanges = await this.getBreakingChanges(pluginId, fromVersion, toVersion);
      guide.migrationSteps = await this.generateMigrationSteps(guide.breakingChanges);
    }

    if (compatibility.minorChange) {
      guide.newFeatures = await this.getNewFeatures(pluginId, fromVersion, toVersion);
      guide.deprecations = await this.getDeprecations(pluginId, fromVersion, toVersion);
    }

    return guide;
  }

  /**
   * Analyze version difference
   */
  analyzeVersionDifference(fromVersion, toVersion) {
    const from = this.versionManager.parseVersion(fromVersion);
    const to = this.versionManager.parseVersion(toVersion);

    return {
      majorChange: to.major > from.major,
      minorChange: to.minor > from.minor,
      patchChange: to.patch > from.patch
    };
  }

  /**
   * Generate migration steps
   */
  async generateMigrationSteps(breakingChanges) {
    const steps = [];

    for (const change of breakingChanges) {
      switch (change.type) {
        case 'api_removed':
          steps.push({
            step: `Replace usage of removed API: ${change.api}`,
            description: change.description,
            example: change.migrationExample
          });
          break;

        case 'config_changed':
          steps.push({
            step: `Update configuration: ${change.config}`,
            description: change.description,
            example: change.migrationExample
          });
          break;

        case 'dependency_updated':
          steps.push({
            step: `Update dependency: ${change.dependency}`,
            description: change.description,
            example: change.migrationExample
          });
          break;
      }
    }

    return steps;
  }

  /**
   * Format migration guide as markdown
   */
  formatMigrationGuide(guide) {
    let markdown = `# Migration Guide: ${guide.pluginId}\n\n`;
    markdown += `**From Version**: ${guide.fromVersion}\n`;
    markdown += `**To Version**: ${guide.toVersion}\n\n`;

    if (guide.breakingChanges.length > 0) {
      markdown += '## Breaking Changes\n\n';
      
      for (const change of guide.breakingChanges) {
        markdown += `### ${change.title}\n\n`;
        markdown += `${change.description}\n\n`;
        
        if (change.migrationExample) {
          markdown += '**Migration Example:**\n\n';
          markdown += '```javascript\n';
          markdown += '// Before\n';
          markdown += change.migrationExample.before + '\n\n';
          markdown += '// After\n';
          markdown += change.migrationExample.after + '\n';
          markdown += '```\n\n';
        }
      }
    }

    if (guide.migrationSteps.length > 0) {
      markdown += '## Migration Steps\n\n';
      
      guide.migrationSteps.forEach((step, index) => {
        markdown += `${index + 1}. **${step.step}**\n\n`;
        markdown += `   ${step.description}\n\n`;
        
        if (step.example) {
          markdown += '   ```javascript\n';
          markdown += `   ${step.example}\n`;
          markdown += '   ```\n\n';
        }
      });
    }

    if (guide.newFeatures.length > 0) {
      markdown += '## New Features\n\n';
      
      for (const feature of guide.newFeatures) {
        markdown += `- **${feature.title}**: ${feature.description}\n`;
      }
      markdown += '\n';
    }

    if (guide.deprecations.length > 0) {
      markdown += '## Deprecations\n\n';
      
      for (const deprecation of guide.deprecations) {
        markdown += `- **${deprecation.api}**: ${deprecation.reason}\n`;
        markdown += `  - **Replacement**: ${deprecation.replacement}\n`;
        markdown += `  - **Removal planned**: Version ${deprecation.removalVersion}\n\n`;
      }
    }

    return markdown;
  }

  // Placeholder methods - would be implemented based on actual data sources
  async getBreakingChanges(pluginId, fromVersion, toVersion) {
    return [];
  }

  async getNewFeatures(pluginId, fromVersion, toVersion) {
    return [];
  }

  async getDeprecations(pluginId, fromVersion, toVersion) {
    return [];
  }
}
```

## Best Practices

### Version Planning

1. **Plan Version Increments**
   - Document planned breaking changes
   - Group related changes in single versions
   - Communicate version roadmap to users

2. **Pre-release Testing**
   - Use alpha/beta versions for testing
   - Gather user feedback before stable release
   - Test compatibility with different Movian versions

3. **Deprecation Strategy**
   - Announce deprecations in advance
   - Provide migration paths
   - Keep deprecated features for at least one major version

### Update Communication

1. **Clear Release Notes**
   - Highlight breaking changes
   - Explain new features
   - Provide migration examples

2. **User Notifications**
   - Notify about available updates
   - Explain update importance
   - Provide rollback options

3. **Documentation Updates**
   - Update documentation with new versions
   - Maintain version-specific docs
   - Provide migration guides

### Version Control Integration

```bash
#!/bin/bash
# Automated version release script

# Get current version
CURRENT_VERSION=$(node -p "require('./plugin.json').version")

# Determine next version
echo "Current version: $CURRENT_VERSION"
echo "Select version increment:"
echo "1) Patch (bug fixes)"
echo "2) Minor (new features)"
echo "3) Major (breaking changes)"
read -p "Enter choice (1-3): " CHOICE

case $CHOICE in
  1) INCREMENT_TYPE="patch" ;;
  2) INCREMENT_TYPE="minor" ;;
  3) INCREMENT_TYPE="major" ;;
  *) echo "Invalid choice"; exit 1 ;;
esac

# Update version
NEW_VERSION=$(node -e "
  const semver = require('./src/semantic-version-manager.js');
  const manager = new semver.SemanticVersionManager();
  console.log(manager.incrementVersion('$CURRENT_VERSION', '$INCREMENT_TYPE'));
")

# Update plugin.json
node -e "
  const fs = require('fs');
  const plugin = require('./plugin.json');
  plugin.version = '$NEW_VERSION';
  fs.writeFileSync('plugin.json', JSON.stringify(plugin, null, 2));
"

# Create git tag
git add plugin.json
git commit -m "Release version $NEW_VERSION"
git tag -a "v$NEW_VERSION" -m "Version $NEW_VERSION"

echo "Released version $NEW_VERSION"
```

This comprehensive versioning and update management system ensures consistent version handling, smooth updates, and clear communication with users about changes and migration requirements.