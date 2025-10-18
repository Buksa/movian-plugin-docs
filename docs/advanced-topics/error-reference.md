# Error Message Reference and Troubleshooting Guide

## Overview

This comprehensive reference guide catalogs common error messages encountered during Movian plugin development, their causes, and step-by-step solutions. Use this guide to quickly identify and resolve issues in your plugins.

## Plugin Loading Errors

### PLG001: "Plugin failed to load: Invalid plugin.json"

**Error Message:** `Plugin failed to load: Invalid plugin.json`

**Cause:** The plugin.json file contains syntax errors or invalid JSON structure.

**Solutions:**
1. **Validate JSON Syntax**
   ```bash
   # Use online JSON validator or command line tool
   cat plugin.json | python -m json.tool
   ```

2. **Check Common JSON Issues**
   ```json
   {
     "type": "ecmascript",
     "apiversion": 2,
     "id": "my-plugin",
     "file": "main.js",
     "version": "1.0.0",
     "author": "Your Name",
     "title": "My Plugin"
     // Remove trailing commas
     // Ensure all strings are quoted
     // Check for missing commas between properties
   }
   ```

3. **Verify Required Fields**
   - Ensure all mandatory fields are present
   - Check field names for typos

**Prevention:**
- Use a JSON validator in your development workflow
- Use consistent formatting and indentation

---

### PLG002: "Plugin failed to load: Main file not found"

**Error Message:** `Plugin failed to load: Main file not found: main.js`

**Cause:** The file specified in the "file" property of plugin.json doesn't exist.

**Solutions:**
1. **Check File Path**
   ```json
   {
     "file": "main.js"  // Ensure this file exists in plugin directory
   }
   ```

2. **Verify File Name Case**
   - File names are case-sensitive on some systems
   - Ensure exact match between plugin.json and actual file name

3. **Check File Permissions**
   - Ensure the file is readable
   - Verify file isn't corrupted

**Prevention:**
- Use relative paths in plugin.json
- Maintain consistent file naming conventions

---

### PLG003: "Plugin failed to load: API version mismatch"

**Error Message:** `Plugin failed to load: API version 1 not supported`

**Cause:** The plugin uses an outdated or unsupported API version.

**Solutions:**
1. **Update API Version**
   ```json
   {
     "apiversion": 2  // Use current supported version
   }
   ```

2. **Check Movian Version Compatibility**
   - Verify your Movian version supports the API version
   - Update Movian if necessary

3. **Review API Changes**
   - Check for deprecated functions
   - Update code to use current API methods

**Prevention:**
- Always use the latest stable API version
- Keep Movian updated

---

## JavaScript Runtime Errors

### JS001: "ReferenceError: [variable] is not defined"

**Error Message:** `ReferenceError: myVariable is not defined`

**Cause:** Attempting to use a variable that hasn't been declared or is out of scope.

**Solutions:**
1. **Check Variable Declaration**
   ```javascript
   // Bad
   console.log(myVariable);  // ReferenceError
   
   // Good
   var myVariable = "Hello";
   console.log(myVariable);
   ```

2. **Check Scope Issues**
   ```javascript
   function myFunction() {
     var localVar = "local";
   }
   
   // Bad - localVar is not accessible here
   console.log(localVar);  // ReferenceError
   
   // Good - declare in appropriate scope
   var globalVar = "global";
   console.log(globalVar);
   ```

3. **Check for Typos**
   - Verify variable names are spelled correctly
   - Check for case sensitivity issues

**Prevention:**
- Always declare variables before use
- Use consistent naming conventions
- Consider using strict mode: `"use strict";`

---

### JS002: "TypeError: Cannot read property 'X' of undefined"

**Error Message:** `TypeError: Cannot read property 'title' of undefined`

**Cause:** Attempting to access a property of an undefined or null object.

