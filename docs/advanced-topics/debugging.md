# Plugin Debugging Guide

## Overview

This comprehensive debugging guide provides developers with the tools, techniques, and knowledge needed to effectively troubleshoot Movian plugins. Whether you're dealing with runtime errors, performance issues, or unexpected behavior, this guide will help you identify and resolve problems quickly.

## Common Plugin Errors and Solutions

### 1. Plugin Loading Errors

#### Error: "Plugin failed to load"
**Symptoms:** Plugin doesn't appear in Movian's plugin list
**Common Causes:**
- Invalid `plugin.json` syntax
- Missing required files
- Incorrect file paths

**Solutions:**
```javascript
// Check plugin.json syntax
{
  "type": "ecmascript",
  "apiversion": 2,
  "id": "my-plugin",
  "file": "main.js",  // Ensure this file exists
  "version": "1.0.0",
  "author": "Your Name",
  "title": "My Plugin"
}
```

**Debugging Steps:**
1. Validate JSON syntax using online validators
2. Verify all referenced files exist
3. Check file permissions
4. Review Movian logs for specific error messages

#### Error: "API version mismatch"
**Symptoms:** Plugin loads but functions don't work
**Solution:** Update `apiversion` in plugin.json to match your Movian version

### 2. JavaScript Runtime Errors

#### Error: "ReferenceError: [variable] is not defined"
**Common Causes:**
- Typos in variable names
- Missing imports
- Scope issues

**Debugging Technique:**
```javascript
// Add debug logging
function debugLog(message, data) {
  console.log('[DEBUG] ' + message, data || '');
}

// Use throughout your code
debugLog('Starting plugin initialization');
debugLog('API response:', response);
```

#### Error: "TypeError: Cannot read property of undefined"
**Solution:** Always check object properties before accessing
```javascript
// Bad
var title = item.metadata.title;

// Good
var title = item && item.metadata && item.metadata.title || 'Unknown';

// Better with helper function
function safeGet(obj, path, defaultValue) {
  return path.split('.').reduce((current, key) => 
    current && current[key] !== undefined ? current[key] : defaultValue, obj);
}
var title = safeGet(item, 'metadata.title', 'Unknown');
```

### 3. HTTP Request Issues

#### Error: "Network request failed"
**Debugging Steps:**
```javascript
function debugHttpRequest(url, options) {
  console.log('Making request to:', url);
  console.log('Request options:', JSON.stringify(options, null, 2));
  
  try {
    var response = http.request(url, options);
    console.log('Response status:', response.status);
    console.log('Response headers:', JSON.stringify(response.headers, null, 2));
    return response;
  } catch (error) {
    console.log('Request failed:', error.message);
    throw error;
  }
}
```

#### Error: "CORS policy violation"
**Solution:** Use Movian's proxy capabilities
```javascript
// Instead of direct request
var response = http.request('https://api.example.com/data');

// Use through Movian's proxy
var response = http.request('https://api.example.com/data', {
  headers: {
    'User-Agent': 'Movian Plugin'
  }
});
```

### 4. UI and View File Errors

#### Error: "View file syntax error"
**Common Issues:**
- Unclosed tags
- Invalid property names
- Missing required attributes

**Debugging Tools:**
```javascript
// View file validator function
function validateViewFile(viewContent) {
  var errors = [];
  
  // Check for unclosed tags
  var openTags = viewContent.match(/<[^\/][^>]*>/g) || [];
  var closeTags = viewContent.match(/<\/[^>]*>/g) || [];
  
  if (openTags.length !== closeTags.length) {
    errors.push('Mismatched opening/closing tags');
  }
  
  // Check for required attributes
  if (viewContent.includes('<container') && !viewContent.includes('orientation=')) {
    errors.push('Container missing orientation attribute');
  }
  
  return errors;
}
```

## Debugging Tools and Techniques

### 1. Console Logging

**Basic Logging:**
```javascript
// Different log levels
console.log('Info message');
console.warn('Warning message');
console.error('Error message');

// Structured logging
function log(level, component, message, data) {
  var timestamp = new Date().toISOString();
  var logMessage = '[' + timestamp + '] [' + level + '] [' + component + '] ' + message;
  
  if (data) {
    console.log(logMessage, JSON.stringify(data, null, 2));
  } else {
    console.log(logMessage);
  }
}

// Usage
log('INFO', 'HTTP', 'Making API request', { url: apiUrl, method: 'GET' });
log('ERROR', 'PARSER', 'Failed to parse response', { error: error.message });
```

**Advanced Logging with Stack Traces:**
```javascript
function debugTrace(message) {
  try {
    throw new Error();
  } catch (e) {
    console.log(message + '\nStack trace:', e.stack);
  }
}
```

### 2. Error Handling Patterns

