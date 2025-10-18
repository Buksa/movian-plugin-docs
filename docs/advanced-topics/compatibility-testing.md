# Compatibility Testing Guide

## Overview

This comprehensive guide provides developers with the tools, procedures, and best practices for ensuring Movian plugin compatibility across different versions, platforms, and configurations. Compatibility testing is essential for creating plugins that work reliably for all users.

## Understanding Compatibility Requirements

### Movian Version Compatibility

Movian plugins must be compatible with different versions of the Movian media center:

**API Version Compatibility:**
- API Version 1: Legacy (deprecated)
- API Version 2: Current stable
- API Version 3: Future (in development)

**Version Support Strategy:**
- **Backward Compatibility**: Support older Movian versions when possible
- **Forward Compatibility**: Prepare for future API changes
- **Graceful Degradation**: Provide fallbacks for missing features

### Platform Compatibility

Movian runs on multiple platforms, each with specific considerations:

**Supported Platforms:**
- **Desktop**: Windows, macOS, Linux
- **Mobile**: Android, iOS
- **TV/Set-top boxes**: Android TV, Apple TV
- **Embedded**: Raspberry Pi, other ARM devices

**Platform-Specific Considerations:**
- Screen sizes and resolutions
- Input methods (keyboard, remote, touch)
- Performance capabilities
- Network connectivity
- Storage limitations

## Compatibility Testing Framework

### 1. Version Compatibility Testing

**API Version Detection:**
```javascript
var CompatibilityChecker = {
  // Detect current API version
  detectApiVersion: function() {
    // Check for API version in plugin environment
    if (typeof PLUGIN_INFO !== 'undefined' && PLUGIN_INFO.apiversion) {
      return PLUGIN_INFO.apiversion;
    }
    
    // Fallback detection based on available features
    if (typeof page !== 'undefined' && page.appendItem) {
      if (page.appendPassiveItem) {
        return 2; // API v2 has passive items
      }
      return 1; // API v1
    }
    
    return 0; // Unknown or no API
  },
  
  // Check if specific API features are available
  checkFeatureSupport: function() {
    var features = {
      apiVersion: this.detectApiVersion(),
      httpService: typeof http !== 'undefined',
      pageService: typeof page !== 'undefined',
      serviceCreation: typeof service !== 'undefined',
      settings: typeof settings !== 'undefined',
      notifications: typeof notifications !== 'undefined'
    };
    
    // Check for specific methods
    if (features.httpService) {
      features.httpRequest = typeof http.request === 'function';
      features.httpPost = typeof http.post === 'function';
    }
    
    if (features.pageService) {
      features.appendItem = typeof page.appendItem === 'function';
      features.appendPassiveItem = typeof page.appendPassiveItem === 'function';
      features.loading = 'loading' in page;
    }
    
    return features;
  },
  
  // Get compatibility report
  getCompatibilityReport: function() {
    var features = this.checkFeatureSupport();
    var report = {
      compatible: true,
      apiVersion: features.apiVersion,
      warnings: [],
      errors: [],
      recommendations: []
    };
    
    // Check minimum requirements
    if (features.apiVersion < 2) {
      report.warnings.push('API version ' + features.apiVersion + ' is deprecated');
      report.recommendations.push('Update plugin to use API version 2');
    }
    
    if (!features.httpService) {
      report.errors.push('HTTP service not available');
      report.compatible = false;
    }
    
    if (!features.pageService) {
      report.errors.push('Page service not available');
      report.compatible = false;
    }
    
    // Check for deprecated features
    if (features.apiVersion === 1) {
      report.warnings.push('Using deprecated API version 1');
      report.recommendations.push('Migrate to API version 2 for better compatibility');
    }
    
    return report;
  }
};
```