**Solutions:**
1. **Add Null Checks**
   ```javascript
   // Bad
   var title = item.metadata.title;  // Error if item or metadata is undefined
   
   // Good
   var title = item && item.metadata && item.metadata.title || 'Unknown';
   
   // Better with helper function
   function safeGet(obj, path, defaultValue) {
     return path.split('.').reduce((current, key) => 
       current && current[key] !== undefined ? current[key] : defaultValue, obj);
   }
   var title = safeGet(item, 'metadata.title', 'Unknown');
   ```

2. **Validate API Responses**
   ```javascript
   var response = http.request(url);
   if (response && response.body) {
     try {
       var data = JSON.parse(response.body);
       if (data && data.results) {
         // Process data safely
       }
     } catch (error) {
       console.error('Failed to parse response:', error);
     }
   }
   ```

**Prevention:**
- Always validate object existence before property access
- Use defensive programming techniques
- Implement proper error handling

---

### JS003: "TypeError: [function] is not a function"

**Error Message:** `TypeError: myFunction is not a function`

**Cause:** Attempting to call something that isn't a function.

**Solutions:**
1. **Check Function Definition**
   ```javascript
   // Bad - function not defined
   myFunction();  // TypeError
   
   // Good - define function first
   function myFunction() {
     console.log("Hello");
   }
   myFunction();
   ```

2. **Check Object Method Calls**
   ```javascript
   // Bad - method doesn't exist
   var obj = { name: "test" };
   obj.getName();  // TypeError
   
   // Good - define method
   var obj = {
     name: "test",
     getName: function() {
       return this.name;
     }
   };
   obj.getName();
   ```

3. **Verify API Method Names**
   ```javascript
   // Check Movian API documentation for correct method names
   page.appendItem();  // Correct
   page.addItem();     // May not exist - check docs
   ```

**Prevention:**
- Verify function names and spelling
- Check API documentation for correct method signatures
- Use typeof checks when uncertain

---

## HTTP and Network Errors

### NET001: "Network request failed"

**Error Message:** `Network request failed: Connection timeout`

**Cause:** Network connectivity issues or server problems.

**Solutions:**
1. **Add Timeout Handling**
   ```javascript
   function makeRequestWithRetry(url, maxRetries) {
     var retries = 0;
     
     function attempt() {
       try {
         var response = http.request(url, {
           timeout: 10000  // 10 second timeout
         });
         return response;
       } catch (error) {
         retries++;
         if (retries < maxRetries) {
           console.log('Request failed, retrying... (' + retries + '/' + maxRetries + ')');
           return attempt();
         } else {
           throw error;
         }
       }
     }
     
     return attempt();
   }
   ```

2. **Check Network Connectivity**
   ```javascript
   function testConnectivity() {
     try {
       var response = http.request('https://www.google.com', { timeout: 5000 });
       return response.status === 200;
     } catch (error) {
       return false;
     }
   }
   
   if (!testConnectivity()) {
     console.error('No internet connection available');
     return;
   }
   ```

**Prevention:**
- Always implement timeout handling
- Add retry logic for critical requests
- Provide user feedback for network issues

---

### NET002: "HTTP 403 Forbidden"

**Error Message:** `HTTP 403 Forbidden`

**Cause:** Server denying access due to authentication or authorization issues.

**Solutions:**
1. **Check API Keys and Authentication**
   ```javascript
   var response = http.request(url, {
     headers: {
       'Authorization': 'Bearer ' + apiKey,
       'User-Agent': 'Movian Plugin/1.0'
     }
   });
   ```

2. **Verify Request Headers**
   ```javascript
   var response = http.request(url, {
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
       'Referer': 'https://example.com'
     }
   });
   ```

3. **Check Rate Limiting**
   ```javascript
   var lastRequestTime = 0;
   var minInterval = 1000; // 1 second between requests
   
   function rateLimitedRequest(url) {
     var now = Date.now();
     var timeSinceLastRequest = now - lastRequestTime;
     
     if (timeSinceLastRequest < minInterval) {
       // Wait before making request
       var waitTime = minInterval - timeSinceLastRequest;
       // Note: Movian doesn't have setTimeout, so implement delay differently
     }
     
     lastRequestTime = Date.now();
     return http.request(url);
   }
   ```