**Comprehensive Error Handling:**
```javascript
function safeApiCall(url, options, callback) {
  try {
    var response = http.request(url, options);
    
    if (response.status >= 200 && response.status < 300) {
      try {
        var data = JSON.parse(response.body);
        callback(null, data);
      } catch (parseError) {
        callback(new Error('Failed to parse JSON: ' + parseError.message));
      }
    } else {
      callback(new Error('HTTP ' + response.status + ': ' + response.statusText));
    }
  } catch (networkError) {
    callback(new Error('Network error: ' + networkError.message));
  }
}

// Usage
safeApiCall('https://api.example.com/data', {}, function(error, data) {
  if (error) {
    console.error('API call failed:', error.message);
    // Handle error appropriately
    return;
  }
  
  // Process successful response
  processData(data);
});
```

### 3. Plugin State Debugging

**State Inspection Tools:**
```javascript
var PluginDebugger = {
  state: {},
  
  setState: function(key, value) {
    this.state[key] = value;
    this.logState('State updated: ' + key);
  },
  
  getState: function(key) {
    return this.state[key];
  },
  
  logState: function(message) {
    console.log(message || 'Current state:', JSON.stringify(this.state, null, 2));
  },
  
  clearState: function() {
    this.state = {};
    console.log('State cleared');
  }
};

// Usage throughout your plugin
PluginDebugger.setState('currentPage', 'search');
PluginDebugger.setState('searchQuery', query);
PluginDebugger.logState('Before API call');
```

### 4. Performance Debugging

**Timing Functions:**
```javascript
var PerformanceTracker = {
  timers: {},
  
  start: function(name) {
    this.timers[name] = Date.now();
  },
  
  end: function(name) {
    if (this.timers[name]) {
      var duration = Date.now() - this.timers[name];
      console.log('Timer [' + name + ']: ' + duration + 'ms');
      delete this.timers[name];
      return duration;
    }
  },
  
  measure: function(name, fn) {
    this.start(name);
    var result = fn();
    this.end(name);
    return result;
  }
};

// Usage
PerformanceTracker.start('api-call');
var response = http.request(url);
PerformanceTracker.end('api-call');

// Or with measure
var data = PerformanceTracker.measure('data-processing', function() {
  return processLargeDataSet(rawData);
});
```

## Testing Framework

### Unit Testing for Plugins

**Basic Test Structure:**
```javascript
// test-framework.js
var TestFramework = {
  tests: [],
  results: { passed: 0, failed: 0, errors: [] },
  
  test: function(name, testFunction) {
    this.tests.push({ name: name, fn: testFunction });
  },
  
  assert: function(condition, message) {
    if (!condition) {
      throw new Error('Assertion failed: ' + (message || 'No message provided'));
    }
  },
  
  assertEqual: function(actual, expected, message) {
    if (actual !== expected) {
      throw new Error('Expected ' + expected + ' but got ' + actual + 
                     (message ? ': ' + message : ''));
    }
  },
  
  run: function() {
    console.log('Running ' + this.tests.length + ' tests...');
    
    for (var i = 0; i < this.tests.length; i++) {
      var test = this.tests[i];
      try {
        test.fn();
        this.results.passed++;
        console.log('✓ ' + test.name);
      } catch (error) {
        this.results.failed++;
        this.results.errors.push({ test: test.name, error: error.message });
        console.log('✗ ' + test.name + ': ' + error.message);
      }
    }
    
    this.printResults();
  },
  
  printResults: function() {
    console.log('\nTest Results:');
    console.log('Passed: ' + this.results.passed);
    console.log('Failed: ' + this.results.failed);
    
    if (this.results.errors.length > 0) {
      console.log('\nFailures:');
      for (var i = 0; i < this.results.errors.length; i++) {
        var error = this.results.errors[i];
        console.log('- ' + error.test + ': ' + error.error);
      }
    }
  }
};
```

**Example Plugin Tests:**
```javascript
// plugin-tests.js
TestFramework.test('Plugin configuration is valid', function() {
  TestFramework.assert(typeof PLUGIN_INFO === 'object', 'PLUGIN_INFO should be defined');
  TestFramework.assert(PLUGIN_INFO.id, 'Plugin should have an ID');
  TestFramework.assert(PLUGIN_INFO.version, 'Plugin should have a version');
});

TestFramework.test('HTTP helper functions work correctly', function() {
  // Mock HTTP response for testing
  var mockResponse = { status: 200, body: '{"test": "data"}' };
  
  // Test JSON parsing
  var parsed = JSON.parse(mockResponse.body);
  TestFramework.assertEqual(parsed.test, 'data', 'JSON parsing should work');
});

TestFramework.test('URL building functions work correctly', function() {
  function buildApiUrl(endpoint, params) {
    var url = 'https://api.example.com/' + endpoint;
    if (params) {
      var queryString = Object.keys(params).map(function(key) {
        return key + '=' + encodeURIComponent(params[key]);
      }).join('&');
      url += '?' + queryString;
    }
    return url;
  }
  
  var url = buildApiUrl('search', { q: 'test query', limit: 10 });
  var expected = 'https://api.example.com/search?q=test%20query&limit=10';
  TestFramework.assertEqual(url, expected, 'URL building should handle parameters correctly');
});

// Run tests
TestFramework.run();
```