**Version-Specific Code Handling:**
```javascript
var VersionHandler = {
  // Handle different API versions
  appendItem: function(url, type, metadata) {
    var features = CompatibilityChecker.checkFeatureSupport();
    
    if (features.apiVersion >= 2 && page.appendItem) {
      // Use modern API
      return page.appendItem(url, type, metadata);
    } else if (features.apiVersion === 1) {
      // Use legacy API with fallback
      return this.appendItemLegacy(url, type, metadata);
    } else {
      throw new Error('Unsupported API version: ' + features.apiVersion);
    }
  },
  
  appendItemLegacy: function(url, type, metadata) {
    // Legacy implementation for API v1
    console.warn('Using legacy appendItem implementation');
    
    // Simplified metadata for older versions
    var simplifiedMetadata = {
      title: metadata.title || 'Unknown',
      icon: metadata.icon || null
    };
    
    return page.appendItem(url, type, simplifiedMetadata);
  },
  
  // Handle HTTP requests across versions
  makeHttpRequest: function(url, options) {
    var features = CompatibilityChecker.checkFeatureSupport();
    
    if (!features.httpService) {
      throw new Error('HTTP service not available');
    }
    
    // Use available HTTP method
    if (features.httpRequest) {
      return http.request(url, options);
    } else {
      // Fallback for older versions
      return this.httpRequestFallback(url, options);
    }
  },
  
  httpRequestFallback: function(url, options) {
    console.warn('Using HTTP request fallback');
    
    // Simplified request for older versions
    try {
      return http.request(url);
    } catch (error) {
      console.error('HTTP request failed:', error);
      throw error;
    }
  }
};
```

### 2. Platform Compatibility Testing

**Platform Detection:**
```javascript
var PlatformDetector = {
  // Detect current platform
  detectPlatform: function() {
    var platform = {
      type: 'unknown',
      os: 'unknown',
      version: 'unknown',
      capabilities: {}
    };
    
    // Check for platform-specific indicators
    if (typeof navigator !== 'undefined') {
      var userAgent = navigator.userAgent || '';
      
      if (userAgent.includes('Android')) {
        platform.type = 'mobile';
        platform.os = 'android';
      } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        platform.type = 'mobile';
        platform.os = 'ios';
      } else if (userAgent.includes('Windows')) {
        platform.type = 'desktop';
        platform.os = 'windows';
      } else if (userAgent.includes('Mac')) {
        platform.type = 'desktop';
        platform.os = 'macos';
      } else if (userAgent.includes('Linux')) {
        platform.type = 'desktop';
        platform.os = 'linux';
      }
    }
    
    // Detect capabilities
    platform.capabilities = this.detectCapabilities();
    
    return platform;
  },
  
  // Detect platform capabilities
  detectCapabilities: function() {
    var capabilities = {
      touchScreen: false,
      keyboard: true,
      mouse: true,
      remoteControl: false,
      highDPI: false,
      networkConnectivity: true
    };
    
    // Touch screen detection
    if (typeof window !== 'undefined') {
      capabilities.touchScreen = 'ontouchstart' in window || 
                                navigator.maxTouchPoints > 0;
    }
    
    // High DPI detection
    if (typeof window !== 'undefined' && window.devicePixelRatio) {
      capabilities.highDPI = window.devicePixelRatio > 1;
    }
    
    // Remote control detection (heuristic)
    var platform = this.detectPlatform();
    if (platform.type === 'tv' || platform.os.includes('tv')) {
      capabilities.remoteControl = true;
      capabilities.keyboard = false;
      capabilities.mouse = false;
    }
    
    return capabilities;
  },
  
  // Get platform-specific recommendations
  getPlatformRecommendations: function() {
    var platform = this.detectPlatform();
    var recommendations = [];
    
    switch (platform.type) {
      case 'mobile':
        recommendations.push('Optimize for touch input');
        recommendations.push('Consider smaller screen sizes');
        recommendations.push('Minimize network usage');
        break;
        
      case 'desktop':
        recommendations.push('Support keyboard shortcuts');
        recommendations.push('Optimize for mouse interaction');
        recommendations.push('Consider high-resolution displays');
        break;
        
      case 'tv':
        recommendations.push('Design for remote control navigation');
        recommendations.push('Use large, readable fonts');
        recommendations.push('Optimize for 10-foot viewing distance');
        break;
    }
    
    return recommendations;
  }
};
```

