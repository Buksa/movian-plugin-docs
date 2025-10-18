# Plugin Packaging and Distribution

This guide covers the complete process of packaging and distributing Movian plugins, from preparation to publication.

## Overview

Plugin packaging involves creating a distributable format that includes all necessary files, proper metadata, and validation checks. The distribution system ensures plugins can be easily installed and updated by users.

## Plugin Package Structure

A properly packaged Movian plugin should follow this structure:

```
my-plugin/
├── plugin.json          # Plugin metadata and configuration
├── main.js             # Main plugin entry point
├── icon.png            # Plugin icon (recommended 256x256)
├── README.md           # Plugin documentation
├── LICENSE             # License file
├── assets/             # Static assets (images, fonts, etc.)
│   ├── images/
│   └── fonts/
├── views/              # UI view files (if applicable)
│   ├── main.view
│   └── settings.view
└── lib/                # Additional JavaScript modules
    ├── utils.js
    └── api-client.js
```

## Plugin Metadata Validation

### Required plugin.json Fields

```json
{
  "type": "ecmascript",
  "apiversion": 2,
  "id": "com.example.myplugin",
  "file": "main.js",
  "showtimeVersion": "5.0",
  "version": "1.0.0",
  "author": "Your Name",
  "title": "My Plugin",
  "synopsis": "Short description",
  "description": "Detailed description of plugin functionality",
  "category": "video",
  "icon": "icon.png"
}
```

### Optional Fields

```json
{
  "homepage": "https://github.com/username/my-plugin",
  "downloadURL": "https://github.com/username/my-plugin/releases/latest",
  "control": {
    "uriprefixes": ["myplugin:"]
  },
  "dependencies": {
    "plugins": ["com.example.otherplugin"]
  }
}
```

## Packaging Process

### 1. Pre-packaging Validation

Before packaging, ensure your plugin meets these requirements:

- All required files are present
- plugin.json is valid JSON with required fields
- Main entry point file exists and is syntactically correct
- Icon file exists and is in supported format (PNG, JPG)
- No sensitive information (API keys, passwords) in source code

### 2. File Preparation

```bash
# Remove development files
rm -rf node_modules/
rm -rf .git/
rm -rf test/
rm package-lock.json

# Ensure proper file permissions
chmod 644 *.js *.json *.md
chmod 755 directories/
```

### 3. Archive Creation

Create a ZIP archive containing all plugin files:

```bash
# Create plugin archive
zip -r my-plugin-v1.0.0.zip my-plugin/

# Verify archive contents
unzip -l my-plugin-v1.0.0.zip
```

## Distribution Formats

### ZIP Archive (Recommended)

The standard distribution format for Movian plugins:

- **Extension**: `.zip`
- **Compression**: Standard ZIP compression
- **Structure**: Single root directory containing all plugin files
- **Naming**: `plugin-name-vX.Y.Z.zip`

### Directory Installation

For development and testing:

- Copy plugin directory to Movian plugins folder
- Ensure proper file permissions
- Restart Movian to load plugin

## Installation Mechanisms

### Manual Installation

Users can install plugins by:

1. Downloading the plugin ZIP file
2. Extracting to Movian plugins directory
3. Restarting Movian

### Plugin Manager Integration

For automated installation:

```javascript
// Plugin installation API
var installer = require('movian/plugin-installer');

installer.install({
  url: 'https://example.com/my-plugin-v1.0.0.zip',
  checksum: 'sha256:abc123...',
  signature: 'digital-signature-here'
});
```

## Distribution Validation

### Package Integrity Checks

```javascript
// Validate package structure
function validatePackage(packagePath) {
  const checks = [
    validatePluginJson,
    validateMainFile,
    validateIcon,
    validateFileStructure,
    validateDependencies
  ];
  
  return checks.every(check => check(packagePath));
}

// Validate plugin.json
function validatePluginJson(packagePath) {
  const pluginJsonPath = path.join(packagePath, 'plugin.json');
  
  if (!fs.existsSync(pluginJsonPath)) {
    throw new Error('plugin.json not found');
  }
  
  const pluginJson = JSON.parse(fs.readFileSync(pluginJsonPath));
  
  // Required fields validation
  const requiredFields = ['type', 'apiversion', 'id', 'file', 'version', 'title'];
  for (const field of requiredFields) {
    if (!pluginJson[field]) {
      throw new Error(`Required field '${field}' missing from plugin.json`);
    }
  }
  
  return true;
}
```

### Security Validation

```javascript
// Security checks
function validateSecurity(packagePath) {
  const securityChecks = [
    checkForMaliciousCode,
    validatePermissions,
    checkDependencies,
    scanForVulnerabilities
  ];
  
  return securityChecks.every(check => check(packagePath));
}

function checkForMaliciousCode(packagePath) {
  // Scan for potentially dangerous patterns
  const dangerousPatterns = [
    /eval\s*\(/,
    /Function\s*\(/,
    /require\s*\(\s*['"]child_process['"]\s*\)/,
    /require\s*\(\s*['"]fs['"]\s*\)/
  ];
  
  // Scan all JavaScript files
  const jsFiles = glob.sync('**/*.js', { cwd: packagePath });
  
  for (const file of jsFiles) {
    const content = fs.readFileSync(path.join(packagePath, file), 'utf8');
    
    for (const pattern of dangerousPatterns) {
      if (pattern.test(content)) {
        console.warn(`Potentially dangerous code found in ${file}`);
        return false;
      }
    }
  }
  
  return true;
}
```

