# Plugin Installation and Update Mechanisms

This document describes the various mechanisms available for installing and updating Movian plugins, including manual installation, automated systems, and update management.

## Installation Methods

### Manual Installation

The simplest method for installing plugins, suitable for development and testing.

#### Directory Installation

1. **Extract Plugin Files**
   ```bash
   # Extract plugin archive
   unzip my-plugin-v1.0.0.zip -d /path/to/movian/plugins/
   
   # Verify extraction
   ls -la /path/to/movian/plugins/my-plugin/
   ```

2. **Set Proper Permissions**
   ```bash
   # Set directory permissions
   chmod 755 /path/to/movian/plugins/my-plugin/
   
   # Set file permissions
   chmod 644 /path/to/movian/plugins/my-plugin/*.js
   chmod 644 /path/to/movian/plugins/my-plugin/*.json
   ```

3. **Restart Movian**
   - Close Movian completely
   - Restart the application
   - Plugin should appear in the plugins list

#### Archive Installation

Some systems support direct installation from ZIP files:

```javascript
// Movian plugin installation API (if available)
var installer = require('movian/installer');

installer.installFromArchive('/path/to/plugin.zip', {
  validate: true,
  backup: true,
  restart: false
});
```

### Automated Installation Systems

#### Plugin Manager Integration

For systems with plugin managers:

```javascript
// Plugin manager API
class PluginManager {
  async install(pluginId, options = {}) {
    try {
      // Download plugin metadata
      const metadata = await this.fetchPluginMetadata(pluginId);
      
      // Validate compatibility
      if (!this.isCompatible(metadata)) {
        throw new Error('Plugin not compatible with current Movian version');
      }
      
      // Download plugin package
      const packagePath = await this.downloadPlugin(metadata.downloadUrl);
      
      // Validate package
      if (options.validate !== false) {
        await this.validatePackage(packagePath);
      }
      
      // Install plugin
      await this.installPackage(packagePath, options);
      
      // Clean up
      await fs.remove(packagePath);
      
      return { success: true, pluginId, version: metadata.version };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async downloadPlugin(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }
    
    const tempPath = path.join(os.tmpdir(), `plugin-${Date.now()}.zip`);
    const buffer = await response.arrayBuffer();
    await fs.writeFile(tempPath, Buffer.from(buffer));
    
    return tempPath;
  }
  
  async installPackage(packagePath, options) {
    const pluginsDir = this.getPluginsDirectory();
    const tempDir = path.join(os.tmpdir(), `install-${Date.now()}`);
    
    try {
      // Extract package
      await this.extractPackage(packagePath, tempDir);
      
      // Find plugin directory
      const pluginDir = await this.findPluginDirectory(tempDir);
      const pluginJson = await this.readPluginJson(pluginDir);
      
      // Check for existing installation
      const targetDir = path.join(pluginsDir, pluginJson.id);
      if (await fs.pathExists(targetDir)) {
        if (options.overwrite !== true) {
          throw new Error('Plugin already installed. Use overwrite option to replace.');
        }
        
        // Backup existing installation
        if (options.backup !== false) {
          await this.backupPlugin(pluginJson.id);
        }
        
        await fs.remove(targetDir);
      }
      
      // Move plugin to plugins directory
      await fs.move(pluginDir, targetDir);
      
      // Register plugin
      await this.registerPlugin(pluginJson);
      
    } finally {
      // Clean up temporary files
      await fs.remove(tempDir);
    }
  }
}
```

#### Repository-Based Installation

For systems with plugin repositories:

