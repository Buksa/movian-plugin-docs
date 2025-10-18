# Update Mechanism Examples and Migration Guides

This document provides practical examples of implementing update mechanisms and creating migration guides for Movian plugins.

## Update Detection Examples

### Basic Update Checker

```javascript
/**
 * Simple update checker for individual plugins
 */
class SimpleUpdateChecker {
  constructor(pluginId, currentVersion) {
    this.pluginId = pluginId;
    this.currentVersion = currentVersion;
    this.repositoryUrl = 'https://plugins.movian.tv/api';
  }

  async checkForUpdate() {
    try {
      const response = await fetch(`${this.repositoryUrl}/plugins/${this.pluginId}/latest`);
      const data = await response.json();
      
      if (this.isNewerVersion(data.version, this.currentVersion)) {
        return {
          hasUpdate: true,
          currentVersion: this.currentVersion,
          latestVersion: data.version,
          downloadUrl: data.downloadUrl,
          changelog: data.changelog,
          releaseDate: data.releaseDate
        };
      }
      
      return { hasUpdate: false };
      
    } catch (error) {
      console.error('Update check failed:', error);
      return { hasUpdate: false, error: error.message };
    }
  }

  isNewerVersion(newVersion, currentVersion) {
    const parseVersion = (v) => v.split('.').map(Number);
    const newParts = parseVersion(newVersion);
    const currentParts = parseVersion(currentVersion);
    
    for (let i = 0; i < Math.max(newParts.length, currentParts.length); i++) {
      const newPart = newParts[i] || 0;
      const currentPart = currentParts[i] || 0;
      
      if (newPart > currentPart) return true;
      if (newPart < currentPart) return false;
    }
    
    return false;
  }
}

// Usage example
const updateChecker = new SimpleUpdateChecker('com.example.myplugin', '1.2.0');
updateChecker.checkForUpdate().then(result => {
  if (result.hasUpdate) {
    console.log(`Update available: ${result.currentVersion} -> ${result.latestVersion}`);
    console.log(`Download: ${result.downloadUrl}`);
  } else {
    console.log('Plugin is up to date');
  }
});
```

### Batch Update Checker

```javascript
/**
 * Check updates for multiple plugins
 */
class BatchUpdateChecker {
  constructor(plugins) {
    this.plugins = plugins; // Array of {id, version}
    this.repositoryUrl = 'https://plugins.movian.tv/api';
  }

  async checkAllUpdates() {
    const updatePromises = this.plugins.map(plugin => 
      this.checkSingleUpdate(plugin.id, plugin.version)
    );
    
    const results = await Promise.allSettled(updatePromises);
    
    return results.map((result, index) => ({
      pluginId: this.plugins[index].id,
      currentVersion: this.plugins[index].version,
      ...result.value
    }));
  }

  async checkSingleUpdate(pluginId, currentVersion) {
    try {
      const response = await fetch(`${this.repositoryUrl}/plugins/${pluginId}/versions`);
      const versions = await response.json();
      
      // Find latest stable version
      const stableVersions = versions.filter(v => !v.prerelease);
      const latestVersion = stableVersions.sort((a, b) => 
        this.compareVersions(b.version, a.version)
      )[0];
      
      if (latestVersion && this.isNewerVersion(latestVersion.version, currentVersion)) {
        return {
          hasUpdate: true,
          latestVersion: latestVersion.version,
          updateInfo: latestVersion,
          changelog: await this.getChangelog(pluginId, currentVersion, latestVersion.version)
        };
      }
      
      return { hasUpdate: false };
      
    } catch (error) {
      return { hasUpdate: false, error: error.message };
    }
  }

  async getChangelog(pluginId, fromVersion, toVersion) {
    try {
      const response = await fetch(
        `${this.repositoryUrl}/plugins/${pluginId}/changelog?from=${fromVersion}&to=${toVersion}`
      );
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;
      
      if (part1 > part2) return 1;
      if (part1 < part2) return -1;
    }
    
    return 0;
  }

  isNewerVersion(newVersion, currentVersion) {
    return this.compareVersions(newVersion, currentVersion) > 0;
  }
}

// Usage example
const plugins = [
  { id: 'com.example.plugin1', version: '1.0.0' },
  { id: 'com.example.plugin2', version: '2.1.0' },
  { id: 'com.example.plugin3', version: '0.9.5' }
];

const batchChecker = new BatchUpdateChecker(plugins);
batchChecker.checkAllUpdates().then(results => {
  const updatesAvailable = results.filter(r => r.hasUpdate);
  console.log(`${updatesAvailable.length} updates available`);
  
  updatesAvailable.forEach(update => {
    console.log(`${update.pluginId}: ${update.currentVersion} -> ${update.latestVersion}`);
  });
});
```