**Prevention:**
- Store and manage API credentials securely
- Implement proper rate limiting
- Follow API provider guidelines

---

### NET003: "HTTP 404 Not Found"

**Error Message:** `HTTP 404 Not Found`

**Cause:** Requested resource doesn't exist or URL is incorrect.

**Solutions:**
1. **Validate URLs Before Requests**
   ```javascript
   function validateUrl(url) {
     try {
       // Basic URL validation
       if (!url || typeof url !== 'string') {
         return false;
       }
       
       if (!url.startsWith('http://') && !url.startsWith('https://')) {
         return false;
       }
       
       return true;
     } catch (error) {
       return false;
     }
   }
   
   if (!validateUrl(apiUrl)) {
     console.error('Invalid URL:', apiUrl);
     return;
   }
   ```

2. **Handle Missing Resources Gracefully**
   ```javascript
   function fetchWithFallback(primaryUrl, fallbackUrl) {
     try {
       var response = http.request(primaryUrl);
       if (response.status === 404 && fallbackUrl) {
         console.log('Primary resource not found, trying fallback');
         return http.request(fallbackUrl);
       }
       return response;
     } catch (error) {
       if (fallbackUrl) {
         return http.request(fallbackUrl);
       }
       throw error;
     }
   }
   ```

**Prevention:**
- Validate URLs before making requests
- Implement fallback mechanisms
- Keep API endpoint documentation updated

---

## UI and View File Errors

### UI001: "View file syntax error"

**Error Message:** `View file syntax error: Unexpected token at line 15`

**Cause:** Invalid XML/view file syntax.

**Solutions:**
1. **Check XML Structure**
   ```xml
   <!-- Bad - unclosed tag -->
   <container orientation="vertical">
     <text>Hello World</text>
   <!-- Missing </container> -->
   
   <!-- Good - properly closed -->
   <container orientation="vertical">
     <text>Hello World</text>
   </container>
   ```

2. **Validate Attributes**
   ```xml
   <!-- Bad - invalid attribute -->
   <container direction="vertical">
   
   <!-- Good - correct attribute -->
   <container orientation="vertical">
   ```

3. **Check Special Characters**
   ```xml
   <!-- Bad - unescaped characters -->
   <text>Price: $5 & up</text>
   
   <!-- Good - escaped characters -->
   <text>Price: $5 &amp; up</text>
   ```

**Prevention:**
- Use XML validation tools
- Follow view file syntax guidelines
- Test view files in isolation

---

### UI002: "Widget property not supported"

**Error Message:** `Widget property 'invalidProp' not supported for container`

**Cause:** Using invalid or unsupported properties on UI widgets.

**Solutions:**
1. **Check Widget Documentation**
   ```xml
   <!-- Check supported properties for each widget type -->
   <container orientation="vertical" spacing="10">
     <text color="white" size="16">Valid properties</text>
   </container>
   ```

2. **Remove Invalid Properties**
   ```xml
   <!-- Bad - invalid property -->
   <text invalidProperty="value">Text</text>
   
   <!-- Good - valid properties only -->
   <text color="white" size="16">Text</text>
   ```

**Prevention:**
- Refer to widget property documentation
- Use code completion tools if available
- Test widgets individually

---

## Data and Storage Errors

### DATA001: "JSON parse error"

**Error Message:** `JSON parse error: Unexpected token at position 15`

**Cause:** Invalid JSON format in API responses or stored data.

**Solutions:**
1. **Validate JSON Before Parsing**
   ```javascript
   function safeJsonParse(jsonString, defaultValue) {
     try {
       return JSON.parse(jsonString);
     } catch (error) {
       console.error('JSON parse error:', error.message);
       console.error('Invalid JSON:', jsonString);
       return defaultValue || null;
     }
   }
   
   var data = safeJsonParse(response.body, {});
   ```