**Responsive Design Patterns:**
```javascript
var ResponsiveDesign = {
  // Get optimal layout for current platform
  getLayoutConfig: function() {
    var platform = PlatformDetector.detectPlatform();
    var config = {
      itemsPerRow: 4,
      fontSize: 'medium',
      spacing: 'normal',
      navigationStyle: 'mouse'
    };
    
    // Adjust for platform
    switch (platform.type) {
      case 'mobile':
        config.itemsPerRow = 2;
        config.fontSize = 'large';
        config.spacing = 'large';
        config.navigationStyle = 'touch';
        break;
        
      case 'tv':
        config.itemsPerRow = 6;
        config.fontSize = 'large';
        config.spacing = 'large';
        config.navigationStyle = 'remote';
        break;
        
      case 'desktop':
        if (platform.capabilities.highDPI) {
          config.fontSize = 'medium';
          config.itemsPerRow = 5;
        }
        break;
    }
    
    return config;
  },
  
  // Apply responsive styles
  applyResponsiveStyles: function() {
    var config = this.getLayoutConfig();
    var platform = PlatformDetector.detectPlatform();
    
    // Apply platform-specific CSS classes or styles
    if (typeof document !== 'undefined') {
      var body = document.body;
      
      // Remove existing platform classes
      body.className = body.className.replace(/platform-\w+/g, '');
      
      // Add current platform class
      body.className += ' platform-' + platform.type;
      body.className += ' os-' + platform.os;
      
      if (platform.capabilities.touchScreen) {
        body.className += ' touch-enabled';
      }
      
      if (platform.capabilities.highDPI) {
        body.className += ' high-dpi';
      }
    }
    
    return config;
  }
};
```

### 3. Cross-Platform Testing Procedures

**Automated Compatibility Tests:**
```javascript
var CompatibilityTestSuite = {
  tests: [],
  results: [],
  
  // Add compatibility test
  addTest: function(name, testFunction, platforms) {
    this.tests.push({
      name: name,
      fn: testFunction,
      platforms: platforms || ['all'],
      required: true
    });
  },
  
  // Run compatibility tests
  runTests: function() {
    console.log('Running compatibility tests...');
    
    var platform = PlatformDetector.detectPlatform();
    var features = CompatibilityChecker.checkFeatureSupport();
    
    this.results = [];
    
    for (var i = 0; i < this.tests.length; i++) {
      var test = this.tests[i];
      
      // Check if test applies to current platform
      if (!this.shouldRunTest(test, platform)) {
        console.log('Skipping test "' + test.name + '" (not applicable to ' + platform.type + ')');
        continue;
      }
      
      try {
        var result = test.fn(platform, features);
        this.results.push({
          name: test.name,
          passed: true,
          result: result,
          platform: platform.type
        });
        console.log('✓ ' + test.name);
      } catch (error) {
        this.results.push({
          name: test.name,
          passed: false,
          error: error.message,
          platform: platform.type
        });
        console.log('✗ ' + test.name + ': ' + error.message);
      }
    }
    
    return this.generateReport();
  },
  
  // Check if test should run on current platform
  shouldRunTest: function(test, platform) {
    if (test.platforms.includes('all')) {
      return true;
    }
    
    return test.platforms.includes(platform.type) || 
           test.platforms.includes(platform.os);
  },
  
  // Generate compatibility report
  generateReport: function() {
    var passed = this.results.filter(function(r) { return r.passed; }).length;
    var failed = this.results.filter(function(r) { return !r.passed; }).length;
    
    var report = {
      totalTests: this.results.length,
      passed: passed,
      failed: failed,
      successRate: (passed / this.results.length) * 100,
      platform: PlatformDetector.detectPlatform(),
      features: CompatibilityChecker.checkFeatureSupport(),
      results: this.results,
      timestamp: new Date().toISOString()
    };
    
    return report;
  }
};

// Define standard compatibility tests
CompatibilityTestSuite.addTest('API Version Support', function(platform, features) {
  if (features.apiVersion < 2) {
    throw new Error('Minimum API version 2 required, found: ' + features.apiVersion);
  }
  return { apiVersion: features.apiVersion, supported: true };
});

CompatibilityTestSuite.addTest('HTTP Service Available', function(platform, features) {
  if (!features.httpService) {
    throw new Error('HTTP service not available');
  }
  return { httpService: true };
});

CompatibilityTestSuite.addTest('Page Service Available', function(platform, features) {
  if (!features.pageService) {
    throw new Error('Page service not available');
  }
  return { pageService: true };
});

CompatibilityTestSuite.addTest('Touch Input Support', function(platform, features) {
  if (platform.type === 'mobile' && !platform.capabilities.touchScreen) {
    throw new Error('Touch screen not detected on mobile platform');
  }
  return { touchSupport: platform.capabilities.touchScreen };
}, ['mobile']);

CompatibilityTestSuite.addTest('Remote Control Support', function(platform, features) {
  if (platform.type === 'tv' && !platform.capabilities.remoteControl) {
    throw new Error('Remote control support not detected on TV platform');
  }
  return { remoteSupport: platform.capabilities.remoteControl };
}, ['tv']);

CompatibilityTestSuite.addTest('Network Connectivity', function(platform, features) {
  // Test basic network connectivity
  try {
    var response = VersionHandler.makeHttpRequest('https://httpbin.org/status/200');
    if (response.status !== 200) {
      throw new Error('Network connectivity test failed');
    }
  } catch (error) {
    throw new Error('Network not available: ' + error.message);
  }
  return { networkConnectivity: true };
});
```