## Automatic Update System

### Scheduled Update Checker

```javascript
/**
 * Automatic update system with scheduling
 */
class AutomaticUpdateSystem {
  constructor(options = {}) {
    this.options = {
      checkInterval: options.checkInterval || 24 * 60 * 60 * 1000, // 24 hours
      autoInstall: options.autoInstall || false,
      notifyUser: options.notifyUser !== false,
      backupBeforeUpdate: options.backupBeforeUpdate !== false,
      ...options
    };
    
    this.updateTimer = null;
    this.pendingUpdates = new Map();
  }

  start() {
    console.log('Starting automatic update system...');
    
    // Initial check
    this.checkForUpdates();
    
    // Schedule periodic checks
    this.updateTimer = setInterval(() => {
      this.checkForUpdates();
    }, this.options.checkInterval);
  }

  stop() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
      console.log('Automatic update system stopped');
    }
  }

  async checkForUpdates() {
    try {
      console.log('Checking for plugin updates...');
      
      const installedPlugins = await this.getInstalledPlugins();
      const batchChecker = new BatchUpdateChecker(installedPlugins);
      const updateResults = await batchChecker.checkAllUpdates();
      
      const availableUpdates = updateResults.filter(result => result.hasUpdate);
      
      if (availableUpdates.length > 0) {
        console.log(`Found ${availableUpdates.length} available updates`);
        
        for (const update of availableUpdates) {
          await this.handleAvailableUpdate(update);
        }
      } else {
        console.log('All plugins are up to date');
      }
      
    } catch (error) {
      console.error('Update check failed:', error);
    }
  }

  async handleAvailableUpdate(update) {
    const updateKey = `${update.pluginId}-${update.latestVersion}`;
    
    // Skip if already processed
    if (this.pendingUpdates.has(updateKey)) {
      return;
    }
    
    this.pendingUpdates.set(updateKey, update);
    
    // Analyze update compatibility
    const compatibility = this.analyzeUpdateCompatibility(
      update.currentVersion, 
      update.latestVersion
    );
    
    if (this.options.autoInstall && compatibility.autoInstallSafe) {
      await this.performAutomaticUpdate(update);
    } else {
      await this.notifyUserAboutUpdate(update, compatibility);
    }
  }

  analyzeUpdateCompatibility(currentVersion, targetVersion) {
    const current = this.parseVersion(currentVersion);
    const target = this.parseVersion(targetVersion);
    
    const isMajorUpdate = target.major > current.major;
    const isMinorUpdate = target.minor > current.minor;
    const isPatchUpdate = target.patch > current.patch;
    
    return {
      isMajorUpdate,
      isMinorUpdate,
      isPatchUpdate,
      autoInstallSafe: isPatchUpdate && !isMajorUpdate && !isMinorUpdate,
      risk: isMajorUpdate ? 'high' : isMinorUpdate ? 'medium' : 'low',
      recommendation: this.getUpdateRecommendation(isMajorUpdate, isMinorUpdate, isPatchUpdate)
    };
  }

  getUpdateRecommendation(isMajor, isMinor, isPatch) {
    if (isMajor) {
      return 'Review changelog carefully - may contain breaking changes';
    } else if (isMinor) {
      return 'New features available - generally safe to update';
    } else if (isPatch) {
      return 'Bug fixes and improvements - recommended to update';
    }
    return 'No significant changes';
  }

  async performAutomaticUpdate(update) {
    try {
      console.log(`Automatically updating ${update.pluginId}...`);
      
      // Create backup if enabled
      if (this.options.backupBeforeUpdate) {
        await this.createBackup(update.pluginId);
      }
      
      // Download and install update
      await this.downloadAndInstallUpdate(update);
      
      console.log(`Successfully updated ${update.pluginId} to ${update.latestVersion}`);
      
      // Notify user about successful update
      if (this.options.notifyUser) {
        this.notifyUpdateComplete(update);
      }
      
    } catch (error) {
      console.error(`Automatic update failed for ${update.pluginId}:`, error);
      
      // Restore backup if available
      if (this.options.backupBeforeUpdate) {
        await this.restoreBackup(update.pluginId);
      }
      
      // Notify user about failed update
      this.notifyUpdateFailed(update, error);
    }
  }

  async notifyUserAboutUpdate(update, compatibility) {
    const notification = {
      type: 'update-available',
      pluginId: update.pluginId,
      currentVersion: update.currentVersion,
      latestVersion: update.latestVersion,
      compatibility,
      changelog: update.changelog,
      actions: [
        { id: 'install', label: 'Install Update' },
        { id: 'skip', label: 'Skip This Version' },
        { id: 'remind', label: 'Remind Me Later' }
      ]
    };
    
    // This would integrate with the UI notification system
    console.log('Update notification:', notification);
  }

  parseVersion(version) {
    const parts = version.split('.').map(Number);
    return {
      major: parts[0] || 0,
      minor: parts[1] || 0,
      patch: parts[2] || 0
    };
  }

  // Placeholder methods - would be implemented based on actual system
  async getInstalledPlugins() {
    return [
      { id: 'com.example.plugin1', version: '1.0.0' },
      { id: 'com.example.plugin2', version: '2.1.0' }
    ];
  }

  async createBackup(pluginId) {
    console.log(`Creating backup for ${pluginId}`);
  }

  async restoreBackup(pluginId) {
    console.log(`Restoring backup for ${pluginId}`);
  }

  async downloadAndInstallUpdate(update) {
    console.log(`Installing update for ${update.pluginId}`);
  }

  notifyUpdateComplete(update) {
    console.log(`Update completed: ${update.pluginId} v${update.latestVersion}`);
  }

  notifyUpdateFailed(update, error) {
    console.log(`Update failed: ${update.pluginId} - ${error.message}`);
  }
}

// Usage example
const autoUpdater = new AutomaticUpdateSystem({
  checkInterval: 6 * 60 * 60 * 1000, // Check every 6 hours
  autoInstall: true, // Only for patch updates
  notifyUser: true
});

autoUpdater.start();
```