```javascript
// Repository-based installation
class PluginRepository {
  constructor(repositoryUrl) {
    this.repositoryUrl = repositoryUrl;
    this.cache = new Map();
  }
  
  async search(query) {
    const response = await fetch(`${this.repositoryUrl}/search?q=${encodeURIComponent(query)}`);
    return await response.json();
  }
  
  async getPluginInfo(pluginId) {
    if (this.cache.has(pluginId)) {
      return this.cache.get(pluginId);
    }
    
    const response = await fetch(`${this.repositoryUrl}/plugins/${pluginId}`);
    const info = await response.json();
    
    this.cache.set(pluginId, info);
    return info;
  }
  
  async installPlugin(pluginId, version = 'latest') {
    const info = await this.getPluginInfo(pluginId);
    const versionInfo = version === 'latest' ? info.latestVersion : info.versions[version];
    
    if (!versionInfo) {
      throw new Error(`Version ${version} not found for plugin ${pluginId}`);
    }
    
    const manager = new PluginManager();
    return await manager.install(pluginId, {
      downloadUrl: versionInfo.downloadUrl,
      checksum: versionInfo.checksum,
      signature: versionInfo.signature
    });
  }
}
```

## Update Mechanisms

### Version Detection

```javascript
// Version comparison utilities
class VersionManager {
  compareVersions(version1, version2) {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;
      
      if (v1Part < v2Part) return -1;
      if (v1Part > v2Part) return 1;
    }
    
    return 0;
  }
  
  isNewerVersion(newVersion, currentVersion) {
    return this.compareVersions(newVersion, currentVersion) > 0;
  }
  
  async checkForUpdates(pluginId) {
    const installedVersion = await this.getInstalledVersion(pluginId);
    const latestVersion = await this.getLatestVersion(pluginId);
    
    return {
      hasUpdate: this.isNewerVersion(latestVersion.version, installedVersion),
      currentVersion: installedVersion,
      latestVersion: latestVersion.version,
      updateInfo: latestVersion
    };
  }
}
```

### Automatic Updates

```javascript
// Automatic update system
class AutoUpdater {
  constructor(options = {}) {
    this.options = {
      checkInterval: options.checkInterval || 24 * 60 * 60 * 1000, // 24 hours
      autoInstall: options.autoInstall || false,
      backupBeforeUpdate: options.backupBeforeUpdate !== false,
      ...options
    };
    
    this.versionManager = new VersionManager();
    this.pluginManager = new PluginManager();
    this.updateTimer = null;
  }
  
  start() {
    if (this.updateTimer) {
      this.stop();
    }
    
    // Initial check
    this.checkAllPlugins();
    
    // Schedule periodic checks
    this.updateTimer = setInterval(() => {
      this.checkAllPlugins();
    }, this.options.checkInterval);
  }
  
  stop() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
  }
  
  async checkAllPlugins() {
    const installedPlugins = await this.getInstalledPlugins();
    const updateResults = [];
    
    for (const plugin of installedPlugins) {
      try {
        const updateInfo = await this.versionManager.checkForUpdates(plugin.id);
        
        if (updateInfo.hasUpdate) {
          console.log(`Update available for ${plugin.id}: ${updateInfo.currentVersion} -> ${updateInfo.latestVersion}`);
          
          if (this.options.autoInstall) {
            const result = await this.updatePlugin(plugin.id, updateInfo);
            updateResults.push(result);
          } else {
            // Notify user about available update
            this.notifyUpdateAvailable(plugin.id, updateInfo);
          }
        }
      } catch (error) {
        console.error(`Update check failed for ${plugin.id}:`, error);
      }
    }
    
    return updateResults;
  }
  
  async updatePlugin(pluginId, updateInfo) {
    try {
      console.log(`Updating plugin ${pluginId}...`);
      
      // Backup current version
      if (this.options.backupBeforeUpdate) {
        await this.backupPlugin(pluginId);
      }
      
      // Download and install update
      const result = await this.pluginManager.install(pluginId, {
        downloadUrl: updateInfo.updateInfo.downloadUrl,
        overwrite: true,
        backup: false // Already backed up above
      });
      
      if (result.success) {
        console.log(`Successfully updated ${pluginId} to version ${updateInfo.latestVersion}`);
        this.notifyUpdateComplete(pluginId, updateInfo);
      } else {
        console.error(`Update failed for ${pluginId}:`, result.error);
        
        // Attempt to restore backup
        if (this.options.backupBeforeUpdate) {
          await this.restorePlugin(pluginId);
        }
      }
      
      return result;
      
    } catch (error) {
      console.error(`Update failed for ${pluginId}:`, error);
      
      // Attempt to restore backup
      if (this.options.backupBeforeUpdate) {
        try {
          await this.restorePlugin(pluginId);
        } catch (restoreError) {
          console.error(`Failed to restore backup for ${pluginId}:`, restoreError);
        }
      }
      
      return { success: false, error: error.message };
    }
  }
}
```