## Version Compatibility Matrix

### API Version Compatibility

| Feature | API v1 | API v2 | API v3 (Future) | Notes |
|---------|--------|--------|-----------------|-------|
| Basic Plugin Loading | ✅ | ✅ | ✅ | Universal support |
| HTTP Requests | ✅ | ✅ | ✅ | Enhanced in v2+ |
| Page Items | ✅ | ✅ | ✅ | More options in v2+ |
| Passive Items | ❌ | ✅ | ✅ | Added in v2 |
| Service Creation | ✅ | ✅ | ✅ | Improved in v2+ |
| Settings API | ✅ | ✅ | ✅ | Enhanced in v2+ |
| Notifications | ❌ | ✅ | ✅ | Added in v2 |
| Advanced UI | ❌ | ✅ | ✅ | v2+ only |

### Platform Compatibility Matrix

| Feature | Desktop | Mobile | TV/STB | Embedded | Notes |
|---------|---------|--------|--------|----------|-------|
| Full Plugin Support | ✅ | ✅ | ✅ | ⚠️ | Limited on some embedded |
| HTTP Requests | ✅ | ✅ | ✅ | ✅ | Universal |
| Complex UI | ✅ | ⚠️ | ✅ | ⚠️ | Adapt for small screens |
| High-Res Graphics | ✅ | ✅ | ✅ | ❌ | Memory limitations |
| Background Processing | ✅ | ⚠️ | ✅ | ⚠️ | Power/performance limits |
| Local Storage | ✅ | ✅ | ✅ | ⚠️ | Storage limitations |

**Legend:**
- ✅ Full Support
- ⚠️ Limited/Conditional Support  
- ❌ Not Supported

## Migration Guidelines

### Upgrading from API v1 to v2

**Step 1: Update Plugin Configuration**
```json
{
  "apiversion": 2,  // Update from 1 to 2
  "type": "ecmascript",
  "id": "my-plugin",
  "file": "main.js",
  "version": "2.0.0"  // Increment version
}
```

**Step 2: Update Code for New Features**
```javascript
// Old API v1 approach
function addItem(title, url) {
  page.appendItem(url, 'video', {
    title: title
  });
}

// New API v2 approach with enhanced features
function addItem(title, url, metadata) {
  page.appendItem(url, 'video', {
    title: title,
    description: metadata.description,
    icon: metadata.poster,
    year: metadata.year,
    genre: metadata.genre
  });
}
```

**Step 3: Handle Backward Compatibility**
```javascript
function addItemCompatible(title, url, metadata) {
  var features = CompatibilityChecker.checkFeatureSupport();
  
  if (features.apiVersion >= 2) {
    // Use enhanced API v2 features
    page.appendItem(url, 'video', {
      title: title,
      description: metadata.description || '',
      icon: metadata.poster || null,
      year: metadata.year || null,
      genre: metadata.genre || null
    });
  } else {
    // Fallback to basic API v1
    page.appendItem(url, 'video', {
      title: title
    });
  }
}
```