## Migration Guide Examples

### Version 1.x to 2.0 Migration Guide

```markdown
# Migration Guide: MyPlugin 1.x → 2.0

## Overview

Version 2.0 introduces significant changes to improve performance and add new features. This guide will help you migrate from version 1.x to 2.0.

## Breaking Changes

### 1. Configuration Format Changed

**What Changed**: The plugin configuration format has been updated to support new features.

**Before (1.x)**:
```json
{
  "settings": {
    "apiKey": "your-key",
    "baseUrl": "https://api.example.com"
  }
}
```

**After (2.0)**:
```json
{
  "api": {
    "key": "your-key",
    "endpoint": "https://api.example.com/v2"
  },
  "features": {
    "caching": true,
    "notifications": false
  }
}
```

**Migration Steps**:
1. Update your configuration file
2. Move `apiKey` to `api.key`
3. Update `baseUrl` to `api.endpoint` and append `/v2`
4. Add the new `features` section

### 2. API Method Signatures Changed

**What Changed**: Several API methods now require additional parameters for enhanced functionality.

**Before (1.x)**:
```javascript
// Search content
searchContent(query);

// Get item details
getItemDetails(itemId);
```

**After (2.0)**:
```javascript
// Search content with options
searchContent(query, {
  limit: 20,
  offset: 0,
  filters: {}
});