### Manual Update Process

```javascript
// Manual update workflow
class ManualUpdater {
  async updatePlugin(pluginId, options = {}) {
    const steps = [
      'Checking current version',
      'Fetching update information',
      'Downloading update',
      'Validating package',
      'Creating backup',
      'Installing update',
      'Verifying installation',
      'Cleaning up'
    ];
    
    let currentStep = 0;
    
    try {
      // Step 1: Check current version
      this.reportProgress(steps[currentStep++]);
      const currentVersion = await this.getCurrentVersion(pluginId);
      
      // Step 2: Fetch update information
      this.reportProgress(steps[currentStep++]);
      const updateInfo = await this.getUpdateInfo(pluginId);
      
      if (!updateInfo.hasUpdate) {
        return { success: true, message: 'Plugin is already up to date' };
      }
      
      // Step 3: Download update
      this.reportProgress(steps[currentStep++]);
      const packagePath = await this.downloadUpdate(updateInfo.downloadUrl);
      
      // Step 4: Validate package
      this.reportProgress(steps[currentStep++]);
      const validation = await this.validatePackage(packagePath);
      if (!validation.valid) {
        throw new Error(`Package validation failed: ${validation.errors.join(', ')}`);
      }
      
      // Step 5: Create backup
      this.reportProgress(steps[currentStep++]);
      const backupPath = await this.createBackup(pluginId);
      
      try {
        // Step 6: Install update
        this.reportProgress(steps[currentStep++]);
        await this.installUpdate(pluginId, packagePath);
        
        // Step 7: Verify installation
        this.reportProgress(steps[currentStep++]);
        const newVersion = await this.getCurrentVersion(pluginId);
        if (newVersion !== updateInfo.latestVersion) {
          throw new Error('Version verification failed after update');
        }
        
        // Step 8: Clean up
        this.reportProgress(steps[currentStep++]);
        await fs.remove(packagePath);
        await fs.remove(backupPath);
        
        return {
          success: true,
          message: `Successfully updated ${pluginId} from ${currentVersion} to ${newVersion}`
        };
        
      } catch (error) {
        // Restore backup on failure
        console.log('Update failed, restoring backup...');
        await this.restoreBackup(pluginId, backupPath);
        throw error;
      }
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        step: steps[currentStep - 1]
      };
    }
  }
  
  reportProgress(step) {
    console.log(`[UPDATE] ${step}...`);
    // Could emit events for UI updates
  }
}
```

## Rollback and Recovery

### Backup Management