### Cross-Platform Migration

**Responsive UI Patterns:**
```javascript
// Platform-aware item rendering
function renderItems(items) {
  var layout = ResponsiveDesign.getLayoutConfig();
  var platform = PlatformDetector.detectPlatform();
  
  items.forEach(function(item, index) {
    // Adjust item presentation based on platform
    var itemMetadata = {
      title: item.title,
      description: platform.type === 'mobile' ? 
        item.shortDescription : item.fullDescription,
      icon: platform.capabilities.highDPI ? 
        item.iconHD : item.icon
    };
    
    page.appendItem(item.url, 'video', itemMetadata);
    
    // Add row breaks for grid layout
    if ((index + 1) % layout.itemsPerRow === 0) {
      // Platform-specific row handling
    }
  });
}
```

## Testing Automation

### Automated Test Runner

```javascript
var AutomatedTester = {
  testSuites: [],
  
  // Add test suite
  addTestSuite: function(suite) {
    this.testSuites.push(suite);
  },
  
  // Run all test suites
  runAllTests: function() {
    console.log('Starting automated compatibility testing...');
    
    var allResults = [];
    
    for (var i = 0; i < this.testSuites.length; i++) {
      var suite = this.testSuites[i];
      console.log('\nRunning test suite: ' + suite.name);
      
      var results = suite.runTests();
      allResults.push({
        suite: suite.name,
        results: results
      });
    }
    
    return this.generateCombinedReport(allResults);
  },
  
  // Generate combined test report
  generateCombinedReport: function(allResults) {
    var totalTests = 0;
    var totalPassed = 0;
    var totalFailed = 0;
    
    allResults.forEach(function(suiteResult) {
      totalTests += suiteResult.results.totalTests;
      totalPassed += suiteResult.results.passed;
      totalFailed += suiteResult.results.failed;
    });
    
    var report = {
      summary: {
        totalTests: totalTests,
        totalPassed: totalPassed,
        totalFailed: totalFailed,
        successRate: (totalPassed / totalTests) * 100
      },
      platform: PlatformDetector.detectPlatform(),
      compatibility: CompatibilityChecker.getCompatibilityReport(),
      suiteResults: allResults,
      timestamp: new Date().toISOString()
    };
    
    this.printReport(report);
    return report;
  },
  
  // Print formatted report
  printReport: function(report) {
    console.log('\n=== Compatibility Test Report ===');
    console.log('Platform: ' + report.platform.type + ' (' + report.platform.os + ')');
    console.log('API Version: ' + report.compatibility.apiVersion);
    console.log('Overall Compatibility: ' + (report.compatibility.compatible ? 'PASS' : 'FAIL'));
    
    console.log('\nTest Summary:');
    console.log('Total Tests: ' + report.summary.totalTests);
    console.log('Passed: ' + report.summary.totalPassed);
    console.log('Failed: ' + report.summary.totalFailed);
    console.log('Success Rate: ' + report.summary.successRate.toFixed(1) + '%');
    
    if (report.compatibility.warnings.length > 0) {
      console.log('\nWarnings:');
      report.compatibility.warnings.forEach(function(warning) {
        console.log('⚠ ' + warning);
      });
    }
    
    if (report.compatibility.errors.length > 0) {
      console.log('\nErrors:');
      report.compatibility.errors.forEach(function(error) {
        console.log('❌ ' + error);
      });
    }
    
    if (report.compatibility.recommendations.length > 0) {
      console.log('\nRecommendations:');
      report.compatibility.recommendations.forEach(function(rec) {
        console.log('💡 ' + rec);
      });
    }
  }
};

// Add the compatibility test suite
AutomatedTester.addTestSuite(CompatibilityTestSuite);
```

This compatibility testing guide provides comprehensive tools and procedures for ensuring your Movian plugins work reliably across all supported platforms and versions. Regular compatibility testing helps maintain a high-quality user experience for all users.