// Get item details with metadata
getItemDetails(itemId, {
  includeMetadata: true,
  includeRelated: false
});
```

**Migration Steps**:
1. Update all `searchContent()` calls to include options parameter
2. Update all `getItemDetails()` calls to include options parameter
3. Review your code for any other API method calls

### 3. Event System Redesigned

**What Changed**: The event system has been redesigned for better performance and flexibility.

**Before (1.x)**:
```javascript
// Register event listener
plugin.on('content-loaded', function(data) {
  console.log('Content loaded:', data);
});

// Emit event
plugin.emit('custom-event', eventData);
```

**After (2.0)**:
```javascript
// Register event listener with new API
plugin.events.subscribe('content-loaded', (data) => {
  console.log('Content loaded:', data);
});

// Emit event with new API
plugin.events.publish('custom-event', eventData);
```

**Migration Steps**:
1. Replace all `plugin.on()` calls with `plugin.events.subscribe()`
2. Replace all `plugin.emit()` calls with `plugin.events.publish()`
3. Update event handler function signatures if needed

## New Features

### 1. Enhanced Caching System

Version 2.0 introduces an improved caching system:

```javascript
// Enable caching for API responses
const cachedResponse = await plugin.cache.get('api-key', async () => {
  return await api.fetchData();
}, { ttl: 3600 }); // Cache for 1 hour
```

### 2. Background Tasks

New background task system for long-running operations:

```javascript
// Schedule background task
plugin.tasks.schedule('data-sync', {
  interval: '0 */6 * * *', // Every 6 hours
  handler: async () => {
    await syncDataFromAPI();
  }
});
```

### 3. Improved Error Handling

Enhanced error handling with detailed error information:

```javascript
try {
  await plugin.api.request('/data');
} catch (error) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    // Handle rate limiting
    await plugin.utils.delay(error.retryAfter * 1000);
  } else {
    // Handle other errors
    plugin.logger.error('API request failed:', error);
  }
}
```

## Deprecated Features

### 1. Legacy Search API (Deprecated in 2.0, will be removed in 3.0)

```javascript
// Deprecated - still works but will be removed
plugin.legacySearch(query);

// Use instead
plugin.search.content(query, options);
```

### 2. Old Configuration Methods (Deprecated in 2.0, will be removed in 3.0)

```javascript
// Deprecated
plugin.getConfig('setting-name');
plugin.setConfig('setting-name', value);

// Use instead
plugin.config.get('setting-name');
plugin.config.set('setting-name', value);
```

## Migration Checklist

- [ ] Update plugin.json version to 2.0.0
- [ ] Update configuration format
- [ ] Update API method calls
- [ ] Replace event system calls
- [ ] Test all plugin functionality
- [ ] Update documentation
- [ ] Test with different Movian versions
- [ ] Create backup of 1.x version

## Rollback Plan

If you encounter issues with version 2.0:

1. **Immediate Rollback**:
   - Restore plugin directory from backup
   - Restart Movian

2. **Configuration Rollback**:
   - Restore old configuration format
   - Remove new configuration sections

3. **Report Issues**:
   - Create issue report with error details
   - Include configuration and log files
   - Specify Movian version and platform

## Support

- **Documentation**: https://docs.example.com/myplugin/v2
- **Issues**: https://github.com/example/myplugin/issues
- **Community**: https://forum.example.com/myplugin
```

### Automated Migration Script