## Update Mechanisms

### Version Checking

```javascript
// Check for plugin updates
function checkForUpdates(pluginId) {
  const currentVersion = getInstalledVersion(pluginId);
  const latestVersion = fetchLatestVersion(pluginId);
  
  if (semver.gt(latestVersion, currentVersion)) {
    return {
      updateAvailable: true,
      currentVersion,
      latestVersion,
      downloadUrl: getDownloadUrl(pluginId, latestVersion)
    };
  }
  
  return { updateAvailable: false };
}
```

### Automatic Updates

```javascript
// Automatic update system
class PluginUpdater {
  constructor() {
    this.updateInterval = 24 * 60 * 60 * 1000; // 24 hours
    this.autoUpdateEnabled = true;
  }
  
  async checkAllPlugins() {
    const installedPlugins = getInstalledPlugins();
    
    for (const plugin of installedPlugins) {
      try {
        const updateInfo = await checkForUpdates(plugin.id);
        
        if (updateInfo.updateAvailable && this.autoUpdateEnabled) {
          await this.updatePlugin(plugin.id, updateInfo);
        }
      } catch (error) {
        console.error(`Update check failed for ${plugin.id}:`, error);
      }
    }
  }
  
  async updatePlugin(pluginId, updateInfo) {
    // Download new version
    const packagePath = await downloadPackage(updateInfo.downloadUrl);
    
    // Validate package
    if (!validatePackage(packagePath)) {
      throw new Error('Package validation failed');
    }
    
    // Backup current version
    await backupPlugin(pluginId);
    
    // Install new version
    await installPlugin(packagePath);
    
    // Verify installation
    if (!verifyInstallation(pluginId, updateInfo.latestVersion)) {
      await restorePlugin(pluginId);
      throw new Error('Installation verification failed');
    }
  }
}
```

## Best Practices

### Package Optimization

1. **Minimize Package Size**
   - Remove unnecessary files
   - Compress images appropriately
   - Use minified JavaScript when appropriate

2. **File Organization**
   - Use clear directory structure
   - Group related files together
   - Include comprehensive README

3. **Metadata Completeness**
   - Provide detailed descriptions
   - Include proper categorization
   - Specify accurate version requirements

### Distribution Security

1. **Code Signing**
   - Sign packages with digital certificates
   - Verify signatures during installation
   - Maintain certificate security

2. **Checksum Verification**
   - Provide SHA-256 checksums
   - Verify integrity during download
   - Detect tampering attempts

3. **Dependency Management**
   - Specify exact dependency versions
   - Validate dependency integrity
   - Handle dependency conflicts

## Troubleshooting

### Common Packaging Issues

1. **Invalid plugin.json**
   - Syntax errors in JSON
   - Missing required fields
   - Incorrect field types

2. **Missing Files**
   - Main entry point not found
   - Referenced assets missing
   - Icon file not included

3. **Permission Issues**
   - Incorrect file permissions
   - Directory access problems
   - Security restrictions

### Distribution Problems

1. **Download Failures**
   - Network connectivity issues
   - Server unavailability
   - Corrupted downloads

2. **Installation Errors**
   - Insufficient disk space
   - Permission denied
   - Dependency conflicts

3. **Update Issues**
   - Version conflicts
   - Backup failures
   - Rollback problems

## Examples

### Complete Packaging Script

```bash
#!/bin/bash

PLUGIN_NAME="my-plugin"
VERSION="1.0.0"
BUILD_DIR="build"
DIST_DIR="dist"

# Clean previous builds
rm -rf $BUILD_DIR $DIST_DIR
mkdir -p $BUILD_DIR $DIST_DIR

# Copy plugin files
cp -r src/* $BUILD_DIR/
cp plugin.json $BUILD_DIR/
cp README.md $BUILD_DIR/
cp LICENSE $BUILD_DIR/
cp icon.png $BUILD_DIR/

# Validate plugin
node validate-plugin.js $BUILD_DIR

# Create distribution archive
cd $BUILD_DIR
zip -r ../$DIST_DIR/$PLUGIN_NAME-v$VERSION.zip .
cd ..

# Generate checksums
sha256sum $DIST_DIR/$PLUGIN_NAME-v$VERSION.zip > $DIST_DIR/$PLUGIN_NAME-v$VERSION.zip.sha256

echo "Package created: $DIST_DIR/$PLUGIN_NAME-v$VERSION.zip"
```

This comprehensive packaging and distribution system ensures plugins are properly prepared, validated, and distributed to users while maintaining security and reliability standards.