```javascript
// Backup and recovery system
class BackupManager {
  constructor(backupDir) {
    this.backupDir = backupDir || path.join(os.homedir(), '.movian', 'plugin-backups');
  }
  
  async createBackup(pluginId) {
    const pluginDir = await this.getPluginDirectory(pluginId);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `${pluginId}-${timestamp}`;
    const backupPath = path.join(this.backupDir, backupName);
    
    await fs.ensureDir(this.backupDir);
    await fs.copy(pluginDir, backupPath);
    
    // Store backup metadata
    const metadata = {
      pluginId,
      timestamp: new Date().toISOString(),
      originalPath: pluginDir,
      backupPath
    };
    
    await fs.writeJson(path.join(backupPath, '.backup-metadata.json'), metadata);
    
    return backupPath;
  }
  
  async restoreBackup(pluginId, backupPath) {
    const metadata = await fs.readJson(path.join(backupPath, '.backup-metadata.json'));
    const pluginDir = metadata.originalPath;
    
    // Remove current installation
    if (await fs.pathExists(pluginDir)) {
      await fs.remove(pluginDir);
    }
    
    // Restore from backup
    await fs.copy(backupPath, pluginDir);
    
    // Remove backup metadata file from restored plugin
    const metadataPath = path.join(pluginDir, '.backup-metadata.json');
    if (await fs.pathExists(metadataPath)) {
      await fs.remove(metadataPath);
    }
  }
  
  async listBackups(pluginId = null) {
    if (!await fs.pathExists(this.backupDir)) {
      return [];
    }
    
    const backups = [];
    const items = await fs.readdir(this.backupDir);
    
    for (const item of items) {
      const itemPath = path.join(this.backupDir, item);
      const metadataPath = path.join(itemPath, '.backup-metadata.json');
      
      if (await fs.pathExists(metadataPath)) {
        const metadata = await fs.readJson(metadataPath);
        
        if (!pluginId || metadata.pluginId === pluginId) {
          backups.push({
            ...metadata,
            backupName: item
          });
        }
      }
    }
    
    return backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
  
  async cleanupOldBackups(maxAge = 30 * 24 * 60 * 60 * 1000) { // 30 days
    const backups = await this.listBackups();
    const cutoffDate = new Date(Date.now() - maxAge);
    
    for (const backup of backups) {
      if (new Date(backup.timestamp) < cutoffDate) {
        await fs.remove(backup.backupPath);
        console.log(`Removed old backup: ${backup.backupName}`);
      }
    }
  }
}
```

## Error Handling and Recovery

### Installation Error Recovery

```javascript
// Error recovery mechanisms
class InstallationRecovery {
  async handleInstallationError(error, context) {
    console.error('Installation error:', error.message);
    
    switch (error.code) {
      case 'INSUFFICIENT_SPACE':
        return await this.handleInsufficientSpace(context);
        
      case 'PERMISSION_DENIED':
        return await this.handlePermissionError(context);
        
      case 'DEPENDENCY_CONFLICT':
        return await this.handleDependencyConflict(error, context);
        
      case 'VALIDATION_FAILED':
        return await this.handleValidationError(error, context);
        
      default:
        return await this.handleGenericError(error, context);
    }
  }
  
  async handleInsufficientSpace(context) {
    // Calculate required space
    const requiredSpace = await this.calculateRequiredSpace(context.packagePath);
    const availableSpace = await this.getAvailableSpace(context.pluginsDir);
    
    return {
      recovery: 'manual',
      message: `Insufficient disk space. Required: ${requiredSpace}MB, Available: ${availableSpace}MB`,
      suggestions: [
        'Free up disk space',
        'Remove unused plugins',
        'Clean up temporary files'
      ]
    };
  }
  
  async handlePermissionError(context) {
    return {
      recovery: 'manual',
      message: 'Permission denied. Cannot write to plugins directory.',
      suggestions: [
        'Run Movian as administrator',
        'Check plugins directory permissions',
        'Ensure plugins directory is writable'
      ]
    };
  }
  
  async handleDependencyConflict(error, context) {
    return {
      recovery: 'automatic',
      message: 'Dependency conflict detected',
      action: async () => {
        // Attempt to resolve dependency conflicts
        await this.resolveDependencies(context.pluginId, error.conflicts);
      }
    };
  }
}
```

## Best Practices

### Installation Best Practices

1. **Always Validate Packages**
   - Check package integrity
   - Verify digital signatures
   - Validate metadata

2. **Create Backups**
   - Backup before updates
   - Keep multiple backup versions
   - Test backup restoration

3. **Handle Errors Gracefully**
   - Provide clear error messages
   - Offer recovery options
   - Log installation attempts

4. **User Communication**
   - Show installation progress
   - Notify about updates
   - Explain any issues clearly

### Update Best Practices

1. **Staged Updates**
   - Test updates in development
   - Gradual rollout to users
   - Monitor for issues

2. **Version Compatibility**
   - Check API compatibility
   - Validate dependencies
   - Test with current Movian version

3. **Rollback Planning**
   - Always have rollback plan
   - Test rollback procedures
   - Keep previous versions available

This comprehensive installation and update system ensures reliable plugin management while providing users with a smooth experience and developers with robust deployment options.