```javascript
/**
 * Automated migration script for plugin updates
 */
class PluginMigrationManager {
  constructor(pluginPath) {
    this.pluginPath = pluginPath;
    this.backupPath = `${pluginPath}.backup`;
  }

  async migrateToVersion(targetVersion) {
    try {
      console.log(`Starting migration to version ${targetVersion}...`);
      
      // Create backup
      await this.createBackup();
      
      // Get current version
      const currentVersion = await this.getCurrentVersion();
      
      // Determine migration path
      const migrationSteps = this.getMigrationSteps(currentVersion, targetVersion);
      
      // Execute migration steps
      for (const step of migrationSteps) {
        console.log(`Executing migration step: ${step.description}`);
        await step.execute();
      }
      
      // Update version
      await this.updateVersion(targetVersion);
      
      // Verify migration
      await this.verifyMigration();
      
      console.log(`Migration to version ${targetVersion} completed successfully`);
      
    } catch (error) {
      console.error('Migration failed:', error);
      
      // Restore backup
      await this.restoreBackup();
      throw error;
    }
  }

  getMigrationSteps(fromVersion, toVersion) {
    const steps = [];
    
    // Example migration steps for 1.x to 2.0
    if (this.needsMigration(fromVersion, '2.0.0', toVersion)) {
      steps.push({
        description: 'Migrate configuration format',
        execute: () => this.migrateConfigurationFormat()
      });
      
      steps.push({
        description: 'Update API method calls',
        execute: () => this.updateApiMethodCalls()
      });
      
      steps.push({
        description: 'Migrate event system',
        execute: () => this.migrateEventSystem()
      });
    }
    
    return steps;
  }

  needsMigration(currentVersion, migrationVersion, targetVersion) {
    // Check if migration is needed based on version ranges
    return this.compareVersions(currentVersion, migrationVersion) < 0 &&
           this.compareVersions(targetVersion, migrationVersion) >= 0;
  }

  async migrateConfigurationFormat() {
    const configPath = path.join(this.pluginPath, 'config.json');
    
    if (await fs.pathExists(configPath)) {
      const config = await fs.readJson(configPath);
      
      // Transform old format to new format
      const newConfig = {
        api: {
          key: config.settings?.apiKey,
          endpoint: config.settings?.baseUrl ? `${config.settings.baseUrl}/v2` : undefined
        },
        features: {
          caching: true,
          notifications: false
        }
      };
      
      await fs.writeJson(configPath, newConfig, { spaces: 2 });
    }
  }

  async updateApiMethodCalls() {
    // This would scan and update JavaScript files
    // For demonstration, we'll just log the action
    console.log('API method calls would be updated here');
  }

  async migrateEventSystem() {
    // This would update event system usage
    console.log('Event system migration would be performed here');
  }

  async createBackup() {
    await fs.copy(this.pluginPath, this.backupPath);
  }

  async restoreBackup() {
    if (await fs.pathExists(this.backupPath)) {
      await fs.remove(this.pluginPath);
      await fs.move(this.backupPath, this.pluginPath);
    }
  }

  async getCurrentVersion() {
    const pluginJson = await fs.readJson(path.join(this.pluginPath, 'plugin.json'));
    return pluginJson.version;
  }

  async updateVersion(newVersion) {
    const pluginJsonPath = path.join(this.pluginPath, 'plugin.json');
    const pluginJson = await fs.readJson(pluginJsonPath);
    pluginJson.version = newVersion;
    await fs.writeJson(pluginJsonPath, pluginJson, { spaces: 2 });
  }

  async verifyMigration() {
    // Perform verification checks
    const pluginJson = await fs.readJson(path.join(this.pluginPath, 'plugin.json'));
    
    if (!pluginJson.version) {
      throw new Error('Version not found after migration');
    }
    
    // Additional verification checks would go here
  }

  compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;
      
      if (part1 > part2) return 1;
      if (part1 < part2) return -1;
    }
    
    return 0;
  }
}

// Usage example
const migrationManager = new PluginMigrationManager('/path/to/plugin');
migrationManager.migrateToVersion('2.0.0')
  .then(() => console.log('Migration completed'))
  .catch(error => console.error('Migration failed:', error));
```

These examples provide comprehensive update mechanisms and migration guides that help ensure smooth transitions between plugin versions while maintaining user data and settings.