## Plugin Validation Tools

### Configuration Validator

```javascript
// plugin-validator.js
var PluginValidator = {
  validatePluginJson: function(pluginJson) {
    var errors = [];
    var warnings = [];
    
    // Required fields
    var required = ['type', 'apiversion', 'id', 'file', 'version', 'author', 'title'];
    for (var i = 0; i < required.length; i++) {
      var field = required[i];
      if (!pluginJson[field]) {
        errors.push('Missing required field: ' + field);
      }
    }
    
    // Type validation
    if (pluginJson.type && pluginJson.type !== 'ecmascript') {
      warnings.push('Only ecmascript type is fully supported');
    }
    
    // API version validation
    if (pluginJson.apiversion && pluginJson.apiversion < 2) {
      warnings.push('API version ' + pluginJson.apiversion + ' is deprecated');
    }
    
    // ID validation
    if (pluginJson.id && !/^[a-z0-9-]+$/.test(pluginJson.id)) {
      errors.push('Plugin ID should only contain lowercase letters, numbers, and hyphens');
    }
    
    // Version validation
    if (pluginJson.version && !/^\d+\.\d+\.\d+$/.test(pluginJson.version)) {
      warnings.push('Version should follow semantic versioning (x.y.z)');
    }
    
    return { errors: errors, warnings: warnings };
  },
  
  validatePluginStructure: function(pluginFiles) {
    var errors = [];
    var warnings = [];
    
    // Check for main file
    if (!pluginFiles.includes('plugin.json')) {
      errors.push('Missing plugin.json file');
    }
    
    // Check for main script file
    var hasMainFile = pluginFiles.some(function(file) {
      return file.endsWith('.js');
    });
    
    if (!hasMainFile) {
      errors.push('No JavaScript files found');
    }
    
    // Check for icon
    var hasIcon = pluginFiles.some(function(file) {
      return /\.(png|jpg|jpeg|gif|svg)$/i.test(file);
    });
    
    if (!hasIcon) {
      warnings.push('No icon file found - consider adding one for better user experience');
    }
    
    return { errors: errors, warnings: warnings };
  }
};
```

## Troubleshooting Checklist

### Before You Start Debugging

1. **Check Movian Version Compatibility**
   - Verify your plugin's API version matches Movian
   - Check for deprecated functions or methods

2. **Review Recent Changes**
   - What was the last working version?
   - What changes were made since then?

3. **Check External Dependencies**
   - Are external APIs accessible?
   - Have API endpoints or formats changed?

### Step-by-Step Debugging Process

1. **Reproduce the Issue**
   - Can you consistently reproduce the problem?
   - Under what conditions does it occur?

2. **Check Logs**
   - Enable debug logging in your plugin
   - Review Movian's system logs

3. **Isolate the Problem**
   - Comment out sections of code to narrow down the issue
   - Test individual functions in isolation

4. **Test with Minimal Code**
   - Create a minimal reproduction case
   - Remove unnecessary complexity

5. **Verify Assumptions**
   - Check that variables contain expected values
   - Verify API responses match expectations

### Common Debugging Scenarios

#### Scenario 1: Plugin Loads but Doesn't Function
**Steps:**
1. Check console for JavaScript errors
2. Verify API calls are working
3. Test individual functions
4. Check event handlers and callbacks

#### Scenario 2: Intermittent Failures
**Steps:**
1. Add extensive logging
2. Check for race conditions
3. Verify error handling
4. Test under different network conditions

#### Scenario 3: Performance Issues
**Steps:**
1. Profile function execution times
2. Check for memory leaks
3. Optimize API calls
4. Review data processing efficiency

## Best Practices for Debuggable Code

### 1. Defensive Programming
```javascript
function safeFunction(param) {
  // Validate inputs
  if (!param || typeof param !== 'object') {
    console.warn('Invalid parameter passed to safeFunction:', param);
    return null;
  }
  
  // Process with error handling
  try {
    return processParameter(param);
  } catch (error) {
    console.error('Error in safeFunction:', error.message);
    return null;
  }
}
```

### 2. Meaningful Error Messages
```javascript
// Bad
throw new Error('Error');

// Good
throw new Error('Failed to parse API response: expected JSON but received ' + typeof response);
```

### 3. Consistent Logging
```javascript
var Logger = {
  debug: function(component, message, data) {
    if (DEBUG_MODE) {
      console.log('[DEBUG][' + component + '] ' + message, data || '');
    }
  },
  
  info: function(component, message, data) {
    console.log('[INFO][' + component + '] ' + message, data || '');
  },
  
  error: function(component, message, error) {
    console.error('[ERROR][' + component + '] ' + message, error || '');
  }
};
```

This debugging guide provides the foundation for effective plugin troubleshooting and development. Use these tools and techniques to build more reliable and maintainable Movian plugins.