2. **Handle Malformed Responses**
   ```javascript
   function processApiResponse(response) {
     if (!response || !response.body) {
       console.error('Empty response received');
       return null;
     }
     
     // Check if response looks like JSON
     var body = response.body.trim();
     if (!body.startsWith('{') && !body.startsWith('[')) {
       console.error('Response doesn\'t appear to be JSON:', body.substring(0, 100));
       return null;
     }
     
     return safeJsonParse(body);
   }
   ```

**Prevention:**
- Always validate JSON before parsing
- Log raw responses for debugging
- Handle different response formats

---

## Performance and Memory Errors

### PERF001: "Memory usage warning"

**Error Message:** `Memory usage warning: Plugin consuming excessive memory`

**Cause:** Memory leaks or inefficient memory usage in plugin code.

**Solutions:**
1. **Clean Up Resources**
   ```javascript
   var cache = {};
   var maxCacheSize = 100;
   
   function addToCache(key, value) {
     // Prevent unlimited cache growth
     if (Object.keys(cache).length >= maxCacheSize) {
       // Remove oldest entries
       var keys = Object.keys(cache);
       delete cache[keys[0]];
     }
     
     cache[key] = value;
   }
   
   function clearCache() {
     cache = {};
   }
   ```

2. **Avoid Circular References**
   ```javascript
   // Bad - creates circular reference
   var obj1 = {};
   var obj2 = {};
   obj1.ref = obj2;
   obj2.ref = obj1;  // Circular reference
   
   // Good - avoid circular references
   var obj1 = { data: "value1" };
   var obj2 = { data: "value2", parentId: "obj1" };
   ```

**Prevention:**
- Monitor memory usage during development
- Clean up unused variables and objects
- Avoid creating unnecessary object references

---

## Debugging Tools and Commands

### Debug Mode Activation

```javascript
// Add to your plugin's main file
var DEBUG_MODE = true;  // Set to false for production

function debug(message, data) {
  if (DEBUG_MODE) {
    console.log('[DEBUG] ' + message, data || '');
  }
}

function debugError(message, error) {
  if (DEBUG_MODE) {
    console.error('[DEBUG ERROR] ' + message, error || '');
  }
}
```

### Error Reporting System

```javascript
var ErrorReporter = {
  errors: [],
  
  report: function(error, context) {
    var errorInfo = {
      timestamp: new Date().toISOString(),
      message: error.message || error,
      context: context || 'Unknown',
      stack: error.stack || 'No stack trace available'
    };
    
    this.errors.push(errorInfo);
    console.error('Error reported:', errorInfo);
    
    // Limit error history
    if (this.errors.length > 50) {
      this.errors.shift();
    }
  },
  
  getErrors: function() {
    return this.errors;
  },
  
  clearErrors: function() {
    this.errors = [];
  }
};

// Usage throughout your plugin
try {
  riskyOperation();
} catch (error) {
  ErrorReporter.report(error, 'riskyOperation');
}
```

### Quick Diagnostic Commands

```javascript
// Add these functions to your plugin for quick diagnostics
function diagnosticInfo() {
  return {
    pluginVersion: PLUGIN_INFO.version,
    apiVersion: PLUGIN_INFO.apiversion,
    timestamp: new Date().toISOString(),
    errors: ErrorReporter.getErrors(),
    cacheSize: Object.keys(cache || {}).length
  };
}

function healthCheck() {
  var health = {
    status: 'OK',
    issues: []
  };
  
  // Check network connectivity
  try {
    http.request('https://www.google.com', { timeout: 5000 });
  } catch (error) {
    health.status = 'WARNING';
    health.issues.push('Network connectivity issue');
  }
  
  // Check memory usage
  if (ErrorReporter.getErrors().length > 10) {
    health.status = 'WARNING';
    health.issues.push('High error count');
  }
  
  return health;
}
```

This error reference guide provides comprehensive solutions for the most common issues encountered in Movian plugin development. Keep this guide handy during development and debugging sessions.