/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/index.js ***!
  \*********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/adapters/xhr.js":
/*!********************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/adapters/xhr.js ***!
  \********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/createError.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/defaults.js");
var Cancel = __webpack_require__(/*! ../cancel/Cancel */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/cancel/Cancel.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener('abort', onCanceled);
      }
    }

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
      var transitional = config.transitional || defaults.transitional;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function(cancel) {
        if (!request) {
          return;
        }
        reject(!cancel || (cancel && cancel.type) ? new Cancel('canceled') : cancel);
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/axios.js":
/*!*************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/axios.js ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/cancel/isCancel.js");
axios.VERSION = (__webpack_require__(/*! ./env/data */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/env/data.js").version);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/cancel/Cancel.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/cancel/Cancel.js ***!
  \*********************************************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/cancel/CancelToken.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/cancel/CancelToken.js ***!
  \**************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;

  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;

  // eslint-disable-next-line func-names
  this.promise.then(function(cancel) {
    if (!token._listeners) return;

    var i;
    var l = token._listeners.length;

    for (i = 0; i < l; i++) {
      token._listeners[i](cancel);
    }
    token._listeners = null;
  });

  // eslint-disable-next-line func-names
  this.promise.then = function(onfulfilled) {
    var _resolve;
    // eslint-disable-next-line func-names
    var promise = new Promise(function(resolve) {
      token.subscribe(resolve);
      _resolve = resolve;
    }).then(onfulfilled);

    promise.cancel = function reject() {
      token.unsubscribe(_resolve);
    };

    return promise;
  };

  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Subscribe to the cancel signal
 */

CancelToken.prototype.subscribe = function subscribe(listener) {
  if (this.reason) {
    listener(this.reason);
    return;
  }

  if (this._listeners) {
    this._listeners.push(listener);
  } else {
    this._listeners = [listener];
  }
};

/**
 * Unsubscribe from the cancel signal
 */

CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
  if (!this._listeners) {
    return;
  }
  var index = this._listeners.indexOf(listener);
  if (index !== -1) {
    this._listeners.splice(index, 1);
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/cancel/isCancel.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/cancel/isCancel.js ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/Axios.js":
/*!******************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/Axios.js ***!
  \******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/mergeConfig.js");
var validator = __webpack_require__(/*! ../helpers/validator */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/validator.js");

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean),
      forcedJSONParsing: validators.transitional(validators.boolean),
      clarifyTimeoutError: validators.transitional(validators.boolean)
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/InterceptorManager.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/InterceptorManager.js ***!
  \*******************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/buildFullPath.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/buildFullPath.js ***!
  \**************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/createError.js":
/*!************************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/createError.js ***!
  \************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/dispatchRequest.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/dispatchRequest.js ***!
  \****************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/defaults.js");
var Cancel = __webpack_require__(/*! ../cancel/Cancel */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/cancel/Cancel.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new Cancel('canceled');
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/enhanceError.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/enhanceError.js ***!
  \*************************************************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/mergeConfig.js":
/*!************************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/mergeConfig.js ***!
  \************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(prop) {
    if (prop in config2) {
      return getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      return getMergedValue(undefined, config1[prop]);
    }
  }

  var mergeMap = {
    'url': valueFromConfig2,
    'method': valueFromConfig2,
    'data': valueFromConfig2,
    'baseURL': defaultToConfig2,
    'transformRequest': defaultToConfig2,
    'transformResponse': defaultToConfig2,
    'paramsSerializer': defaultToConfig2,
    'timeout': defaultToConfig2,
    'timeoutMessage': defaultToConfig2,
    'withCredentials': defaultToConfig2,
    'adapter': defaultToConfig2,
    'responseType': defaultToConfig2,
    'xsrfCookieName': defaultToConfig2,
    'xsrfHeaderName': defaultToConfig2,
    'onUploadProgress': defaultToConfig2,
    'onDownloadProgress': defaultToConfig2,
    'decompress': defaultToConfig2,
    'maxContentLength': defaultToConfig2,
    'maxBodyLength': defaultToConfig2,
    'transport': defaultToConfig2,
    'httpAgent': defaultToConfig2,
    'httpsAgent': defaultToConfig2,
    'cancelToken': defaultToConfig2,
    'socketPath': defaultToConfig2,
    'responseEncoding': defaultToConfig2,
    'validateStatus': mergeDirectKeys
  };

  utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
    var merge = mergeMap[prop] || mergeDeepProperties;
    var configValue = merge(prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });

  return config;
};


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/settle.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/settle.js ***!
  \*******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/transformData.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/transformData.js ***!
  \**************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/utils.js");
var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/defaults.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/defaults.js":
/*!****************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/defaults.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/normalizeHeaderName.js");
var enhanceError = __webpack_require__(/*! ./core/enhanceError */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/core/enhanceError.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional || defaults.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/env/data.js":
/*!****************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/env/data.js ***!
  \****************************************************************************/
/***/ ((module) => {

module.exports = {
  "version": "0.24.0"
};

/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/bind.js":
/*!********************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/bind.js ***!
  \********************************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/buildURL.js":
/*!************************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/buildURL.js ***!
  \************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/combineURLs.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/combineURLs.js ***!
  \***************************************************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/cookies.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/cookies.js ***!
  \***********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*****************************************************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/isAxiosError.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/isAxiosError.js ***!
  \****************************************************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \*******************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***********************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/parseHeaders.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/parseHeaders.js ***!
  \****************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/spread.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/spread.js ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/validator.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/validator.js ***!
  \*************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var VERSION = (__webpack_require__(/*! ../env/data */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/env/data.js").version);

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};

/**
 * Transitional option validator
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')));
    }

    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/utils.js":
/*!*************************************************************************!*\
  !*** ./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/utils.js ***!
  \*************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/lib/helpers/bind.js");

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./src/App.jsx":
/*!*********************!*\
  !*** ./src/App.jsx ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _components_Header__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/Header */ "./src/components/Header/index.jsx");
/* harmony import */ var _components_NavBar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/NavBar */ "./src/components/NavBar/index.jsx");




var App = function App() {
  return /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("div", null, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_components_Header__WEBPACK_IMPORTED_MODULE_1__.Header, null), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), null), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_components_NavBar__WEBPACK_IMPORTED_MODULE_2__.NavBar, null));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);

/***/ }),

/***/ "./src/Routes/index.jsx":
/*!******************************!*\
  !*** ./src/Routes/index.jsx ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Router": () => (/* binding */ Router)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../App */ "./src/App.jsx");
/* harmony import */ var _components_PhotoCardWithQuery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/PhotoCardWithQuery */ "./src/components/PhotoCardWithQuery/index.jsx");
/* harmony import */ var _components_ListOfPhotoCards__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/ListOfPhotoCards */ "./src/components/ListOfPhotoCards/index.jsx");
/* harmony import */ var _pages_Error__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../pages/Error */ "./src/pages/Error/index.jsx");






var Router = function Router() {
  return /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), null, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
    exact: true,
    path: "/",
    element: /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_App__WEBPACK_IMPORTED_MODULE_1__["default"], null)
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
    index: true,
    element: /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_components_ListOfPhotoCards__WEBPACK_IMPORTED_MODULE_3__.ListOfPhotoCards, null)
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
    path: "category/:categoryId",
    element: /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_components_ListOfPhotoCards__WEBPACK_IMPORTED_MODULE_3__.ListOfPhotoCards, null)
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
    path: "photos/:detailId",
    element: /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_components_PhotoCardWithQuery__WEBPACK_IMPORTED_MODULE_2__.PhotoCardWithQuery, null)
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
    path: "*",
    element: /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_pages_Error__WEBPACK_IMPORTED_MODULE_4__["default"], null)
  })));
};

/***/ }),

/***/ "./src/components/Category/index.jsx":
/*!*******************************************!*\
  !*** ./src/components/Category/index.jsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Category": () => (/* binding */ Category)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles */ "./src/components/Category/styles.js");


var DEFAULT_IMAGE = 'https://picsum.photos/200';
var Category = function Category(_ref) {
  var id = _ref.id,
    _ref$cover = _ref.cover,
    cover = _ref$cover === void 0 ? DEFAULT_IMAGE : _ref$cover,
    path = _ref.path,
    _ref$emoji = _ref.emoji,
    emoji = _ref$emoji === void 0 ? '?' : _ref$emoji;
  return /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_styles__WEBPACK_IMPORTED_MODULE_1__.Anchor, {
    to: "/category/".concat(id)
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_styles__WEBPACK_IMPORTED_MODULE_1__.Image, {
    src: cover,
    alt: "Pending",
    onError: function onError(e) {
      e.currentTarget.onerror = null;
      e.currentTarget.src = DEFAULT_IMAGE;
    }
  }), emoji);
};

/***/ }),

/***/ "./src/components/Category/styles.js":
/*!*******************************************!*\
  !*** ./src/components/Category/styles.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Anchor": () => (/* binding */ Anchor),
/* harmony export */   "Image": () => (/* binding */ Image)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/taggedTemplateLiteral */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js");
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());

var _templateObject, _templateObject2;


var Anchor = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()))(_templateObject || (_templateObject = (0,_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\n  display: flex;\n  flex-direction: column;\n  text-align: center;\n  text-decoration: none;\n  width: 75px;\n"])));
var Image = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_templateObject2 || (_templateObject2 = (0,_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\n  border: 1px solid #ddd;\n  box-shadow: 0 10px 14px rgba(0, 0, 0, 0.2);\n  border-radius: 50%;\n  overflow: hidden;\n  object-fit: cover;\n  width: 75px;\n  height: 75px;\n  "])));

/***/ }),

/***/ "./src/components/Header/index.jsx":
/*!*****************************************!*\
  !*** ./src/components/Header/index.jsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Header": () => (/* binding */ Header)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _Logo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Logo */ "./src/components/Logo/index.jsx");
/* harmony import */ var _Logo_styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../Logo/styles */ "./src/components/Logo/styles.js");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles */ "./src/components/Header/styles.js");
/* harmony import */ var _styles_GlobalStyles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../styles/GlobalStyles */ "./src/styles/GlobalStyles.js");





var Header = function Header() {
  return /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_styles__WEBPACK_IMPORTED_MODULE_3__.HeaderStyle, null, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_styles_GlobalStyles__WEBPACK_IMPORTED_MODULE_4__.GlobalStyle, null), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_Logo__WEBPACK_IMPORTED_MODULE_1__.Logo, null), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_Logo_styles__WEBPACK_IMPORTED_MODULE_2__.Octocat, null));
};

/***/ }),

/***/ "./src/components/Header/styles.js":
/*!*****************************************!*\
  !*** ./src/components/Header/styles.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HeaderStyle": () => (/* binding */ HeaderStyle)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/taggedTemplateLiteral */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js");
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());

var _templateObject;

var HeaderStyle = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_templateObject || (_templateObject = (0,_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\n  display: flex;\n  align-items: center;\n  justify-content: space-around;\n"])));

/***/ }),

/***/ "./src/components/ListOfCategories/Loading.jsx":
/*!*****************************************************!*\
  !*** ./src/components/ListOfCategories/Loading.jsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Loading": () => (/* binding */ Loading)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-spinners'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles */ "./src/components/ListOfCategories/styles.js");



var Loading = function Loading() {
  return /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_styles__WEBPACK_IMPORTED_MODULE_1__.LoadingStyle, null, [1, 2, 3, 4, 5, 6].map(function () {
    return /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-spinners'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
      key: Math.random(),
      sizeUnit: "px",
      size: 60,
      color: "#00BFFF"
    });
  }));
};

/***/ }),

/***/ "./src/components/ListOfCategories/index.jsx":
/*!***************************************************!*\
  !*** ./src/components/ListOfCategories/index.jsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ListOfCategories": () => (/* binding */ ListOfCategories)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! axios */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _Category__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../Category */ "./src/components/Category/index.jsx");
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./styles */ "./src/components/ListOfCategories/styles.js");
/* harmony import */ var _Loading__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Loading */ "./src/components/ListOfCategories/Loading.jsx");








var ListOfCategories = function ListOfCategories() {
  var _useState = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())([]),
    _useState2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState, 2),
    categories = _useState2[0],
    setCategories = _useState2[1];
  var _useState3 = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(false),
    _useState4 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState3, 2),
    showFixed = _useState4[0],
    setShowFixed = _useState4[1];
  var renderList = function renderList(fixed) {
    return /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_styles__WEBPACK_IMPORTED_MODULE_6__.List, {
      fixed: fixed
    }, categories.length === 0 ? /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_Loading__WEBPACK_IMPORTED_MODULE_7__.Loading, null) : categories.map(function (category) {
      return /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_styles__WEBPACK_IMPORTED_MODULE_6__.Item, {
        key: category.id
      }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_Category__WEBPACK_IMPORTED_MODULE_5__.Category, {
        id: category.id,
        cover: category.cover,
        emoji: category.emoji,
        path: category.path
      }));
    }));
  };
  Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())( /*#__PURE__*/(0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee() {
    var url;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          url = "".concat("https://photogram-api.oscar-cely.xyz", "/api/v1/categories");
          _context.next = 3;
          return axios__WEBPACK_IMPORTED_MODULE_4___default().get(url).then(function (response) {
            setTimeout(function () {
              var res = response.data.data;
              setCategories(res);
              renderList();
            }, 1500);
          })["catch"](function (error) {
            return error;
          });
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })), []);
  Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(function () {
    var onScroll = function onScroll() {
      var newShowFixed = window.scrollY > 235;
      setShowFixed(newShowFixed);
    };
    document.addEventListener('scroll', onScroll);
    return function () {
      return document.removeEventListener('scroll', onScroll);
    };
  }, [showFixed]);
  return /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), null, renderList(), showFixed && renderList(true));
};

/***/ }),

/***/ "./src/components/ListOfCategories/styles.js":
/*!***************************************************!*\
  !*** ./src/components/ListOfCategories/styles.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Item": () => (/* binding */ Item),
/* harmony export */   "List": () => (/* binding */ List),
/* harmony export */   "LoadingStyle": () => (/* binding */ LoadingStyle)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/taggedTemplateLiteral */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js");
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _styles_animation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../styles/animation */ "./src/styles/animation.js");

var _templateObject, _templateObject2, _templateObject3, _templateObject4;


var List = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_templateObject || (_templateObject = (0,_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\n  display: flex;\n  overflow: scroll;\n  width: 100%;\n  ", "\n  "])), function (props) {
  return props.fixed && Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_templateObject2 || (_templateObject2 = (0,_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["{\n    ", "\n    background: transparent;\n    border-radius: 60px;\n    box-shadow: 0 0 20px rgba(0,0,0,0.3);\n    left: 0;\n    margin: 0 auto;\n    max-width: 600px;\n    padding: 5px;\n    position: fixed;\n    right: 0;\n    top: 43px;\n    transform: scale(.5);\n    z-index: 1;\n  }"])), (0,_styles_animation__WEBPACK_IMPORTED_MODULE_2__.fadeIn)());
});
var Item = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_templateObject3 || (_templateObject3 = (0,_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\n  padding: 0 8px;\n"])));
var LoadingStyle = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_templateObject4 || (_templateObject4 = (0,_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\n  display: flex;\n  justify-content: space-evenly;\n  align-items: start;\n  height: 100%;\n  min-width: 600px;\n  min-height: 100px;\n"])));

/***/ }),

/***/ "./src/components/ListOfPhotoCards/index.jsx":
/*!***************************************************!*\
  !*** ./src/components/ListOfPhotoCards/index.jsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ListOfPhotoCards": () => (/* binding */ ListOfPhotoCards)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! axios */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_4__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _PhotoCard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../PhotoCard */ "./src/components/PhotoCard/index.jsx");
/* harmony import */ var _ListOfCategories__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../ListOfCategories */ "./src/components/ListOfCategories/index.jsx");








var ListOfPhotoCards = function ListOfPhotoCards() {
  var _useState = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())([]),
    _useState2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState, 2),
    photos = _useState2[0],
    setPhotos = _useState2[1];
  var _useParams = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(),
    categoryId = _useParams.categoryId;
  Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())( /*#__PURE__*/(0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee() {
    var uri;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          setPhotos([]);
          uri = "".concat("https://photogram-api.oscar-cely.xyz", "/api/v1/photos?items_per_page=21");
          if (categoryId) {
            uri += "&category_id=".concat(categoryId);
          }
          _context.next = 5;
          return axios__WEBPACK_IMPORTED_MODULE_4___default().get(uri).then(function (response) {
            setPhotos(response.data.data);
          })["catch"](function (error) {
            console.log(error);
          });
        case 5:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })), [categoryId]);
  return /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), null, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_ListOfCategories__WEBPACK_IMPORTED_MODULE_6__.ListOfCategories, null), photos ? /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("ul", null, photos.map(function (photo) {
    return /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("li", {
      key: photo.id
    }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_PhotoCard__WEBPACK_IMPORTED_MODULE_5__.PhotoCard, {
      id: photo.id,
      src: photo.src,
      likes: photo.likes
    }));
  })) : /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("p", null, "Loading..."));
};

/***/ }),

/***/ "./src/components/Logo/Octocat.jsx":
/*!*****************************************!*\
  !*** ./src/components/Logo/Octocat.jsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OctocatSvg": () => (/* binding */ OctocatSvg)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/extends.js");
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());


var OctocatSvg = function OctocatSvg(props) {
  return /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("svg", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    xmlns: "http://www.w3.org/2000/svg",
    xmlnsXlink: "http://www.w3.org/1999/xlink",
    viewBox: "0 0 2000 2000",
    xmlSpace: "preserve",
    width: 248,
    height: 248,
    className: "hide-hand"
    /* eslint-disable-next-line react/jsx-props-no-spreading */
  }, props), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("ellipse", {
    fill: "#5CDFF2",
    cx: 981.8,
    cy: 1755.6,
    rx: 432,
    ry: 110.8
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#46828E",
    className: "main-body-fill",
    d: "M1278.9 1686.1c-8.7-1.9-12.6 5.8-12.6 5.8s-9.7 1.9-17.5-7.8 5.8-26.2-11.7-49.5c-9.9-13.2-25.6-25.7-40.8-34.8l-1.6-.9-1.8-1.1-1.1-.6-1.2-.7-1.1-.6-1.2-.6-1.1-.6-1.2-.6-1.1-.6-1.1-.6-1.2-.6-1-.5-1.3-.6-.8-.4c-.7-.3-1.4-.6-2-.9l-.8-.3-1.3-.5-.8-.3-1.2-.4-.8-.3c-.4-.1-.8-.3-1.1-.4l-.8-.3c-.4-.1-.8-.2-1.1-.3l-.7-.2-1.2-.3-.6-.2-1.7-.4c-2.3-.5-4.5-.8-6.8-.9l-1.9-8.8v.1s-18 8.5-39.3 16.8c-11.3 4.4-23.5 8.9-34.5 12-7.8 2.2-15 3.8-20.7 4.2-2.2.2-4.4.1-6.5-.2-3 .4-6.6.9-10.9 1.3-13.1 1.2-32.7 1.9-61.6.1-14.7-.9-28.2-1.9-39.8-3.4-14.5-1.8-26-4.4-32.5-8.5-1.7-1-3.3-2.4-4.5-4h-1.6c-12.5-.1-25-.9-37.4-2.4-15.5-2.1-27.5-6.3-39.7-16.1v-.1l-1.8 4.9-10.9 30.3-2.9 1-.7.3c-.9.3-1.8.6-2.7 1l-.2.1-3 1.1-.6.2-2.8 1.1-.2.1c-1 .4-2.1.8-3.1 1.3l-.4.2c-1 .4-2 .8-3 1.3h-.1l-3.3 1.5h-.1l-3.3 1.5c-2.2 1.1-4.5 2.2-6.8 3.4-6.9 3.6-13.6 7.8-20 12.3-3.7 2.7-7.3 5.5-10.8 8.6l-.2.2c-1.3 1.1-2.6 2.3-3.8 3.5-1.2 1.2-2.5 2.4-3.7 3.6l-.2.2c-.7.8-1.5 1.5-2.2 2.3l-.1.2-.2.2c-1.2 1.3-2.3 2.6-3.4 3.9l-.1.1c-1.1 1.3-2.2 2.7-3.3 4l-.4.5c-.6.8-1.2 1.6-1.8 2.3l-.3.5c-1.4 1.9-2.7 3.9-4 5.9 0 .1-.1.2-.2.3l-.1.1c-.5.9-1.1 1.7-1.6 2.6-.1.1-.1.2-.2.3l-.3.5c-.5.8-1 1.6-1.4 2.5-.1.1-.2.3-.2.4s-.1.2-.1.3c-1.2 2.1-2.2 4.2-3.3 6.5-.1.2-.2.5-.3.7v.1c-.4.8-.8 1.7-1.2 2.6l-.4 1c-.4.9-.7 1.8-1.1 2.7l-.3.6v.2c-.5 1.2-.9 2.3-1.3 3.6v.1l-.1.2c-.4 1.1-.8 2.2-1.1 3.3-.1.4-.2.7-.3 1.1-.3.9-.5 1.8-.8 2.7-.1.2-.1.4-.2.7s-.1.3-.1.5c-.3 1-.5 2-.8 3 0 .1 0 .2-.1.3 0 .2-.1.3-.1.5l-.9 3.9c0 .3-.1.5-.2.8-.2 1-.4 2.1-.6 3.1-.1.4-.2.9-.2 1.3-.2.9-.3 1.9-.5 2.9 0 .2-.1.5-.1.7l-.1.6c-.2 1.2-.3 2.3-.5 3.5v.7c-.2 1.4-.3 2.8-.4 4.2l-.1.7v.5c-.1 1-.2 2.1-.2 3.2v1.5c-.1 1-.1 2.1-.1 3.2v1.4c0 1.5-.1 3-.1 4.6 1 27.2 46.6 50.5 83.5 43.7l3.3-.6 1.1-.2 2.2-.4 1.4-.3 2-.4 1.4-.3 1.9-.4 1.5-.3 1.8-.4 1.5-.3 1.6-.4 1.6-.4 1.5-.4 1.7-.4 1.4-.3 1.8-.4 1.1-.3c5.5-1.4 10.8-2.8 15.6-4.2h-.6l2.5-.7c.6-1.5 1.1-3 1.5-4.6.2 1.3.5 2.7.8 3.9l1.5-.4c0 1.1 0 2.2.1 3.2v.6c0 1 .1 2.1.1 3.1.5 1.5 1 3 1.6 4.4l-1.3.6c0 .5.1 1 .1 1.6V1794.2c0 .3 0 .6.1 1v.5c0 .6.1 1.1.2 1.7v.5c0 .4.1.9.1 1.3v.4c0 .4.1.7.1 1.1v.8c0 .4.1.7.1 1.1v.5c0 .3.1.6.1.9s0 .3.1.5 0 .2 0 .3v.2l.1.6v.3l.1.3c0 .2.1.4.1.6s.1.4.1.6v.1c.1.3.1.7.2 1 0 .1 0 .2.1.3.1.3.2.7.2 1 4.9 18.4 63.1 28.2 90.3 21.4s71.8-50.5 86.4-64.1l1.2-1.2.4-.4c.3-.3.5-.6.8-.9l.5-.5.1-.1c.1-.1.2-.2.2-.3.1-.2.3-.3.4-.5s.3-.4.5-.6l.2-.2c.1-.1.1-.2.2-.2l.3-.4.5-.6c.1-.2.3-.4.4-.6 6.2-9 10.2-21.1 12.4-32v-.1c.2-1 .4-2.1.6-3.1v-.2c.2-1 .3-1.9.5-2.9v-.2c.1-.9.3-1.7.4-2.5 0-.3.1-.7.1-1 .1-.6.2-1.1.2-1.7 0-.3.1-.6.1-.8v-.3c.1-.7.2-1.4.2-2v-.4c.1-.8.2-1.5.2-2.3l1.1.6.4.2.8.4.6.2.8.3.6.2.8.3.7.2.8.3.7.3.9.3.7.3.9.3.8.3.9.3.8.2 1 .3.8.3 1 .3.9.3 1 .3.9.2 1.1.3.9.2 1.1.3 1 .3 1.1.3 1 .2 1.2.3 1 .2 1.2.3 1 .2 1.2.3 1 .2 1.2.3 1 .2 1.3.3 1 .2 1.3.3 1.1.2 1.3.3 1.1.2 1.3.3 1.1.2 1.3.3 1.1.2 1.3.3 1.2.2 1.3.3 1.2.2 1.4.3 1.2.2 1.4.3 1.2.2 1.3.3 1.2.2 1.3.2 1.3.2 1.3.2 1.3.2 1.2.2 1.3.2 1.3.2 1.3.2 1.2.2 1.3.2 1.2.2 1.4.2 1.1.2 1.5.2 1 .2 1.5.2 1 .2 1.5.2 1 .2 1.6.2.8.1 1.7.3.7.1 1.8.3.5.1 2 .3c16.7 2.5 31.1 4.3 38.7 4.8l1 .1 1.3.1c19.4 1 41.7 1.9 65.1-1.9s22.3-15.5 36.9-25.2 13.4-21.1 4.6-23.1zM724.8 1677.3c-.6 1-1.1 1.9-1.7 2.9.1-.1.2-.3.2-.4.5-.8 1-1.6 1.5-2.5zM712.3 1706.7l-.9 3.3c0-.1.1-.2.1-.3.3-1 .6-2 .8-3zM726.8 1674c-.6.9-1.2 1.9-1.8 2.9 0-.1.1-.2.2-.3.5-.9 1-1.7 1.6-2.6zM723 1680.5c-1.3 2.3-2.5 4.7-3.6 7.2.1-.2.2-.5.3-.7 1-2.3 2.1-4.4 3.3-6.5zM716.3 1694.7c-.5 1.2-.9 2.4-1.4 3.6v-.1c.5-1.1 1-2.3 1.4-3.5zM713.5 1702.9c.1-.4.2-.7.3-1.1.4-1.1.7-2.2 1.1-3.3-.9 2.5-1.7 5.1-2.4 7.7.1-.2.1-.4.2-.7.2-.8.5-1.7.8-2.6zM717.8 1691.2l.4-1c.4-.9.8-1.7 1.2-2.6-1 2.2-2 4.5-2.9 6.8l.3-.6c.2-.8.6-1.7 1-2.6zM711.3 1710.5c-.4 1.5-.7 3.1-1.1 4.7 0-.3.1-.5.2-.8l.9-3.9zM1079 1721.1l-1.1-.2 1.1.2zM740.4 1656.3c-1.2 1.3-2.4 2.7-3.6 4 1.1-1.3 2.2-2.6 3.4-3.9l.2-.1z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#46828E",
    className: "main-body-fill",
    d: "M1023.1 1763.2c.2-.2.3-.4.5-.6l-.1.1c-.1.1-.2.3-.4.5zM731 1667.7c-1.4 1.9-2.7 3.9-4 5.9 1.3-2 2.6-3.9 4-5.9zM843.7 1807.2c-.1-.3-.1-.6-.2-1v-.1c0-.2-.1-.4-.1-.6s-.1-.4-.1-.6l-.1-.3v-.3c.3 1.6.5 3 .8 4.1-.1-.3-.2-.6-.2-1-.1 0-.1-.1-.1-.2zM742.8 1653.8c-.7.8-1.5 1.5-2.2 2.3.7-.7 1.4-1.5 2.2-2.3zM1083.8 1722.1l-1.1-.2 1.1.2zM798.6 1789.4l-1.4.3-2.2.4-1.1.2-3.3.6c3.8-.7 7.6-1.5 11.4-2.3l-1.4.3-2 .5zM841.8 1792.3v-.3l.1 1.2v-.4c-.1-.1-.1-.3-.1-.5zM842.5 1799.6c0-.4-.1-.7-.1-1.1v-.4c0-.4-.1-.8-.1-1.3v-.5c0-.5-.1-1.1-.2-1.7v-.5c.2 2.3.4 4.3.6 6.2v-.4c0-.1-.2-.1-.2-.3zM837.5 1779.7l-2.5.7c-4.8 1.4-10.1 2.8-15.6 4.2l-1.1.3-1.8.4-1.4.3-1.7.4-1.5.4-1.6.4-1.6.4-1.5.3-1.8.4-1.5.3c13.2-2.9 25.7-6.3 35.8-9.2-.3-1.3-.6-2.6-.8-3.9-.4 1.5-.9 3.1-1.4 4.6zM841.4 1785.5c0-1-.1-2-.1-3.1v-.4c.1 3 .2 5.8.3 8.4l1.3-.6c-.5-1.3-1-2.8-1.5-4.3zM709.4 1719.7l-.6 3.6c0-.2.1-.5.1-.7.2-1 .3-2 .5-2.9zM843 1803.3c0-.2 0-.3-.1-.5 0 .3.1.6.1.9v-.4zM842.7 1801.5l.1.4c0-.1 0-.2-.1-.4zM707.6 1733.5v-.5l-.3 4.2v-.5c.2-1.1.2-2.2.3-3.2zM1081.4 1721.6l-1.1-.2 1.1.2zM707.2 1741.3c0-1.1.1-2.1.1-3.2-.2 3-.2 6-.2 9.1 0-1.5 0-3.1.1-4.6v-1.3zM1091.3 1723.6l-1.2-.2 1.2.2zM708.7 1723.8c-.2 1.3-.4 2.6-.5 3.9v-.4c.2-1.1.4-2.3.5-3.5zM1088.8 1723.1l-1.2-.2 1.2.2zM1086.3 1722.6l-1.1-.2 1.1.2zM781.5 1625.4c-11 5.8-21.4 12.8-30.8 20.9 3.5-3.1 7.1-5.9 10.8-8.6 6.4-4.5 13-8.6 20-12.3zM707.7 1732.2c.1-1.4.3-2.8.4-4.2-.1 1.4-.2 2.8-.4 4.2zM1051.8 1713.9l-.8-.3.8.3zM1057.2 1715.6l-.9-.3.9.3zM1048.5 1712.8l-.7-.3.7.3zM1050.1 1713.3l-.7-.3.7.3zM1053.5 1714.5l-.8-.2.8.2zM1055.3 1715l-.8-.3.8.3zM709.6 1718.4c.2-1.1.4-2.1.6-3.1-.2 1-.4 2-.6 3.1zM841.3 1781.8c0-1.1 0-2.2-.1-3.2.1 1.1.1 2.2.1 3.2zM1041.2 1709.7c-.1.7-.1 1.5-.2 2.3.1-.9.2-1.6.2-2.3zM1027.9 1756.7c-.1.2-.3.4-.4.7.1-.3.2-.5.4-.7zM1028.8 1755l-.4.6.4-.6zM1042.8 1710.4l-.4-.2.4.2zM1022.3 1764.1l-.4.4.4-.4zM1045.5 1711.6l-.6-.2.6.2zM1076.6 1720.5l-1-.2 1 .2zM1044.1 1711l-.6-.2.6.2zM1046.9 1712.2l-.7-.2.7.2zM1072 1719.5l-1-.2 1 .2zM1069.7 1718.9l-1-.2 1 .2zM1074.3 1720l-1-.2 1 .2zM742.9 1653.7c1.2-1.2 2.5-2.5 3.7-3.6-1.2 1.1-2.4 2.3-3.7 3.6zM731.4 1667.3c.6-.8 1.2-1.6 1.8-2.3-.6.7-1.2 1.5-1.8 2.3zM746.7 1650c1.3-1.2 2.5-2.4 3.8-3.5-1.3 1.1-2.5 2.3-3.8 3.5zM733.5 1664.4c1.1-1.4 2.2-2.7 3.3-4-1.1 1.3-2.2 2.7-3.3 4zM1061.1 1716.7l-.9-.2.9.2zM1063.2 1717.3l-1-.3 1 .3zM1065.3 1717.8l-1-.2 1 .2zM1059.1 1716.2l-.9-.2.9.2zM1067.5 1718.4l-1-.2 1 .2zM1035.5 1739.3c.1-.4.3-.8.4-1.2-.1.3-.2.6-.3.8l-.1.4zM1124.6 1729.5l-1.6-.2 1.6.2zM1122 1729.1l-1.5-.2 1.5.2zM1119.5 1728.7l-1.5-.2 1.5.2zM1127 1729.9l-1.7-.3 1.7.3zM1131.9 1730.6l-2-.3 2 .3zM1117 1728.3l-1.5-.2 1.5.2zM1129.5 1730.3l-1.8-.3 1.8.3zM1040.5 1716.3c0-.4.1-.8.2-1.2 0 .1 0 .2-.1.4 0 .2 0 .5-.1.8zM1109.3 1727l-1.3-.2 1.3.2zM1040.7 1714.6v-.2.2zM1170.7 1735.5c-7.6-.6-22.1-2.3-38.7-4.8 16.7 2.4 31.1 4.2 38.7 4.8zM1114.4 1727.8l-1.4-.2 1.4.2zM1040.8 1714.3c.1-.7.2-1.4.2-2-.1.7-.2 1.4-.2 2zM1111.8 1727.4l-1.3-.2 1.3.2zM1171.8 1735.5l-1-.1 1 .1zM1040.3 1717.7c.1-.4.1-.8.2-1.2 0 .2-.1.4-.1.7s-.1.3-.1.5zM1099 1725.1l-1.2-.2 1.2.2zM1026.9 1758.2c-.2.2-.3.4-.4.7l-.2.3 1.2-1.8-.6.8zM1031.3 1750.2c-.2.5-.4 1-.7 1.4 0 .1-.1.2-.2.3-.2.5-.5.9-.7 1.4l-.3.6-.3.5c.9-1.6 1.7-3.3 2.5-5-.1.2-.1.3-.2.5s-.1.2-.1.3zM1101.6 1725.6l-1.3-.2 1.3.2zM1093.8 1724.1l-1.2-.2 1.2.2zM1035 1740.8c-.1.3-.2.7-.3 1l-.3.8c-.1.3-.2.7-.4 1l-.3.8c-.1.4-.3.7-.4 1.1l-.3.8c0 .1-.1.2-.1.2l-.1.1c.9-2.3 1.8-4.7 2.6-7 0 .1-.1.2-.1.3l-.3.9zM1038.3 1728.8c-.1.3-.2.7-.2 1s-.1.6-.2.9c0 .1-.1.3-.1.4.3-1.1.5-2.1.7-3.2-.1.3-.1.6-.2.9zM1096.4 1724.6l-1.2-.2 1.2.2zM1032.1 1748.5c.2-.3.3-.7.5-1.1l-.3.7c-.1.2-.2.3-.2.4zM1024.2 1761.8c-.1.2-.3.3-.4.5.3-.4.7-.8 1-1.2l-.2.2c0 .1-.2.3-.4.5zM1038.7 1727.1c.1-.4.2-.7.2-1.1-.1.3-.1.6-.2.9v.2zM1039.7 1721.7c0 .3-.1.5-.1.8s-.1.6-.2 1c.2-.9.3-1.8.4-2.6.2-1.3 0 .1 0 .1 0 .1 0 .4-.1.7zM1039.9 1720.7c.1-.6.2-1.1.3-1.7l-.2 1c-.1.2-.1.5-.1.7zM1037.4 1732.5c.1-.3.2-.7.3-1 0 .1 0 .2-.1.3l-.2.7zM1106.7 1726.5l-1.3-.2 1.3.2zM1040.2 1718.5c0-.2.1-.4.1-.7v.3c0 .1-.1.2-.1.4zM1038.6 1727.3v-.2.2zM1025.8 1759.8c-.2.2-.3.4-.5.6l-.3.4c.4-.5.8-1.1 1.2-1.7-.1.3-.2.5-.4.7zM1036.4 1736.2l-.2.8v.1l-.1.3c.3-1 .6-2.1.9-3.1l-.2.7-.4 1.2zM1104.1 1726l-1.3-.2 1.3.2zM1039.2 1724.2c0 .3-.1.6-.2.9s-.1.3-.1.5c.1-.6.2-1.1.3-1.7.1.2.1.2 0 .3zM1049.3 1713.1l-.9-.3.9.3zM1051 1713.6l-.9-.3.9.3zM1085.2 1722.4l-1.3-.3 1.3.3zM1171.8 1735.5zM1087.7 1722.9l-1.3-.3 1.3.3zM1052.7 1714.2l-.9-.3.9.3zM1095.2 1724.4l-1.4-.3 1.4.3zM1041 1711.9v.4-.4zM1040.3 1717.7v.1-.1zM1108 1726.7l-1.3-.2 1.3.2zM1040.7 1714.7v.4-.4zM1092.7 1723.9l-1.4-.3 1.4.3zM1039.9 1720.7zM1090.2 1723.4l-1.3-.3 1.3.3zM1042.3 1710.2l-1.1-.6 1.1.6zM1038.7 1727.1zM1046.3 1711.9l-.8-.3.8.3zM1043.6 1710.8l-.8-.4.8.4zM1044.9 1711.4l-.8-.3.8.3zM1054.5 1714.8l-1-.3 1 .3zM1100.3 1725.3l-1.3-.2 1.3.2zM1073.2 1719.8l-1.2-.3 1.2.3zM1115.5 1728l-1.1-.2 1.1.2zM1120.5 1728.8l-1-.2 1 .2zM1118 1728.4l-1-.2 1 .2zM1070.9 1719.2l-1.2-.3 1.2.3zM1075.5 1720.3l-1.3-.3 1.3.3zM1077.9 1720.8l-1.3-.3 1.3.3zM1110.5 1727.2l-1.2-.2 1.2.2zM1080.3 1721.3l-1.3-.3 1.3.3zM1105.4 1726.3l-1.2-.2 1.2.2zM1102.8 1725.8l-1.3-.2 1.3.2zM1113 1727.6l-1.2-.2 1.2.2zM1123 1729.2l-1-.2 1 .2zM1062.2 1717l-1.1-.3 1.1.3zM1132 1730.6zM1060.2 1716.5l-1.1-.3 1.1.3zM1082.7 1721.9l-1.3-.3 1.3.3zM1170.7 1735.5zM1058.2 1715.9l-1-.3 1 .3zM1056.3 1715.3l-1-.3 1 .3zM1064.3 1717.6l-1.1-.3 1.1.3zM1125.3 1729.6l-.8-.1.8.1zM1097.8 1724.9l-1.3-.3 1.3.3zM1130 1730.3l-.5-.1.5.1zM1066.5 1718.1l-1.2-.3 1.2.3zM1068.7 1718.7l-1.2-.3 1.2.3zM1127.7 1730l-.7-.1.7.1zM1047.8 1712.5l-.8-.3.8.3zM1026.2 1759.2zM1039.3 1724v-.2.2zM1039.3 1724v-.2.2zM1026.2 1759.2zM1038.7 1727.2zM1040.6 1715.4c0-.1 0-.2.1-.4s0-.3 0-.4v-.1c0 .4 0 .7-.1.9zM1039.9 1720.7v.2-.2z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#46828E",
    className: "main-body-fill",
    d: "M1040.3 1718.1v-.4c0-.2.1-.4.1-.6 0 .3-.1.7-.1 1zM750.7 1646.3l-.2.2.2-.2zM802 1788.7l1.8-.4-1.8.4zM839.7 1779l1.5-.4-1.5.4zM707.3 1738.2v-1 1zM842.5 1800.4c0 .3.1.5.1.8v.3c0-.3 0-.7-.1-1.1zM841.7 1790.5c0 .4.1.8.1 1.2v.3c0-.5-.1-1-.1-1.5zM841.3 1781.8zM841.9 1793.9v.3c0-.3 0-.6-.1-1 .1.3.1.5.1.7zM708.2 1728v-.3.3zM1037 1734.3l.4-1.5c0-.1.1-.2.1-.2-.2.5-.4 1.1-.5 1.7zM712.3 1706.7c0-.2.1-.3.1-.5 0 .2 0 .4-.1.5zM716.3 1694.7v-.2.2zM714.9 1698.5l.1-.2c0 .1 0 .1-.1.2zM719.3 1687.7zM711.3 1710.5c0-.2.1-.3.1-.5 0 .2 0 .3-.1.5zM709.6 1718.4c-.1.4-.2.9-.2 1.3.1-.5.2-.9.2-1.3zM708.7 1723.8l.1-.6-.1.6zM710.3 1715.2zM1038.6 1727.4c0 .1-.1.3-.1.4.1-.1.1-.3.1-.4zM1040.1 1719c0-.2 0-.3.1-.5 0 .2 0 .4-.1.5zM1038.9 1726c0-.1 0-.2.1-.4 0 .2 0 .3-.1.4zM1040.5 1716.4v-.1.1zM1027.9 1756.7c.2-.3.4-.7.6-1l-.6 1zM842.8 1802c0 .2 0 .3.1.5l.1.4c-.1-.3-.2-.6-.2-.9zM1037.7 1731.3l.1-.3c0 .2-.1.3-.1.4v-.1zM723 1680.5c0-.1.1-.2.1-.3l-.1.3zM1031.7 1749.4l.4-.9c-.2.3-.3.6-.4.9zM1028.8 1755l.1-.2c.1-.1.1-.3.2-.4l-.3.6zM1022.3 1764.1c.3-.3.5-.6.8-.9-.3.3-.5.6-.8.9zM1021.9 1764.5l-1.2 1.2 1.2-1.2zM843 1803.8c0 .2 0 .3.1.4l-.1-.6v.2zM1040.8 1714.4zM1023.7 1762.5l.2-.2-.2.2zM1024.9 1761l.1-.2c0 .1-.1.2-.1.2zM707.7 1732.2l-.1.7.1-.7zM1035.5 1739.4v-.1c0 .1-.1.3-.1.4l.1-.3zM1039.3 1723.8c0-.2 0-.3.1-.4 0 .1-.1.2-.1.4zM1035.9 1738.1l.2-.6c-.1.1-.2.4-.2.6zM746.6 1650zM727 1673.6c0 .1-.1.2-.2.3.1-.1.2-.2.2-.3zM736.8 1660.4zM733.5 1664.4l-.4.5.4-.5zM740.6 1656.1l-.1.2.1-.2zM731.4 1667.3l-.3.5.3-.5zM742.9 1653.7l-.2.2.2-.2zM1032.5 1747.4l.3-.7-.3.7zM724.8 1677.3l.3-.5-.3.5z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#46828E",
    className: "main-body-fill",
    d: "M1039.7 1721.7c0-.3.1-.5.1-.8-.2 1-.3 1.9-.5 2.9 0-.1 0-.2.1-.4 0-.3.1-.6.2-1s.1-.5.1-.7zM1040.3 1718.1c-.1.8-.2 1.7-.4 2.5 0-.2.1-.4.1-.7l.2-1c0-.2.1-.4.1-.5-.1-.1-.1-.2 0-.3zM1040.4 1717.1c0-.2.1-.4.1-.7v-.1c0-.3.1-.6.1-.9 0 .6-.1 1.1-.2 1.7zM1040.7 1714.6v-.2.2zM1026.2 1759.2l.2-.3c.2-.2.3-.4.4-.7l.6-.9c.1-.2.3-.4.4-.7l.6-1 .4-.6.3-.6.3-.5.3-.6c.2-.5.5-.9.7-1.4.1-.1.1-.2.2-.3.2-.5.4-.9.7-1.4.1-.1.1-.2.2-.3s.2-.3.2-.5.3-.6.4-.9c.1-.1.1-.2.2-.4l.3-.7.3-.8.1-.1c0-.1.1-.2.1-.2l.3-.8c.1-.4.3-.7.4-1.1l.3-.8c.1-.3.3-.7.4-1l.3-.8c.1-.3.2-.7.3-1s.2-.6.3-.8c0-.1 0-.2.1-.3 0-.1.1-.3.1-.4l.1-.4c.1-.3.2-.6.3-.8s.1-.4.2-.6l.1-.3v-.1l.2-.8.3-1.2.2-.7c.2-.6.3-1.2.5-1.8v-.1l.2-.7c0-.1.1-.2.1-.3s.1-.3.1-.4.1-.3.1-.4c.1-.3.1-.6.2-.9s.2-.7.2-1 .1-.6.2-.9c0-.2.1-.3.1-.5v-.2c-2.3 10.9-6.2 22.9-12.5 32zM1039.2 1724.2v-.2c-.2 1-.4 2-.6 3.1v-.1c.1-.3.1-.6.2-.9 0-.1 0-.2.1-.4s.1-.3.1-.5.2-.7.2-1zM1039.3 1723.8z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#494959",
    className: "secondary-body-fill",
    d: "M1181 1735.6c30.7 2 60 3.3 73.3-4s43.3-38 27.3-46-13.5 5.3-30.7 20c-18.6 16-43.9 26.6-69.9 30zM945.7 1824.9c-20 9.3-40 8-66.7 3.3s-53.3-10.7-53.3-22 7.3-19.3 26.7-16.7 42.7 18 54 23.3 23.3 16.1 39.3 12.1zM807 1787.6c-13.3 2.7-31.3 10.7-55.3 6s-59.3-14.7-65.3-28c-.7-14 10.8-16.6 20.7-18.3s31.3 23.6 55.3 31.6c14.4 4.8 29.4 7.7 44.6 8.7z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.3,
    fill: "#091426",
    d: "M1044.7 1610.6c4.3-.4 7.9-.8 10.9-1.3 2.2.3 4.3.4 6.5.2.7 0 1.4-.1 2.2-.2l1.8-.2h.4c1.6-.2 3.2-.5 4.9-.8l1.2-.3 1.1-.2 1.3-.3 1.2-.3 1.2-.3 2.4-.6 3-.8c10.9-3.1 23.2-7.5 34.5-12l2-.8 1.1-.4.6-.3.2-.1.8-.3.7-.3.4-.2 1-.4.9-.4 1.1-.4.8-.3.9-.4.4-.2.6-.2 1.1-.4.7-.3 1-.4.7-.3.1-.1 1.3-.6h.1l.3-.2 1.1-.5.5-.2 1-.4.6-.2.1-.1 1.1-.5.3-.1.2-.1 1-.4c.2-.1.3-.1.5-.2l1.1-.5.4-.2 1-.4.4-.2h.1l.9-.4c7.5-3.3 12.3-5.5 12.3-5.5l1.8 8.2h.2c3.1.1 6.2.6 9.2 1.4 3 .8 5.9 1.8 8.8 3 5.7 2.3 11.3 5 16.6 8.1 10.8 6 20.8 13.2 30 21.5 4.6 4.1 8.9 8.6 12.8 13.4 4 4.7 7.1 10.2 9.2 16.1 1.9 5.9 2.6 12.2 2 18.4-.2 3.1-.5 6.1-.5 9.2s.6 6.1 2.5 8.4l-.3.2c2.1 2.7 4.8 4.9 7.9 6.3-2.1.8-4.2 1.5-6.4 2.1L1209 1705c21-13.8 25.8-32.2 31.8-52.6-.3-.8-.6-1.5-.9-2.2-1.1-2.5-2.4-4.9-4-7.1-1.6-2.3-3.4-4.4-5.3-6.4-3.9-4.3-8.1-8.3-12.5-12-1.1-1-2.2-1.9-3.4-2.8s-2.3-1.9-3.4-2.7l-3.5-2.7c-1.2-.9-2.4-1.7-3.6-2.6-4.8-3.4-9.7-6.7-14.8-9.7-1.2-.8-2.5-1.5-3.8-2.2l-1.9-1.1-1.9-1c-1.3-.7-2.6-1.4-3.9-2s-2.6-1.4-3.9-1.9-2.6-1.2-3.9-1.7c-1.1-.4-2.2-.9-3.2-1.3-9.1-1.3-18.3-1.7-27.5-1.2l-7.7 1.6c-8.9 8.5-16.6 18.1-23 28.5-1.6 2.6-5.5 8-5.5 8s5.7 8.4 7 10.5c12.2 18.9 26.8 33.9 43 49.5s34.9 31.2 57 27c-4.6 3.4-5.6 8.5-4.2 13.6-8.1 2.6-16.4 4.4-24.8 5.5 5.8.4 11.5.7 17 1-8.7-.1-17.1-.5-24.9-.8l-1.3-.1-1-.1c-7.6-.6-22.1-2.3-38.7-4.8l-2-.3-.5-.1-1.8-.3-.7-.1-1.7-.3-.8-.1-1.6-.2-1-.2-1.5-.2-1-.2-1.5-.2-1-.2-1.5-.2-1.1-.2-1.4-.2-1.2-.2-1.3-.2-1.2-.2-1.3-.2-1.3-.2-1.3-.2-1.2-.2-1.3-.2-1.3-.2-1.3-.2-1.3-.2-1.2-.2-1.3-.3-1.2-.2-1.4-.3-1.2-.2-1.4-.3-1.2-.2-1.3-.3-1.2-.2-1.3-.3-1.1-.2-1.3-.3-1.1-.2-1.3-.3-1.1-.2-1.3-.3-1.1-.2-1.3-.3-1-.2-1.3-.3-1-.2-1.2-.3-1-.2-1.2-.3-1-.2-.3-.1-.9-.2-1-.2-1.2-.3-1-.2-1.1-.3-1-.3-1.1-.3-.9-.2-1.1-.3-.9-.2-1-.3-.9-.3-1-.3-.8-.3-1-.3-.8-.2-.9-.3-.8-.3-.9-.3-.7-.3-.9-.3-.7-.3-.8-.3-.7-.2-.8-.3-.6-.2-.8-.3-.6-.2-.8-.4-.4-.2-1.1-.6c-.1.7-.1 1.5-.2 2.3v.4c-.1.7-.2 1.3-.2 2v.3c0 .3-.1.6-.1.8-.1.5-.1 1.1-.2 1.7 0 .3-.1.7-.1 1-.1.8-.2 1.7-.4 2.5v.2c-.2 1-.3 1.9-.5 2.9v.2c-.2 1-.4 2.1-.6 3.1v.1c-2.3 10.9-6.2 23-12.4 32-.1.2-.3.4-.4.6s-.3.4-.5.6l-.3.4c-.1.1-.1.2-.2.2l-.2.2c-.2.2-.3.4-.5.6s-.3.3-.4.5l-.2.3-.1.1c-.2.2-.3.4-.5.5s-.5.6-.8.9l-.4.4-1.2 1.2c-14.6 13.6-59.2 57.3-86.4 64.1-14.4 3.6-37.4 2.6-56.7-1.9l1.4.2c26.7 4.7 46.7 6 66.7-3.3-16 4-28-6.7-39.3-12s-34.7-20.7-54-23.3c-3.2-.5-6.4-.6-9.7-.4-.4-1.2-.9-2.3-1.2-3.6 0-1-.1-2-.1-3.1v-.6c0-1.1 0-2.2-.1-3.2l-1.5.4c-.3-1.3-.6-2.6-.8-3.9-.4 1.6-.9 3.1-1.5 4.6l-2.5.7c-4.8 1.4-10.1 2.8-15.6 4.2l-1.1.3-1.8.4-1.4.3-1.7.4-1.5.4-1.6.4-1.6.4-1.5.3-1.8.4-1.5.3-1.9.4-.9.2c2.1-.5 4.1-1 6-1.4-15.2-.9-30.2-3.9-44.7-8.7-24-8-45.3-33.3-55.3-31.6 0-1.5 0-3 .1-4.5v-1.4c0-1.1.1-2.1.1-3.2v-1.5c.1-1.1.2-2.1.2-3.2v-.5l.1-.7c.1-1.4.3-2.8.4-4.2v-.7c.1-1.2.3-2.3.5-3.5l.1-.6c0-.2.1-.5.1-.7.2-1 .3-1.9.5-2.9.1-.4.2-.9.2-1.3.2-1.1.4-2.1.6-3.1 0-.3.1-.5.2-.8l.9-3.9c0-.2.1-.3.1-.5 0-.1.1-.2.1-.3.3-1 .5-2 .8-3 0-.2.1-.3.1-.5s.1-.4.2-.7c.3-.9.5-1.8.8-2.7.1-.4.2-.7.3-1.1.4-1.1.7-2.2 1.1-3.3l.1-.2v-.1c.4-1.2.9-2.4 1.3-3.6v-.2l.3-.6c.4-.9.7-1.8 1.1-2.7l.4-1c.4-.9.8-1.7 1.2-2.6v-.1c.1-.2.2-.5.3-.7 1-2.2 2.1-4.4 3.3-6.5 0-.1.1-.2.1-.3s.2-.3.2-.4c.5-.8.9-1.7 1.4-2.5l.3-.5c0-.1.1-.2.2-.3.5-.9 1.1-1.8 1.6-2.6l.1-.1c.1-.1.1-.2.2-.3 1.3-2 2.6-4 4-5.9l.3-.5c.6-.8 1.2-1.6 1.8-2.3l.4-.5c1.1-1.4 2.2-2.7 3.3-4l.1-.1c1.1-1.3 2.2-2.6 3.4-3.9l.2-.2.1-.2c.7-.8 1.5-1.5 2.2-2.3l.2-.2c1.2-1.2 2.5-2.5 3.7-3.6 1.3-1.2 2.5-2.4 3.8-3.5l.2-.2c3.5-3.1 7.1-5.9 10.8-8.6 6.4-4.6 13.1-8.7 20-12.3 2.2-1.2 4.5-2.3 6.8-3.4l3.3-1.5h.1l3.3-1.5h.1c1-.4 2-.9 3-1.3l.4-.2c1-.4 2.1-.9 3.1-1.3l.2-.1 2.8-1.1.6-.2 3-1.1.2-.1c.9-.3 1.8-.7 2.7-1l.7-.3 2.9-1 .3-.7h.2c1.2-3.4 2.3-6.7 3.4-10l7-19.5 1.8-4.9c1.5 1.2 3 2.3 4.5 3.4 10.7 7.4 21.6 10.9 35.1 12.7 12.4 1.5 24.9 2.3 37.4 2.4h1.6c1.2 1.6 2.7 3 4.5 4 6.5 4 18 6.6 32.5 8.5.7 2 1.2 3.2 1.1 3.8 0 0 13.5-1.8 34.2 7.5s26.6 34.2 26.6 34.2c-20-28.5-63.3-27.3-79.3-21.3s-23.9 24-23.9 42c0 20.3 17 39.3 31 68s7.8 29.6 20 47c7 10 20.7 12 38.7-4.7 15-13.9 29.5-24.5 36.2-33 5.3-25.7 13.5-72.5-5.3-100.7 8.4-11.8 15.8-12.6 22.1-40zM1049.3 1713.1l-.9-.3.9.3zM1051 1713.6l-.9-.3.9.3zM1085.2 1722.4l-1.3-.3 1.3.3zM1171.8 1735.5zM1087.7 1722.9l-1.3-.3 1.3.3zM1052.7 1714.2l-.9-.3.9.3zM1095.2 1724.4l-1.4-.3 1.4.3zM1041 1711.9v.4-.4zM1040.3 1717.7v.1-.1zM1108 1726.7l-1.3-.2 1.3.2zM1040.7 1714.7v.4-.4zM1092.7 1723.9l-1.4-.3 1.4.3zM1039.9 1720.7zM1090.2 1723.4l-1.3-.3 1.3.3zM1042.3 1710.2l-1.1-.6 1.1.6zM1038.7 1727.1zM1046.3 1711.9l-.8-.3.8.3zM1043.6 1710.8l-.8-.4.8.4zM1044.9 1711.4l-.8-.3.8.3zM1054.5 1714.8l-1-.3 1 .3zM1100.3 1725.3l-1.3-.2 1.3.2zM1073.2 1719.8l-1.2-.3 1.2.3zM1115.5 1728l-1.1-.2 1.1.2zM1120.5 1728.8l-1-.2 1 .2zM1118 1728.4l-1-.2 1 .2zM1070.9 1719.2l-1.2-.3 1.2.3zM1075.5 1720.3l-1.3-.3 1.3.3zM1077.9 1720.8l-1.3-.3 1.3.3zM1110.5 1727.2l-1.2-.2 1.2.2zM1080.3 1721.3l-1.3-.3 1.3.3zM1105.4 1726.3l-1.2-.2 1.2.2zM1102.8 1725.8l-1.3-.2 1.3.2zM1113 1727.6l-1.2-.2 1.2.2zM1123 1729.2l-1-.2 1 .2zM1062.2 1717l-1.1-.3 1.1.3zM1132 1730.6zM1060.2 1716.5l-1.1-.3 1.1.3zM1082.7 1721.9l-1.3-.3 1.3.3zM1170.7 1735.5zM1058.2 1715.9l-1-.3 1 .3zM1056.3 1715.3l-1-.3 1 .3zM1064.3 1717.6l-1.1-.3 1.1.3zM1125.3 1729.6l-.8-.1.8.1zM1097.8 1724.9l-1.3-.3 1.3.3zM1130 1730.3l-.5-.1.5.1zM1066.5 1718.1l-1.2-.3 1.2.3zM1068.7 1718.7l-1.2-.3 1.2.3zM1127.7 1730l-.7-.1.7.1zM1047.8 1712.5l-.8-.3.8.3zM1026.2 1759.2zM1039.3 1724v-.2.2zM1039.3 1724v-.2.2zM1026.2 1759.2zM1038.7 1727.2z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.3,
    fill: "#091426",
    d: "M1040.6 1715.4c0-.1 0-.2.1-.4s0-.3 0-.4v-.1c0 .4 0 .7-.1.9zM1039.9 1720.7v.2-.2zM1040.3 1718.1v-.4c0-.2.1-.4.1-.6 0 .3-.1.7-.1 1zM750.7 1646.3l-.2.2.2-.2zM802 1788.7l1.8-.4-1.8.4zM839.7 1779l1.5-.4-1.5.4zM707.3 1738.2v-1 1zM842.5 1800.4c0 .3.1.5.1.8v.3c0-.3 0-.7-.1-1.1zM841.7 1790.5c0 .4.1.8.1 1.2v.3c0-.5-.1-1-.1-1.5zM841.3 1781.8zM841.9 1793.9v.3c0-.3 0-.6-.1-1 .1.3.1.5.1.7zM708.2 1728v-.3.3zM1037 1734.3l.4-1.5c0-.1.1-.2.1-.2-.2.5-.4 1.1-.5 1.7zM712.3 1706.7c0-.2.1-.3.1-.5 0 .2 0 .4-.1.5zM716.3 1694.7v-.2.2zM714.9 1698.5l.1-.2c0 .1 0 .1-.1.2zM719.3 1687.7zM711.3 1710.5c0-.2.1-.3.1-.5 0 .2 0 .3-.1.5zM709.6 1718.4c-.1.4-.2.9-.2 1.3.1-.5.2-.9.2-1.3zM708.7 1723.8l.1-.6-.1.6zM710.3 1715.2zM1038.6 1727.4c0 .1-.1.3-.1.4.1-.1.1-.3.1-.4zM1040.1 1719c0-.2 0-.3.1-.5 0 .2 0 .4-.1.5zM1038.9 1726c0-.1 0-.2.1-.4 0 .2 0 .3-.1.4zM1040.5 1716.4v-.1.1zM1027.9 1756.7c.2-.3.4-.7.6-1l-.6 1zM842.8 1802c0 .2 0 .3.1.5l.1.4c-.1-.3-.2-.6-.2-.9zM1037.7 1731.3l.1-.3c0 .2-.1.3-.1.4v-.1zM723 1680.5c0-.1.1-.2.1-.3l-.1.3zM1031.7 1749.4l.4-.9c-.2.3-.3.6-.4.9zM1028.8 1755l.1-.2c.1-.1.1-.3.2-.4l-.3.6zM1022.3 1764.1c.3-.3.5-.6.8-.9-.3.3-.5.6-.8.9zM1021.9 1764.5l-1.2 1.2 1.2-1.2zM843 1803.8c0 .2 0 .3.1.4l-.1-.6v.2zM1040.8 1714.4zM1023.7 1762.5l.2-.2-.2.2zM1024.9 1761l.1-.2c0 .1-.1.2-.1.2zM707.7 1732.2l-.1.7.1-.7zM1035.5 1739.4v-.1c0 .1-.1.3-.1.4l.1-.3zM1039.3 1723.8c0-.2 0-.3.1-.4 0 .1-.1.2-.1.4zM1035.9 1738.1l.2-.6c-.1.1-.2.4-.2.6zM746.6 1650zM727 1673.6c0 .1-.1.2-.2.3.1-.1.2-.2.2-.3zM736.8 1660.4zM733.5 1664.4l-.4.5.4-.5zM740.6 1656.1l-.1.2.1-.2zM731.4 1667.3l-.3.5.3-.5zM742.9 1653.7l-.2.2.2-.2zM1032.5 1747.4l.3-.7-.3.7zM724.8 1677.3l.3-.5-.3.5z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.3,
    fill: "#091426",
    d: "M1039.7 1721.7c0-.3.1-.5.1-.8-.2 1-.3 1.9-.5 2.9 0-.1 0-.2.1-.4 0-.3.1-.6.2-1s.1-.5.1-.7zM1040.3 1718.1c-.1.8-.2 1.7-.4 2.5 0-.2.1-.4.1-.7l.2-1c0-.2.1-.4.1-.5-.1-.1-.1-.2 0-.3zM1040.4 1717.1c0-.2.1-.4.1-.7v-.1c0-.3.1-.6.1-.9 0 .6-.1 1.1-.2 1.7zM1040.7 1714.6v-.2.2zM1026.2 1759.2l.2-.3c.2-.2.3-.4.4-.7l.6-.9c.1-.2.3-.4.4-.7l.6-1 .4-.6.3-.6.3-.5.3-.6c.2-.5.5-.9.7-1.4.1-.1.1-.2.2-.3.2-.5.4-.9.7-1.4.1-.1.1-.2.2-.3s.2-.3.2-.5.3-.6.4-.9c.1-.1.1-.2.2-.4l.3-.7.3-.8.1-.1c0-.1.1-.2.1-.2l.3-.8c.1-.4.3-.7.4-1.1l.3-.8c.1-.3.3-.7.4-1l.3-.8c.1-.3.2-.7.3-1s.2-.6.3-.8c0-.1 0-.2.1-.3 0-.1.1-.3.1-.4l.1-.4c.1-.3.2-.6.3-.8s.1-.4.2-.6l.1-.3v-.1l.2-.8.3-1.2.2-.7c.2-.6.3-1.2.5-1.8v-.1l.2-.7c0-.1.1-.2.1-.3s.1-.3.1-.4.1-.3.1-.4c.1-.3.1-.6.2-.9s.2-.7.2-1 .1-.6.2-.9c0-.2.1-.3.1-.5v-.2c-2.3 10.9-6.2 22.9-12.5 32zM1039.2 1724.2v-.2c-.2 1-.4 2-.6 3.1v-.1c.1-.3.1-.6.2-.9 0-.1 0-.2.1-.4s.1-.3.1-.5.2-.7.2-1zM1039.3 1723.8zM1039.3 1723.8zM818.7 1600.6l7-19.5-10.6 29.6h.2c1.1-3.5 2.3-6.8 3.4-10.1z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.04,
    fill: "#FFF",
    d: "M1043.3 1689.4c.6-6.7 1.4-13.4 2.5-20.1.5-3.3 1.1-6.6 1.8-9.9s1.5-6.5 2.4-9.7c1.9-6.4 4.1-12.8 6.2-19.3s4.1-13.1 5.7-19.8l.3-1.2c-2.2.2-4.4.1-6.5-.2-1.3 6.6-3 13-4.8 19.6s-3.8 13-5.4 19.7c-.8 3.3-1.4 6.8-2 10.2s-1 6.8-1.3 10.2c-.7 6.8-1 13.6-1.2 20.4-.1 3.4-.1 6.8-.1 10.2 0 3.4.1 6.8-.1 10.2l.4.1h.4c.8-6.9 1.1-13.7 1.7-20.4zM892.8 1637.2c-1.2.8-2.3 1.7-3.4 2.6-4.7 3.7-9.2 7.7-13.4 12-2.1 2.1-4.2 4.4-6.1 6.7-1.9 2.4-3.6 4.8-5.2 7.4-3.1 5.1-5.8 10.5-8 16.1-4.3 11.2-7.6 22.7-9.8 34.5-4.7 23.5-6 47.6-3.9 71.4l.8-.1c.7-23.6 3.8-47.1 9.3-70.1.7-2.8 1.5-5.7 2.3-8.5s1.5-5.6 2.4-8.4c1.7-5.5 3.6-10.9 5.9-16.1 2.1-5.1 4.7-10.1 7.6-14.8 1.4-2.3 3-4.5 4.7-6.6.8-1 1.7-2 2.6-3 .4-.5 1-1 1.5-1.5l1.5-1.5c3.9-4.1 8.1-7.9 12.5-11.5 1.5-1.2 3-2.3 4.6-3.4l.8.2.2-.9 1.1-.7c.6-.4 1.1-.7 1.7-1.1s1.2-.7 1.7-1c1.1-.6 2.4-1.3 3.6-2 5-2.5 10.2-4.7 15.5-6.3 1.3-.4 2.7-.8 4.1-1.2s2.7-.7 4.1-1c2.8-.7 5.5-1.2 8.3-1.7 5.7-.9 11.4-1.4 17.1-1.5 5.6-.3 11.1.4 16.5 1.8 5.4 1.5 10.6 3.9 15.2 7.2 2.4 1.7 4.6 3.5 6.8 5.5s4.3 4.1 6.2 6.3l.7-.5c-3.4-5-7.4-9.5-11.9-13.4-4.6-4-9.8-7-15.5-9.1-5.7-2-11.7-3.1-17.7-3.2-6-.2-12 0-18 .6-6 .7-11.9 1.8-17.7 3.4-5.8 1.6-11.4 3.7-16.9 6.3-.8.3-1.5.7-2.2 1.1 2.8-10.9 5.5-21.8 8.2-32.7-1.7-1-3.3-2.4-4.5-4h-1.6c-.8 2.8-1.5 5.7-2.3 8.5-3 11.5-6.2 22.8-9.4 34.2zM707.2 1741.3c0-1.1.1-2.1.1-3.2v-1.5c.1-1.1.2-2.1.2-3.2v-.5l.1-.7c.1-1.4.3-2.8.4-4.2v-.7c.1-1.2.3-2.3.5-3.5l.1-.6c0-.2.1-.5.1-.7.2-1 .3-1.9.5-2.9.1-.4.2-.9.2-1.3.2-1.1.4-2.1.6-3.1 0-.3.1-.5.2-.8l.9-3.9c0-.2.1-.3.1-.5 0-.1.1-.2.1-.3.3-1 .5-2 .8-3 0-.2.1-.3.1-.5s.1-.4.2-.7c.3-.9.5-1.8.8-2.7.1-.4.2-.7.3-1.1.4-1.1.7-2.2 1.1-3.3l.1-.2v-.1c.4-1.2.9-2.4 1.3-3.6v-.2l.3-.6c.4-.9.7-1.8 1.1-2.7l.4-1c.4-.9.8-1.7 1.2-2.6v-.1c.1-.2.2-.5.3-.7 1-2.2 2.1-4.4 3.3-6.5 0-.1.1-.2.1-.3s.2-.3.2-.4c.5-.8.9-1.7 1.4-2.5l.3-.5c0-.1.1-.2.2-.3.5-.9 1.1-1.8 1.6-2.6l.1-.1c.1-.1.1-.2.2-.3 1.3-2 2.6-4 4-5.9l.3-.5c.6-.8 1.2-1.6 1.8-2.3l.4-.5c1.1-1.4 2.2-2.7 3.3-4l.1-.1c1.1-1.3 2.2-2.6 3.4-3.9l.2-.2.1-.2c.7-.8 1.5-1.5 2.2-2.3l.2-.2c1.2-1.2 2.5-2.5 3.7-3.6 1.3-1.2 2.5-2.4 3.8-3.5l.2-.2c3.5-3.1 7.1-5.9 10.8-8.6 6.4-4.6 13.1-8.7 20-12.3 2.2-1.2 4.5-2.3 6.8-3.4l3.3-1.5h.1l3.3-1.5h.1c1-.4 2-.9 3-1.3l.4-.2c1-.4 2.1-.9 3.1-1.3l.2-.1 2.8-1.1.6-.2 3-1.1.2-.1c.9-.3 1.8-.7 2.7-1l.7-.3 2.9-1 .3-.7-.4.1h-.1c-14.8 4.8-29 11.2-42.3 19.1-13.5 8-25.6 18.2-35.8 30.1-10.1 12-17.8 25.9-22.7 40.9-2.4 7.4-4.2 15.1-5.3 22.9-1 7.8-1.5 15.6-1.5 23.4h.4c0-1.5 0-3.1.1-4.6.1.3.1-.1.1-.6z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.04,
    fill: "#FFF",
    d: "M709.4 1735.7c.3-1.9.7-3.8 1.1-5.7s.8-3.8 1.2-5.6c1.8-7.4 4.1-14.6 7-21.7 2.7-7 6.1-13.7 10-20 1.9-3.2 4-6.2 6.2-9.2s4.5-5.8 7-8.6c9.9-11 21.4-20.6 34-28.3 12.7-8 26.4-14.3 40.5-20.1 4.1-1 8.3-1.6 12.5-1.8 4.6-.2 9.1 0 13.7.5s9.1 1.4 13.5 2.7c2.2.7 4.4 1.5 6.5 2.5.5.2 1.1.5 1.6.8l1.5.9c.5.3 1 .6 1.5 1l1.5 1 .6-.5c-3.4-3.5-7.5-6.2-12-8.1-4.4-1.9-9.1-3.4-13.8-4.3-4.7-1-9.5-1.5-14.4-1.7-2.4-.1-4.8 0-7.2.1 3.6-10.5 6.9-20.4 10-30.2-1.5-1-3-2.2-4.5-3.4l-1.8 4.9-7 19.5c-1.1 3.3-2.2 6.6-3.4 10h-.2l-.3.7-2.9 1-.7.3c-.9.3-1.8.6-2.7 1l-.2.1-3 1.1-.6.2-2.8 1.1-.2.1c-1 .4-2.1.8-3.1 1.3l-.4.2c-1 .4-2 .8-3 1.3h-.1l-3.3 1.5h-.1l-3.3 1.5c-2.2 1.1-4.5 2.2-6.8 3.4-6.9 3.6-13.6 7.8-20 12.3-3.7 2.7-7.3 5.5-10.8 8.6l-.2.2c-1.3 1.1-2.6 2.3-3.8 3.5-1.2 1.2-2.5 2.4-3.7 3.6l-.2.2c-.7.8-1.5 1.5-2.2 2.3l-.1.2-.2.2c-1.2 1.3-2.3 2.6-3.4 3.9l-.1.1c-1.1 1.3-2.2 2.7-3.3 4l-.4.5c-.6.8-1.2 1.6-1.8 2.3l-.3.5c-1.4 1.9-2.7 3.9-4 5.9 0 .1-.1.2-.2.3l-.1.1c-.5.9-1.1 1.7-1.6 2.6-.1.1-.1.2-.2.3l-.3.5c-.5.8-1 1.6-1.4 2.5-.1.1-.2.3-.2.4s-.1.2-.1.3c-1.1 2.1-2.2 4.3-3.3 6.5-.1.2-.2.5-.3.7v.1c-.4.8-.8 1.7-1.2 2.6l-.4 1c-.4.9-.7 1.8-1.1 2.7l-.3.6v.2c-.5 1.2-.9 2.3-1.3 3.6v.1l-.1.2c-.4 1.1-.8 2.2-1.1 3.3-.1.4-.2.7-.3 1.1-.3.9-.5 1.8-.8 2.7-.1.2-.1.4-.2.7s-.1.3-.1.5c-.3 1-.5 2-.8 3 0 .1 0 .2-.1.3 0 .2-.1.3-.1.5l-.9 3.9c0 .3-.1.5-.2.8-.2 1-.4 2.1-.6 3.1-.1.4-.2.9-.2 1.3-.2.9-.3 1.9-.5 2.9 0 .2-.1.5-.1.7l-.1.6c-.2 1.2-.3 2.3-.5 3.5v.7c-.2 1.4-.3 2.8-.4 4.2l-.1.7v.5c-.1 1-.2 2.1-.2 3.2v1.5c-.1 1-.1 2.1-.1 3.2v1.4c0 1.5-.1 3-.1 4.6h.4c.3-4.3.8-8.2 1.6-12zM963.7 1047l1.5-1.7-1.5 1.7z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#F7EFCD",
    className: "face-fill-color",
    d: "M1299.2 759.5c-4-34.1-22.4-48.2-27.1-60.1-1.2-1.1-2-2.7-2.1-4.4-2-38.3 11.1-122-1-185.6-12.1-63.5-52.3-86.4-70.5-85.4-24.2 1.3-104.4 1-185.1 2s-178-6.5-254.7 18.7c-76.7 25.2-94.9 123.2-84.8 199.9s31.3 90.8 33.3 113c1.3 14.2-23.9 38.5-13.1 87.8 11.1 50.4 112 109.9 241.1 109.9 40.3 0 74.6-29.3 114-31.3 23.4-1.2 49.1 8.4 99.3-6.1 1.4-.4 2.9-.8 4.3-1.3 45-21.6 81.7-48 107.1-74.4 13.7-14.2 23.8-28.6 30.4-42.2 7.3-15.1 10.2-29.3 8.9-40.5z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#A37D76",
    className: "face-accent-fill-color",
    stroke: "#000",
    strokeOpacity: 0.2,
    strokeWidth: 3,
    strokeMiterlimit: 10,
    d: "M1018.3 766.7c.6 8.9 18.8 8 27.9 6.8s19.6-8.1 19.3-11-7.1-12.5-26-10.2-21.2 14.4-21.2 14.4z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("g", {
    fill: "#000D26"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.03,
    d: "M1020.7 764.3c-1.9 1.5-1.4 4.2.5 5.9 1.9 1.6 4.6 2.2 7.3 2.6 12 2.2 25.3 2.8 36.1-2 .3-.1.6-.3.6-.5s-.5-.3-.6-.1c-11.5 8.4-25.6 12-41.1 10.7-4.7-.4-9.9-1.5-12.5-4.7-2.1-2.6-2-6.4.2-8.9 2.1-2.7 5.6-3.2 9.5-3zM1259.8 842.2c12.4-12.9 21.9-26 28.4-38.4-91.5 95.3-150.9 101.3-236.7 109-88.8 8.1-32.3-4-115 6.1-76.9 9.4-174.5-9.1-244.6-86.2.4 4.2 1.1 8.4 2 12.6 11.1 50.4 112 109.9 241.1 109.9 40.3 0 74.6-29.3 114-31.3 24.1-1.2 50.5 9 103.7-7.3 45-21.5 81.7-47.9 107.1-74.4zM1268.9 509.4c-12.1-63.5-52.3-86.4-70.5-85.4-23 1.3-86-34.6-161.1-26.3-5.1.2-69.5 6.7-74.5 7-79.6-.7-111.8 23.8-187.5 48.7-76.7 25.2-111.5 114.6-101.4 191.2 10.1 76.7 31.3 90.8 33.3 113 .1 1.2 0 2.3-.2 3.5.6-3.8 24.9-8.5 28.2-9.2 12.7-2.7 25.6-4.3 38.6-4.8 34.8-1.8 69.8 2.1 103.9 8.9 3.6.7 7.3 1.3 10.9 1.8l2.5 1 4.1.9c.9 0 1.7-.1 2.6-.1-.6-.3-1.3-.7-1.9-1.1 18.1 1.4 35.6-.6 51.4-8.2 35.8-10.3 72.1-24.9 105.2-22.9 49.4 3 49.4 20.2 75.6 14.1 4.1-1 8.4-3.1 12.9-6.1 9.1-3.2 17-9.6 24.4-15.9 2.3-2 4.6-3.9 6.9-6 21.8-13.6 51.5-25.5 97.4-18.5-1.8-38.3 11.3-122.1-.8-185.6z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#46828E",
    className: "main-body-fill",
    d: "M1425 1113c-35.5-14.6-52-27.3-66.9-34.8-.6 7-1.5 14-2.8 20.9-.1.3-.1.7-.2 1-.2.8-.3 1.6-.5 2.4-.2 1.2-.5 2.3-.8 3.5-.2 1-.4 1.9-.7 2.8 0 .1-.1.3-.1.4-.3 1.1-.5 2.1-.8 3.2l-1.2 4.2c-.1.3-.2.6-.3 1-.4 1.3-.8 2.7-1.3 4-.4 1.3-.9 2.6-1.4 3.9l-.3.9c-.5 1.2-.9 2.5-1.4 3.7-.1.2-.2.3-.2.5-.1.2-.2.5-.3.7-.4 1-.8 1.9-1.2 2.8l-.5 1.1c-.3.7-.6 1.3-.9 2l-.2.4-.5 1-.7 1.3c-.3.6-.6 1.1-.9 1.7l-.3.6c-.4.7-.7 1.3-1.1 2l-.1.2-.7 1.2-.2.4c-.3.6-.7 1.1-1 1.7l-.5.8-.8 1.2-.4.6c-.3.4-.6.9-1 1.3l-.1.1c-.6.8-1.2 1.5-1.8 2.3l-.3.3-1.8 2.1c-1.9 2.1-4 4-6.2 5.6-17.5 12.6-50.5-9.7-127.2-66-70.1-51.4-115.8-119.1-141.7-132.6-5.3-8-.6-13.2 5.4-16.9l-.3.1c29.6-7.4 58.5-17.7 86.2-30.5-49.8 14.3-75.3 4.8-98.5 6-39 2-73 31-113 31-128 0-228-59-239-109-10.7-48.8 14.3-72.9 13-87-2-22-23-36-33-112s37-136 113-161 154 41 234 40 147-81.7 171-83c18-1 60 7 72 70s-1 146 1 184c.1 1.7.8 3.3 2.1 4.4 4.7 11.8 22.9 25.8 26.9 59.6 1.3 11.1-1.6 25.1-8.9 40.2 7.7-15.5 10.8-29.8 9.4-41.2-4.5-38.1-27-51-28-64s19-83 17-170-44-129-92-171-138-85-277-83S617.8 388.9 590 443c-37 72-52 126-19 257 25.2 100.2 95.9 212 246 251 46.2 12 101.8 14.1 163 9 3.6-.3 7.2-.6 10.8-1 3.8 3.4-3.3 9.6-9.9 15.7-18.7 12.2-43.3 37.5-75.7 62.1-39.5 29.9-198.1 117.5-237.9 176.7s1 111.7 35.9 147.6c20.9 21.5 48.8 40.2 71.6 53.7l-1.5.7-.5.2-1.2.6-.7.3-1.2.6-.8.3-1.2.6-.8.4-1.3.6-.9.4-1.3.7-.9.5-1.4.7-1 .5-1.5.7-1 .5-1.5.8-1 .5-1.6.8-1 .5-1.6.9-1 .5-1.7 1-.9.5-1.8 1-.8.5-2 1.2-.6.4c-.9.5-1.7 1.1-2.6 1.6l-2.6 1.7c-12.2 8-22.8 17.3-25.1 26.2-5.8 23.3 5.8 38.8 19.4 28.2 24.7 40.2 63 64.4 102.1 71.6-.1.2-.1.3-.2.5l-.4 1c-.1.3-.2.5-.3.8l-.3.8v.1c-.1.2-.2.5-.3.8s-.3.8-.4 1.1c-.1.2-.1.4-.2.6v.1c-.1.3-.2.6-.3.8l-.1.3c0 .1-.1.2-.1.2-.2.4-.3.8-.4 1.2l-.2.4c-.1.3-.2.6-.3.8v.1c0 .1-.1.2-.1.3-.1.3-.2.7-.3 1 0 .1 0 .2-.1.2l-.2.8-.1.3-.3.8v.1c-.1.2-.1.4-.2.7v.2l-.2.7-1 2.7c12.2 9.8 24.2 14 39.7 16.1 12.4 1.5 24.9 2.3 37.4 2.4h1.6c1.2 1.6 2.7 3 4.5 4 6.5 4 18 6.6 32.5 8.5 11.6 1.5 25.2 2.5 39.8 3.4 29 1.8 48.5 1.1 61.6-.1 4.3-.4 7.9-.8 10.9-1.3 2.2.3 4.3.4 6.5.2 5.7-.4 12.9-1.9 20.7-4.2 10.9-3.1 23.2-7.5 34.5-12 21.3-8.4 39.3-16.8 39.3-16.8s29.1-178.7 9.7-309.7c-.3-2.1-.6-4.2-1-6.3-.1-.7-.2-1.3-.3-2-.2-1.4-.5-2.9-.7-4.3-.1-.8-.3-1.6-.4-2.3-.2-1.3-.4-2.7-.7-4l-.4-2.4c-.2-1.3-.5-2.7-.7-4l-.4-2.3c-.3-1.4-.5-2.8-.8-4.1-.1-.7-.3-1.4-.4-2.1l-.9-4.5-.3-1.7c-.4-1.9-.8-3.7-1.1-5.6-.1-.2-.1-.4-.1-.6-1.3-6.4-2.7-12.8-4.2-19.2l-.2-.7c-.4-1.9-.9-3.8-1.3-5.6-.1-.3-.1-.6-.2-.8-.4-1.8-.9-3.7-1.3-5.5-.1-.3-.1-.5-.2-.8-.5-1.9-.9-3.8-1.4-5.7l-.1-.5c-1.6-6.1-3.2-12.2-4.8-18.2l-.1-.4-1.5-3 1.5 3c-.8-2.7-1.5-5.4-2.3-8.1.5.6.9 1.2 1.4 1.8l.7.9c.5.6.9 1.2 1.4 1.8.2.3.5.6.7.9.5.6 1 1.2 1.4 1.8l.7.9c.5.6 1 1.3 1.5 1.9l.5.7c.9 1.2 1.9 2.3 2.8 3.5l.1.2 2.5 3.1.4.4.3.4.6.8.6.7.6.8c.2.2.4.5.6.7l.3.4.7.8.8 1c.2.2.4.5.6.7v.1c.2.3.5.6.8.9l1.1 1.3.4.4c3.1 3.5 6.3 7.1 9.6 10.7l.3.3c.2.2.3.4.5.6l1.7 1.9.5.5.3.3c.6.6 1.2 1.3 1.8 1.9l.2.2.3.3.1.1c1.7 1.8 3.4 3.5 5.1 5.3l.2.2c1.8 1.8 3.5 3.6 5.3 5.3 41.8 41.2 95.7 79.2 148.3 78.6 87.4-.9 147.5-100.1 168.9-142.6-5.3-3.4-34.9-15.6-81.3-34.7zm-681 319.7c-.8.2-1.5.4-2.3.6.8-.2 1.5-.4 2.3-.6zm-3.5 1c-.7.2-1.5.5-2.2.7.8-.3 1.5-.6 2.2-.7zm3.9-1.1c28.2-7.1 45.7 3 59.4 12.2-13.7-9.2-31.2-19.3-59.4-12.2zm64.3 15.4c1 .7 2 1.4 3 2-1-.6-2-1.3-3-2zm-2.3-1.5 2.1 1.4-2.1-1.4zm158.3-395.9v.2c-.1.4-.1.9-.2 1.3-.3 1.9-.6 3.8-.9 5.8 0 .3-.1.6-.1.8-.2 1.4-.4 2.8-.7 4.3v.2l-.6 3.9c-.1.5-.2 1-.3 1.6-.1.4-.2.9-.2 1.3-.1.4-.1.8-.2 1.2l-.6 3.3v.2c-.1.5-.2 1-.2 1.5 0 .2-.1.4-.1.6-.6 3.7-1.3 7.6-2 11.6 0 .3-.1.6-.2.9-.1.7-.3 1.4-.4 2.2-.1.4-.2.8-.2 1.3-.5 2.9-1 5.8-1.6 8.8-.3 1.7-.6 3.3-.9 5l-.5 2.4v.1c-.2.8-.3 1.6-.5 2.5-.1.4-.1.7-.2 1.1v.1c-.3 1.5-.6 3-.9 4.6v.2c-.3 1.4-.5 2.8-.8 4.2l-.1.5c-.3 1.4-.5 2.8-.8 4.2V1126.8l-.1.6c0 .2-.1.4-.1.7-.3 1.7-.7 3.4-1 5.2-.1.3-.1.7-.2 1-.6 3-1.2 6-1.7 9.1l-.2.8c-.9 4.5-1.7 9-2.6 13.6-1.5 7.9-3.1 16-4.7 24.2 0 .2-.1.3-.1.5l-.8 4.3v.4c-.3 1.4-.5 2.9-.8 4.3v.4l-1.8 9.3c0 .3-.1.6-.2.8-.2 1.2-.5 2.5-.7 3.7-.1.4-.2.8-.2 1.2l-.6 3.3-.3 1.5c-.2 1.1-.4 2.2-.6 3.2-.1.5-.2.9-.3 1.4l-.8 4.5c-.3 1.6-.6 3.2-.9 4.7v.2l-.2.8c-.2 1.2-.4 2.4-.7 3.6l-.1.6c-.1.3-.1.7-.2 1-.2 1-.4 2-.5 3-.1.5-.2.9-.3 1.4v.2c-.2 1.1-.4 2.1-.6 3.2-.1.5-.2 1-.3 1.6-.2 1.1-.4 2.3-.6 3.4l-.2 1.1v.1l-.8 4.6-.1.4c0 .2-.1.5-.1.8l-.6 3.5c-.1.5-.2 1.1-.3 1.6-.2 1-.4 2-.6 3.1v.1l-.3 1.7c-.2 1-.3 2-.5 2.9-.1.6-.2 1.2-.3 1.7-.2 1-.4 2.1-.5 3.1 0 .3-.1.6-.2 1s-.1.4-.1.6l-.8 4.6-.9 5.1c0 .2-.1.4-.1.6-.8 4-1.6 8.1-2.5 12.3 0 .2-.1.3-.1.5-.3 1.4-.6 2.9-1 4.4-.1.4-.2.7-.2 1.1-.4 1.7-.8 3.5-1.2 5.3-.1.5-.2 1-.4 1.6l-.4 1.8c-30.5-27.5-75.8-60.5-101.1-71.9 35.3-53.3 46-66.9 80-108.7 18.9-23.2 46.7-54.7 69.5-80.3-.5 1.2-.6 2.3-.8 3.4z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "none",
    d: "m1144.1 1165-1.5-3zM815.7 1236.3c25.3 11.4 70.6 44.4 101.1 71.9l.4-1.8c.1-.5.2-1.1.4-1.6.4-1.8.8-3.5 1.2-5.3.1-.4.2-.7.2-1.1.3-1.5.6-2.9 1-4.4 0-.2.1-.3.1-.5.9-4.2 1.7-8.3 2.5-12.3 0-.2.1-.4.1-.6l.9-5.1.8-4.6c0-.2.1-.4.1-.6s.1-.6.2-1c.2-1 .4-2.1.5-3.1.1-.6.2-1.2.3-1.7.2-1 .3-2 .5-2.9l.3-1.7v-.1c.2-1 .4-2.1.6-3.1.1-.5.2-1.1.3-1.6l.6-3.5c0-.2.1-.5.1-.8l.1-.4.8-4.6v-.1l.2-1.1c.2-1.1.4-2.3.6-3.4.1-.5.2-1 .3-1.6.2-1 .4-2.1.6-3.2v-.2c.1-.5.2-.9.3-1.4.2-1 .4-2 .5-3 .1-.3.1-.7.2-1l.1-.6c.2-1.2.4-2.4.7-3.6l.2-.8v-.2c.3-1.6.6-3.2.9-4.7l.8-4.5c.1-.4.2-.9.3-1.4.2-1.1.4-2.2.6-3.2l.3-1.5.6-3.3c.1-.4.2-.8.2-1.2.2-1.2.5-2.5.7-3.7 0-.3.1-.6.2-.8l1.8-9.3v-.4c.3-1.4.5-2.9.8-4.3v-.4l.8-4.3c0-.2.1-.3.1-.5 1.6-8.2 3.1-16.3 4.7-24.2.9-4.6 1.8-9.2 2.6-13.6l.2-.8c.6-3.1 1.2-6.1 1.7-9.1.1-.3.1-.7.2-1 .3-1.7.7-3.5 1-5.2 0-.2.1-.4.1-.7l.1-.6V1126.6c.3-1.4.5-2.8.8-4.2l.1-.5c.3-1.4.5-2.8.8-4.2v-.2c.3-1.5.6-3.1.9-4.6v-.1c.1-.3.1-.7.2-1.1.2-.8.3-1.7.5-2.5v-.1l.5-2.4c.3-1.7.6-3.4.9-5 .5-3 1.1-5.9 1.6-8.8.1-.4.2-.8.2-1.3.1-.7.2-1.4.4-2.2.1-.3.1-.6.2-.9.7-4 1.4-7.8 2-11.6 0-.2.1-.4.1-.6.1-.5.2-1 .2-1.5v-.2l.6-3.3c.1-.4.1-.8.2-1.2.1-.4.2-.9.2-1.3.1-.5.2-1 .3-1.6l.6-3.9v-.2c.2-1.4.5-2.9.7-4.3 0-.3.1-.6.1-.8.3-2 .6-3.9.9-5.8.1-.4.1-.9.2-1.3v-.2c.2-1.1.3-2.2.5-3.3-22.8 25.6-50.6 57.1-69.5 80.3-33.7 41.7-44.4 55.3-79.7 108.6z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#46828E",
    className: "main-body-fill",
    d: "M1346.4 1130.1zM1353.9 1106.1c-.2 1-.4 1.9-.7 2.8.2-.9.5-1.9.7-2.8zM1353.1 1109.3c-.3 1.1-.5 2.1-.8 3.2.3-1 .5-2.1.8-3.2zM1344.7 1134.1l-.5 1.1.5-1.1zM1346.2 1130.7c-.1.2-.2.5-.3.7.1-.3.2-.5.3-.7zM1332.6 1154.3l.3-.3-.3.3zM1354.7 1102.6c.2-.8.3-1.6.5-2.4-.2.8-.4 1.6-.5 2.4zM1349.6 1121.6zM1343.3 1137.2l-.2.4.2-.4zM1347.9 1126.4l.3-.9-.3.9zM1350.8 1117.6zM1336.2 1149.6l-.4.6.4-.6zM1342.6 1138.7l-.7 1.3.7-1.3zM1334.8 1151.5l-.1.2.1-.2zM1338.8 1145.5c-.1.1-.2.3-.3.4l.3-.4zM1339.6 1144.2l-.1.2.1-.2zM1337.5 1147.6l-.5.8.5-.8zM1341 1141.6l-.3.6.3-.6z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#494959",
    className: "secondary-body-fill",
    d: "M1338.2 1146.4c-.2.4-.5.8-.7 1.2.3-.5.7-1.1 1-1.7l-.3.5zM1342.6 1138.7l.5-1-.5 1zM1336.2 1149.6l.8-1.2-.8 1.2zM1340.1 1143.3l-.5.8c.4-.6.7-1.3 1.1-2-.2.5-.4.9-.6 1.2zM1338.8 1145.5l.7-1.2-.7 1.2zM1341.3 1141.1l-.3.6c.3-.6.6-1.1.9-1.7-.2.3-.4.7-.6 1.1zM1330.8 1156.4l1.8-2.1-1.8 2.1zM1153.3 1171.4l-.1-.2.1.2zM1334.8 1151.5c.3-.4.7-.9 1-1.3-.4.4-.7.9-1 1.3zM1332.9 1154c.6-.7 1.2-1.5 1.8-2.3-.6.8-1.2 1.5-1.8 2.3zM1349.6 1121.6c.4-1.3.9-2.7 1.3-4-.5 1.4-.9 2.7-1.3 4zM1353.1 1109.3c0-.1.1-.2.1-.3 0 .1 0 .2-.1.3zM1352.3 1112.5l-1.2 4.2 1.2-4.2zM1353.9 1106.1c.3-1.2.5-2.3.8-3.5-.3 1.2-.5 2.3-.8 3.5zM1348.2 1125.5c.5-1.3.9-2.6 1.4-3.9-.5 1.4-.9 2.6-1.4 3.9zM1355.1 1100.2c.1-.3.1-.7.2-1 0 .3-.1.7-.2 1zM1345.3 1132.7l-.4.8-.3.6c.4-.9.8-1.8 1.2-2.8l-.5 1.4zM1343.8 1136.2l-.5 1c.3-.7.6-1.3.9-2l-.4 1zM1346.2 1130.7c.1-.2.2-.3.2-.5-.1.1-.1.3-.2.5zM1346.4 1130.1c.5-1.2 1-2.4 1.4-3.7-.4 1.3-.9 2.5-1.4 3.7z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#494959",
    className: "secondary-body-fill",
    d: "m1156.5 1175.3 1.8 2.2c.2.2.4.5.6.7l1.8 2.1c.2.2.4.5.6.7l1.9 2.2c.1.2.3.3.4.5 3 3.5 6.2 7 9.4 10.5.1.2.3.3.4.4.7.8 1.5 1.6 2.2 2.4l.5.5 2.3 2.4.3.3c3.5 3.7 7.1 7.3 10.8 11 .9.9 1.8 1.7 2.7 2.6l.3.3c.9.9 1.8 1.7 2.7 2.6l.2.2c4.8 4.6 9.7 9 14.7 13.4l.1.1 3 2.6.1.1c6.2 5.2 12.5 10.3 19 15.1 20.6 15.3 42.7 27.9 65.1 35.1h.1c6.9 2.2 14 3.9 21.2 5.1h.3c1.1.2 2.3.3 3.4.5h.1c4.7.6 9.5.9 14.2.9 20.1-6.7 29.4-26.9 34.1-58.1s-9.8-92.7-15.5-133.8c-.1.3-.1.7-.2 1s-.1.7-.2 1c-.2.8-.3 1.6-.5 2.4-.2 1.2-.5 2.3-.8 3.5-.2 1-.4 1.9-.7 2.8 0 .1-.1.3-.1.4-.3 1.1-.5 2.1-.8 3.2l-1.2 4.2c-.1.3-.2.6-.3 1-.4 1.3-.8 2.7-1.3 4-.4 1.3-.9 2.6-1.4 3.9l-.3.9c-.5 1.2-.9 2.5-1.4 3.7-.1.2-.2.3-.2.5-.1.2-.2.5-.3.7-.4 1-.8 1.9-1.2 2.8l-.5 1.1c-.3.7-.6 1.3-.9 2l-.2.4-.5 1-.7 1.3c-.3.6-.6 1.1-.9 1.7l-.3.6c-.4.7-.7 1.3-1.1 2l-.1.2-.7 1.2-.2.4c-.3.6-.7 1.1-1 1.7l-.5.8-.8 1.2-.4.6c-.3.4-.6.9-1 1.3l-.1.1c-.6.8-1.2 1.5-1.8 2.3l-.3.3-1.8 2.1c-3.9 9.7-8 19.6-11.2 26.9-6.8 15.3-20.8 28.5-49.1 27.2-26.6-1.2-55.4-29.3-83.5-59-34.9-36.9-67.8-78.8-84.3-103.2 13.8 30.8 27.5 68.1 39.1 108.6l1.4 1.9.7.9c.5.6.9 1.2 1.4 1.8.2.3.5.6.7.9.5.6 1 1.2 1.4 1.8l.7.9c.5.6 1 1.3 1.5 1.9l.5.7c.9 1.2 1.9 2.3 2.8 3.5l.1.2c1 1.2 1.9 2.3 2.9 3.5l.8.6z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#7C6983",
    className: "teriary-body-fill",
    d: "M1135.3 1135.3c11.2 6.7 22.3 11.3 27 7.2 6-5.2-6.6-21.1-23.6-36.6-8.2-7.4-14.1-12.5-18.7-15.1 5.4 14.1 10.5 29 15.3 44.5zM1183.5 1172c-7.7 8.7 11.5 30.5 19 38.5s25.8 20.8 34 12c7.5-8-14-30.5-22.5-38.5s-23-20.5-30.5-12zM1276.5 1241c6.8 22.7 25 31.5 39.5 32s31-9.5 27.5-28.5-26.5-33-43-30c-17.8 3.2-27 16.5-24 26.5zM1353.7 1106.2c.2-1.7-3.6 14.9-3.5 13.4-1.2 3.7-2.4 7.2-3.8 10.6-.1.2-.2.3-.2.5-.3.7-.6 1.4-.9 2l-.4.8c-.2.6-.5 1.1-.8 1.7l-.4 1c-.2.5-.5 1-.7 1.5l-.5 1-.7 1.3c-.2.4-.4.7-.6 1.1l-.6 1.2c-.2.4-.4.8-.6 1.1l-.6 1-.7 1.2-.6.9-.6 1c-3 14.6.8 30.2 8.1 30.2 15.9 0 5.4-50.2 8.1-71.5z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "none",
    d: "M916.8 1308.3c.1-.6.3-1.2.4-1.8v-.1c.1-.5.2-1.1.4-1.6.4-1.8.8-3.5 1.2-5.3.1-.4.2-.8.2-1.1.3-1.5.6-2.9 1-4.4 0-.2.1-.4.1-.5.1-.3.2-.7.2-1 .4-1.7.7-3.5 1.1-5.2l.1-.6c.3-1.6.6-3.1.9-4.7l.2-.8c0-.2.1-.4.1-.6l.9-5.1c.3-1.7.6-3.5.9-5.2.1-.3.1-.6.2-.9l1.7-9.4v-.1l1.5-8.2v-.1l.1-.6.9-5v-.1l.8-4.6.3-1.5v-.1c.2-1.1.4-2.2.6-3.4.1-.4.2-.9.2-1.4.2-1 .4-2 .5-3v-.1l.2-1c.3-1.4.5-2.8.8-4.2v-.1c0-.2.1-.5.1-.7l1.8-9.5c.1-.4.2-.9.2-1.3.2-1.1.4-2.2.6-3.2v-.1c.1-.5.2-.9.3-1.4v-.1c1.2-6.2 2.3-12.3 3.5-18.4v-.2c.3-1.5.6-3 .8-4.5v-.2l5.6-29.1c.9-4.6 1.8-9.2 2.6-13.6l.2-.8c.3-1.6.6-3.3.9-4.9l.1-.5.6-3.3.1-.5.2-1.1c.1-.7.3-1.4.4-2.1 0-.3.1-.6.2-.8l.4-2.2c0-.2.1-.4.1-.7s.1-.4.1-.6l.1-.4c.3-1.4.5-2.8.8-4.2l.1-.5c.3-1.4.5-2.8.8-4.2v-.2c.1-.3.1-.6.2-.9.2-.8.3-1.6.5-2.4l.2-1.3.2-1.1.2-1.3c.1-.4.2-.8.2-1.2.2-.8.3-1.7.5-2.5l.2-1.1c.2-1.3.5-2.6.7-3.9.2-1.3.5-2.6.7-3.8l.3-1.5c.1-.6.2-1.3.3-1.9s.2-1 .3-1.6l.2-1.3c0-.2.1-.4.1-.6.1-.5.2-1 .3-1.6 0-.3.1-.6.2-.9s.1-.6.2-1l.3-1.5.3-1.8.3-1.7c.2-1 .3-1.9.5-2.8.1-.6.2-1.1.3-1.7l.2-1.1c0-.2.1-.4.1-.6.1-.5.2-1 .2-1.5v-.2c.1-.5.2-1 .2-1.4s.2-.9.2-1.4c0-.2 0-.3.1-.5.1-.4.1-.8.2-1.2s.2-.9.2-1.3.2-1.1.3-1.6l.2-1.4c.1-.8.3-1.6.4-2.4v-.2c.1-.5.2-1 .2-1.5s.1-.9.2-1.4.2-1 .2-1.4c0-.3.1-.6.1-.8s0-.3.1-.5l.2-1.4c.1-.4.1-.9.2-1.3s.1-.9.2-1.3.1-.9.2-1.3.1-.9.2-1.3v-.2c0-.3.1-.6.1-1l.3-2.1v-.2c-22.8 25.6-50.6 57.1-69.5 80.3-34 41.7-44.7 55.3-80 108.7 25.3 11.4 70.6 44.4 101.1 71.9l.6.1z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#46828E",
    className: "main-body-fill",
    d: "M960.9 1074.7v.2-.2zM962.8 1063.2v.2-.2zM964.7 1050.6v.2-.2zM961.7 1070.2c-.1.4-.1.8-.2 1.2 0-.4.1-.8.2-1.2zM963.6 1058.1c0 .3-.1.6-.1.8 0-.3.1-.6.1-.8zM964.5 1052.2zM962.2 1067.3c-.1.5-.2 1.1-.3 1.6.1-.6.2-1.1.3-1.6zM953.2 1117.4v.2-.2zM954.3 1111.7l-.2 1.1v-.1c0-.3.1-.7.2-1zM960.6 1076.4c0 .2-.1.4-.1.6 0-.2.1-.4.1-.6zM951.5 1126.5l-.1.4v-.2l.1-.2zM958.5 1088.6c0 .3-.1.6-.2.9.1-.3.1-.6.2-.9zM958 1091.7l-.2 1.3c0-.5.1-.9.2-1.3zM955.2 1106.7c-.2.8-.3 1.6-.5 2.5v-.1l.5-2.4zM1158.2 1223.1c.4 1.9.8 3.7 1.1 5.6-.4-1.9-.7-3.7-1.1-5.6zM956.1 1101.7zM1165.3 1262.5c.3 2.1.7 4.2 1 6.3-.3-2.1-.6-4.2-1-6.3zM952.3 1122.3l.1-.5-.1.5zM948.1 1144.2l.2-.8-.2.8zM930.9 1235c.2-1 .4-2 .5-3-.2 1-.4 2-.5 3zM934.6 1215.2c.2-1.1.4-2.2.6-3.2-.2 1-.4 2.1-.6 3.2zM1164.3 1256.2c.2 1.4.5 2.9.7 4.3-.2-1.5-.4-2.9-.7-4.3zM1162.1 1243.5c.2 1.3.5 2.7.7 4-.2-1.4-.5-2.7-.7-4zM951.3 1127.4c0 .2-.1.4-.1.7 0-.2.1-.4.1-.7zM1153.8 1203.3c1.5 6.4 2.9 12.8 4.2 19.2-1.3-6.5-2.7-12.9-4.2-19.2zM1159.6 1230.3l.9 4.5c-.3-1.4-.6-2.9-.9-4.5zM1152.3 1197zM1160.9 1237c.3 1.4.5 2.8.8 4.1-.3-1.3-.5-2.7-.8-4.1zM1163.2 1249.8c.2 1.3.5 2.7.7 4-.2-1.3-.4-2.6-.7-4zM1149.2 1184.2c.5 1.9 1 3.8 1.4 5.7-.4-1.9-.9-3.8-1.4-5.7zM832 1564.8c.1-.2.2-.5.3-.8-.3.9-.6 1.7-.9 2.5.1-.2.1-.4.2-.6.1-.4.2-.8.4-1.1zM831.3 1566.5c-.1.4-.3.8-.4 1.1l.1-.3c.2-.2.2-.5.3-.8zM829.2 1572.8l.2-.8-.2.8zM1150.8 1190.7c.4 1.8.9 3.7 1.3 5.5-.4-1.9-.8-3.7-1.3-5.5zM830.3 1569.5l-.3.9v-.1c.1-.2.2-.5.3-.8zM830.5 1569.1c.1-.4.3-.8.4-1.2-.2.4-.3.8-.4 1.2zM829.2 1573.1l-.3.9.3-.9zM828.4 1575.6l.2-.7-.2.7zM950.2 1133.3l-.2 1.1c.1-.4.1-.8.2-1.1zM829.9 1570.7l-.4 1.3c0-.1 0-.2.1-.2.1-.4.2-.7.3-1.1zM828.4 1575.6l-.9 2.6zM917.6 1304.9c-.1.5-.2 1.1-.4 1.6.1-.6.2-1.1.4-1.6zM828.8 1574.1c-.1.2-.1.5-.2.7v-.1c.1-.2.2-.4.2-.6zM832.9 1562.3l.4-1c-.3.9-.6 1.8-.9 2.6l.3-.8c0-.3.1-.6.2-.8zM939.8 1187.3c-.3 1.5-.6 3-.8 4.5v-.1c.3-1.5.6-2.9.8-4.4zM919 1298.5c-.1.4-.2.7-.2 1.1 0-.4.1-.7.2-1.1zM930.6 1236.4c-.2 1.1-.4 2.2-.6 3.4.2-1 .4-2.1.6-3.2v-.2zM929.7 1241.3l-.8 4.6.2-1.1c.2-1.2.4-2.3.6-3.5zM933.5 1221.1l.8-4.5-1.8 9.5v-.2c.4-1.7.7-3.2 1-4.8zM928.8 1246l-.9 5 .1-.4.8-4.6zM932.4 1226.8c-.2 1.4-.5 2.8-.8 4.2l.1-.6c.3-1.2.5-2.4.7-3.6zM936.3 1205.9c.2-1.2.5-2.5.7-3.7 0-.3.1-.6.2-.8l1.8-9.3c-1.2 6.1-2.3 12.2-3.5 18.4l.6-3.3c.1-.5.1-.9.2-1.3zM920.1 1293.6c0 .2-.1.3-.1.5 0-.2 0-.3.1-.5zM925.5 1264.6c.2-1 .3-2 .5-2.9l.3-1.7-1.7 9.4c.2-1 .4-2.1.5-3.1.2-.6.3-1.1.4-1.7zM924.5 1270.4c-.3 1.7-.6 3.5-.9 5.2l.8-4.6c0-.2.1-.4.1-.6zM940.7 1182.6c0-.2.1-.3.1-.5 1.6-8.2 3.1-16.3 4.7-24.2l-5.6 29.1v-.1l.8-4.3zM922.7 1280.7c0 .2-.1.4-.1.6-.1-.2 0-.4.1-.6zM927.2 1255.2l.6-3.5-1.5 8.2c.2-1 .4-2.1.6-3.1.1-.5.2-1 .3-1.6zM959.6 1345.2l-.7-.7.7.7zM917.9 1544.9c2.2-1.2 4.5-2.5 6.8-3.9-2.3 1.3-4.6 2.6-6.8 3.9z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "none",
    d: "M815.7 1236.3c25.3 11.4 70.6 44.4 101.1 71.9l.4-1.8c.1-.5.2-1.1.4-1.6.4-1.8.8-3.5 1.2-5.3.1-.4.2-.7.2-1.1.3-1.5.6-2.9 1-4.4 0-.2.1-.3.1-.5.9-4.2 1.7-8.3 2.5-12.3 0-.2.1-.4.1-.6l.9-5.1.8-4.6c0-.2.1-.4.1-.6s.1-.6.2-1c.2-1 .4-2.1.5-3.1.1-.6.2-1.2.3-1.7.2-1 .3-2 .5-2.9l.3-1.7v-.1c.2-1 .4-2.1.6-3.1.1-.5.2-1.1.3-1.6l.6-3.5c0-.2.1-.5.1-.8l.1-.4.8-4.6v-.1l.2-1.1c.2-1.1.4-2.3.6-3.4.1-.5.2-1 .3-1.6.2-1 .4-2.1.6-3.2v-.2c.1-.5.2-.9.3-1.4.2-1 .4-2 .5-3 .1-.3.1-.7.2-1l.1-.6c.2-1.2.4-2.4.7-3.6l.2-.8v-.2c.3-1.6.6-3.2.9-4.7l.8-4.5c.1-.4.2-.9.3-1.4.2-1.1.4-2.2.6-3.2l.3-1.5.6-3.3c.1-.4.2-.8.2-1.2.2-1.2.5-2.5.7-3.7 0-.3.1-.6.2-.8l1.8-9.3v-.4c.3-1.4.5-2.9.8-4.3v-.4l.8-4.3c0-.2.1-.3.1-.5 1.6-8.2 3.1-16.3 4.7-24.2.9-4.6 1.8-9.2 2.6-13.6l.2-.8c.6-3.1 1.2-6.1 1.7-9.1.1-.3.1-.7.2-1 .3-1.7.7-3.5 1-5.2 0-.2.1-.4.1-.7l.1-.6V1126.6c.3-1.4.5-2.8.8-4.2l.1-.5c.3-1.4.5-2.8.8-4.2v-.2c.3-1.5.6-3.1.9-4.6v-.1c.1-.3.1-.7.2-1.1.2-.8.3-1.7.5-2.5v-.1l.5-2.4c.3-1.7.6-3.4.9-5 .5-3 1.1-5.9 1.6-8.8.1-.4.2-.8.2-1.3.1-.7.2-1.4.4-2.2.1-.3.1-.6.2-.9.7-4 1.4-7.8 2-11.6 0-.2.1-.4.1-.6.1-.5.2-1 .2-1.5v-.2l.6-3.3c.1-.4.1-.8.2-1.2.1-.4.2-.9.2-1.3.1-.5.2-1 .3-1.6l.6-3.9v-.2c.2-1.4.5-2.9.7-4.3 0-.3.1-.6.1-.8.3-2 .6-3.9.9-5.8.1-.4.1-.9.2-1.3v-.2c.2-1.1.3-2.2.5-3.3-22.8 25.6-50.6 57.1-69.5 80.3-33.7 41.7-44.4 55.3-79.7 108.6zM1144.1 1165l-1.5-3z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#46828E",
    className: "main-body-fill",
    d: "m753.5 1425 1.6-.8-1.6.8zM751 1426.4l1.6-.9-1.6.9zM748.3 1427.9l1.7-1c-.6.4-1.1.7-1.7 1zM745.6 1429.4l1.8-1-1.8 1zM756.1 1423.7l1.5-.8-1.5.8zM758.6 1422.4l1.5-.7-1.5.7zM742.8 1431.1l2-1.2-2 1.2zM1148.2 1165.2c.5.6 1 1.3 1.5 1.9l.5.7c.9 1.2 1.9 2.3 2.8 3.5-2-2.4-3.9-4.8-5.8-7.2l.1.2.9.9zM1146.1 1162.4c.3.4.7.8 1 1.2l-2.2-2.8c.2.2.3.4.5.6s.4.7.7 1zM1147.1 1163.7l.3.4-.3-.4zM761 1421.2l1.4-.7-1.4.7zM1143.9 1159.7l.3.4c-.8-1-1.6-2.1-2.4-3.1.5.6.9 1.2 1.4 1.8l.7.9zM739.6 1433.1c.8-.5 1.7-1.1 2.6-1.6-.9.5-1.7 1-2.6 1.6zM1144.3 1160.1l.6.8-.6-.8zM769.7 1417l1.2-.6-1.2.6zM765.5 1418.9l1.3-.6-1.3.6zM767.7 1417.9l1.2-.6-1.2.6zM771.5 1416.1l1.2-.6-1.2.6zM773.2 1415.4l1.5-.7-1.5.7zM763.3 1420l1.3-.7-1.3.7z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#494959",
    className: "secondary-body-fill",
    d: "M739.6 1433.1zM742.2 1431.5l.6-.4-.6.4zM770.8 1416.4l.7-.3-.7.3zM760 1421.6l1-.5-1 .5zM757.6 1422.9l1-.5-1 .5zM772.7 1415.6l.5-.2-.5.2zM762.4 1420.5l.9-.5-.9.5zM766.8 1418.3l.8-.4-.8.4zM755.1 1424.2l1-.5-1 .5zM752.6 1425.5l1-.5-1 .5zM750 1426.9l1-.5-1 .5zM764.7 1419.3l.9-.4-.9.4zM768.9 1417.3l.8-.3-.8.3zM744.8 1429.9l.8-.5-.8.5zM747.4 1428.4l.9-.5-.9.5zM811.7 1450c17 11 49 37.3 55.7 30.3s-17.3-23.7-30-31.3c-11.5-7-42.8-24-64.2-35.3l1.6.9-1.5.7-.5.2-1.2.6-.7.3-1.2.6-.8.3-1.2.6-.8.4-1.3.6-.9.4-1.3.7-.9.5-1.4.7-1 .5-1.5.7-1 .5-1.5.8-1 .5-1.6.8-1 .5-1.6.9-1 .5-1.7 1-.9.5-1.8 1-.8.5-2 1.2-.6.4c-.9.5-1.7 1.1-2.6 1.6l-2.6 1.7c38.7-13.1 58.8 4.9 74.8 15.2z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.3,
    fill: "#091426",
    d: "m1144.1 1165-1.5-3c25.1 119 29.9 264 19.4 336-5.9 40.4-11.8 73.5-16.6 84.4-14.6-1.7-24.8-17.7-29.1-32.5-9.4-32.1-6.1-66.4-4.9-99.8 1.4-38.4.1-76.8-4-115-2.1-19.1-4.8-38.1-8.2-57-2.2-11.9-3.1-35.4-9.7-47.6-.2-1.2-.3-2.4-.4-3.5-8-63-28-158-43-215 9 46 18 123 25 248s-15.9 288.1-22.9 334.1c-1.1 7.3-2.2 13.3-3.4 18.5 4.3-.4 7.9-.8 10.9-1.3 2.2.3 4.3.4 6.5.2.7 0 1.4-.1 2.2-.2l1.8-.2h.4c1.6-.2 3.2-.5 4.9-.8l1.2-.3 1.1-.2 1.3-.3 1.2-.3 1.2-.3 2.4-.6 3-.8c10.9-3.1 23.2-7.5 34.5-12l2-.8 1.1-.4.6-.3.2-.1.8-.3.7-.3.4-.2 1-.4.9-.4 1.1-.4.8-.3.9-.4.4-.2.6-.2 1.1-.4.7-.3 1-.4.7-.3.1-.1 1.3-.6h.1l.3-.2 1.1-.5.5-.2 1-.4.6-.2.1-.1 1.1-.5.3-.1.2-.1 1-.4c.2-.1.3-.1.5-.2l1.1-.5.4-.2 1-.4.4-.2h.1l.9-.4c7.5-3.3 12.3-5.5 12.3-5.5s29.1-178.7 9.7-309.7c-.3-2.1-.6-4.2-1-6.3-.1-.7-.2-1.3-.3-2-.2-1.4-.5-2.9-.7-4.3-.1-.8-.3-1.6-.4-2.3-.2-1.3-.4-2.7-.7-4l-.4-2.4c-.2-1.3-.5-2.7-.7-4l-.4-2.3c-.3-1.4-.5-2.8-.8-4.1-.1-.7-.3-1.4-.4-2.1l-.9-4.5-.3-1.7c-.4-1.9-.8-3.7-1.1-5.6-.1-.2-.1-.4-.1-.6-1.3-6.4-2.7-12.8-4.2-19.2l-.2-.7c-.4-1.9-.9-3.8-1.3-5.6-.1-.3-.1-.6-.2-.8-.4-1.8-.9-3.7-1.3-5.5-.1-.3-.1-.5-.2-.8-.5-1.9-.9-3.8-1.4-5.7l-.1-.5c-1.6-6.1-3.2-12.2-4.8-18.2l-.1-.4-.4-.3zM1457.8 1126.6l-6.4-2.6-.3-.1c-4.5-1.9-15.2 20.4-16.8 23.8-2.5 5.3-4.9 10.3-7.3 15.4-2.5 5.3-5.3 10.5-8.4 15.5-3.9 6.1-8 12.3-13.8 16.6-7.2 5.3-14.6 4.9-22.9 3.6-9.5-1.5-13.5-1.1-21.6 4.3-6.4 4.3-19 10.4-26.8 11.8-11.1 2.1-22.5 1.7-33.8 1.3-14.9-.5-30.1-1.1-44-6.2-10.3-3.8-11.6-3.4-20.7-9.6-20-13.4-36.9-33.1-53.3-50.7-29.3-31.2-64.7-100-101.3-142 14.8 32 49.1 105.9 61.5 149.3 40.8 53.6 119.9 134 196.3 133.2 1.4 0 2.8-.1 4.2-.1.5 0 .9-.1 1.4-.1.9 0 1.9-.1 2.8-.2.6 0 1.1-.1 1.6-.2.8-.1 1.7-.2 2.5-.3l1.7-.2 2.4-.3 1.7-.3c.8-.1 1.6-.3 2.3-.4l1.7-.3c.8-.2 1.5-.3 2.3-.5l1.7-.4 2.3-.6 1.7-.4 2.3-.7 1.6-.5c.8-.2 1.6-.5 2.4-.8.5-.2 1-.3 1.5-.5.8-.3 1.7-.6 2.5-.9l1.3-.5c.9-.3 1.8-.7 2.7-1.1.3-.1.7-.3 1-.4 1.1-.4 2.2-.9 3.3-1.4l.4-.2c3.8-1.7 7.5-3.6 11.2-5.6l.2-.1c1.2-.6 2.3-1.3 3.4-2l.4-.2c1.1-.6 2.1-1.3 3.1-1.9l.5-.3c1-.7 2-1.3 3-2l.5-.3 3-2.1.4-.3c1-.7 2.1-1.4 3.1-2.2l.3-.2c1.1-.8 2.1-1.6 3.2-2.4l.1-.1c12.2-9.5 23.5-20.1 33.7-31.7 25.3-28.6 43.5-60.3 53.3-79.9-4.3-2.4-21.6-9.7-49.1-21zM1154.5 912.5l-1.8.9 1.8-.9zM1149.5 914.8l-1.8.8 1.8-.8zM1048.5 922c-39 2-73 31-113 31-88.7 0-163.9-28.3-205.4-62.3-.4-.2-.8-.5-1.1-.7-46-31-50.3-58.2-58-72-11.4-20.4.5-42.1-12.9-50.4-31.5-19.5-94-198.5-27-307.5 8.4-13.6 29.2-26 40.9-37.5 9-8.9 8.3-17.2 18.9-24.8 85.3-61 215.8-81.9 286.7-57.8-65-22-82.6-27.1-69.6-38.1 12.3-10.4 133.7-3.8 162.2 14-30.4-22.7-25.9-41.2-147.5-46.1H917c-139 2-299.2 118.9-327 173-37 72-52 126-19 257 25.2 100.2 95.9 212 246 251 46.2 12 101.8 14.1 163 9 57.8-4.8 114.3-19.7 166.9-44-49.7 14.5-75.2 5-98.4 6.2zM1173.4 902.7l.6-.3-.6.3zM1159.3 910.1l-1.5.8 1.5-.8zM1170 904.5l-1.2.6 1.2-.6zM1164 907.7l-.2.1.2-.1zM1161.7 1241.1l.4 2.3-.4-2.3z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.3,
    fill: "#091426",
    d: "M1158 1222.5c0 .2.1.4.1.6 0-.2 0-.4-.1-.6zM1159.3 1228.7l.3 1.7-.3-1.7zM1160.5 1234.9c.1.7.3 1.4.4 2.1-.1-.7-.2-1.4-.4-2.1zM1162.8 1247.4l.4 2.4-.4-2.4zM1163.9 1253.8c.1.8.3 1.6.4 2.3-.1-.7-.2-1.5-.4-2.3zM1153.7 1202.6l.2.7-.2-.7zM1165 1260.5c.1.7.2 1.3.3 2-.1-.7-.2-1.4-.3-2zM1149.1 1183.7l.1.5-.1-.5zM1152.2 1196.2c.1.3.1.6.2.8-.1-.3-.2-.6-.2-.8zM1150.6 1189.9c.1.3.1.5.2.8 0-.3-.1-.6-.2-.8zM934.5 1215.2c-.1.4-.2.9-.2 1.3.1-.4.2-.9.2-1.3zM932.4 1226.8l.2-.7c-.1.2-.2.4-.2.7zM964.5 1052.2c.1-.4.1-.9.2-1.3-.1.4-.1.9-.2 1.3zM931.4 1232c.1-.3.1-.6.2-.9l-.2.9zM935.4 1210.5c-.1.5-.2.9-.3 1.4v.1c.2-.6.3-1.1.3-1.5zM922.7 1280.7l.9-5.1-.9 5.1zM922.4 1282.1c-.3 1.6-.6 3.1-.9 4.7l-.1.6c-.3 1.7-.7 3.5-1.1 5.2-.1.3-.2.7-.2 1 .9-4.2 1.7-8.3 2.5-12.3l-.2.8zM963.3 1060.3c-.1.4-.2.9-.2 1.4s-.2 1-.2 1.5c.2-1.4.5-2.9.7-4.3-.2.5-.2.9-.3 1.4zM958 1091.1c0 .2-.1.4-.1.6.1-.7.2-1.4.4-2.2-.1.5-.1 1.1-.3 1.6zM938.9 1192v-.3.3zM957.4 1094.5c-.1.6-.2 1.3-.3 1.9l-.3 1.5c-.2 1.3-.5 2.5-.7 3.8.5-3 1.1-5.9 1.6-8.8-.1.6-.2 1.1-.3 1.6zM928.8 1246v-.1.1zM927.8 1251.6v.1c0-.2.1-.5.1-.8l-.1.7zM926.3 1259.9zM930.9 1235c-.1.5-.2.9-.2 1.4 0-.5.1-1 .2-1.4zM965.2 1047.6l-.3 2.1c0 .3-.1.6-.1 1 .2-1.1.3-2.2.5-3.3-.1 0-.1.1-.1.2zM930 1239.8l-.3 1.5.3-1.5zM924.7 1269.4c-.1.3-.1.6-.2.9 0-.2.1-.6.2-.9zM919 1298.5c.3-1.5.6-2.9 1-4.4-.3 1.5-.7 2.9-1 4.4zM964.3 1053.5c-.1.4-.1.9-.2 1.3s-.1.9-.2 1.3l-.2 1.4c0 .2-.1.3-.1.5.3-2 .6-3.9.9-5.8 0 .4-.1.9-.2 1.3zM952.4 1121.8c.3-1.4.5-2.8.8-4.2-.3 1.4-.6 2.7-.8 4.2zM916.8 1308.3zM951.5 1126.5c.3-1.4.5-2.8.8-4.2-.3 1.4-.6 2.8-.8 4.2zM953.8 1114.1c-.2.8-.3 1.6-.5 2.4 0 .3-.1.6-.2.9.3-1.5.6-3.1.9-4.6l-.2 1.3zM960.3 1078.1c-.1.6-.2 1.1-.3 1.7-.2.9-.3 1.9-.5 2.8l-.3 1.7-.3 1.8-.3 1.5c0 .3-.1.6-.2 1 .7-4 1.4-7.8 2-11.6l-.1 1.1zM960.6 1076.4c.1-.5.2-1 .2-1.5 0 .5-.1 1-.2 1.5zM955.4 1105.6l-.2 1.1c.3-1.7.6-3.4.9-5-.2 1.3-.5 2.6-.7 3.9zM917.2 1306.5c-.1.6-.3 1.2-.4 1.8l.4-1.8zM962.4 1065.8l-.2 1.4.6-3.9c-.1.9-.3 1.7-.4 2.5zM954.5 1110.4l-.2 1.3c.2-.8.3-1.7.5-2.5l-.3 1.2zM961.7 1070.2c.1-.4.2-.9.2-1.3-.1.4-.1.9-.2 1.3zM945.5 1157.9c.9-4.6 1.8-9.2 2.6-13.6-.9 4.5-1.7 9-2.6 13.6zM939.8 1187.3v-.3.3zM949.9 1134.8l-.6 3.3-.1.5c-.3 1.6-.6 3.2-.9 4.9.6-3.1 1.2-6.1 1.7-9.1l-.1.4zM950.8 1130.3c-.1.3-.1.6-.2.8-.1.7-.3 1.4-.4 2.1.3-1.7.7-3.5 1-5.2l-.4 2.3zM917.6 1304.9c.4-1.8.8-3.5 1.2-5.3-.4 1.7-.8 3.5-1.2 5.3zM951.3 1127.4l.1-.6c0 .2-.1.4-.1.6zM961.4 1071.9c-.1.5-.2.9-.2 1.4s-.2 1-.2 1.4l.6-3.3c-.1.2-.2.3-.2.5zM828.8 1574.1zM828.6 1574.9v-.1.1zM831.3 1566.5zM832.3 1563.9zM830.9 1567.9c0-.1 0-.2.1-.2-.1 0-.1.1-.1.2zM833.4 1560.8c-.1.2-.1.3-.2.5.1-.3.1-.4.2-.5zM829.5 1572zM830.5 1569.1l-.2.4.2-.4zM829.2 1572.8l-.1.3.1-.3zM829.9 1570.7c0-.1.1-.2.1-.3 0 .1 0 .2-.1.3z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.3,
    fill: "#091426",
    d: "M994.3 1025s0-.1-.7-9.4c-7.1 8-17.2 19.2-28.4 31.8-.1 1.1-.3 2.2-.5 3.3v.2c-.1.4-.1.9-.2 1.3-.3 1.9-.6 3.8-.9 5.8 0 .3-.1.6-.1.8-.2 1.4-.4 2.8-.7 4.3v.2l-.6 3.9c-.1.5-.2 1-.3 1.6-.1.4-.2.9-.2 1.3-.1.4-.1.8-.2 1.2l-.6 3.3v.2c-.1.5-.2 1-.2 1.5 0 .2-.1.4-.1.6-.6 3.7-1.3 7.6-2 11.6 0 .3-.1.6-.2.9-.1.7-.3 1.4-.4 2.2-.1.4-.2.8-.2 1.3-.5 2.9-1 5.8-1.6 8.8-.3 1.7-.6 3.3-.9 5l-.5 2.4v.1c-.2.8-.3 1.6-.5 2.5-.1.4-.1.7-.2 1.1v.1c-.3 1.5-.6 3-.9 4.6v.2c-.3 1.4-.5 2.8-.8 4.2l-.1.5c-.3 1.4-.5 2.8-.8 4.2V1126.9l-.1.6c0 .2-.1.4-.1.7-.3 1.7-.7 3.4-1 5.2-.1.3-.1.7-.2 1-.6 3-1.2 6-1.7 9.1l-.2.8c-.9 4.5-1.7 9-2.6 13.6-1.5 7.9-3.1 16-4.7 24.2 0 .2-.1.3-.1.5l-.8 4.3v.4c-.3 1.4-.5 2.9-.8 4.3v.4l-1.8 9.3c0 .3-.1.6-.2.8-.2 1.2-.5 2.5-.7 3.7-.1.4-.2.8-.2 1.2l-.6 3.3-.3 1.5c-.2 1.1-.4 2.2-.6 3.2-.1.5-.2.9-.3 1.4l-.8 4.5c-.3 1.6-.6 3.2-.9 4.7v.2l-.2.8c-.2 1.2-.4 2.4-.7 3.6l-.1.6c-.1.3-.1.7-.2 1-.2 1-.4 2-.5 3-.1.5-.2.9-.3 1.4v.2c-.2 1.1-.4 2.1-.6 3.2-.1.5-.2 1-.3 1.6-.2 1.1-.4 2.3-.6 3.4l-.2 1.1v.1l-.8 4.6-.1.4c0 .2-.1.5-.1.8l-.6 3.5c-.1.5-.2 1.1-.3 1.6-.2 1-.4 2-.6 3.1v.1l-.3 1.7c-.2 1-.3 2-.5 2.9-.1.6-.2 1.2-.3 1.7-.2 1-.4 2.1-.5 3.1 0 .3-.1.6-.2 1s-.1.4-.1.6l-.8 4.6-.9 5.1c0 .2-.1.4-.1.6-.8 4-1.6 8.1-2.5 12.3 0 .2-.1.3-.1.5-.3 1.4-.6 2.9-1 4.4-.1.4-.2.7-.2 1.1-.4 1.7-.8 3.5-1.2 5.3-.1.5-.2 1-.4 1.6l-.4 1.8c5.8 5.2 11 10.2 15.5 14.9 6.5 3.9 15.4 10.7 24.7 19.5.6.6 1.3 1.2 1.9 1.8l.7.7c3.2 3.2 6.5 6.6 9.8 10.2 5.2-58.6 25.2-276.8 24.6-330.3z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "none",
    d: "m1144.1 1165-1.5-3z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.3,
    fill: "#091426",
    d: "M827.5 1578.2c1.5 1.2 3 2.3 4.5 3.4 10.7 7.4 21.6 10.9 35.1 12.7 12.4 1.5 24.9 2.3 37.4 2.4h1.6c1.2 1.6 2.7 3 4.5 4 6.5 4 18 6.6 32.5 8.5-1.7-4.6-4.5-13.5-3.5-28.9.1-1.9-.4-4.2-.5-7 9.6-3.4 25.6-8.8 32.4-16.7 20.7-24.1 32.2-62.7 27.1-90.2 3.2-6.6 5.4-13.6 6.5-20.9 4-28.2-9.2-56.1-26.2-78.5 1.1 5.6 2 11.2 2.4 16.9 4.2 50.9-25.3 102.3-70.2 126.6s-102.7 21.2-146.2-5.6c-17.4-10.7-33.1-27-33.7-48.5-6.4 11.4-7.9 23.6-8.6 36h1.1l.8-.1.3-.1.7-.2.4-.1c.2-.1.5-.1.7-.2l.5-.2.6-.3.6-.3c.2-.1.4-.2.5-.3s.5-.3.7-.5l.5-.3 1.2-.9c5.2 8.6 11.3 16.6 18 24.1 2.8 3.1 5.7 6.1 8.7 8.9 1 .9 2 1.9 3 2.8 9.9 8.9 20.9 16.4 32.8 22.4 2.3 1.2 4.7 2.3 7 3.3 10.4 4.6 21.3 8 32.5 10.1-.1.2-.1.3-.2.5l-.4 1c-.1.3-.2.5-.3.8l-.3.8v.1c-.1.2-.2.5-.3.8s-.3.8-.4 1.1c-.1.2-.1.4-.2.6v.1c-.1.3-.2.6-.3.8l-.1.3c0 .1-.1.2-.1.2-.2.4-.3.8-.4 1.2l-.2.4c-.1.3-.2.6-.3.8v.1c0 .1-.1.2-.1.3-.1.3-.2.7-.3 1 0 .1 0 .2-.1.2l-.2.8-.1.3-.3.8v.1c-.1.2-.1.4-.2.7v.2l-.2.7-.7 3zm90.4-33.3zM774.8 1414.7l-1.4.6 1.4-.6z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.3,
    fill: "#091426",
    d: "M868.8 1446.2c-6.6-10.3-17.6-16.9-28.2-23.2l-49-28.9c-27-15.9-54.9-32.6-72.9-58.3s-34.2-68.7-14.6-93.2c-10.1 6-19.4 8.7-23.8 15.9-1.3 2.3-4.3 3.1-6.5 1.7-1.1-.7-1.9-1.7-2.3-3-1.1-4.6-.5-9 .8-15.2 2.7-13.6 14.7-31.2 23-42.2 32.4-42.5 54.2-51.5 97.5-85.4 14.5-11.3 55.4-33.9 67.3-47.9-63 40-162.7 101.7-193.1 147-39.8 59.2 1 111.7 35.9 147.6 20.9 21.5 48.8 40.2 71.6 53.7l-1.6-.9c21.3 11.3 52.6 28.3 64.2 35.3 12.7 7.7 36.7 24.3 30 31.3-1.2 1.2-3.1 1.4-5.6.9 14.8 4.9 16.7-20.6 7.3-35.2zM762 1420.7l.3-.1-.3.1zM764.3 1419.5l-.7.3.7-.3zM771 1416.4l-.8.4.8-.4zM772.8 1415.6l-1 .4 1-.4zM766 1418.7l-.3.2.3-.2zM769.2 1417.2l-.5.2.5-.2z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.3,
    fill: "#091426",
    d: "M809 1232c2.8 1.2 5.2 2.3 7.5 3.1 34.7-52.3 45.5-66 79.2-107.4 22.8-28 58.5-68 82.8-95.1 15.9-16.2 15.9-18.5 21.6-32.3-44.5 43.7-90.5 87.4-131 134.8-29.5 34.4-65.8 71.3-107 90 12.5-2.1 35.2 1.9 46.9 6.9z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.3,
    fill: "#091426",
    d: "M980.8 974.7c-18.7 12.2-43.3 37.5-75.7 62.1-12.4 9.4-36.4 24.4-64.8 42.4 1.1-.2 2.2-.4 3.2-.7 26.8-6.2 51.8-18.3 73.4-35.3 14-11.1 26.4-24.2 41.1-34.5s32.4-17.7 50.1-15.3c10.9 1.6 21.8 2.5 32.8 2.7 7.9 0 15.3-4 22.9-5.5 2.9 3 6 5.8 8.4 8.5 12.3 13.2 23.6 27.3 35.1 41.2 22.5 27 46.6 54.3 78.9 69.6 15.7 7.4 32.4 11.6 49.6 14.2-11.5-8.1-24.3-17.5-38.6-28-66.7-48.9-111.3-112.5-137.8-130.3-.4.4-.8.9-1.1 1.3-.3-.4-.6-.8-.9-1.1-8.1-9.4-3.1-15.3 3.5-19.4-23.1 5.9-46.6 10-70.3 12.5 3.9 3.3-3.2 9.5-9.8 15.6z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.04,
    fill: "#FFF",
    d: "M653.2 843.2c-6.4-7.3-12.5-15-18.2-23-2.8.5-5.7 1.2-8.5 1.9 9.3 13.2 19.6 25.6 30.7 37.3 2.6-1.2 5.3-2.2 7.9-3.3-4.1-4.2-8-8.5-11.9-12.9zM1295.5 776.4c-1.7 7.9-4.4 15.6-8 22.8 3.7-7.2 6.5-14.9 8.2-22.8h-.2zM1108.5 923.4c-41.6 15.3-85 24.9-129.1 28.6-20.5 1.7-40.2 2.6-58.5 2.6-38.5 0-72.8-3.8-101.8-11.3-55.4-14.4-103-39.7-141.8-75.5-2.6 1.2-5.2 2.5-7.7 3.8 37.3 34.9 85.6 63.3 147.5 79.4 30.8 8 65.8 11.6 103.8 11.6 19 0 38.8-.9 59.2-2.6 57.8-4.8 114.3-19.7 167-44-12.7 3.7-25.6 6.2-38.6 7.4zM616.4 807c2.9-.5 5.8-1 8.6-1.4-21.1-33.1-36.8-69.4-46.2-107.5-15.8-62.6-20.9-108.2-16.6-147.8 4.1-37.6 16.9-68.6 34.9-103.6 14-27.3 62.8-69.5 118.8-102.8 40.5-24.1 120.5-64.7 201.2-65.8 3.1 0 6.2-.1 9.2-.1 60.3 0 115.4 8.6 163.7 25.7 38.8 13.7 72.9 32.8 98.7 55.4 22.2 19.4 45.2 40.5 61.8 66.9 17.9 28.4 26.6 59.7 27.5 98.3 1 45.1-3.9 85.5-8.7 115.8-1.3 22.1-2.5 41.5-1.8 55.1.1 1.7.8 3.3 2.1 4.4 2.5 6.4 9 13.4 15.1 23.8l.8-.5c-7.5-13.2-15.8-20.9-16.4-28.7-1-13 19-83 17-170s-44-129-92-171c-46.9-41-134-83.1-267.7-83.1-3.1 0-6.2 0-9.3.1-139 2-299.2 118.9-327 173-37 72-52 126-19 257 9.3 37.6 24.6 73.7 45.3 106.8zM1297 758c-1-8.4-3.1-16.7-6.3-24.6l-.8.4c3.4 8 5.6 16.5 6.5 25.2.2 1.8.3 3.7.3 5.5l.5-.1c.1-2.1 0-4.3-.2-6.4zM959.6 1345.2l-.7-.7.7.7zM961 1340l5-38.5 5.1-38.5c3.4-25.7 6.7-51.4 9.9-77.1 1.6-12.9 3-25.7 4.5-38.6l2.1-19.3c.7-6.4 1.4-12.9 1.9-19.3l.9-9.7.4-4.8.3-4.8c.5-6.5 1-12.9 1.2-19.4.2-3.2.3-6.5.5-9.7s.2-6.5.3-9.7c.2-6.5.1-13-.1-19.5-3 25.8-6.1 51.4-8.9 77.1-1.4 12.8-2.8 25.7-4.3 38.6l-4.4 38.6c-2.9 25.7-6 51.4-9 77.1l-4.6 38.6-4.8 38.5-.3 2.7c.8.7 1.6 1.5 2.4 2.3l.7.7.7.7.5-6zM910.7 1600.7c2.6-10.5 5.1-21 7.6-31.5 2.3-9.5 4.5-18.9 6.7-28.4l-.3.2c-2.2 1.3-4.5 2.6-6.8 3.9-1.9 7.6-3.8 15.2-5.7 22.9-2.5 9.7-5 19.3-7.6 29h1.6c1.2 1.6 2.7 2.9 4.5 3.9z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.04,
    fill: "#FFF",
    d: "M765.6 1224.7c8.7-1.3 17.5-.8 26 1.4s16.6 5.6 24.2 9.9c11.1 5.1 21.5 11.6 31.7 18.2s20.1 13.8 29.8 21.1 19.2 14.9 28.5 22.8 18.4 16 26.9 24.7l-.1-.1c4.5 2.8 8.8 5.8 12.8 9.1 4.1 3.3 8 6.7 11.9 10.3 7.6 7.2 14.7 15 21.2 23.2 6.5 8.3 12.1 17.1 16.9 26.5 4.8 9.4 8.2 19.4 10 29.8 1.9 10.4 1.5 21.1-1.1 31.4-2.7 10.2-7.6 19.7-13.4 28.4-5.9 8.7-12.6 16.8-20 24.2-7.4 7.5-15.3 14.4-23.6 20.7-8.3 6.3-17.1 12.1-26.1 17.3-9.1 5.2-18.6 9.7-28.5 13.3-4.9 1.8-10 3.3-15.1 4.4-5.1 1.2-10.4 1.9-15.6 2-10.5.3-21-.7-31.3-2.8-20.6-4.4-40.1-13-57.1-25.4-17-12.4-31.4-28-42.3-46v-.1c-.6-2.6-1.2-5.1-1.7-7.7-.6-2.6-.9-5.2-1.1-7.8-.1-2.6 0-5.3.5-7.9.5-2.6 1.2-5.1 2-7.6l.7.2c-1.4 5-2.3 10.2-1.8 15.2.3 2.6.7 5.1 1.4 7.6.6 2.5 1.2 5 1.9 7.6l-.2-.5c11.3 17.3 25.9 32.2 43 43.9 16.8 11.6 35.8 19.6 55.9 23.4 9.9 1.9 20 2.7 30.1 2.2 9.7-.3 19.4-3 28.8-6.5 9.5-3.6 18.6-8 27.4-13.2 8.8-5.1 17.3-10.9 25.3-17.1 8-6.2 15.6-13 22.7-20.2 7.1-7.2 13.5-15 19.1-23.3 5.5-8.1 9.7-17 12.5-26.4.6-2.3 1.1-4.6 1.4-6.9.3-2.4.5-4.8.6-7.1.1-4.8-.2-9.7-1-14.4-1.7-9.7-4.8-19.1-9.3-27.9-4.5-9-9.9-17.6-16-25.6-6.2-8.1-12.9-15.7-20.3-22.7-3.7-3.5-7.5-6.9-11.4-10.1-3.9-3.2-7.9-6.1-12.1-8.8l-.2-.1c-.3-.2-.6-.5-.9-.8-8.2-8.7-17-16.8-26.1-24.8-4.5-4-9.1-7.9-13.8-11.7l-14.1-11.4c-9.5-7.5-19.2-14.7-29.1-21.6-9.9-6.9-20-13.6-30.7-19l-.1-.1c-7.3-4.5-15.2-8-23.4-10.4-4.1-1.2-8.3-2.1-12.6-2.5-4.3-.5-8.6-.4-12.9.1l-.2-.4zM1064 1602.5l1.8-10c2.4-13.4 4.6-26.8 6.8-40.2l3-20.2c1-6.7 1.9-13.5 2.8-20.2 1.7-13.5 3.2-27 4.7-40.5s2.5-27.1 3.5-40.7 1.6-27.2 2-40.8.3-27.2.1-40.8-.7-27.2-1.5-40.8c-1.4-27.2-3.7-54.2-6.6-81.3s-6.6-53.9-10.7-80.8-8.6-53.6-13.4-80.3l-.8.1c4.3 26.8 8.3 53.6 11.8 80.5s6.6 53.8 9.1 80.8 4.4 54 5.4 81.1c.5 13.5.8 27.1.9 40.6s-.1 27.1-.7 40.6-1.4 27-2.6 40.4-2.7 26.9-4.3 40.4-3.2 26.9-5 40.3-3.6 26.8-5.4 40.3-3.8 26.8-5.8 40.2l-1.5 10.1-.8 5c-.3 1.6-.6 3.3-.9 4.9 2.2.3 4.3.4 6.5.2.3-1.3.6-2.6.8-3.8l.8-5.1z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.04,
    fill: "#FFF",
    d: "m970 1047.4-4.3-.6-.5.6c-3.3 24.6-10.3 61.5-18.4 103.8-5.5 30.9-11.8 64.4-18.6 98.6-1.6 8.6-3.1 17.2-4.6 25.8-1.8 10.3-4.1 21.3-6.8 32.7 1.6 1.4 3.1 2.8 4.6 4.2 21.3-100 39.8-204.9 48.6-265.1z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("g", {
    fill: "#46828E"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    className: "main-body-fill",
    d: "M667 806c-42-9-112 14-128 40-10 14 0 23 11 15s65.7-48 113.7-42c8 1 8.6-10.7 3.3-13zM675 852.3c-50.7 18-98 52.7-108.7 80.7-4.7 11.3 6.7 21.3 16.7 11.3s47.3-56 97.3-78c7.4-2.6 1.4-15.3-5.3-14z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("g", {
    fill: "#091426"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.3,
    d: "M664.3 815.7c-7.8.5-15.6.1-23.4.3-22.7.9-44.8 7.5-64.2 19.4-7.8 4.8-15.2 10.4-23.8 13.4-3.7 1.3-7.9 2.1-11.3.3-1.2-.7-2.2-1.7-2.8-2.9-9.7 13.9.2 22.8 11.2 14.8s65.7-48 113.7-42c3.8.5 6-1.9 6.6-4.8-1.9.9-3.9 1.5-6 1.5zM583 944.3c10-10 47.3-56 97.3-78 3.4-1.2 3.9-4.6 2.9-7.7-2.2 3-6.1 5.1-9.7 6.6-12.4 5.4-25.3 10.2-36.5 17.8-15.1 10.2-26.3 25.1-39.2 38-6.2 6.3-13.3 12.4-22.1 13.8-2.3.4-5.1.2-6.6-1.6-.8-1-1.3-2.2-1.5-3.4-.5 1.1-1 2.2-1.4 3.2-4.5 11.3 6.8 21.3 16.8 11.3z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("g", {
    fill: "#46828E"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    className: "main-body-fill",
    d: "M1391.9 778c-18.7-14.5-68.6-17.3-94.7-13.6-.1 4-.6 8.1-1.5 12 33.4-1.4 76.9 10.9 85.2 14.6 9 4 15-2 11-13zM1371.9 701c-11.6-2.7-57.7 5-86.6 21.7 2 3.4 3.7 7 5.3 10.7 25.4-12.8 64.2-15.4 79.3-14.4 16 1 15-15 2-18z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("g", {
    fill: "#091426"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.3,
    d: "M1391.9 778c-.2-.2-.4-.3-.6-.5-1.3 1.6-2.9 2.9-4.7 3.8-6.3 3.1-13.8 2.2-20.8 1-17.1-2.9-33.9-7.1-50.4-12.4-.8-.2-1.5-.5-2.2-1-2.4-1.9-1.6-3.9-.2-5.8-.7 0-1.3 0-2 .1-.9 0-1.8.1-2.8.2h-.5l-2.3.2h-.3c-.9.1-1.8.2-2.6.2h-.2l-2.3.2h-.3l-2.4.3c-.1 4-.6 8.1-1.5 12 1 0 2.1-.1 3.1-.1H1302.2c6.6.1 13.2.5 19.8 1.3 7.8.9 15.5 2.2 22.7 3.6l3 .6c4 .8 7.8 1.7 11.4 2.6l2.5.6h.1l2.3.6h.2l2.2.6h.2l2.1.6h.1c1.4.4 2.7.8 3.9 1.2h.1l1.7.5h.2l1.5.5.2.1 1.3.4.2.1 1.1.4h.1l1 .4h.1l.8.3c8.9 4.4 14.9-1.6 10.9-12.6zM1371.6 719h1.3l.9-.1h.3l1-.2.2-.1c.3-.1.5-.1.8-.2l.3-.1c.2-.1.4-.1.6-.2l.3-.1c.2-.1.5-.2.7-.3h.1c.2-.1.5-.3.7-.5l.2-.2c.2-.1.3-.2.4-.4l.2-.2.4-.4.2-.2c.2-.2.3-.4.4-.6l.1-.1c.1-.2.2-.3.3-.5 0-.1.1-.1.1-.2.1-.1.1-.3.2-.5l.1-.2c.1-.2.1-.3.2-.5s0-.1 0-.2c.1-.2.1-.5.1-.7v-1.7s0-.5-.1-.7v-.1c0-.2-.1-.4-.1-.6s0-.2-.1-.3-.1-.3-.2-.5c0-.1-.1-.2-.1-.3-.1-.2-.1-.3-.2-.5 0-.1-.1-.2-.1-.2s-.2-.5-.4-.7c0-.1-.1-.1-.1-.2l-.3-.5-.2-.3-.3-.4c-.1-.1-.1-.2-.2-.2s-.3-.3-.5-.5l-.1-.1c-2.1 2.1-4.5 3.9-7.1 5.4-6.2 3.5-13.3 5.3-20.3 6.6-14.6 2.8-29.5 3.9-44.3 3.3-1.3 0-2.5-.2-3.7-.6-1.5-.7-2.7-2-3.2-3.6-1.1.5-2.2.9-3.2 1.4l-1.1.5c-.7.3-1.3.6-2 .9l-1.3.7-1.7.8-1.4.7-1.6.8-1.4.8-.8.5c2 3.4 3.7 7 5.3 10.7l1.8-.9.7-.3c.6-.3 1.2-.5 1.7-.8l.8-.4c.6-.2 1.1-.5 1.7-.7l.9-.4c.6-.2 1.1-.4 1.7-.7l1-.4 1.7-.6 1-.3 1.8-.6 1-.3 1.8-.5 1.1-.3 1.8-.5 1.1-.3 1.9-.5 1-.3 1.8-.4 1-.2c.6-.2 1.2-.3 1.9-.4l1-.2 1.9-.4.9-.2 2-.4.7-.1c.7-.1 1.4-.3 2.2-.4h.1c2.6-.4 5.2-.8 7.7-1.2l.6-.1 1.8-.2 1-.1 1.7-.2 1.1-.1 1.6-.2 1.1-.1 1.5-.1 1.2-.1 1.4-.1 1.2-.1c.4 0 .9-.1 1.3-.1l1.2-.1 1.2-.1 1.2-.1H1368.8l1.5.1h1.3z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#46828E",
    className: "main-body-fill",
    d: "M994 274c25 7 66 42 80 45s15.7-4.7 15.7-4.7c27 3 79.3 32.7 93.3 45.7 7 8 15 14 15-2s6-137-27-165c-39.4-33.5-156 45-177 81z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("g", {
    fill: "#091426"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.3,
    d: "M1084.6 317.8c-2.1.1-4.2.1-6.2-.2-11.1-1.7-18.8-12.1-23.1-22.5-10.2-24.2-4.5-57.4 7.9-80.4-31.8 19.2-59.8 43.5-69.1 59.4 25 7 66 42 80 45 4.6.9 8 .1 10.5-1.3zM1095.8 319c-1.8-.2-3.1-1.9-2.8-3.7.1-.6.3-1.2.7-1.6 8.5-10.4 20.1-37.9 24-47.3 4.7-11.3 20-47.3 26.7-52.7s13.3-6.7 17.3-6 9.3 7.3 12 18.7 10.7 70 11.3 82 7.3 37.3 3.3 39.3-16.8-9.7-26-14.7c-8.7-4.7-32.7-14-46-15.3-6.4-.7-15 2-20.5 1.3z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#46828E",
    className: "main-body-fill",
    d: "M588 462c-10-102 58-248 138-264 31-6.2 107 76 121 109 6 14-20 5-52 14s-86 48-88 57 6 46-2 56-47 4.7-69.3 7c-21.8 2.3-32.7 10-47.7 21z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("g", {
    fill: "#091426"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.3,
    d: "M639.2 341.9c-4.8-23.3-4.2-47.3-.8-70.9-34.9 55.1-56.3 130.7-50.4 191 15-11 25.9-18.7 47.7-21 4.4-.5 9.4-.6 14.7-.7 2.9-3.3 5.6-6.7 8.2-10.2 5.5-7.3 13-12.9 20.6-16.9-21.2-17.9-34.4-44.1-40-71.3zM847.5 312.1c-3.2.7-7.1-.9-10.4-2.4-8.1-3.8-16.8-6.5-25.6-8-1.4-.1-2.8-.6-4-1.3-1-.8-1.8-1.8-2.4-3-13.2-22.3-29.8-42.4-49.1-59.8-9.2-8.3-20.8-16.4-33-14.1-10.3 1.9-17.9 11-22.7 20.4-6 11.8-9.2 24.8-11.8 37.8-6.7 33-10.4 66.5-11.1 100.2-.1 3.1-.1 6.2.9 9.2s3.2 5.6 6.2 6.3c8.1 1.9 16.4-5.4 22.2-10.7-.3-2.9-.2-5.8.2-8.7 2-9 56-48 88-57 27-7.6 49.7-2.4 52.6-8.9z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("g", {
    "data-cat": "eyes"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#C6D9D5",
    d: "M857.6 602.2c-5.7 0-11.5.5-17.1 1.4.4 13.3 1.1 26.8 1.8 35.5 4.1-7.9 7.6-16.1 8.7-25.1 40.8 2.8 79 25.3 100.3 60.5 0-6.2-.2-12.2-.4-18.2-18.5-5.7-33.4-54.1-93.3-54.1z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#D9E9E6",
    d: "M851 614c-1.1 9-4.6 17.1-8.7 25.1.3 3.5.5 6.3.8 7.9 7.4 49.5 20.2 108.2 68.6 108.2 31.8 0 39.7-46.6 39.7-78.2v-2.5C930 639.3 891.8 616.8 851 614zM1179 592c-33.5 10.2-68.7 26.5-87.1 57.7-2 11.2-3.4 22.4-3.4 33.2 0 38.1 18.4 54.5 39.7 54.5 38.3 0 51.4-66.1 55.2-117.3-1.4-9.4-2.9-18.7-4.4-28.1z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#C6D9D5",
    d: "M1179 592c1.5 9.4 3 18.7 4.4 28.1 1-13.3 1.3-25.6 1.3-35.5 0-3.7 0-7.3-.1-10.7-44.6 8.4-64.8 35-87.2 49.4-2 8.7-4 17.5-5.6 26.3 18.5-31.1 53.7-47.4 87.2-57.6z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#A37D76",
    d: "M835.6 605.6c32.6-13.9 58.6-8.2 85.1 15.9 17.4 15.7 26.1 27.7 32.1 31.1 3.4 1.9 12.9-2 12.8-2.2 4.1 6-10.8 9-13.7 8.3-13.8-3-34.3-42.7-75.2-48.9-7.2-1.1-14.5-.3-21.8-.8-2.9-.2-20.2-3-19.3-3.4zM1091 619.7c2.5 10.1 9.7.2 14.8-4.5 8.7-7.9 16.5-16.5 25.7-23.8 10.9-8.7 24.2-17.8 38.6-19 1.9-.2 20.8.5 21.4 4.2.6 3.4-11.5 5-14.9 5.9-18.5 4.8-34.2 11.5-49.6 23.1-6.7 5.1-23.7 25.5-32.9 24.2-12.7-1.7-4.1-13.7-3.1-10.1z",
    className: "face-accent-fill-color"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("ellipse", {
    transform: "rotate(-11.11 905.313 692.997)",
    fill: "#0F4456",
    cx: 905.4,
    cy: 693,
    rx: 32.5,
    ry: 53.1,
    className: "eye-fill-color"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("ellipse", {
    transform: "rotate(-11.11 905.313 692.997)",
    opacity: 0.16,
    cx: 905.4,
    cy: 693,
    rx: 32.5,
    ry: 53.1
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#0F4456",
    d: "M911.6 740.3c-14 0-28.7-18.5-33.3-42.1-5-25.6 3.1-49.6 17.8-52.5 1-.2 2-.3 3-.3 14 0 28.7 18.5 33.3 42.1 2.6 13 1.9 25.8-1.9 36-3.5 9.3-9.1 15.2-15.9 16.5-1 .3-2 .3-3 .3z",
    className: "eye-fill-color"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("ellipse", {
    transform: "matrix(.08497 -.9964 .9964 .08497 350.898 1733.87)",
    fill: "#0F4456",
    cx: 1119.5,
    cy: 675.9,
    rx: 53.1,
    ry: 28.5,
    className: "eye-fill-color"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("ellipse", {
    transform: "matrix(.08497 -.9964 .9964 .08497 350.898 1733.87)",
    opacity: 0.16,
    cx: 1119.5,
    cy: 675.9,
    rx: 53.1,
    ry: 28.5
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#0F4456",
    d: "M1116.2 723.8h-.9c-11.3-1-21.8-21.2-19.3-49.9 1.1-12.9 4.7-24.9 10.3-33.7 4.9-7.8 10.9-12.3 16.3-12.3h.9c11.3 1 21.8 21.2 19.3 49.9-1.1 12.9-4.7 24.9-10.3 33.7-4.8 7.8-10.8 12.3-16.3 12.3z",
    className: "eye-fill-color"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#A37D76",
    d: "M849.3 605c.4 19.3-3.1 90.1 19.6 122.4 2.2 3.1 10 13.9 23.8 19.8 8.2 3.5 15 3.7 17.3 3.7 3.7 0 9.1 0 14.8-2.8 4.1-2 7.5-4.9 11.1-9.6 11.1-14.4 12-30 12.6-29.9s.5 19.4-11.3 34.8c-6.9 8.9-16.5 13.2-27.6 13.3-12.6.1-30.4-6.9-42.8-22.7-17.9-22.7-23.6-56.2-26-80.4-2.8-28.9-.3-46.9 0-48.8.1-.9 6.2-3.3 7.4-2.7 1.1.5 1.1 2.2 1.1 2.9zM1091.5 707.2c5.9 17.2 18.3 30.9 38.5 29.4 22.8-1.7 33.2-27.8 38.9-46.5 7-22.6 10.1-46.5 11.9-70 .2-3 1.8-29.7 3.8-40.1.5-2.6 1.7-2.4 2.4-2.5 4.4-.7-1.2 50-1.8 56.3-2.2 23.6-6.1 46.3-14.7 68.5-7.3 18.8-20.8 40.3-43.7 39.3-23.5-1.1-29.2-16.6-35.3-34.4z",
    className: "face-accent-fill-color"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("ellipse", {
    transform: "rotate(-12.268 910.708 656.894)",
    fill: "#FFF",
    cx: 910.7,
    cy: 656.9,
    rx: 9,
    ry: 20.9
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("ellipse", {
    transform: "rotate(-83.656 1129.922 641.845)",
    fill: "#FFF",
    cx: 1129.9,
    cy: 641.9,
    rx: 20.9,
    ry: 9
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("g", {
    "data-cat": "mouths"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.1,
    d: "M930.9 832.7s46.8 17.9 107.1 6.8c42.1-7.7 101.2-34.1 101.2-34.1s-20.9-1.6-23.3-2.1c-.7-.2 4.6-2.4-9.2 5.9-6 3.6-49.2 22.6-81.2 26.1 0 0-37.6 6.1-67.6-4.9-2.9-1.1-5.6-4.9-5.6-4.9l-21.4 7.2z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#A37D76",
    className: "face-accent-fill-color",
    d: "M945.1 826.9c23.3 15.2 54.2 13.7 80.9 9.9 32.9-4.6 66.8-17.8 95.5-34 .8 1.5 6.9.4 7.7 1.9-30.6 15.4-61.3 29.6-103.1 35.3-16.8 2.3-34.2 3.4-51.1 1.5-10.8-1.2-27.4-3.9-35.9-11.5 1.1-1.2 4.9-1.8 6-3.1z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#A37D76",
    className: "face-accent-fill-color",
    d: "M929.1 833c0-.2.1-.2.1-.2h.1l.1-.1.2-.1.4-.2.8-.3 1.5-.6 3-1.1 6-2.2c2-.7 3.9-1.8 6-2.2 2.1-.5 4.2-.9 6.5-.9l.1.3c-1.7 1.5-3.6 2.6-5.6 3.5s-4.2 1.2-6.3 1.7-4.2 1-6.3 1.4l-3.2.6-1.6.3-.8.1-.4.1H929.4s.1 0 0-.2l-.3.1zM1113.4 802.8c2.6-.2 5-.1 7.5 0 2.4.1 4.8.8 7.3 1.2 1.2.2 2.4.3 3.7.5 1.2.2 2.4.3 3.7.5l3.7.4c1.2.1 2.5.2 3.7.4v.3c-2.5.2-5 .3-7.4.4-2.5 0-5 0-7.5-.1s-5 0-7.5-.6c-1.2-.3-2.4-.6-3.6-1.1-1.2-.4-2.4-.9-3.5-1.7l-.1-.2z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("g", {
    "data-cat": "footwear"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.3,
    fill: "#05132B",
    d: "M1315.1 1694.7c-9.8 22.8-8.8 29.7-31.6 37.7s-90.2 23.8-125.8 18.8-36.7-7.9-46.6-1-57.5 26.8-82.2 44.6c-24.8 17.8-41.6 36.7-67.4 43.6-25.8 6.9-39.6 12.9-77.3 8.9s-56.5-4-83.2-16.8-54.5-13.9-73.3-19.8c-18.8-5.9-32.7-9.9-58.5-20.8s-83.2-35.7-64.4-68.4c18.8-32.7 97.1-33.7 97.1-33.7l484.5-6.9 128.7 13.8z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#555",
    d: "M1064.1 1599.6c14.5 4.4 38.8 3.1 51.5-1.8s36.6-7.5 41.4-13.2 34.3-14.5 66.5-7.9 61.7 27.7 77.1 56.8 18.1 49.8 14.5 61.2c-3.5 11.4-48 41.8-77.9 46.7-29.9 4.8-100.4 3.1-123.3-3.1s-55.5-16.3-55.5-16.3 3.1 5.3-6.2 23.8-58.1 88.1-113.6 95.6c-55.5 7.5-110.1-8.4-125.1-15.4-15-7.1-27.7-18.1-29.1-24.7-19.4 2.6-63-.9-87.6-10.6-24.7-9.7-45.8-22.5-49.3-26.9s-7-47.6 20.7-90.7c27.7-43.2 66.9-56.8 100-64.7 33-7.9 47.1-6.2 53.3-6.6 16.3 7.9 45.8 27.3 63.8 22.9 8.8-6.6 33.9-11 53.7-9.7 19.8 1.3 66 10.1 81 16.7s34.8-11 40.9-18.5c6.3-7.4 3.2-13.6 3.2-13.6z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("g", {
    opacity: 0.3,
    fill: "#05132B"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    d: "M1314.8 1669.9c-.8 10.3-1.6 18.4-4.5 25l-5.8-10.1-8.2 10.6c-.5 1.9 5.2 6.5 7.4 9.1-2.9 2.8-6.6 5.4-11.4 7.9-8.6 4.4-16.6 8.2-24.3 11.2l-.9-14.7-14.1-5.9-3.5 5.3c6.5 3.7 8.2 13 8.5 18.8-7.7 2.3-15.3 3.7-23.3 3.9-11.4.4-26.4 1.4-40.5 1.6l-3.4-10.2-14.1-10-4.1 7c5.1 2.3 9.6 7.8 9.9 12.9-5.3-.2-10.3-.7-14.6-1.4-18-3.2-51.9.6-71.2-21.8-19.2-22.4-25-56.4-22.4-66.7 2.6-10.3.6-10.9-.6-17.3s.6-17.3.6-17.3 41.7-3.8 60.9-11.5c10.6-4.2 16.7-5 20.4-7.2.2 0 .3 0 .4-.1v-.2c.6-.4 1.1-.8 1.5-1.3 6.6-1 13.3-1.6 19.9-1.7 8.1-.2 16.2.3 24.2 1.7 7.9 1.4 15.7 3.7 23 7.1 7.3 3.4 14.1 7.8 19.8 13.4 1.4 1.4 2.8 2.8 4.1 4.3 1.2 1.5 2.3 3.2 3.3 4.9 2 3.4 3.4 7.2 4.6 11 2.4 7.7 3.5 15.7 4.2 23.8.7 8.1.7 16.2.4 24.3-.3 8.1-.9 16.3-2 24.3l.7.1c3-16.1 4.3-32.5 3.4-49-.5-8.2-1.6-16.4-3.9-24.4-1.2-4-2.7-7.9-4.8-11.6-1-1.8-2.2-3.6-3.6-5.3-1.3-1.7-2.8-3.1-4.3-4.6-6-5.8-13.1-10.4-20.7-13.8-7.6-3.4-15.6-5.6-23.8-6.8-8.2-1.2-16.4-1.6-24.6-1.1-6.4.4-12.7 1.2-19 2.4.1-.2.2-.4.4-.6 2.2-.4 4.4-.7 6.6-1l-.1-.8c-2.1.3-4.1.7-6.2 1.1.4-.8.7-1.8 1-2.8-1.3.8-2.3 1.6-3 2.3-.4.5-.9.9-1.5 1.3h-.2v.1c-7.2 4.8-28.1 7.4-39.7 11.8-12.8 4.8-37 6.2-51.5 1.8 0 0 3.1 6.2-3.1 13.7-5.6 6.8-22.5 22-36.8 19.7 6.7 2.9 13.5 10.3 17.2 20.4 4.5 12.2 7.1 62.8.6 77.6s-32.1 60.3-57.7 73.1c-19.3 9.7-39.4 21.2-67.4 24.9-.3-3-.3-6.3.7-8.6l-11.2-6.5-1.7 16.1c-5.7.2-11.6.2-17.9-.3-14.8-1.1-28.9-3-41.5-5.8-.5-5.6-.8-13.6 1.3-17.6l-8.2 1.4c-1.9-9.9-2.9-19.9-3.2-29.9-.3-10.5.2-21 1.6-31.4 1.3-10.4 3.4-20.7 6.4-30.8.8-2.5 1.6-5 2.5-7.5l2.8-7.3c2-4.8 4.4-9.4 7.3-13.7 1.4-2.2 3-4.3 4.5-6.4 1.6-2.1 3.2-4.1 5-6.1 3.5-3.9 7.1-7.7 10.9-11.2 7.7-7.1 16-13.6 24.7-19.5s17.8-11.2 27.2-15.9c4.7-2.3 9.5-4.5 14.4-6.4 4.9-1.9 9.9-3.6 15.1-4.4l-.1-.7c-5.3.6-10.4 2.2-15.4 3.9s-9.9 3.8-14.7 6.1c-9.6 4.5-18.9 9.8-27.8 15.5-4.4 2.9-8.8 6-13 9.2-4.2 3.2-8.3 6.7-12.2 10.3-4 3.6-7.7 7.4-11.2 11.4-1.8 2-3.5 4.1-5.1 6.2-1.6 2.2-3.2 4.3-4.7 6.6-2.9 4.5-5.5 9.2-7.6 14.2l-2.8 7.5c-.9 2.5-1.6 5.1-2.4 7.6-3 10.2-5.1 20.7-6.3 31.3-1.1 10.6-1.4 21.2-.9 31.8.3 5.3.8 10.6 1.6 15.8.7 4.8 1.5 9.5 2.7 14.1l-4.6.8-7.3 9.9c-10.1-3.5-18.5-7.7-24.3-12.5-.2-3.8-1-9-.6-11.5l-5.3-6.5-3.8 4.3c-7.5-18.5-10-48.2 5.3-80 16.7-34.6 39.1-61.6 62.8-72.5 13.4-6.2 24-12.9 30.1-17.9-1.9.8-3.5 1.8-4.8 2.7-13.1 3.2-32.2-6.1-48-14.5 3.1-.4 6.2-.7 9.3-.9v-.3c-3.3.2-6.7.4-10 .7v.2c-1.2-.6-2.4-1.3-3.5-1.9 2.7-.3 5.5-.6 8.2-.9v-.7c-3.3.1-6.7.3-10 .6-2-1.1-3.8-2.1-5.6-3 1.5.9 3 1.9 4.4 3.1-6.8.6-13.6 1.4-20.4 2.4-10.5 1.6-20.9 3.7-31.2 6.3-5.1 1.3-10.3 2.8-15.3 4.4-5.1 1.6-10.1 3.4-15 5.4s-9.8 4.2-14.6 6.6c-4.8 2.4-9.4 5.1-13.8 8.2-4.4 3-8.7 6.4-12.5 10.2-1.9 1.9-3.8 3.7-5.7 5.6-1.8 1.9-3.7 3.9-5.4 5.9-1.7 2.1-3.5 4.1-5.1 6.2l-2.4 3.2c-.8 1.1-1.6 2.1-2.3 3.3l-2.2 3.4-1.1 1.7-1 1.8-1.9 3.6c-.6 1.2-1.1 2.4-1.7 3.7-2.3 4.9-3.8 10.1-5 15.4-1 5.3-1.7 10.7-1.6 16-.1 5.4.5 10.7 1.2 15.9.4 2.6.9 5.2 1.4 7.8.6 2.6 1.2 5.2 1.8 7.7l.7-.2-1.2-7.8c-.3-2.6-.7-5.2-.9-7.8l-.3-3.9-.1-2V1722.5l.1-1.9c.1-1.3.1-2.6.2-3.9l.5-3.9c.1-.6.1-1.3.2-1.9l.4-1.9.8-3.8c1.3-5 2.9-9.9 5.2-14.6 4.4-9.3 10.5-17.9 17.4-25.7 1.8-1.9 3.6-3.8 5.3-5.7 1.8-1.9 3.7-3.7 5.6-5.5 3.7-3.7 7.7-6.9 12-9.8 8.5-5.9 17.9-10.6 27.6-14.7 9.7-4 19.6-7.4 29.8-10.2 5.1-1.4 10.2-2.7 15.3-3.9 5.1-1.2 10.3-2.2 15.5-3.2 7.1-1.3 14.2-2.5 21.3-3.3 5.3 4.8 9.1 11.1 8 17-1.9 10.3-9.6 17.3-15.4 24.4s-11.5 17.3-11.5 17.3-26.9 7.7-37.2 30.8c-10.3 23.1-21.8 57.7-17.3 74.4-9.6 7.1-18 12.2-27.6 12.2s-24.4-3.2-43-9.6c-2-.7-4-1.4-5.8-2-.2-4.2-.2-12.2 1.9-15.6l-10.6-1.2-7.2 10c-6-3.5-10-7.9-11.6-14.9-2.2-9.4-4.5-23.5-4.8-34.4-6.4 25.2-4.1 44.6-1.8 47.5 3.5 4.4 24.7 17.2 49.3 26.9 24.7 9.7 68.3 13.2 87.6 10.6 1.3 6.6 14.1 17.6 29.1 24.7s69.6 22.9 125.1 15.4c55.5-7.5 104.4-77.1 113.6-95.6s6.2-23.8 6.2-23.8 32.6 10.1 55.5 16.3 93.4 7.9 123.3 3.1c29.9-4.8 74.4-35.2 77.9-46.7 1.5-6.6 1.7-14.9-.6-25.5zM821.5 1601.8c-.1 0-.1 0 0 0 .1.1.3.1.5.2-.2-.1-.4-.1-.5-.2z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    d: "M1013.9 1629.4c2 1.2 4.2 2 6.2 2.3-1.7-.7-3.8-1.5-6.2-2.3zM1185.2 1583.4v-1.3c-3.3.1-6.7.3-10 .7l.1 1c3.2-.2 6.5-.4 9.9-.4zM1205.2 1583c-3.3-.4-6.7-.7-10-.8l-.1 1.4c3.3.2 6.6.5 9.9.9l.2-1.5zM1224.9 1587.3c-3.2-1.1-6.4-1.9-9.7-2.7l-.4 1.7c3.2.7 6.4 1.6 9.5 2.7l.6-1.7zM1243.1 1596.1c-2.8-1.9-5.8-3.5-8.8-5l-.8 1.7c3 1.4 5.8 3.1 8.6 4.9l1-1.6zM1253.1 1607.3c1.1 1.2 2.1 2.5 2.9 3.9l1.7-1.1c-.9-1.4-2-2.8-3.1-4.1-1.2-1.3-2.3-2.5-3.6-3.6l-1.3 1.4c1.2 1.1 2.3 2.3 3.4 3.5zM1265.1 1628.9c-.8-3.3-1.7-6.5-2.9-9.7l-1.8.7c1.2 3.1 2.1 6.2 2.9 9.4l1.8-.4zM1267.9 1648.8c-.2-3.3-.5-6.7-1-10l-1.8.2c.5 3.3.8 6.6 1.1 9.9l1.7-.1zM1268.2 1658.8h-1.5c.1 3.3.1 6.6 0 10h1.3c.2-3.3.2-6.6.2-10zM1265.6 1688.8l.8.1c.4-3.3.7-6.6 1-10l-1.1-.1c-.2 3.3-.4 6.6-.7 10zM1264.8 1700.1l.2-1.3-.5-.1-.2 1.3zM1165.8 1588.4c3.3-.1 6.6 0 9.9.1l.1-1.3c-3.3-.1-6.7-.1-10 .1v1.1zM1195.5 1591.2l.3-1.6c-3.3-.7-6.6-1.2-9.9-1.6l-.2 1.4c3.3.5 6.5 1 9.8 1.8zM1214.4 1597.1l.7-1.7c-3.1-1.3-6.3-2.4-9.5-3.4l-.5 1.7c3.1 1 6.2 2.1 9.3 3.4zM1223.2 1601.5c2.9 1.6 5.7 3.4 8.3 5.3l1.1-1.6c-2.7-2-5.6-3.8-8.5-5.4l-.9 1.7zM1240.5 1611.8l-1.4 1.4c1.2 1.1 2.3 2.3 3.4 3.5 1.1 1.2 2.1 2.5 3 3.8l1.6-1.1c-.9-1.4-2-2.8-3.1-4.1-1.1-1.2-2.3-2.4-3.5-3.5zM1250.1 1629.2c1.2 3 2.2 6.2 3 9.4l1.8-.4c-.8-3.3-1.8-6.5-3.1-9.6l-1.7.6zM1257.7 1658c-.2-3.3-.4-6.7-.9-10l-1.8.2c.5 3.3.8 6.6 1.1 9.9l1.6-.1zM1257.9 1668.1h-1.4c0 3.3-.1 6.6-.2 10l1.2.1c.2-3.4.3-6.8.4-10.1zM1256.6 1688.1l-.9-.1c-.3 3.3-.7 6.6-1.1 9.9l.5.1c.6-3.3 1.1-6.6 1.5-9.9zM948.2 1617.5v-.4c-3.3.4-6.6 1.2-9.8 2l.2.6c3.1-.9 6.4-1.7 9.6-2.2zM929.1 1622.9l-.3-.8c-3.2 1.1-6.3 2.3-9.3 3.6l.4 1c3-1.3 6.1-2.6 9.2-3.8zM910.9 1631l-.6-1.1c-3 1.4-6 3-8.9 4.5l.7 1.2c2.8-1.6 5.8-3.1 8.8-4.6zM885 1646c2.7-1.9 5.5-3.7 8.4-5.4l-.8-1.3c-2.9 1.7-5.7 3.5-8.5 5.3l.9 1.4zM869.2 1658.1c2.5-2.2 5.1-4.2 7.8-6.2l-1.1-1.4c-2.7 2-5.3 4.1-7.9 6.2l1.2 1.4zM855 1671.9c2.2-2.5 4.5-4.9 6.8-7.2l-1.3-1.3c-2.4 2.3-4.8 4.8-7 7.3l1.5 1.2zM843.4 1688c1.6-2.9 3.4-5.6 5.3-8.3l-1.5-1.1c-2 2.7-3.8 5.5-5.5 8.5l1.7.9zM835.8 1706.2c1-3.2 2.2-6.3 3.4-9.3l-1.8-.8c-1.2 3.1-2.4 6.3-3.4 9.5l1.8.6zM831.1 1715.2c-.8 3.2-1.5 6.5-2.1 9.8l1.8.3c.6-3.3 1.3-6.5 2.2-9.7l-1.9-.4zM829.2 1735.2l-1.8-.2c-.4 3.3-.7 6.7-.9 10l1.7.1c.3-3.3.6-6.6 1-9.9zM826.4 1765.1l1.4-.1c-.1-3.3-.1-6.6 0-10h-1.6c0 3.4 0 6.8.2 10.1zM829.3 1784.9c-.4-3.3-.7-6.6-1-9.9l-1.2.1c.3 3.3.7 6.7 1.2 10l1-.2zM829.9 1794.9c.6 3.3 1.4 6.5 2.2 9.8l.5-.1c-.7-3.2-1.3-6.5-1.9-9.8l-.8.1zM952.2 1619.5c3.1-1.1 6.3-2.1 9.6-2.6v-.4c-3.3.4-6.6 1.3-9.8 2.4l.2.6zM934.1 1628c2.9-1.6 5.8-3.2 8.8-4.6l-.4-.8c-3 1.4-6 2.9-9 4.4l.6 1zM917.2 1638.5c2.7-1.9 5.5-3.7 8.3-5.5l-.7-1.1c-2.9 1.7-5.7 3.5-8.5 5.4l.9 1.2zM901.3 1650.5c2.6-2.1 5.2-4.2 7.8-6.2l-.9-1.2c-2.7 2-5.3 4-8 6.1l1.1 1.3zM886.5 1663.8c2.4-2.3 4.8-4.6 7.2-6.8l-1.2-1.3c-2.5 2.2-5 4.5-7.3 6.9l1.3 1.2zM873.2 1678.6c2.1-2.6 4.2-5.1 6.4-7.6l-1.4-1.2c-2.3 2.5-4.4 5-6.5 7.7l1.5 1.1zM862.1 1695c1.6-2.9 3.3-5.7 5.2-8.4l-1.6-1.1c-1.9 2.8-3.7 5.6-5.3 8.6l1.7.9zM854.2 1707.8l-1.8 4.7 1.8.7 1.8-4.6.9-2.3c.3-.8.6-1.6.9-2.3l-1.8-.8c-.3.8-.6 1.6-.9 2.3l-.9 2.3zM848 1732.2c.9-3.2 1.9-6.4 2.9-9.5l-1.8-.6c-1 3.2-2 6.4-2.9 9.6l1.8.5zM843.4 1751.5c.7-3.3 1.3-6.5 2.1-9.7l-1.7-.4c-.8 3.3-1.5 6.5-2 9.8l1.6.3zM840.2 1761.1c-.4 3.3-.8 6.7-1 10l1.4.1c.3-3.3.7-6.6 1.2-9.9l-1.6-.2zM838.6 1781.1c0 3.3 0 6.7.2 10h.9c-.1-3.3-.1-6.6 0-10h-1.1zM841.2 1806.9l.4-.1c-.4-1.9-.8-3.8-1-5.8l-.6.1c.3 2 .7 3.9 1.2 5.8zM826.8 1610.8l-10 1.6.2.9 9.9-1.7zM807 1614.2l-9.8 2.2.3 1.2 9.7-2.2zM787.5 1618.8l-9.6 2.8.4 1.5 9.6-2.9zM768.3 1624.7c-3.2 1.1-6.3 2.2-9.4 3.5l.7 1.6 9.3-3.6-.6-1.5zM749.7 1632.1c-3 1.4-6.1 2.8-9 4.4l.8 1.6c2.9-1.6 5.9-3 8.9-4.4l-.7-1.6zM731.9 1641.5c-2.9 1.8-5.7 3.6-8.4 5.6l1.1 1.5c2.7-2 5.4-3.8 8.2-5.6l-.9-1.5zM717.1 1655l-1.3-1.4c-1.2 1.2-2.4 2.3-3.6 3.5l-3.6 3.5 1.4 1.4 3.6-3.5c1.1-1.2 2.3-2.4 3.5-3.5zM701.6 1667.8c-2.3 2.5-4.5 5-6.6 7.6l1.5 1.2c2.1-2.6 4.3-5.1 6.5-7.5l-1.4-1.3zM689 1683.5c-1.9 2.8-3.6 5.7-5.2 8.7l1.6.8c1.5-2.9 3.3-5.7 5.1-8.5l-1.5-1zM679.8 1701.5c-1.1 3.2-1.9 6.5-2.5 9.8l1.4.3c.6-3.2 1.5-6.4 2.6-9.5l-1.5-.6zM676.6 1731.3l1-.1c-.2-3.3-.2-6.6 0-9.9l-1.3-.1c-.1 3.5 0 6.8.3 10.1zM677.9 1741.3c.5 3.1 1.2 6.2 1.9 9.3l.3-.1c-.6-3.1-1.1-6.2-1.5-9.3l-.7.1zM838.5 1604v-.3c-3.3.2-6.7.4-10 .7l.1.6c3.2-.5 6.6-.8 9.9-1zM818.6 1606.1l-.1-.7-9.9 1.3.2 1zM798.9 1609.5l-.2-1.1-9.8 1.9.3 1.3zM779.5 1613.9l-.4-1.4-9.7 2.5.4 1.5zM760.3 1619.4l-.5-1.6c-3.2 1-6.4 2.1-9.5 3.2l.6 1.6c3.1-1.1 6.2-2.2 9.4-3.2zM741.6 1626.3l-.7-1.7c-3.1 1.3-6.2 2.7-9.2 4.1l.8 1.6c3-1.3 6-2.7 9.1-4zM723.8 1635.1l-.9-1.6c-2.9 1.7-5.8 3.4-8.5 5.4l1.1 1.6c2.6-2 5.4-3.8 8.3-5.4zM704 1649.8c.6-.6 1.2-1.2 1.8-1.7l1.8-1.7-1.3-1.5-1.9 1.7c-.6.6-1.2 1.2-1.8 1.7l-3.6 3.5 1.4 1.4 3.6-3.4zM693.6 1660.6l-1.5-1.3c-2.2 2.5-4.4 5.1-6.4 7.8l1.5 1.2c2.1-2.7 4.2-5.3 6.4-7.7zM681.5 1676.3l-1.6-1c-1.8 2.8-3.4 5.8-4.9 8.8l1.6.8c1.6-2.9 3.2-5.8 4.9-8.6zM673 1694.1l-1.6-.5c-1 3.2-1.8 6.5-2.5 9.8l1.5.3c.6-3.3 1.5-6.5 2.6-9.6zM668.9 1723.4c-.1-3.3 0-6.6.2-9.9l-1.3-.1c-.2 3.3-.2 6.7 0 10.1l1.1-.1zM668.7 1733.4c.5 3.3 1 6.6 1.7 9.9l.6-.1c-.5-3.3-1-6.6-1.4-9.9l-.9.1z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#FFFBE9",
    d: "M1172 1716.7c-.9-5.3.9-11 6.2-12.8s10.6-.9 12.8 1.3c2.2 2.2 7.9 12.3 10.1 21.1s1.8 28.6-5.7 26c-7.5-2.6-3.5-12.8-7.9-22s-13.3-7.9-15.5-13.6zM1249.3 1708.3c-3.8-7.4 1.5-14.4 6.4-15.3s8.8-.4 11 1.8 6.6 6.6 8.8 14.5c2.2 7.9 1.8 29.9-5.7 28.6-7.5-1.3-4-11.9-7.1-18.5-3.1-6.6-8.3-5.5-13.4-11.1zM1296.2 1695.3c-.5-6.4.4-16.5-.1-21.3-.4-4.7 6.2-3.5 11.9-1.8s10.6 9.2 13.7 17.6 3.1 29.1-2.2 26.4c-5.3-2.6-5.7-8.8-10.1-13.7s-10.9-1.7-13.2-7.2zM917.7 1820.4c.2-5.4 2.4-13.4-1.6-18.2-4-4.8-12.3-7.1-17.2-6.2-4.8.9-17.2 7.5-16.3 23.3s9.5 39.2 21.1 38.3c6.9-.5 1.3-15.4 2.2-22.9s9.8-7.1 11.8-14.3zM847 1807.9c5.6-4.8 6.2-10.6 3.1-16.3s-11.5-9.2-15-8.4c-3.5.9-22 9.7-26 22s3.1 42.7 8.8 40.1c5.7-2.6 4-22.9 12.3-29.5 8.4-6.6 13.7-5.3 16.8-7.9zM793.7 1770c5.4 1 7.5 9.2 9.2 13.7s1.8 11.4-.4 13.2-8.4-.4-14.1 7.5c-6.7 9.2-4 25.1-8.4 26.4-4.4 1.3-19.4-14.1-15.4-32.2 4-18 24.3-29.5 29.1-28.6zM730.4 1784.2c4.5-4.8 3.9-12.4 1.7-16.4s-7-8.8-11-8.4c-4 .4-17.6 14.1-17.2 27.7s7.5 31.7 12.3 28.2c4.8-3.5-.4-14.5 3.5-21.6 4-7 8.2-6.8 10.7-9.5zM681.4 1761.6c3.6-3.6 4.4-8.8 2.2-13.2s-.8-6.3-5.7-7.1-15 5.4-22.5 13.3-15 33-6.6 32.6c8.4-.4 6.2-6.2 12.8-14.1s16.7-8.4 19.8-11.5zM651 1718.5c4.7 1.9-3.1 16.3-2.2 19.8-5.7.4-5.7.9-11.5 4-5.7 3.1-5.3 7.9-8.8 8.4-3.5.4-8.4-2.2-7-11s7-17.2 14.5-20.3c7.5-3.1 12.8-1.8 15-.9z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.15,
    fill: "#05132B",
    d: "M1319.5 1716.3c1.6.8 2.7-.5 3.3-2.8-.6-.1-1.3 0-2 .2-4.8 1.3-5.7-8.4-7.5-12.8s-9.2-6.2-13.2-7.1c-3.9-.9-5.7-18 .6-23.1-2.8-.2-4.8.6-4.6 3.3.4 4.8-.4 15 .1 21.3 2.3 5.5 8.7 2.4 13.2 7.3 4.4 4.9 4.8 11 10.1 13.7zM1262.7 1719.4c3.1 6.6-.4 17.2 7.1 18.5.8.1 1.5 0 2.1-.3-1.2-.7-2.6-1.5-3.9-2.3-4.8-3.1-1.8-12.3-3.5-18.5s-8.4-8.8-12.8-10.1c-3.3-1-4.1-3.4-2.9-7.5-1.1 2.6-1.2 5.8.5 9.1 5.1 5.6 10.3 4.5 13.4 11.1zM1187.4 1730.4c4.4 9.2.4 19.4 7.9 22 1.6.6 2.8.1 3.8-1-.5-.2-1.1-.3-1.6-.3-4.4 0-4.8-.9-5.7-6.2-.9-5.3-.9-13.7-4.4-21.1s-7.1-5.7-11.9-8.4c-2.2-1.2-3.2-2.6-3.4-4.4-.4 1.8-.5 3.8-.1 5.7 2.2 5.7 11 4.4 15.4 13.7zM906.9 1826.8c-4 4.8-3.5 9.2-.9 13.2 0 .1.1.1.1.2-.2-2-.3-3.9-.1-5.4.9-7.5 9.7-7.2 11.7-14.4.1-3.8 1.2-8.8.6-13.1-4.8 15.1-7.5 14.7-11.4 19.5zM903.4 1855.9c-5.7 1.3-8.8-5.3-12.3-12.3-3-5.9-7.8-18.1-8.2-29.2-.2 1.5-.3 3.2-.2 4.9.9 15.8 9.5 39.2 21.1 38.3 1.8-.1 2.7-1.2 3.2-2.9-1.1.5-2.3.9-3.6 1.2zM849.7 1790.9l.9 2.9c-.4 7.1-1.8 11.9-6.6 13.7-4.8 1.8-11.9 2.2-16.3 7.9-3.1 4.1-3.4 7.7-3.1 10.7 1.2-4.2 2.9-8 5.7-10.3 8.4-6.6 13.7-5.3 16.7-7.9 5.6-4.8 6.2-10.6 3.1-16.3-.1-.3-.3-.5-.4-.7zM819.7 1841.8c-4 2.6-4.2.4-7.9-7.9-.9-2.1-1.8-4.5-2.7-7 1.8 10.6 5.5 20 8.8 18.5 1.3-.6 2.2-2.1 2.9-4.2-.3.1-.7.3-1.1.6z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("g", {
    opacity: 0.15,
    fill: "#05132B"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    d: "M803 1783.7c-.4-1.1-.9-2.4-1.4-3.7 1.6 10.3 4.7 12.5-.7 14.6-5.9 2.3-13.3 1.4-15.5 9.8s-1.8 16.3-3.5 22.5c-.3 1-.4 2-.5 2.9 2.6-3.9 1.2-17.2 7.1-25.4 5.7-7.9 11.9-5.7 14.1-7.5 2.1-1.8 2.1-8.8.4-13.2zM780.1 1830.8s-7.5-7.9-12.8-16.3c-4.4-7-3.3-9.1-1.5-19.8-.5 1.3-.8 2.6-1.2 3.9-3.9 18.1 11.1 33.5 15.5 32.2z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.15,
    fill: "#05132B",
    d: "M732 1767.6c.6 5.1.8 11-2.1 12.9-4 2.6-10.6 6.6-11.5 10.1s-2.6 5.3-.4 12.8c.1.3.2.6.2.9-.2-3.6-.2-7.5 1.5-10.6 4-7.1 8.1-6.9 10.7-9.6 4.5-4.8 3.9-12.4 1.7-16.4-.1.1-.1 0-.1-.1zM716.2 1815.4c.6-.4 1-1 1.4-1.7-.2-.2-.5-.2-.9-.1-2.6.9-2.6-.9-7-6.2-1.5-1.8-2.6-3.9-3.5-6.5 2.5 9.4 6.7 16.9 10 14.5z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("g", {
    opacity: 0.15,
    fill: "#05132B"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    d: "M648.8 1787.2h.5c-1.4-.9-2.3-2.7-2.7-7.9-.1-2-.2-4.1-.2-6-2 7.5-1.9 14.1 2.4 13.9zM683.6 1748.4c.9 2.7 1.1 4.9-.9 7-4 4.4-7.5 7.1-11.5 7.9s-8.8 2.6-10.6 5.7-3.1 1.3-3.1 9.2v1c.9-1.8 2.1-4 4-6.3 6.6-7.9 16.7-8.4 19.8-11.4 3.7-3.5 4.5-8.7 2.3-13.1z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.15,
    fill: "#05132B",
    d: "M651 1718.5c-.4-.2-.9-.3-1.4-.5.7 5.5-.6 12.7-3.4 15.4-3.1 3.1-7 6.2-10.6 7.9s-7 3.1-7 6.2c0 1.1.3 2.2.4 3 3-.8 2.9-5.3 8.4-8.3 5.7-3.1 5.7-3.5 11.5-4-.9-3.4 6.8-17.9 2.1-19.7z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("g", {
    "data-cat": "tops"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#403F3A",
    d: "M1165.4 1051.6c-.1-.4-.1-.6-.1-.6s-19.8-17-35.7-31.6c-2.8-2.5-5.4-5-7.8-7.3-4.9-4.7-9.1-8.6-12.9-12.1-8.7-8-15.4-13.5-23.6-20.6-11.8-10.2-19.6-15.4-21.1-16.1-1.5-.7-4.2 2.4-8.9 5.9-4.8 3.5-16.5 9.2-33.1 8s-26.9-7.3-32-9.6c-5.2-2.3-5-2.2-14.2 4.2s-28.7 18-44.4 29.6-19.8 11.5-32.4 23.5c-12.6 11.9-22 21.7-23.5 22.8-.1.1-.2.2-.2.3-1.1 1.7.8 8.5.8 8.5l7.4-4.8s.4-.4 2.9.6c2.1.9 5 2.3 8.5 4.5 2.1 1.3 4.3 2.9 6.8 4.8 5.4 4.2 10.7 10.8 14.8 16.7 4.7 6.7 7.8 12.4 7.8 12.4l-1 2.4-4.5 6.6s4.1 2.8 6.5 3.6c.3.1.8-.1 1.4-.5 4-2.8 14-16.3 20.2-22.1 1.2-1.1 2.3-2.1 3.4-2.9 5-4 7.8-4.8 7.8-4.8s-.5 3.3-1.3 8c-.8 4.3-1.8 9.7-3 14.8-10.8 47.3-17.5 81.5-17.5 81.5 0 .3.1.6.3.9 1.1 1.2 4.4 2.1 4.4 2.1s-.2-3 17.9-9.9c2.1-.8 4.4-1.7 7-2.6 9.5-2.7 19.1-5.5 28.8-7.6 15-3.3 29.9-6.7 45-9.4 30.8-5.5 61.3-4 91.6 3.8.3.1.6-.1.8-.3 1.3.5 2.6 1 3.7 1.4 5.1 2.1 7.2 3.7 7.2 3.7l.8 4s2.7-1.3 4.3-2.7c.2-.1.3-.4.3-.9.1-3.5-4.9-15.9-8.4-27.6-.1-.4-.3-.8-.4-1.3-1-3.2-2.2-7.1-3.6-11.4-1.9-6.1-4-12.7-5.8-18.4-2.5-7.8-4.4-13.7-4.4-13.7s3.5-4.1 8-8.9c4.2-4.5 9.2-9.7 13.2-12.8 8.2-6.4 6.5-6.5 10.9-2.5 0 0 4.4-4.5 6.1-7.3.4-.6.7-1.1.9-1.5.3-1.1.3-2.2.3-2.8z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.3,
    fill: "#05132B",
    d: "M1157.9 1048.5s-7.8 4.1-15.9 10.4-11.2 13.2-7.9 10.2 21.6-16.3 25-17.5c3.3-1.2 3.3 1.4 4.7 4.6.4-.6.7-1.1.9-1.5.7-1.4.7-2.5.7-3.1-.1-.4-.1-.6-.1-.6s-19.8-17-35.7-31.6c2.7 4 5.9 8.1 9.3 11.4 9.3 9.4 19 17.7 19 17.7zM1125.6 1087.7s3.5-4.1 8-8.9l-.3-.3c-4.7-6.3-18.8-22.1-22.1-26.8s-2.4-6.1-4.1-15.1-4-8.7-3.1.2c.9 8.8 1.9 11.2 1.9 11.2s-3.9-5.5-8.3-11.4c-4.4-6-2.9-1.1-.3 3.1s4 5.5 4 5.5-6.9-5.5-9.1-5.5.3 1.3 7.1 6.5c6.8 5.3 5.7 6.2 5.7 6.2s.3.8 1.1 4.7c.7 3.9 6 12 12.4 28.2 6.1 15.4 10.3 22 17.4 34.6-1.9-6.1-4-12.7-5.8-18.4-2.6-7.8-4.5-13.8-4.5-13.8z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.3,
    fill: "#05132B",
    d: "M1035.6 1140.1c-39.3 4.2-67.5 15.2-67.5 15.2-4.7-16.7-4-54.8-4.9-67.5s.1-23.9 5.1-34.9 5.9-13.4 4.3-11.2-5.6 8.6-5.6 8.6 3.6-11.3 3-14.8-1.8 2.2-4 8.6c-2.2 6.4-6.4 9.8-6.4 9.8 3.1-11.1 2.7-15 0-10.4s-3.6 13.1-6.7 18.7-7.3 8-13.3 13.1-7 10.9-8.9 7.7-15.3-19.5-22.1-26.1c-6.8-6.6-16.5-8.7-15.3-10 1.2-1.3 9.5-9.4 35-25.5s39.8-22.9 52.7-28.7c13-5.7 9.9-5.6 30.4-6.7s32.9-1.1 42.3-4.2c9.4-3.1 15.6-1.8 27.1 1.4 10.1 2.8 11.1 5.1 28.2 16.9-8.7-8-15.4-13.5-23.6-20.6-11.8-10.2-19.6-15.4-21.1-16.1-1.5-.7-4.2 2.4-8.9 5.9-4.8 3.5-16.5 9.2-33.1 8s-26.9-7.3-32-9.6c-5.2-2.3-5-2.2-14.2 4.2s-28.7 18-44.4 29.6-19.8 11.5-32.4 23.5c-12.6 11.9-22 21.7-23.5 22.8-.1.1-.2.2-.2.3-1.1 1.7.6 8.5.6 8.5l7.4-4.8s.7-.4 3.2.6c1.2-.9 4.4-2.9 7.3-1.4 3.6 1.9 9.1 5 17.1 11.1 8 6.1 16 21.2 16.6 23.5.5 2.1-.2 7.4-4.7 7.4l-4.5 6.6s4.7 2.9 7.1 3.7c.3.1.8-.1 1.4-.5 4-2.8 14-16.3 20.2-22.1 1.2-1.1 2.3-2.1 3.4-2.9 5-4 7.8-4.8 7.8-4.8s-.5 3.3-1.3 8c-.8 4.3-1.8 9.7-3 14.8-10.8 47.3-17.5 81.5-17.5 81.5 0 .3.1.6.3.9 1.1 1.2 4.4 2.1 4.4 2.1s-.2-3 17.9-9.9c2.1-.8 4.4-1.7 7-2.6-5.2 1.5-10.5 3-15.7 4.4-.7.2-1-.8-.3-1.1 14.9-5.6 30.6-9.6 46-13.9 15.3-4.3 31-7.8 46.6-10.4 5.4-.9 10.8-1.6 16.2-2.1-2 .2-4 .3-6 .6-14.3 1.6-28.6 3.3-42.8 6.1-6.7 1.3-13.4 2.8-20 4.5-6 1.5-12 3.7-18.2 4.2-.4 0-.5-.5-.2-.7 5.8-3.6 12.8-5.3 19.4-7.1 6.9-1.9 13.8-3.6 20.8-5 13.5-2.7 27.3-4.7 41-5 27.8-.6 56.5-2.1 82.8 8.3.2.1.1.4-.1.3-12.9-4.6-27.5-5.4-41.1-6 12.6 1.3 25.1 4 37.3 8.5.5.2.6.8.4 1.1 1.3.5 2.6 1 3.7 1.4 5.1 2.1 7.7 3.7 7.7 3.7l.5 3.2s2.5-.5 4.1-1.8c.2-.1.3-.4.3-.9.1-3.5-4.9-15.9-8.4-27.6-.1-.4-.3-.8-.4-1.3-.1 8.1-.9 17.2-.9 17.2-22.2-9.9-64.1-12.5-103.4-8.3z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#80756B",
    d: "M1033.7 1088.9c-.6 6.3 0 9.9-.6 11.6-.6 1.7-4.4 1.7-8.6-.5-4.2-2.2-19.1-7.8-25.4-23.1s-4.8-32.6-3.4-37.8 8.3-22.7 27.4-30.4c19.1-7.7 43.2-1.4 52.3 12.9s14.3 26.3 10.7 42.9c-3.6 16.6-17.6 28.6-23.4 31.7s-5.8.8-6.3-5.1c-.5-5.9.4-11-.6-14.4s-1.8-3.5-2.7-4.6c-.8-1.1-1.4-1.7-.5-2.5.8-.7 7 .7 13.7-6.7 6.7-7.4 4.9-19.5 3.6-22.8-1.3-3.3-5.9-8.1-5.9-8.1s1-3.5.1-7.8-1.8-4.5-6.3-2.2-6.9 4.5-6.9 4.5-4.6-1.4-10.9-.8c-6.3.6-12.9 3.3-12.9 3.3s-6.8-2.7-10.2-3c-3.4-.3-2.8-.3-3.4 4.3-.6 4.6 1.5 7.2 1.5 7.2s-2.1 3.2-3.5 8.1c-1.4 4.9-1.2 16 5.9 21.2 7.1 5.2 9.4 4.1 13 4.7 3.6.6 4.6.8 4.5 1.6s-1.5 1.4-2 3.5-.1 3.5-1.3 4.8c-1.2 1.3-4.8 3.2-8 1.8-3.2-1.4-5-6.7-9.3-8s-7.5-.1-4.4 1.4 5.2 3.4 6.4 6.5c1.2 3.1 2.5 6.8 8.3 7.1 5.8.2 9.1-1.3 9.1-1.3z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.3,
    fill: "#05132B",
    d: "M875.3 1049.3c-1.1 1.7-.1 7.7-.1 7.7l7.4-4.8s4.8 1.1 12.4 5.9c-9-6.8-15.2-9.6-19.7-8.8zM916.5 1079.6c4.7 6.7 7.8 12.4 7.8 12.4l-6.1 8.8s4.7 2.9 7.1 3.7c.3.1.8-.1 1.4-.5 1.6-10.5-2.4-14.9-10.2-24.4zM965.2 1053.5c-1.4.9-3.2 7.1-4.7 11.8s-4.8 6.4-10.4 13.8c5-4 7.8-4.8 7.8-4.8s-.5 3.3-1.3 8c3.6-7.6 7-18.6 8.6-22.9 1.8-5 1.4-6.8 0-5.9zM938.1 1177.7c-.5.3-.8.6-1.1.9 1.1 1.2 4.4 2.1 4.4 2.1s-.2-3 17.9-9.9c-12.7 3.2-19 5.4-21.2 6.9zM1134.9 1156.9c5.1 2.1 7.7 3.7 7.7 3.7l.5 3.2s2.5-.5 4.1-1.8c.2-.1.3-.4.3-.9-1.4-1.2-5.7-2.2-12.6-4.2zM1146.8 1067.3c8.2-6.4 7.2-8 11.7-4.1 0 0 5.1-5 6.2-7.3.7-1.4.7-2.5.7-3.1-.9.1-2.5.9-4.4 2.1-4.3 2.7-10.1 6.1-19.6 14.1s-14 13.9-14 13.9-3.4-5.5-8.6-14.3-10.3-15.8-12-16.2c-1.7-.4.1 1.9 4.7 11.4 4.6 9.4 8.5 17.7 18.6 38.9-2.5-7.8-4.4-13.7-4.4-13.7s12.9-15.3 21.1-21.7z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("g", {
    "data-cat": "props",
    className: "hide-hand"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#494959",
    d: "m1450.7 968.9-57.6 67.1-26.7-5.2c8.8-40.8 12.9-52.3 30.8-66 .2-.1.3-.2.4-.3 11.7-8.9 21.4-12.7 26.7-14.3 3-.9 4.7-1.1 4.7-1.1l21.7 19.8z",
    className: "secondary-body-fill"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#091426",
    d: "M1424.4 950.1c-1.1.3-2.5.8-3.9 1.4 1.4-.6 2.8-1 3.9-1.4zM1397.2 964.8c.1 0 .1 0 0 0 .1 0 .1 0 0 0z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#46828E",
    d: "M1667.7 988.6c-.4-1-4.3-8.4-4.7-9.2-4.3-9.1-13.3-41.1-21-50.6s-35.3-18-55.4-26.1c-20-8-30.7-14.9-49.7-18.6-7.2-1.4-14.9-1.9-21.6-2-11.1-.1-19.6.8-19.6.8s-.7-.5-1.9-1.2c-1.1-.7-2.7-1.6-4.7-2.6-5.1-2.7-13-6.4-23.2-9.8-18.8-6.2-26-4.2-32.9 0-4.7 2.9-8.5 6.5-11.9 10.7-1.6 2-3.2 4.1-4.7 6.3-4.8 6.9-9.7 19.9-6.8 38 3 18.1 8.2 28.2 18.3 33.9 5.2 2.9-1.1 14.5-8.4 25.1-7 10.1-15 19.3-15 19.3s-2.7-8.4-14.8-7.2c-12.1 1.2-16.2 15.9-20.8 27.8-4.6 11.9-6.2 26.2-8 36.7s-2.9 19.1-2.9 19.1c2.3 4 30.8 22.3 47.6 30.1 9.7 4.5 22.8 10.8 36.2 16.6 9.8 4.3 19.9 8.3 29 11.2 21.5 6.9 36.2 10.6 36.2 10.6 2.5-6.1 5.2-11 5.2-11 2.6-4.3 4.7-5.3 4.7-5.3s24.6 1.8 37.7-2.5c13-4.3 37.7-6.6 58.6-22.8 20.9-16.2 22.9-17.4 29.7-32.4s14.3-30.9 16.9-47.5c.1-.6.2-1.1.2-1.7 1.9-14.6 11.2-26.4 7.7-35.7z",
    className: "main-body-fill"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("g", {
    fill: "#091426"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.3,
    d: "M1429.1 949s-1.7.2-4.7 1.1l13.1 11.1s-.4 29.5-21.7 30.6c-16.4.8-21.5-14.2-18.6-27-17.9 13.6-21.9 25.2-30.8 66l26.7 5.2 57.6-67.1-21.6-19.9z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.3,
    d: "M1507 1147.6c2.5-6.1 5.2-11 5.2-11 2.6-4.3 4.7-5.3 4.7-5.3s24.6 1.8 37.7-2.5c13-4.3 37.7-6.6 58.6-22.8 20.9-16.2 22.9-17.4 29.7-32.4s14.3-30.9 16.9-47.5c.1-.6.2-1.1.2-1.7 1.9-14.6-.5-30.2-4.1-39.6 0 9.6-.2 21-1.2 28.4-2 14.9-11 37-28 50.9-17.1 13.9-43.7 28.9-58.9 29.2-15.2.3-36.6-6.6-55.8-25.6s-14.9-46.7-16.2-68.6c-1.3-21.9-12.3-32.7-29.5-42.4s-30.6-15.6-39.2-29c-7.2-11.3-11-27.1-6-47.3-1.6 2-3.2 4.1-4.7 6.3-4.8 6.9-9.7 19.9-6.8 38 3 18.1 8.2 28.2 18.3 33.9 5.2 2.9-1.1 14.5-8.4 25.1l32.9 86.9-10.6 55.5c9.8 4.3 19.9 8.3 29 11.2 21.6 6.6 36.2 10.3 36.2 10.3z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    opacity: 0.3,
    d: "M1454.7 919.6c-2.1 4.2.7 3.9.7 3.9 3.1-.1 3.5-2.1 14.1-14.8 7.7-9.2 29.6-20.3 45.8-26.7-11.1-.1-19.6.8-19.6.8s-.7-.5-1.9-1.2c-1.1-.7-2.7-1.6-4.7-2.6-1 .8-2.1 1.7-3.1 2.6-26.4 23.7-29.2 33.9-31.3 38z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#908BB5",
    d: "M1428 958.7c4 1 13.4-1.7 21.7 5.8 8.3 7.5 20.4 19.6 24.6 41.3s5.7 36 0 44.7c-5.7 8.6-24.4 28.6-41.8 32.5s-32-5.8-38.6-22.7c-6.6-16.9-2.4-27.6 5.6-54.2 8-26.7 28.5-47.4 28.5-47.4z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("defs", null, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    id: "a",
    d: "M1428 958.7c4 1 13.4-1.7 21.7 5.8 8.3 7.5 20.4 19.6 24.6 41.3s5.7 36 0 44.7c-5.7 8.6-24.4 28.6-41.8 32.5s-32-5.8-38.6-22.7c-6.6-16.9-2.4-27.6 5.6-54.2 8-26.7 28.5-47.4 28.5-47.4z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("clipPath", {
    id: "b"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("use", {
    xlinkHref: "#a",
    overflow: "visible"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    clipPath: "url(#b)",
    fill: "#CABEF3",
    d: "M1410.3 974.3c15-2.8 31 12.2 38.2 23.5s12.9 27.7 12.7 33.3c-.2 5.7-4.2 20.2-17.3 32.5-13.1 12.2-20.3 21.2-43.3 11.3s-15.5-55.5-15.5-55.5l25.2-45.1z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#24184E",
    d: "M1755.7 890.9c6.9-8.1 8.6-8.6 10.3-10.3 1.7-1.7 19.7 3 41.6 15.3s41.1 37.4 42.4 38.6c1.3 1.3-.7 25.4-.7 25.4l-93.6-69zM1569.6 836.3c13.7-13 15.6-14.1 20.6-17.7 5-3.5 13.9-5.2 37.5 1.5s46.5 19.6 49.8 21.7c3.3 2.1 6.1 16.7 6.1 16.7l-114-22.2z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#CABEF3",
    d: "M1857.9 984.1s5.1-8.8-5.5-24.3c-10.6-15.6-38.1-40.1-79.2-63.5s-78.7-40.8-109.1-49.6-76.2-15.9-89.1-17c-11.3-.9-14.4-.7-25.7 6.7-9.3 6.1-43.8 35.4-55.5 45.4 1.3.8 1.9 1.2 1.9 1.2s22.3-2.5 41.2 1.2c19 3.7 29.6 10.5 49.7 18.6 20 8 35.2 22.4 42.9 31.9 7.7 9.5 20.9 38.2 25.2 47.3 4.2 8.8 7.5 26.3 5.3 42.4 26.8 14.3 49 26.7 56.4 31.3 8.6 5.4 14 10 17.6 29.6s12.6 63.3 16.3 89.1 17.7 42.2 34.8 46.8c17.1 4.6 37.3-.6 52.1-21.6 14.8-21 21.4-60.7 25.9-122.7s-.6-79-5.2-92.8z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("ellipse", {
    fill: "#908BB5",
    cx: 1657.2,
    cy: 872.6,
    rx: 5.8,
    ry: 6.1
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("ellipse", {
    fill: "#5943AC",
    cx: 1658.8,
    cy: 873.3,
    rx: 5.4,
    ry: 5.6
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("defs", null, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("ellipse", {
    id: "c",
    cx: 1658.8,
    cy: 873.3,
    rx: 5.4,
    ry: 5.6
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("clipPath", {
    id: "d"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("use", {
    xlinkHref: "#c",
    overflow: "visible"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("ellipse", {
    clipPath: "url(#d)",
    fill: "#6141CD",
    cx: 1660,
    cy: 872.6,
    rx: 4.8,
    ry: 5
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#908BB5",
    d: "M1773.2 954.7c0 6.5-5.1 11.8-11.3 11.8s-10.5-5-10.5-11.6 5-11.6 11.2-11.6 10.6 4.9 10.6 11.4z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("ellipse", {
    fill: "#223C83",
    cx: 1765,
    cy: 955.9,
    rx: 10.4,
    ry: 10.9
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("defs", null, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    id: "e",
    d: "M1775.4 955.9c0 6-4.7 10.9-10.4 10.9-5.8 0-10.1-4.9-10.1-10.9s4.4-10.9 10.1-10.9 10.4 4.9 10.4 10.9z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("clipPath", {
    id: "f"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("use", {
    xlinkHref: "#e",
    overflow: "visible"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    clipPath: "url(#f)",
    fill: "#2A4CA9",
    d: "M1776.6 954.7c0 5.4-4.2 10.2-9.3 10.2-6.2 0-9.9-4.8-9.9-10.2s4.8-9.7 9.9-9.7c5.1 0 9.3 4.3 9.3 9.7z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#908BB5",
    d: "M1821.1 979.2c0 6.3-4.9 10.7-10.9 10.7s-8.5-4.1-8.5-10.4c0-6.3 3.2-10.6 9.2-10.6 6-.1 10.2 4 10.2 10.3z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("ellipse", {
    fill: "#AC9030",
    cx: 1813.2,
    cy: 980.3,
    rx: 10.1,
    ry: 10.5
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("defs", null, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("ellipse", {
    id: "g",
    cx: 1813.2,
    cy: 980.3,
    rx: 10.1,
    ry: 10.5
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("clipPath", {
    id: "h"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("use", {
    xlinkHref: "#g",
    overflow: "visible"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("g", {
    clipPath: "url(#h)"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#F5C627",
    d: "M1824.4 979.2c0 5.2-4 9.8-9 9.8-6 0-9.6-4.6-9.6-9.8s4.6-9.4 9.6-9.4 9 4.2 9 9.4z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#908BB5",
    d: "M1786 989.8c0 6.9-5.3 11.8-11.8 11.8s-9.2-4.5-9.2-11.5c0-6.9 3.4-11.7 10-11.7 6.4-.1 11 4.4 11 11.4z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("ellipse", {
    fill: "#278474",
    cx: 1777.4,
    cy: 991,
    rx: 10.9,
    ry: 11.6
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("defs", null, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    id: "i",
    d: "M1788.3 991c0 6.4-4.9 11.6-10.9 11.6s-9.8-5.2-9.8-11.6 3.8-11.6 9.8-11.6 10.9 5.2 10.9 11.6z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("clipPath", {
    id: "j"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("use", {
    xlinkHref: "#i",
    overflow: "visible"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("g", {
    clipPath: "url(#j)"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#33AF92",
    d: "M1789.5 989.8c0 5.7-4.4 10.8-9.7 10.8-6.5 0-10.4-5.1-10.4-10.8s5-10.4 10.4-10.4 9.7 4.6 9.7 10.4z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("ellipse", {
    fill: "#908BB5",
    cx: 1797.3,
    cy: 941.7,
    rx: 12.4,
    ry: 12.9
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#9A2227",
    d: "M1812.1 943c0 6.6-5.1 12-11.4 12s-10.5-4.8-11.6-11.3c-1.1-7 3.3-12.6 11.6-12.6 6.3-.1 11.4 5.3 11.4 11.9z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("defs", null, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("ellipse", {
    id: "k",
    cx: 1800.7,
    cy: 943,
    rx: 11.4,
    ry: 12
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("clipPath", {
    id: "l"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("use", {
    xlinkHref: "#k",
    overflow: "visible"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    clipPath: "url(#l)",
    fill: "#CE2828",
    d: "M1813.4 941.7c0 5.9-4.6 12.2-10.2 12.2-6.9 0-12.3-6.3-12.3-12.2s4.6-10.7 12.3-10.7c5.6 0 10.2 4.8 10.2 10.7z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#908BB5",
    d: "M1749.4 991c-1.6 17.8-16.7 31.8-35 31.8-19.4 0-34.1-15.7-35.1-35-1.2-21.6 10.9-37.9 34-37.9 19.4 0 36.2 18.5 36.2 37.9.1 1.1 0 2.1-.1 3.2"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#CABEF3",
    d: "M1746.5 986.3c0 19.7-15.9 31.1-31 31.1-17.1 0-32.6-15.6-33.5-32.6-1-19 13.8-36.8 32.6-36.8 28.3.1 31.9 17 31.9 38.3z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#908BB5",
    d: "M1696.8 979.4c-1.7 7.7-1.8 17.3 4.6 22.1 6.3 4.8 13.7 5.4 18.8 1.7s4.8-9.8 4.8-9.8l-28.2-14z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("ellipse", {
    fill: "#24184E",
    cx: 1715.1,
    cy: 980.1,
    rx: 20.1,
    ry: 21
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#1F1746",
    d: "M1718.6 971.9c4.8 4.9 5.9 11.4 0 15.8-.5.3-.2 1 .4.9 3.4-.6 5.4-4.3 5.5-7.5.2-4-2.5-7.3-5.5-9.6-.3-.2-.6.2-.4.4z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("defs", null, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    id: "m",
    d: "M1857.9 984.1s5.1-8.8-5.5-24.3c-10.6-15.6-38.1-40.1-79.2-63.5s-78.7-40.8-109.1-49.6-76.2-15.9-89.1-17c-11.3-.9-14.4-.7-25.7 6.7-9.3 6.1-43.8 35.4-55.5 45.4 1.3.8 1.9 1.2 1.9 1.2s22.3-2.5 41.2 1.2c19 3.7 29.6 10.5 49.7 18.6 20 8 35.2 22.4 42.9 31.9 7.7 9.5 20.9 38.2 25.2 47.3 4.2 8.8 7.5 26.3 5.3 42.4 26.8 14.3 49 26.7 56.4 31.3 8.6 5.4 14 10 17.6 29.6s12.6 63.3 16.3 89.1 17.7 42.2 34.8 46.8c17.1 4.6 37.3-.6 52.1-21.6 14.8-21 21.4-60.7 25.9-122.7s-.6-79-5.2-92.8z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("clipPath", {
    id: "n"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("use", {
    xlinkHref: "#m",
    overflow: "visible"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("g", {
    clipPath: "url(#n)"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#908BB5",
    d: "M1846.9 1019.4c-20.8-.5-41.9 3-60.9 11.5-7.2 3.2-14.1 6.7-20.7 11-8.9 5.7-16.3 12.6-24.2 19.3 9.2 19.1 14.9 64.5 17.9 85.4 3.3 22.7 10.8 56.6 31.7 65 20.9 8.4 53.7-13.7 53.7-13.7l-7 45H1731l-96.3-194.3 14-48.7c41.7 19.3 79.3 41.5 90 57 .1.2.3.4.4.6 6.2-7.2 15.3-12.8 23-17.6 7-4.4 14.5-8.3 22.2-11.4 19.9-8 41.2-11.8 62.6-10.1.6.1.6 1.1 0 1zM1661.2 950.4c0 20.5-15.2 37.1-33.9 37.1s-33-16.7-33.9-37.1c-1.1-22.9 10.6-40.2 32.9-40.2 18.7 0 34.9 19.7 34.9 40.2z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#CABEF3",
    d: "M1658.2 946.5c0 21.5-13.4 33.6-30 33.6s-29.1-15.1-30-33.6c-.6-11.9 4.7-23.1 11.9-30.3 5.3-5.3 11.5-8.4 17.1-8 16.6 1.3 31 17.1 31 38.3z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#908BB5",
    d: "M1620.8 930.5c1.4-5.5 2.2-6.6 4.5-6.8s7.9 1.7 10 2.5c2 .8 2 3.4 1.4 6.2s-2.8 10.3-3.3 12.3 1.7 2.5 5.6 3.4 6.6 2.2 7.5 3.5c.9 1.4-2.4 15.1-2.4 15.1l-23.3-36.2z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#24184E",
    d: "M1622.7 930.5c1.4-5.5 2.2-6.6 4.5-6.8s7.9 1.7 10 2.5c2 .8 2 3.4 1.4 6.2s-2.8 10.3-3.3 12.3 1.7 2.5 5.6 3.4 6.6 2.2 7.5 3.5c.9 1.4-2.4 15.1-2.4 15.1l-23.3-36.2z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#908BB5",
    d: "M1628.9 874.8c0 17.2-14.5 31.2-32.3 31.2s-31.4-14-32.3-31.2c-1.1-19.2 10.1-33.8 31.3-33.8 17.8.1 33.3 16.6 33.3 33.8z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#CABEF3",
    d: "M1626 871.6c0 18.1-12.8 28.2-28.5 28.2s-27.7-12.6-28.5-28.2c-.9-17.4 15-33.1 27.6-32.2 15.7 1.1 29.4 14.4 29.4 32.2z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("ellipse", {
    fill: "#908BB5",
    cx: 1595.6,
    cy: 870.4,
    rx: 16.6,
    ry: 19.6
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("ellipse", {
    fill: "#24184E",
    cx: 1595.2,
    cy: 865.2,
    rx: 18.4,
    ry: 19.6
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#1F1746",
    d: "M1596 856.8c3.8.1 5.7 3.3 6.1 6.7.2 1.8-.1 3.1-1 4.7-.5 1-1.1 2.9-2.2 3.4-.6.3-.2 1.2.4 1.1 3.8-1.1 5.7-6 5-9.6-.8-4.2-4.3-6.7-8.4-7.1-.5-.1-.5.8.1.8z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "none",
    d: "M1709.7 900.2c.8-1.7 1-3.7.3-5.5-.2-.5-.4-.9-.6-1.3-.7-1.2-1.7-2.2-3-2.8-1-.5-2.1-.7-3.2-.7-.3 0-.6 0-.9.1-.5.1-1 .2-1.4.3-1.8.6-3.3 1.9-4.1 3.6-.8 1.7-1 3.7-.3 5.5.2.5.4.9.6 1.3.7 1.2 1.7 2.2 3 2.8s2.7.9 4.1.7c.5-.1.9-.2 1.4-.3 1.8-.7 3.2-2 4.1-3.7z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#9791BC",
    d: "M1717.6 908.1c-5.3 5.4-13.1 8.2-19.3 6.5s-12.8-8.2-13.4-12.5 0-6.5 0-6.5-4.6-1.8-7.3-3.8-.5-5.2 1-8.1 2-3.8 4.8-2.3 6.3 13.5 10.4 20.1 21.6 3.5 21.6 3.5l2.2 3.1z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#FFDB93",
    d: "m1728.1 902.5-8.7-4.3c.2-2.2-.1-4.4-.8-6.5-1.4-4.1-4.3-7.4-8.2-9.3-3.9-1.9-8.3-2.2-12.4-.8-2.1.7-4 1.9-5.6 3.3l-8-3.9c-1.3-.6-2.8-.1-3.4 1.2l-3 6.2c-.6 1.3-.1 2.8 1.2 3.4l8 3.9c-.2 2.2.1 4.4.8 6.5 1.4 4.1 4.3 7.4 8.2 9.3 2.3 1.1 4.7 1.7 7.1 1.7 1.8 0 3.5-.3 5.3-.9 2.1-.7 4-1.9 5.6-3.3l8.7 4.3c1.3.6 2.8.1 3.4-1.2l3-6.2c.6-1.2.1-2.8-1.2-3.4zm-28 .9c-1.3-.6-2.3-1.6-3-2.8-.2-.4-.4-.9-.6-1.3-.6-1.8-.5-3.8.3-5.5s2.3-3 4.1-3.6c.5-.2 1-.3 1.4-.3.3 0 .6-.1.9-.1 1.1 0 2.2.2 3.2.7 1.3.6 2.3 1.6 3 2.8.2.4.4.9.6 1.3.6 1.8.5 3.8-.3 5.5-.8 1.7-2.3 3-4.1 3.6-.5.2-.9.3-1.4.3-1.5.3-2.9.1-4.1-.6z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("defs", null, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    id: "o",
    d: "m1728.1 902.5-8.7-4.3c.2-2.2-.1-4.4-.8-6.5-1.4-4.1-4.3-7.4-8.2-9.3-3.9-1.9-8.3-2.2-12.4-.8-2.1.7-4 1.9-5.6 3.3l-8-3.9c-1.3-.6-2.8-.1-3.4 1.2l-3 6.2c-.6 1.3-.1 2.8 1.2 3.4l8 3.9c-.2 2.2.1 4.4.8 6.5 1.4 4.1 4.3 7.4 8.2 9.3 2.3 1.1 4.7 1.7 7.1 1.7 1.8 0 3.5-.3 5.3-.9 2.1-.7 4-1.9 5.6-3.3l8.7 4.3c1.3.6 2.8.1 3.4-1.2l3-6.2c.6-1.2.1-2.8-1.2-3.4zm-28 .9c-1.3-.6-2.3-1.6-3-2.8-.2-.4-.4-.9-.6-1.3-.6-1.8-.5-3.8.3-5.5s2.3-3 4.1-3.6c.5-.2 1-.3 1.4-.3.3 0 .6-.1.9-.1 1.1 0 2.2.2 3.2.7 1.3.6 2.3 1.6 3 2.8.2.4.4.9.6 1.3.6 1.8.5 3.8-.3 5.5-.8 1.7-2.3 3-4.1 3.6-.5.2-.9.3-1.4.3-1.5.3-2.9.1-4.1-.6z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("clipPath", {
    id: "p"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("use", {
    xlinkHref: "#o",
    overflow: "visible"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("g", {
    clipPath: "url(#p)",
    fill: "#B39E79"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    d: "M1683.6 879.4c-3 5.3-4 8.4-4.3 9.2-.3.9 1.1 1.8 3.3 2.7 2.1.9 6.2 3.1 6.2 3.1s-1.4 1.7-.6 6c.8 4.2 5 8.9 9.7 10.8 4.7 1.9 10.3.2 12.6-1.5 2.2-1.8 2.8-2.7 3.9-2.8 1.2 0 12.4 6.9 12.4 6.9l-6.4 4.9-35.5-3.7s-10.9-27.6-11-27.7c-.1 0 5.5-10.4 5.5-10.4l4.2 2.5z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    d: "M1696 896.5c-1.1-5.3.9-7.8 4.5-9.4 3.6-1.6 8.8.6 10.7 4.7s.6 6.5-1.3 7.7c-1.9 1.2-13.9-3-13.9-3z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#908BB5",
    d: "M1661.2 893.6c-4.3-4.5-7.3-5.9-10-5.7s-4.2 1-5 3.6 1.4 4.1 6 5.5 7.2-.7 7.2-.7l1.8-2.7z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    fill: "#5943AC",
    d: "M1649.3 891.4c-.7 1.6-1.3 2.5 2.1 3.5s7.8 2.3 9 2.6 1.5-2.6 2-3.6-2.5-2.3-6.5-3.5c-4.1-1.2-5.7-1-6.6 1z"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("defs", null, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    id: "q",
    d: "M1649.3 891.4c-.7 1.6-1.3 2.5 2.1 3.5s7.8 2.3 9 2.6 1.5-2.6 2-3.6-2.5-2.3-6.5-3.5c-4.1-1.2-5.7-1-6.6 1z"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("clipPath", {
    id: "r"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("use", {
    xlinkHref: "#q",
    overflow: "visible"
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    clipPath: "url(#r)",
    fill: "#6141CD",
    d: "M1660.2 896.7c-7.3-1.9-9.8-2.7-10.4-3.1-.6-.4.9-2.4 1.2-3 .3-.5 12.5 2.3 12.5 2.3l-.2 4.2-3.1-.4z"
  })));
};

/***/ }),

/***/ "./src/components/Logo/index.jsx":
/*!***************************************!*\
  !*** ./src/components/Logo/index.jsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Logo": () => (/* binding */ Logo)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/extends.js");
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles */ "./src/components/Logo/styles.js");




var Logo = function Logo() {
  return /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
    to: "/"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(SvgComponent, null));
};
var SvgComponent = function SvgComponent(props) {
  return /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_styles__WEBPACK_IMPORTED_MODULE_2__.Svg, (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    width: 550.145,
    height: 156.808,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "-25.072 -3.404 550.145 156.808",
    style: {
      background: '0 0'
    },
    preserveAspectRatio: "xMidYMid"
    /* eslint-disable-next-line react/jsx-props-no-spreading */
  }, props), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("defs", null, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("filter", {
    id: "a",
    x: "-100%",
    y: "-100%",
    width: "300%",
    height: "300%"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("feFlood", {
    floodColor: "#ccc",
    result: "flood-surface"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("feFlood", {
    floodColor: "#777",
    result: "flood-extrude"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("feMorphology", {
    "in": "SourceAlpha",
    radius: 1,
    result: "erode"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("feConvolveMatrix", {
    "in": "erode",
    result: "shadow",
    order: "11,8",
    divisor: 1,
    kernelMatrix: "0 0 0 1 1 1 1 1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 1 0 0 0 0 0 0 1 1 0 1 1 0 0 0 0 0 0 0 0 1 0 0 0 0 0"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("feOffset", {
    dy: 4,
    "in": "shadow",
    result: "offset"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("feGaussianBlur", {
    "in": "offset",
    stdDeviation: 0.2,
    result: "blur"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("feComposite", {
    operator: "in",
    "in": "flood-extrude",
    in2: "blur",
    result: "extrude"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("feMorphology", {
    "in": "SourceAlpha",
    radius: 1,
    result: "erode2"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("feConvolveMatrix", {
    "in": "erode2",
    result: "out",
    order: "4,4",
    divisor: 1,
    kernelMatrix: "0 1 1 0 1 0 0 1 1 0 0 1 0 1 1 0"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("feComposite", {
    operator: "in",
    "in": "flood-surface",
    in2: "out",
    result: "text"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("feMerge", null, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("feMergeNode", {
    "in": "extrude"
  }), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("feMergeNode", {
    "in": "text"
  })))), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("g", {
    filter: "url(#a)"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("path", {
    d: "M61.815 78.125h.08q2.69 0 4.27 1.11 1.35.15 1.35.47v.16q-1.19 0-1.19.55.24.4 1.5.48.16.39 1.11.63l2.06-.16.79.24 6.09-1.27h.32q5.93 1.59 10.67 5.22 4.99 4.99 5.78 7.68.79 2.69.79 3.71-1.11 9.42-1.9 9.42-2.93 4.74-3.56 5.38l-.71.63.24.24v.08q-1.43 1.74-2.93 2.21-.79.48-.87 1.42-1.11 1.11-3.72 1.11-5.69 1.98-7.83 1.98-.87 0-3.4-1.35-2.21-.39-3.8-.39l-.47.32q.47.87.47 4.19v1.03l.56 3.63.08 5.54v.79q0 1.98 1.42 1.98l.55.48v.07q-.55 0-.55.56 1.19 1.03 1.19 2.92l.39 1.51q-1.34.39-2.85.39l-5.53-.39q-1.51 1.1-1.66 1.1-1.74-.47-3.41-3.87l-.07-.08.07-.4q.48-.15.48-.23v-.08q-.55-.79-.55-1.19l.07-.31h.24q.16 0 .16.31h.55l.16-.08v-.95q.56-.79 1.66-.79.32-.31.32-3.87v-5.62q0-1.9-.47-7.2v-29.9l-.08-2.45h-2.06l-.24-.32-.08-4.35q0-1.98 1.98-1.98.4-.15 2.53-.31Zm-3.56 1.5q0 .48.4.71h.39q.56 0 .72-.47v-.24q-.16-.39-.72-.39h-.16q-.63 0-.63.39Zm8.7 1.74h-.15l-.16.24v.24l.16.23h.15l.16-.23v-.24l-.16-.24Zm12.11 0h-.16v.32q.95.39 1.58.39h.47v-.08q0-.39-1.89-.63Zm-19.38.16h-.4l-.24.16v.39q0 .64.64 1.03h.15l.08-.55v-.24q0-.71-.23-.79Zm9.33.95.24.08h.39l.24-.24-.16-.24h-.08q-.63.16-.63.4Zm12.74 0v.08q.79.95 2.13 1.34h.24q0-1.03-2.37-1.42Zm-7.91.79q0 .32 3.24.71 0 .16.71.16h1.19l.31-.24-.23-.23h-.24l-.95.15-.4-.15v-.08l.32-.32v-.4l-.71-.07h-1.27q-1.82.07-1.97.47Zm-12.5 3.95q0 1.19.47 1.82v.16l-.55 1.51.55 1.26q-.71 6.41-.71 9.81v5.69q0 2.46.32 4.12l-.32 2.37v.79l.16 6.8.08.16h.08q.79-.31.79-.95v-.15l-.4-.72q.32 0 .56-6.72l-.16-5.46q.39-14 .39-18.51v-.16q0-4.58-.71-4.58-.55 0-.55 2.76Zm24.36-2.37h-.24v.16q.08.32.64.55l.31-.08v-.15q-.23-.48-.71-.48Zm-10.99 3.17q0 .23 1.02.23l.56-.08v-.15l-.24-.48 4.35-.55.4-.24-.32-.47h-.63q-5.14.63-5.14 1.74Zm14.23-1.43-.08.16q.72.95 1.27 1.34h.16q0-.79-1.35-1.5Zm-5.69.63-.16-.23h-.32v.08l.32.31h.16v-.16Zm-14.79.32h-.24l-.48.48v.15h.32l.4-.39v-.24Zm12.57.24h-.63v.08q.32.55 1.74.55h.55l.24-.16q-.24-.31-1.9-.47Zm-17 .95v.47q.31 0 .47-1.34h-.16q-.31.08-.31.87Zm8.3-.48h-.16q0 .48-1.66 1.35v.16h.48l.08-.08.15.08v.08q-3.4 1.66-4.11 2.92-.24 0-.63 14.71l-.16 1.19q0 .24 3.48 2.85l3.32 1.5q.08.48.4.48h.32q2.37 0 5.37-1.74.95-.95 3.48-1.82 4.04-3.17 4.04-6.17v-1.27l-.16-1.03v-.16l.63-.79v-.23q-.71-.32-.71-1.9 0-2.77-1.58-4.51-.87-2.14-2.77-3.48-.63-1.03-4.11-1.82h-.71l-3.72.32h-.24q-.63 0-1.03-.64Zm18.67.56-.08-.24h-.24v.24l.24.16h.08v-.16Zm-6.57-.08-.31.24v.07q0 .95 1.66 1.67h.24v-.16q0-1.19-1.59-1.82Zm-20.25 9.09v-5.85l-.23.16-.16 5.46.08.47h.16l.15-.24Zm27.53-5.37-.24.07.64 1.11h.31v-.16q0-.55-.71-1.02Zm-4.82.07h-.4v.48q0 .63 1.19 2.61h.16v-.32q0-1.97-.95-2.77Zm1.34 4.67-.08-.39h-.39v.47l.39.08.08-.16Zm2.53 9.02h.16q1.5-2.45 1.5-5.54v-1.11h-.15q-.72 0-1.51 6.65Zm-2.05-6.57h-.16v1.11l.31.32h.08l.24-.24q0-.71-.47-1.19Zm-.95 4.28v.07h.08q.95-.07.95-.79v-.71l-.24-.08h-.08q-.71.56-.71 1.51Zm-2.77 5.77.08.08h.16q.95-.55 1.02-.95l-.15-.08q-1.03.48-1.11.95Zm-17.56 1.03-.63-.71h-.32q.08.95.95.95v-.24Zm17.64 1.66v.32h.16q1.02-.32 1.02-.95h-.15q-.8 0-1.03.63Zm-9.34 2.85v.08h.32q4.43-.95 4.43-1.59v-.15q0-.16-.32-.16-4.43 1.18-4.43 1.82Zm7.28-.32h.08q1.58-.63 1.82-.95v-.08l-.24-.16h-.08q-1.58.64-1.58 1.19Zm-15.98-.4-.08.08v.16q0 .79 4.67 1.27l1.58-.79v-.08l-.23-.4h-.48l-2.14.48q-2.13-.72-3.32-.72Zm-5.61 9.5v1.26q0 1.35.39 1.35.71-1.35.71-3.09v-.39q0-.24-.47-.24-.63.24-.63 1.11Zm1.1 4.59h-.31l-.32.31v1.03q0 .71.32 1.42h.39l.16-.47v-1.03q0-1.26-.24-1.26Zm1.82 7.83h-.16l-.23.23v.16l.23.32h.32l.16-.24v-.24l-.32-.23Zm-3.24.47-.24-.24h-.47v.16q.08.32.63.32l.08-.24Zm5.46-.24h-.4l-.23.24v.16l.23.32h.4l.24-.24v-.24l-.24-.24Zm-5.93 1.74h-1.51l-.16.24v.08q0 .16 1.11.32 1.27-.08 1.27-.32v-.16l-.71-.16Zm38.91-77.83 1.59-.08q10.12.39 10.12 1.82l.55 11.63q0 1.58-1.74 7.99-.39 2.53-.39 3.32v.47h.24q5.3-4.11 12.1-4.11 1.98 0 7.28 2.29 1.02.79 2.61 3.25.55.31.71 1.02l-.08.8q2.21 1.74 2.21 6.24.24 0 .4 7.76v.15q0 1.43-1.27 8.71l-.31 1.5h1.66q2.61.08 2.61.71 0 .32-2.53.55 0 .32 1.82.72l.31.47v.16q-1.5.24-1.5.39 1.5.32 1.5 1.03 0 3.72-2.13 3.72l-.64.08q-3.08 0-3.08-.87 0-.24-3.24-.4-1.43-.79-2.3-1.02l-.08-.32q0-3.48 1.03-10.13.4-3.87 1.43-8.22l-.16-2.77.23-.4q-1.02-.79-1.02-2.29-.95-1.66-1.59-2.61-2.76-1.19-3.32-1.19-4.03-1.34-7.91.32-5.14 3.48-5.14 5.14l-.47 5.14.15 5.3q-.47 5.86-1.18 5.86l-.08.39.31.08h.32l1.35-.55q1.89.31 1.89 1.26l-.55.48v.31q.08.24 1.03.56l.16.39q-.48 4.12-1.19 4.12h-.24q-1.03-.72-8.46-1.11-5.3-.48-5.3-1.58v-1.27q-.08-.32.47-1.19v-.47q-.95-1.35-.95-1.58.4-.32 3.8-.4.56 0 .79-3.08.56-.32.95-2.46.48-.63.48-1.34v-.08q0-1.26-.79-2.53l.79-1.9q.55 0 .63-17.32l1.11-11.63v-3.48q0-1.74-1.11-1.74l-2.61-.08-1.66.47q-.4 0-.56-2.13v-.79q0-3.48.95-3.48Zm-.16 56.32v.16h.16q1.03 0 3.88 1.02 4.35.08 6.88.56h.24l.24-.32v-.08q0-.79-7.52-.79-1.26-.79-3.16-.79-.72.08-.72.24Zm32.75-7.12h.24q.55 0 1.5-5.93 0-.87-.55-1.11h-.32q-.47 0-.87 7.04Zm-2.69-16.77.32.32.47-1.27q.32.63.4.95.32.55.63.55v-.63q0-1.58-2.21-3.72l-.4-.08h-.31v.32q1.1 1.11 1.82 2.37l-.72 1.19Zm-23.17-18.59q-.24.48-.24 2.85.95 0 .95 1.42h.08q.24-.47.24-1.66v-1.03h-.08l-.32.87h-.32l-.08-.47q.16-.63.32-.63l.48.15q-.16-.47-1.03-1.5Zm-4.04 37.49q0 .56 2.61.8h.16l.24-.16v-.64q-.16-.23-.63-.23h-1.59q-.79 0-.79.23Zm25.08 4.04h.16l.79.08 2.45-.08.08-.08v-.08q-.79-.55-2.53-.55-.71 0-.95.71Zm-28.8-1.58v.23h3.33q0-.63-2.46-.71-.79 0-.87.48Zm22.55-26.11-.55.08v.4q1.74.87 2.21.87l.32-.4q0-.47-1.98-.95Zm-19.78-26.57v.23q.95.71 2.69.71l.16-.31q-1.66-.63-2.85-.63Zm6.73 31.56v.63h.23q.8 0 1.03-1.42l.08-.08v-.4h-.08q-.55.32-1.26 1.27Zm1.66-31.17h-.87l-.32.4q.24.39.71.63h.08q.56 0 .71-.4v-.15l-.31-.48Zm18.03 55.85h-.87v.23q.08.48 1.03.48h.79v-.24q0-.24-.95-.47Zm-17.79-3.33h-.56l-.16.08v.4l.48.39h.39l.4-.31v-.08l-.55-.48Zm-6.25-50.07h-.79l-.4.08v.16q.08.24.55.24h.64l.47-.16v-.24l-.47-.08Zm25.31 48.65v.32h.63l.24-.16v-.4l-.24-.23q-.47 0-.63.47Zm-20.09-18.51.23.24h.56q.47 0 .55-.24l-.24-.24h-.31q-.63 0-.79.24Zm18.11-10.44v.24q.32.55 1.19.55v-.24q-.32-.55-1.19-.55Zm-1.42 6.01v.16q0 .71.79.71v-.08q-.08-.79-.79-.79Zm-18.2-20.25-.31-.32-.16.24v.56l.16.23.31-.23v-.48Zm-4.27-6.64-.87-.08h-.23v.08l.07.31h1.03v-.31Zm8.86 25.63h.24q.87-.64.87-.8h-.24q-.79.4-.87.8Zm21.2 2.21h-.16l-.23.24v.16l.47.31h.16l.16-.16-.4-.55Zm-10.36-8.7h-.08v.08q0 .24 1.03.47v-.08q0-.39-.95-.47Zm-15.74-10.44h-.08l-.16.23v.24l.24.24.31-.08v-.24l-.31-.39Zm12.18 14.95-.24-.24h-.55v.16l.24.24h.55v-.16Zm-3.64 3.4h-.24l-.31.32v.23h.23l.32-.31v-.24Zm12.1 26.66-.23-.24-.24.24v.08l.24.23h.15l.08-.31Zm-27.37-54.19-.23-.16h-.08v.64h.08l.23-.24v-.24Zm33.39 38.68-.16-.16-.24.16.24.24h.16v-.24Zm-23.74 12.34v-.24h-.31v.24h.31Zm9.81-24.76h-.16l-.15.16h.31v-.16Zm10.52 2.61v.08l-.08.16q-.15 0 0-.16l.08-.08Zm30.38-10.68 2.21.64h.72q4.5 2.21 8.38 5.3 4.03 3.48 4.03 5.22h-.15q-.64-1.11-1.27-1.11h-.08q-.24 0-.24.32.32.87 1.43 3h.16q.15 0 .39-.79h.08q.24.08.55 2.3l.72 1.58-.16 1.03.24 2.84q-.56 1.98-1.03 5.22-.32 1.51-7.36 11.24-3.16 3-6.17 3-2.77.32-6.25.32h-1.5q-1.35 0-7.04-2.29-7.2-6.41-7.2-9.81-1.03-2.14-1.74-3.96 0-1.03 2.14-6.8 0-3.64 1.74-5.06 3.71-7.99 9.41-10.37 4.98-1.82 7.99-1.82Zm-14.24 24.84v.48q1.11 2.13 2.45 4.59 0 .79 3.01 2.21 1.42 1.66 5.3 2.61l1.42.16q3.48-.71 5.22-1.5l2.85-2.38q4.43-4.74 4.27-7.99v-.71q-.47-1.26-.47-4.11 0-2.22.31-3.48 0-.56-3.08-2.77-2.22-3.16-4.59-3.88h-.95q-9.25.4-9.25 1.51-2.06 2.05-2.85 4.03-2.53 2.69-2.53 3.56-.71 3.24-1.11 7.67Zm2.45-19.14-.23.4v.31q.47 0 4.82-3.32l.63-.24.48.08q5.3-.55 5.3-1.03v-.08l-1.27-.23q-5.38 0-9.73 4.11Zm6.17 1.66v.08l.16.24h1.11l5.61-1.27v-.16l-1.5-.31q-5.38.63-5.38 1.42Zm-12.42 19.7-.31.23v.56q.16 2.69 1.5 3l.08-.07v-.08q-.55-3.64-1.27-3.64Zm12.26-22.39v.4q6.17-.71 6.17-.95l-.63-.24h-.08q-3.79 0-5.46.79Zm6.73-3q.39 1.1 1.74 1.1l.79.08.16-.08v-.39q0-.87-1.66-1.03-1.03.08-1.03.32Zm-14.4 33.38h-.55v.31q1.03 1.03 3.72 1.03h.87q-.4-.55-4.04-1.34Zm13.05 2.92v.16q0 .24 1.19.4 1.34 0 1.34-.4v-.16q-.07-.31-.55-.63h-.71q-.87 0-1.27.63Zm15.03-15.03q.08 2.38.4 2.54h.16q0-.87.71-1.9v-.24l-.87-1.19h-.16q-.16 0-.24.79Zm-5.22-13.6h-.31q.47 1.03 2.29 1.74h.32l.23-.24v-.08q-1.34-1.42-2.53-1.42Zm-1.74-2.45v.15q.24.95 2.22 1.98h.23l.16-.23v-.08q-.39-.56-2.61-1.82Zm-5.22-2.61-.16.08q1.51 1.18 2.38 1.18l.07-.16v-.08q-1.26-1.02-2.29-1.02Zm-10.52 31.8v.23q0 .48 2.22.48l.07-.08v-.16q-1.02-.47-2.29-.47Zm14.71-32.67h-.15l-.24.23q.87 1.11 1.74 1.11 0-.87-1.35-1.34Zm-19.46 8.14v.56h.24q1.03-.95 1.03-1.51v-.07h-.4q-.47.31-.87 1.02Zm17.88-3.63q.48.79 1.11.79l.08-.16v-.16q0-.71-.64-.71-.55.08-.55.24Zm7.67 20.8v.08q.64 0 1.11-1.27v-.16h-.24q-.47 0-.87 1.35Zm-23.88-21.28q.71 0 1.34-.95v-.24q-1.34.4-1.34 1.19Zm25.23 18.43-.08 1.42h.4l.31.24q.08-1.26-.39-1.11h-.16l-.08-.55Zm-10.21 12.66h.08q1.43-.48 1.43-.79l-.16-.16q-1.11.39-1.35.95Zm-18.98-6.25-.32.16v.15l.64.64h.31q0-.56-.63-.95Zm5.38 4.9v.08h1.03l.16-.16-.16-.23h-.16q-.79 0-.87.31Zm25.71-19.85h-.08l-.24.24v.31l.24.32.31-.32v-.31l-.23-.24Zm-33.54-2.53q.39 0 .71-.56v-.15q-.71 0-.71.71Zm-2.37 8.54h-.08l-.16.24q.08.71.24.71l.15-.08v-.4l-.15-.47Zm21.04-18.27v.08l.79-.64-.16-.08q-.79.48-.63.64Zm-17.09 7.04h.08q.32-.08.32-.64h-.16q-.24.16-.24.64Zm.55 9.49h-.08l-.31.32v.15h.24l.15-.23v-.24Zm4.59-11.79v-.15h-.31v.31h.15l.16-.16Zm47.23-35.99q1.74 0 2.84.95-.95 2.53-1.26 7.99l-.71 7.28q0 .55 3.16.55 9.33 0 9.33.87.4 0 .95.48-.79 1.02-.79 1.5v.24l.24 1.58-1.03 3.48q0 .55 1.19 1.58v.16q-1.9.63-3.09.63-1.26-.08-1.26-.39v-.16l.71-.08h.55l.32-.32v-.16l-.32-.07-5.3.07-4.35-.07q-.39 0-.87 4.43h-.08l-1.1-1.27-.24.87v.47q.08 2.22.55 2.38.32 0 .56-1.43v-.55h.23l.08.24-.55 7.59q.95 16.38 1.66 16.38.39 2.53 1.98 2.53.87.55 2.13.55h1.43l4.74-.24q.16 0 .56 4.2.15 1.26-.52 1.85-.67.6-2.25.6l-6.09.16q-4.99 0-8.39-2.77-2.21-.79-2.21-4.75-.16-2.13-.56-12.66l.95-10.75.24-4.67v-.63q-.55-3.33-1.9-3.33h-5.14q-1.19 0-2.37.56-.79-.08-1.98-2.14l1.58-7.04q0-.31 9.57-.39 0-1.03 1.11-2.61.32-12.34.87-12.34v-.24q0-.16-.4-.16v-.24q0-.23 5.23-.71Zm-2.85 2.3-.16-.16h-.08v.47h.24v-.31Zm4.03 0h-.79l-.32.31v.16l.24 1.82h.16q.95-.95.95-1.66v-.32l-.24-.31Zm-3.64 3.71v-.79l-.23-.23q-.16.79-.16 2.05v.32h.16l.23-1.35Zm.24 2.54h-.16l-.31 7.83v.08l.23.23h.16q.56 0 .56-1.97v-1.82l-.16-3.88q-.16-.47-.32-.47Zm-13.68 9.09q0 .56.71.56h1.18q3.25 0 6.02-.32v-.16q0-.39-3.88-.39h-3.32q-.71 0-.71.31Zm25.47-.31h-.79l-1.03.39h-2.3v.24q1.74.47 3.01.47h1.82q.16 0 .16-.23-.16-.87-.87-.87Zm2.29.79h-.87l-.24.15v.16l.24.08q.79 0 .87-.31v-.08Zm-25.63 1.02h-.87l-.16.16v.48q0 .79 5.3.79 2.69 0 2.69-.4 0-.95-6.96-1.03Zm16.53.72h-.55l-.24.23v.08q0 .4 2.85.48l1.35-.08 1.81.32h.32q.55 0 .55-.48h-.07l-6.02-.55Zm9.02 1.74h-1.03l-.31.31v.08l.31.24h.4q.71 0 .87-.47l-.24-.16Zm-24.99.31h-.72l-.31.24q0 .32.39.32l1.98.08 2.14-.08.08-.08v-.16q-.95-.32-3.56-.32Zm5.61 1.74-.16-.23-6.48-.24v.16q0 .55 6.01.55l.63-.16v-.08Zm11.15 0h-.39v.24q.08.16 2.77.79h.16v-.16q-1.27-.87-2.54-.87Zm4.04.79q2.13.72 3.8.72l.31-.32v-.47l-.23-.24h-1.75q-2.13 0-2.13.31Zm-11 2.85v.64l.24.23q.32-.08.32-.55v-.32l-.16-.55h-.08q-.32.08-.32.55Zm2.93 1.66v-.23l-.39-.32v.24l.31.31h.08Zm-2.37.08-.16-.16h-.16l-.08.4v.4l.08.47h.32v-1.11Zm.16 5.94-.16-.64h-.24v.64l.24.31h.16v-.31Zm-3.96 9.41.24 2.21-.08 2.77.08.79h.24q.47 0 .47-3.72v-1.81q0-3.64-.32-3.64-.55 0-.63 3.4Zm5.14 6.25h-.16l-.07.55v.63q0 .56.31.64h.16q.32-.08.32-.56-.08-1.26-.56-1.26Zm.64 3.4-.32.87q0 1.82.79 2.29l.16-.31v-.72q-.08-1.97-.63-2.13Zm-2.93.71-.16-.16h-.24v1.19l.16.47h.08l.16-.15v-1.35Zm2.13 4.83v.55q.08.32.56.63h.55v-.16q0-.87-1.11-1.02Zm8.78 1.58h.32q2.93-.48 2.93-1.03l-.16-.16q-3.09.79-3.09 1.19Zm-9.65.31-1.1-1.42h-.16v.32q.24 1.97 1.74 1.97h.79l.16-.23v-.08q0-.16-1.43-.56Zm41.3-35.28 2.21.64h.71q4.51 2.21 8.39 5.3 4.03 3.48 4.03 5.22h-.16q-.63-1.11-1.26-1.11h-.08q-.24 0-.24.32.32.87 1.42 3h.16q.16 0 .4-.79h.08q.23.08.55 2.3l.71 1.58-.16 1.03.24 2.84q-.55 1.98-1.03 5.22-.31 1.51-7.35 11.24-3.17 3-6.17 3-2.77.32-6.25.32h-1.5q-1.35 0-7.04-2.29-7.2-6.41-7.2-9.81-1.03-2.14-1.74-3.96 0-1.03 2.13-6.8 0-3.64 1.74-5.06 3.72-7.99 9.42-10.37 4.98-1.82 7.99-1.82Zm-14.24 24.84v.48q1.1 2.13 2.45 4.59 0 .79 3 2.21 1.43 1.66 5.3 2.61l1.43.16q3.48-.71 5.22-1.5l2.85-2.38q4.43-4.74 4.27-7.99v-.71q-.48-1.26-.48-4.11 0-2.22.32-3.48 0-.56-3.08-2.77-2.22-3.16-4.59-3.88h-.95q-9.26.4-9.26 1.51-2.05 2.05-2.84 4.03-2.54 2.69-2.54 3.56-.71 3.24-1.1 7.67Zm2.45-19.14-.24.4v.31q.48 0 4.83-3.32l.63-.24.47.08q5.3-.55 5.3-1.03v-.08l-1.26-.23q-5.38 0-9.73 4.11Zm6.17 1.66v.08l.16.24h1.1l5.62-1.27v-.16l-1.5-.31q-5.38.63-5.38 1.42Zm-12.42 19.7-.32.23v.56q.16 2.69 1.51 3l.08-.07v-.08q-.56-3.64-1.27-3.64Zm12.26-22.39v.4q6.17-.71 6.17-.95l-.63-.24h-.08q-3.8 0-5.46.79Zm6.72-3q.4 1.1 1.74 1.1l.8.08.15-.08v-.39q0-.87-1.66-1.03-1.03.08-1.03.32Zm-14.39 33.38h-.56v.31q1.03 1.03 3.72 1.03h.87q-.39-.55-4.03-1.34Zm13.05 2.92v.16q0 .24 1.19.4 1.34 0 1.34-.4v-.16q-.08-.31-.55-.63h-.71q-.87 0-1.27.63Zm15.03-15.03q.08 2.38.39 2.54h.16q0-.87.71-1.9v-.24l-.87-1.19h-.15q-.16 0-.24.79Zm-5.22-13.6h-.32q.48 1.03 2.3 1.74h.31l.24-.24v-.08q-1.35-1.42-2.53-1.42Zm-1.74-2.45v.15q.24.95 2.21 1.98h.24l.16-.23v-.08q-.4-.56-2.61-1.82Zm-5.22-2.61-.16.08q1.5 1.18 2.37 1.18l.08-.16v-.08q-1.26-1.02-2.29-1.02Zm-10.52 31.8v.23q0 .48 2.21.48l.08-.08v-.16q-1.03-.47-2.29-.47Zm14.71-32.67h-.16l-.24.23q.87 1.11 1.74 1.11 0-.87-1.34-1.34Zm-19.46 8.14v.56h.24q1.03-.95 1.03-1.51v-.07h-.4q-.47.31-.87 1.02Zm17.88-3.63q.47.79 1.11.79l.07-.16v-.16q0-.71-.63-.71-.55.08-.55.24Zm7.67 20.8v.08q.63 0 1.11-1.27v-.16h-.24q-.47 0-.87 1.35Zm-23.89-21.28q.71 0 1.35-.95v-.24q-1.35.4-1.35 1.19Zm25.24 18.43-.08 1.42h.39l.32.24q.08-1.26-.4-1.11h-.16l-.07-.55Zm-10.21 12.66h.08q1.42-.48 1.42-.79l-.15-.16q-1.11.39-1.35.95Zm-18.98-6.25-.32.16v.15l.63.64h.32q0-.56-.63-.95Zm5.38 4.9v.08h1.02l.16-.16-.16-.23h-.15q-.8 0-.87.31Zm25.7-19.85h-.08l-.23.24v.31l.23.32.32-.32v-.31l-.24-.24Zm-33.54-2.53q.4 0 .72-.56v-.15q-.72 0-.72.71Zm-2.37 8.54h-.08l-.16.24q.08.71.24.71l.16-.08v-.4l-.16-.47Zm21.04-18.27v.08l.79-.64-.15-.08q-.8.48-.64.64Zm-17.08 7.04h.08q.31-.08.31-.64h-.16q-.23.16-.23.64Zm.55 9.49h-.08l-.32.32v.15h.24l.16-.23v-.24Zm4.59-11.79v-.15h-.32v.31h.16l.16-.16Zm46.35-13.76h2.61q1.9 0 6.17 1.66 1.58 0 4.99 1.98h.39q.87 0 3.8-3.17.63 0 2.37 2.22.79.32 1.82 1.5v.24q-4.43 4.9-4.43 5.46-2.14 7.2-2.85 7.99-1.5 1.58-4.27 2.77-3.48 3.48-6.25 3.48l-2.37.07-5.14-.47h-1.03q-.63 0-1.66 5.22l.63.16h.24q1.26 0 2.77-.95l1.82-.16h3.16q7.59 0 12.5 1.43.71.47 3.48 1.74l2.69 1.97q3.16 2.69 3.95 4.83 2.85 5.54 2.85 9.41 0 2.93-4.59 7.28l-4.82 3.48q-3.8 2.37-9.02 2.37l-2.21.32q-14.08 0-19.07-5.7-3.64-2.21-3.64-5.77-1.34-2.53-1.34-6.65l-.32-1.74.32-1.02h.24q.39 1.82.63 1.82h.24q1.1-4.99 1.74-6.65v-.16h-.08q-2.3 3.72-2.3 4.27h-.15q-.32 0-.32-.87.08-1.58 2.85-5.45 3.08-2.93 3.08-3.33.79-6.56 1.19-8.14-2.06-3.96-2.06-6.49l-.08-1.34q0-1.35 1.03-4.91.87-.87 3.32-4.27 4.2-4.43 7.12-4.43Zm-2.92 1.98v.08q2.76-.72 2.76-1.19v-.08h-.23q-1.11 0-2.53 1.19Zm21.35.31h-.23l-.24.24v.08q.16.24.55.24h.48v-.16l-.56-.4Zm-19.38 1.35v.31h.16l2.37-.87v-.39h-.71q-1.82.39-1.82.95Zm-4.74 8.15v.39q1.26 6.01 1.82 6.01 1.82 1.74 3.16 1.74 6.01 0 8.62-2.69 1.98-1.82 2.85-3.79.63-1.11.63-1.66v-1.27q0-1.27-1.9-3.8-4.27-1.89-5.93-1.89-3.72 0-7.2 3.24-2.05 2.53-2.05 3.72Zm23.25-4.75v.47h.16q1.66-1.42 2.29-2.45v-.23h-.07q-.87 0-2.38 2.21Zm-22.38-.16.31.08q.48 0 1.27-1.03v-.31h-.48q-1.1.63-1.1 1.26Zm17.4-.71h-.4v.08q.56 1.5 1.35 1.5.24 0 .24-.24 0-.55-1.19-1.34Zm-22.23 4.27h.24q.24-.16 1.26-1.58l-.23-.16q-.48 0-1.27 1.74Zm-1.03 2.37q0 1.74.79 2.61h.32q.24 0 .24-.23-.32-3.32-.79-3.32-.4 0-.56.94Zm20.73 4.35v.08h.47q1.43 0 1.82-3.24v-.39l-.08-.16h-.23q-1.98 3.16-1.98 3.71Zm-16.69-3.4-.16.24q0 1.35.87 2.45h.08v-.31q-.16-2.06-.79-2.38Zm20.8 3.09h-.24l-.23.39v.08h.23q.08 0 .24-.47Zm-5.69 2.13h.23q.95-.39 1.51-1.1l-.24-.32q-1.35.95-1.5 1.42Zm-3.33.95v.24l.48.32h.31q.4 0 1.59-1.19v-.16h-.72q-.94 0-1.66.79Zm-14.39-.31h-.32v.23q.79 1.27 2.37 1.74v-.15q-.71-1.82-2.05-1.82Zm17.95 0h-.47l-.32.31v.32h.16l.63-.55v-.08Zm-14.71.55-.24.24q.32.79 1.03.79l.4-.48q0-.31-1.19-.55Zm10.13.32h-.64l-.31.31q0 .16 1.34.32l.63-.08q0-.32-1.02-.55Zm-8.39.63-.08.08v.63l.32.32h1.34v-.32q-1.34-.71-1.58-.71Zm3.48.87h-.79l-.32.24q0 .71 2.61.71h2.3q.47 0 .55-.32-1.66-.63-4.35-.63Zm-6.33.95h-.23l-.4.32v.63q0 .63.63.79l.32-.24v-1.26l-.32-.24Zm12.82 6.33h-.79l-1.74.31v.08q0 .71 8.14.95l1.66.56h.16q.24 0 .64-.24l2.29.08v-.24q-.4-.63-1.82-.63h-.79q-.4 0-.71.23l-1.9-.79q-1.66-.31-5.14-.31Zm-7.12.31h.31-.31Zm-4.04 2.22q0 .16 2.54.32 1.02-.08 1.02-.32-.39-.63-.95-.87h-.87q-1.74.24-1.74.87Zm15.43.55-1.9-.23h-.08v.07q0 .32 1.9.4l.08-.08v-.16Zm6.01-.23h-.32l-.23.31.23.16.32-.08v-.39Zm-24.92 1.02.4.24h.55l.32-.39v-.48l-.24-.32q-.79 0-1.03.95Zm-3.24 1.51v.08l.24.23q1.9-.47 1.9-1.26v-.56l-.16-.23q-1.03.39-1.98 1.74Zm29.03-1.43h-.16q0 .56 1.82.95l.32-.08v-.16q-.56-.71-1.74-.71h-.24Zm-19.93.16h-.16l-.4.32.24.23h.55v-.39l-.23-.16Zm10.99.16-.39.39q0 .32 3.95.56 3.24.95 5.62 2.61l1.11.08.31-.32v-.08q-.55-1.11-5.06-2.45-4.19-.79-5.54-.79Zm-5.14 1.11v.23l-1.27.24-1.66-.24-5.85.08q-3.64 3.33-3.64 4.67l-.47.55v.16q.55 7.91 1.58 9.81.08.4 2.85 2.37 0 .56 4.74 1.9 6.96 1.03 11.55 1.03 5.93-1.11 8.07-3.32 3.88-3.96 3.88-6.49v-.39q0-1.35-3.09-5.3-.39-1.11-2.37-2.14-3.48-2.29-7.04-2.85l-4.91-.08v-.55h-.95q-1.1 0-1.42.32Zm17.01.08h-.56v.15l3.09 2.77h.16v-.16q-1.11-2.21-2.69-2.76Zm-29.43 1.66v.23h.24l.95-.31v-.32h-.16q-1.03.08-1.03.4Zm-1.11.79v.31h.24l.48-.55v-.24q-.48 0-.72.48Zm-2.13 1.98.08.39h.16q.39 0 .94-2.37h-.15q-1.03.79-1.03 1.98Zm32.03-1.67h-.31q0 .4 2.29 3.17v.08h.16v-.32q-1.03-2.93-2.14-2.93Zm7.12 6.17v-.31h-.31v.16l.23.31.08-.16Zm-1.5.4-.32-.16h-.39v.16l.24.32h.15l.32-.32Zm-40.1.55h-.24l-.16.08v.56l.32.23h.08v-.87Zm41.05 1.51v.15q0 .72.32.8h.15q.64-1.11.64-2.38l-.08-.08h-.24q-.79.56-.79 1.51Zm-36.62-1.27h-.16l-.16.24-.16 1.58q.08 1.66.48 1.66h.15q.24-.16.24-.55v-1.03q0-1.9-.39-1.9Zm-3.88 1.58-.4-.39h-.15v.23q.08.56.31.56l.24-.16v-.24Zm35.52 5.07v.15l.23.16q1.98-.55 1.98-2.06v-.55h-.24q-1.97 1.5-1.97 2.3Zm-32.59-.4-.32.4q.24.55.47.55l.32-.4q0-.31-.47-.55Zm3.24 1.5h-.16v.24l.32.32h.47v-.24q-.08-.32-.63-.32Zm-.63.56h-.48l-.24.31v.16h.72v-.47Zm19.53 3.71q-9.72-.63-10.99-1.1l-2.14-.16v.16q1.03.79 2.69 1.02l2.38-.07.55.39.08-.08h.16q2.13.4 4.51.4h1.74q3.48 0 4.82-.87 3.32-1.19 3.32-1.35v-.08q-4.9 1.03-7.12 1.74Zm3.64 2.61h.24q.63 0 3.88-1.89v-.16h-.32q-3.8.87-3.8 2.05Zm-2.21-.31v.16h.32q1.42-.24 1.42-.95h-.32q-1.1.39-1.42.79Zm-11.87-.32h.16l-.39-.31-.08.07v.08l.31.16Zm1.35.24h-.32v.08q.08.31.87.31h.87q0-.39-1.42-.39Zm6.88 0h-.47l-.16.24v.15q.08.32.55.32h.48l1.02-.24v-.23l-1.42-.24Zm51.18-54.58q3.08 0 5.22 4.35.4 0 1.11 1.03l1.03 5.85q-.56.95-4.2.95h-.79q-2.92-.47-2.92-1.98 0-1.1-1.82-3.08-.24-.4-3.41-.4-3 0-7.27 1.58-3.01 3.17-3.96 4.91.56 13.52.4 16.93 0 .71.95.71h1.9q1.26.08 1.26.47v.08l.32 1.03-.16 4.43-.48.63-3.71.4h-.32l-1.58.47q-9.1-.31-9.1-.71-1.58 0-1.58-1.42-.16-1.43-.16-2.93 0-1.5 3.09-1.98 0-.63 2.13-.63l.24-.08v-.16l-.48-21.67q0-1.98-1.02-1.98h-.48q-.95 0-3.16.87l-.16-.16v-.15q0-.16.63-.4v-.16q-.79 0-.79-4.43-.16 0-.24-1.42 3.17-2.45 6.65-2.45h1.98q1.18 0 4.03.79v.23q-.71 1.11-.71 1.59v.55q6.41-2.85 17.56-1.66Zm-20.73 11.94v.4q.4.79.4 1.66-.08.32-.24 3.24l.16 3.17h.08q.24 0 .63-7.36.16 0 .16-1.58-.08-.71-.39-.71h-.16q-.64.39-.64 1.18Zm-4.74 23.89-1.03.08v.16q0 .39 2.29.39h2.38l.55-.07q0-.4-4.19-.56Zm13.68-32.43v.16q.71 0 1.9-2.3v-.39h-.08q-2.05.63-1.82 2.53Zm10.21 2.53h.39q.4-.08 1.51-1.9v-.08q0-.15-.32-.15-1.35.63-1.35 1.66-.07 0-.23.47Zm-17.96 3.17-.24-1.35h-.31l-.4 1.66q0 .4.48.79h.08q.23 0 .39-1.1Zm10.76-7.44.39 1.58h.64v-1.66l-.24-.24h-.24q-.55.08-.55.32Zm-15.66 32.91h-1.59l-.15.15.08.16h4.35v-.23l-2.69-.08Zm-3.01-32.99q.63.63 1.35.63l.07-.15v-.56l-.31-.39q-1.11.15-1.11.47Zm7.99 33.54.24.24h1.18l.32-.32q0-.16-.4-.32-1.34.16-1.34.4Zm22.78-31.4h-.24v.15q.64.64 1.11.64h.24v-.16q-.63-.63-1.11-.63Zm-26.18-3.01-.95-.71h-.24v.32l.48.55h.71v-.16Zm-3.32 3.96v.15h.23q.87 0 .95-.31l-.16-.24h-.15q-.72 0-.87.4Zm20.72-3.72h-.47l-.95.08v.08l.16.23h.79q.55 0 .63-.31l-.16-.08Zm-12.81 25.47h-.16l-.32.24v.63h.32l.31-.24v-.47l-.15-.16Zm-9.65 9.17v-.55l-.32-.32-.16.32v.32l.16.23h.32Zm11.54-30.37-.47-.08-.32.08v.24l.32.23h.24l.23-.23v-.24Zm12.03-4.35v.16h.55l.32-.24-.24-.24q-.63.16-.63.32Zm5.54 0h-.32l-.16.16v.08l.16.23h.32l.15-.23v-.08l-.15-.16Zm-19.31-.63-.23-.16-.4.16v.31h.4l.23-.31Zm-.23 1.26h-.24l-.32.24v.16l.16.16.4-.32v-.24Zm18.98 6.57v.16h.16l.32-.24v-.24h-.08q-.4.24-.4.32Zm-2.45-6.96h-.24l-.31.23v.08h.39l.16-.16v-.15Zm-16.61 27.37v-.32h-.16v.32h.16Zm38.05-34.49 9.8-.24q1.27 0 5.3 1.11 4.59 4.35 5.46 6.8 1.74 1.82 2.77 7.2 1.27 1.26 1.27 5.61l.08 1.98-.32 7.83q0 2.38 2.93 5.86 2.69 2.61 3.48 2.61v.15q0 .95-2.77 3.01-2.06 2.06-2.61 2.06h-.08q-1.27-.16-6.41-4.67-9.33 3.64-9.41 3.72-3.09.95-6.88.95h-.4q-4.27-.71-7.28-3.32-.55-.48-2.29-3.96-1.42-1.74-1.42-4.27v-2.3q0-2.21 1.18-4.11 1.03-3.24 3.56-6.17 1.27-1.5 2.53-1.9 4.12-2.21 8.15-2.21l3.56-.08h.47q3.01 0 4.28.87h.47q.4 0 .4-.32-.87-3.72-2.85-7.12-1.74-2.92-6.49-2.92l-3.24-.48q-4.19.87-4.19 1.74-1.66 2.14-1.98 5.3-.16.4-2.85.4l-.47.16q-.32 0-.79 1.34-2.22-.32-2.22-.95.16-.47.55-5.69 1.27-3.64 6.02-6.73 2.21-1.26 2.69-1.26Zm9.25 1.34h-.39l-.16.24.23.32h.48l.08-.16-.24-.4Zm5.62.63h-.16v.16q.63.64 1.11.64h.08v-.16q-.64-.64-1.03-.64Zm-12.66.4v.24q.08.23.79.23.71 0 1.98-.47v-.32h-.32q-1.74 0-2.45.32Zm-7.12 2.53v.16h.08q.71 0 2.14-1.5v-.24h-.08q-.79 0-2.14 1.58Zm11.63-.55h-.63l-.4.31.24.4h1.03l.23-.24-.47-.47Zm-12.1 6.56-.16-.16-.24.16v1.19h.08q.32-.08.32-.55v-.64Zm28.55 6.17h-.08v.16q.16.63.32.63l.08-.39q-.16-.4-.32-.4Zm-1.74 2.77h-.08l-.23.16v.24q.31 1.18.63 1.18h.16q0-1.02-.48-1.58Zm-23.17.48h-.08l-.87.39v.4h.15q.56 0 .8-.64v-.15Zm-.95 7.51q.55 4.75 1.34 4.75l.79 1.03v.07l-.71-.07v.23q1.5 2.06 6.17 3.8.55.32 1.58.47 1.43 0 10.92-4.66.63-.4.63-.87v-.4q-.71-3.24-1.19-7.59l-.15-.08q0-.87-1.74-1.43-5.86-1.66-7.99-1.66-6.01 1.35-8.23 4.04-1.42 1.42-1.42 2.37Zm23.81-5.06v-.08l-.24-.16v.24h.24Zm.31 1.74v-.32h-.47v.32l.24.24.23-.24Zm-2.45 1.66h-.08l-.24.24.24.31.32-.08v-.23l-.24-.24Zm2.77.24h-.24v.08q.16 3 .63 3l.16-.16v-.15q0-1.67-.55-2.77Zm-2.77 2.53h-.32l-.08.08v.47l.24.32h.08l.32-.32v-.47l-.24-.08Zm6.41 7.43h-.24v.48q.32 1.03.71 1.03h.24v-.24q-.32-1.27-.71-1.27Zm-28.95.24h-.16l-.16.16v.08l.16.16h.39v-.16l-.23-.24Zm26.89 1.03h-.39l-.24.24q.24.55.63.71h.08l.32-.32v-.16l-.4-.47Zm-11.86 1.11v.15h.31q1.11 0 2.93-.94v-.08h-.32q-2.69.31-2.92.87Zm13.52.23h-.31l-.16.32v.16l.31.32h.32l.24-.16v-.16l-.4-.48Zm-18.82.64h-1.03l-.24.23q.16.4.63.4.87-.16.87-.4v-.07l-.23-.16Zm-9.42 1.1h-.23l-.24.32q.31.71 3.95 1.82 1.19.55 3.17.55v-.08q0-.23-3.01-.87-1.74-.47-3.64-1.74Zm48.41-38.12q.87.16.87.23l-.31.56v.08h.15l4.04-.08q6.88 0 9.17 3.48 1.82 2.37 1.98 2.77l.32.08q.79 0 8.94-4.28 1.1-.55 1.82-.55 3.24 0 6.72 2.45 6.72 5.3 6.72 9.02.72 1.5 2.46 16.22v2.13q0 .71.39.87h.32q.63 0 2.53-.63 1.26 0 1.26 4.67.16 2.37.16 3.56h-1.1q-3.33.55-5.86.55l-2.53-.32-4.59.16h-.79q-.16 0-.16-.63l-1.02-1.03v-.08l.23-.79v-.16l-.39-2.13v-1.03q0-1.03 1.58-1.03 2.85.32 2.37-2.14-.08-6.17.48-9.25v-.16l-.16-4.74q0-1.27-2.14-2.93l-.63-.16h-.55l-.64.32q-.15 0-.15-.72-1.82-2.37-5.86-2.37-5.14.48-6.17 3.09-.16.71-.31 3.71l.15 1.82v5.7l-.08 2.29q0 3.56 1.98 4.12.87.15.87.55-.87 3.96-1.11 4.35l-1.97.4-6.73-.56-.79.16q-1.34 0-1.34-4.03v-.32q0-.47 2.37-1.19.63 0 .63-.63-.39-1.98-.39-4.43l.16-8.7q-.48-1.74-.48-2.77.08-1.98.56-1.98l.71.4h.08v-.16q0-1.74-5.38-4.98-1.43-.56-2.85-.56-2.21 0-4.98 1.98l-.08.4v6.4l.23 16.54.32.31h.32q.24 0 .31-.55h.16q2.14 0 2.61 1.11v.63l.08 1.9q.16 3.24-1.66 3.24-.47.16-4.27.32l-10.28-.64q-.8 0-1.51-4.82v-.08q0-.71 3.25-1.66 0-.55 3.16-1.03.55-.08.55-.79l.56-18.51.16-4.35q0-.71-1.51-.71-1.5 0-3.71.39-1.35-.71-1.35-1.5.63-.4.63-1.27v-.63q-.39-2.06-.95-2.06l-.08-.07v-.16q.48-.32 1.11-1.51 5.3-.71 11.39-1.1Zm-3.4 7.2v3.95q0 1.19-.47 2.37l.55.79-.16 1.27v.79l.16.16h.08q.63 0 .71-8.62v-.08q0-.95-.55-1.27-.32.08-.32.64Zm-7.28-1.51q0 .79 1.43.79 1.82 0 3.72-1.18v-.24h-.32q-4.83 0-4.83.63Zm13.14-.95v.08l4.11-.47q1.74 0 3.56 1.58h.24v-.32q-.48-1.66-1.67-1.66h-.71q-5.46 0-5.53.79Zm26.34-1.34q-.48.24-.48.39 0 .16 1.35.56.71 1.03 1.74 1.03h1.5v-.24q0-.79-4.03-1.74h-.08Zm-36.63 32.83h-.31l-.24.23q0 1.03 2.77.4.31.55.87.55 1.97-.08 4.11-.39v-.32l-2.06-.08q-1.97.16-4.74-.16l-.4-.23Zm12.26-30.3q0 .24 2.22.79 1.5.79 2.61.79h.08l.16-.24q-1.82-1.58-4.04-1.58h-.47q-.56.08-.56.24Zm27.45 4.03h-1.5l-.24.24q1.74 1.9 3.24 1.9l.24-.16v-.39q-.55-.72-1.74-1.59Zm-4.98-2.84v.15q.23.4.47.4 3.25 0 3.48-.4-.23-.71-2.53-.71h-.16q-1.18 0-1.26.56Zm11.07 15.03-.39-.4h-.48l-.16.32.24 3v.24l.24.32h.16l.39-.4v-3.08Zm-48.88 12.57-.08-.08h-.24q0 .72-.63 1.35.55 2.69 1.18 2.69h.24l-.47-3.96Zm25.31-13.92-.16.71v2.93l.16 1.42h.24q.31-.71.31-1.97-.15-3.09-.55-3.09Zm-14.16-18.27v.08l.32.16 5.14-.95v-.16h-2.37q-3.09 0-3.09.87Zm16.61 5.85v.71l.32.24q.95 0 2.45-1.42h-1.98q-.55 0-.79.47Zm-17.95 1.82h-.16q-.16 1.27-.16 2.69v1.03l.16.39q.55 0 .55-2.13v-.63q0-1.35-.39-1.35Zm35.67-1.82h-.24v.48q.32.95 1.51 1.9v.23h.55v-.16q0-.87-1.82-2.45Zm-12.26-2.45v.16h.08q.47 0 2.69-1.82v-.32q-2.77.87-2.77 1.98Zm15.42 29.98v.24h1.03q2.3 0 2.3-.48l-.32-.16h-.16q-2.85 0-2.85.4Zm-3.16 1.19v.15h2.06q.79 0 .95-.39-.08-.32-.64-.32h-1.18q-.4 0-1.19.56Zm2.77-20.65.95 1.42h.31v-1.18q0-.48-.23-.64h-.71q-.16 0-.32.4Zm-40.74 14.95h-1.66q.08 1.27.32 1.27h.23q1.03 0 1.11-1.27Zm-3.8-28h-1.74l-1.5.16v.23l.24.16q3.24 0 3.24-.31l-.24-.24Zm-2.61 30.85.08 1.18h.16q.56-.79 1.58-1.18v-.24l-.71-.16h-.79q-.32 0-.32.4Zm10.37 2.13-.32.24q0 .71 1.5.79l.4-.31v-.32q0-.4-1.58-.4Zm-1.19-3.32-1.58-1.34v.16q0 1.58.95 1.58h.47q.16 0 .16-.4Zm12.97-25.79h-.08v.08q0 .79 1.43 1.43v-.87q0-.16-1.35-.64Zm23.81 5.7h-.16v.16q.64 2.13 1.19 2.13v-.15q0-1.11-1.03-2.14Zm-27.45-10.44h-.47v.24q1.82.39 2.29.39h.16v-.16q0-.47-1.98-.47Zm3.41 2.85h-.16v.31q.71 1.11 1.26 1.43h.24v-.08q-.4-.95-1.34-1.66Zm-10.13 30.29h-.63l-2.06.16v.32h1.5l1.19-.16v-.32Zm18.11-28.79.08.16h.48q1.03-.08 1.03-.71l-.24-.08q-1.19.23-1.35.63Zm19.94 26.26v.16l.24.24h.23l.32-.4v-.39l-.16-.32h-.32q-.31.24-.31.71Zm-44.93 1.66h-.63l-.64.16v.24l.64.08h.63l.47-.08v-.24l-.47-.16Zm47.06 1.03.08.08h.32q.4 0 .55-.24v-.08q0-.63-.23-.63-.32 0-.72.87Zm-49.43-34.17.23.31q1.59-.15 1.59-.47l-.4-.08q-1.42.08-1.42.24Zm52.2 32.51h-.16l-.31.24v.95l.31.31q.24 0 .24-1.26l-.08-.24Zm-45.01 4.51v.16l.24.15q.71-.31 1.11-.79v-.15q-.71 0-1.35.63Zm17.01-25.79-.08.24q.16.63.32.63h.08l.47-.39v-.24q-.08-.24-.79-.24Zm-16.77-5.85v.16h.32q1.03-.08 1.03-.4v-.24h-.64q-.71.16-.71.48Zm17.09 25.39h-.56l-.31.39.23.24h.56l.31-.31v-.08l-.23-.24Zm11.23-27.84h-.48v.23q0 .24.8.24h.31l.16-.16q-.08-.31-.79-.31Zm-29.51 11.78h-.07l-.16.16v.47l.31.32h.16l.16-.16v-.39l-.4-.4Zm.48-15.5h-.55l-.16.23v.24l.23.24q.56 0 .56-.55l-.08-.16Zm11.55 4.9-.16.16q0 .79.71.79v-.16q0-.55-.55-.79Zm3.64 5.54h-.16q0 .63.63.63h.16v-.31q-.08-.32-.63-.32Zm.79 24.52h-.48l-.23.32v.15l.47.08.48-.08v-.15l-.24-.32Zm-12.5-1.34-.24-.24h-.55v.47l.55.08.24-.31Zm-11.94 2.61-.24-.24h-.16v.55l.16.24h.24v-.55Zm46.59-8.55h-.16l-.24.24v.32l.16.15h.24v-.71Zm-38.53-26.18h-.31l-.16.24v.16l.16.15h.16l.31-.15-.16-.4Zm38.92 28.64-.24-.32-.31.39v.08l.31.32.24-.32v-.15Zm-37.49-26.11v-.16l-.32-.15-.16.31.16.16h.08l.24-.16Zm16.69 25.87h-.16l-.16.24v.23l.32.08.08-.31-.08-.24Zm-20.17-13.61-.24-.16h-.08v.32l.24.24h.08v-.4Zm-.56-12.81h-.31l-.16.24v.15h.16l.31-.23v-.16Zm2.46 31.88h.15v-.08q-.08 0-.15.08Z"
  })));
};

/***/ }),

/***/ "./src/components/Logo/styles.js":
/*!***************************************!*\
  !*** ./src/components/Logo/styles.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Gopher": () => (/* binding */ Gopher),
/* harmony export */   "Octocat": () => (/* binding */ Octocat),
/* harmony export */   "Svg": () => (/* binding */ Svg)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/taggedTemplateLiteral */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js");
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _Octocat__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Octocat */ "./src/components/Logo/Octocat.jsx");

var _templateObject, _templateObject2, _templateObject3;


var Svg = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_templateObject || (_templateObject = (0,_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\n  width: 220px;\n  margin-top: -30px;\n  margin-left: -10px;\n"])));
var Gopher = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_templateObject2 || (_templateObject2 = (0,_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\n  width: 75px;\n  height: 75px;\n"])));
var Octocat = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_Octocat__WEBPACK_IMPORTED_MODULE_2__.OctocatSvg)(_templateObject3 || (_templateObject3 = (0,_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\n  width: 75px;\n  height: 75px;\n"])));

/***/ }),

/***/ "./src/components/NavBar/index.jsx":
/*!*****************************************!*\
  !*** ./src/components/NavBar/index.jsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NavBar": () => (/* binding */ NavBar)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-icons/md'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-icons/ai'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles */ "./src/components/NavBar/styles.js");




var SIZE = '32px';
var NavBar = function NavBar() {
  return /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_styles__WEBPACK_IMPORTED_MODULE_1__.Nav, null, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_styles__WEBPACK_IMPORTED_MODULE_1__.Link, {
    to: "/"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-icons/md'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
    size: SIZE
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_styles__WEBPACK_IMPORTED_MODULE_1__.Link, {
    to: "likes"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-icons/md'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
    size: SIZE
  })), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_styles__WEBPACK_IMPORTED_MODULE_1__.Link, {
    to: "user"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-icons/ai'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
    size: SIZE
  })));
};

/***/ }),

/***/ "./src/components/NavBar/styles.js":
/*!*****************************************!*\
  !*** ./src/components/NavBar/styles.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Link": () => (/* binding */ Link),
/* harmony export */   "Nav": () => (/* binding */ Nav)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/taggedTemplateLiteral */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js");
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _styles_animation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../styles/animation */ "./src/styles/animation.js");

var _templateObject, _templateObject2;



var Nav = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_templateObject || (_templateObject = (0,_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\n  align-items: center;\n  background: #fcfcfc;\n  border-top: 1px solid #e0e0e0;\n  bottom: 0;\n  display: flex;\n  height: 50px;\n  justify-content: space-around;\n  left: 0;\n  margin: 0 auto;\n  max-width: 500px;\n  position: fixed;\n  right: 0;\n  width: 100%;\n  z-index: 1000;"])));
var Link = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()))(_templateObject2 || (_templateObject2 = (0,_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\n  align-items: center;\n  color: #888;\n  display: inline-flex;\n  height: 100%;\n  justify-content: center;\n  text-decoration: none;\n  width: 100%;\n  &.active {\n    color: white;\n    background: #123456;\n    &:after{\n      ", ";\n      content: '.';\n      position: absolute;\n      bottom: 3px;\n      font-size: 34px;\n      line-height: 20px;\n      color: #DC2466FF;\n    }\n  }\n  \n"])), (0,_styles_animation__WEBPACK_IMPORTED_MODULE_2__.fadeIn)({
  time: '0.5s'
}));

/***/ }),

/***/ "./src/components/PhotoCardWithQuery/index.jsx":
/*!*****************************************************!*\
  !*** ./src/components/PhotoCardWithQuery/index.jsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PhotoCardWithQuery": () => (/* binding */ PhotoCardWithQuery)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! axios */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_4__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _PhotoCard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../PhotoCard */ "./src/components/PhotoCard/index.jsx");







var PhotoCardWithQuery = function PhotoCardWithQuery() {
  var id = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())().detailId;
  var _useState = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(null),
    _useState2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_1__["default"])(_useState, 2),
    photo = _useState2[0],
    setPhoto = _useState2[1];
  Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())( /*#__PURE__*/(0,_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_0__["default"])( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().mark(function _callee() {
    var uri;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_2___default().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          uri = "".concat("https://photogram-api.oscar-cely.xyz", "/api/v1/photos/").concat(id);
          _context.next = 3;
          return axios__WEBPACK_IMPORTED_MODULE_4___default().get(uri).then(function (response) {
            setPhoto(response.data.data);
          })["catch"](function (error) {
            console.log(error);
          });
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })), []);
  return photo && /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), null, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("h1", null, "Detail photo ".concat(id)), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_PhotoCard__WEBPACK_IMPORTED_MODULE_5__.PhotoCard, {
    id: photo.id,
    src: photo.src,
    likes: photo.likes
  }));
};

/***/ }),

/***/ "./src/components/PhotoCard/Loading.jsx":
/*!**********************************************!*\
  !*** ./src/components/PhotoCard/Loading.jsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Loading": () => (/* binding */ Loading)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-spinners'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles */ "./src/components/PhotoCard/styles.js");



var Loading = function Loading(_ref) {
  var _ref$color = _ref.color,
    color = _ref$color === void 0 ? '#f96167' : _ref$color,
    _ref$width = _ref.width,
    width = _ref$width === void 0 ? 100 : _ref$width,
    _ref$height = _ref.height,
    height = _ref$height === void 0 ? 4 : _ref$height;
  return /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_styles__WEBPACK_IMPORTED_MODULE_1__.LoadingPhotoCard, null, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-spinners'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
    color: color,
    width: width,
    height: height
  }));
};

/***/ }),

/***/ "./src/components/PhotoCard/index.jsx":
/*!********************************************!*\
  !*** ./src/components/PhotoCard/index.jsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PhotoCard": () => (/* binding */ PhotoCard)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-icons/bs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var hooks_useLocalStorage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! hooks/useLocalStorage */ "./src/hooks/useLocalStorage.js");
/* harmony import */ var hooks_useNearScreen__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! hooks/useNearScreen */ "./src/hooks/useNearScreen.js");
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./styles */ "./src/components/PhotoCard/styles.js");
/* harmony import */ var _Loading__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Loading */ "./src/components/PhotoCard/Loading.jsx");








var PhotoCard = function PhotoCard(_ref) {
  var id = _ref.id,
    _ref$likes = _ref.likes,
    likes = _ref$likes === void 0 ? 0 : _ref$likes,
    _ref$src = _ref.src,
    src = _ref$src === void 0 ? "https://picsum.photos/400?random=".concat(Math.random()) : _ref$src;
  var _useLocalStorage = (0,hooks_useLocalStorage__WEBPACK_IMPORTED_MODULE_2__.useLocalStorage)(id, false),
    _useLocalStorage2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useLocalStorage, 2),
    isLiked = _useLocalStorage2[0],
    setIsLiked = _useLocalStorage2[1];
  var _useNearScreen = (0,hooks_useNearScreen__WEBPACK_IMPORTED_MODULE_3__.useNearScreen)(),
    _useNearScreen2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useNearScreen, 2),
    show = _useNearScreen2[0],
    ref = _useNearScreen2[1];
  var _useState = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(likes),
    _useState2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState, 2),
    likesCount = _useState2[0],
    setLikesCount = _useState2[1];
  return /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_styles__WEBPACK_IMPORTED_MODULE_4__.Article, {
    ref: ref
  }, show ? /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), null, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
    to: "/photos/".concat(id)
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_styles__WEBPACK_IMPORTED_MODULE_4__.ImgWrapper, null, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_styles__WEBPACK_IMPORTED_MODULE_4__.Img, {
    src: src,
    alt: "card",
    loading: "lazy"
  }))), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_styles__WEBPACK_IMPORTED_MODULE_4__.Button, {
    onClick: function onClick() {
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    }
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("span", null, isLiked ? /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_styles__WEBPACK_IMPORTED_MODULE_4__.LikedIcon, {
    color: "E6005C",
    size: "32px"
  }) : /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-icons/bs'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
    size: "32px"
  })), likesCount, "\xA0likes")) : /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_Loading__WEBPACK_IMPORTED_MODULE_5__.Loading, null));
};

/***/ }),

/***/ "./src/components/PhotoCard/styles.js":
/*!********************************************!*\
  !*** ./src/components/PhotoCard/styles.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Article": () => (/* binding */ Article),
/* harmony export */   "Button": () => (/* binding */ Button),
/* harmony export */   "Img": () => (/* binding */ Img),
/* harmony export */   "ImgWrapper": () => (/* binding */ ImgWrapper),
/* harmony export */   "LikedIcon": () => (/* binding */ LikedIcon),
/* harmony export */   "LoadingPhotoCard": () => (/* binding */ LoadingPhotoCard)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/taggedTemplateLiteral */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js");
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-icons/all'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _styles_animation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../styles/animation */ "./src/styles/animation.js");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;



var ImgWrapper = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_templateObject || (_templateObject = (0,_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\n  border-radius: 10px;\n  display: block;\n  height: 0;\n  overflow: hidden;\n  padding: 56.25% 0 0 0;\n  position: relative;\n  width: 100%;\n  margin: 10px 0 10px;\n"])));
var Img = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_templateObject2 || (_templateObject2 = (0,_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\n  ", ";\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);\n  height: 100%;\n  object-fit: cover;\n  position: absolute;\n  top: 0;\n  width: 100%;\n"])), (0,_styles_animation__WEBPACK_IMPORTED_MODULE_2__.fadeIn)({
  time: '3s'
}));
var Button = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_templateObject3 || (_templateObject3 = (0,_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\n  padding-top: 8px;\n  display: flex;\n  align-items: center;\n\n  & svg {\n    margin-right: 4px;\n  }\n\n  background: none;\n  border: none;\n"])));
var LoadingPhotoCard = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_templateObject4 || (_templateObject4 = (0,_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\n  min-height: 200px;\n  background: #fce77d;\n  margin-bottom: 20px;\n  border-radius: 20px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n"])));
var Article = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_templateObject5 || (_templateObject5 = (0,_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\n  min-height: 200px;\n"])));
var LikedIcon = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-icons/all'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()))(_templateObject6 || (_templateObject6 = (0,_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\n  ", "\n"])), (0,_styles_animation__WEBPACK_IMPORTED_MODULE_2__.fadeIn)({
  time: '250ms',
  type: 'ease-in'
}));

/***/ }),

/***/ "./src/hooks/useLocalStorage.js":
/*!**************************************!*\
  !*** ./src/hooks/useLocalStorage.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useLocalStorage": () => (/* binding */ useLocalStorage)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ "./node_modules/.pnpm/axios@0.24.0/node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);



var useLocalStorage = function useLocalStorage(key, initialValue) {
  var _useState = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(function () {
      try {
        var item = window.localStorage.getItem(key);
        return item !== null ? JSON.parse(item) : initialValue;
      } catch (e) {
        console.error(e);
        return initialValue;
      }
    }),
    _useState2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState, 2),
    storedValue = _useState2[0],
    setValue = _useState2[1];
  var setLocalStorage = function setLocalStorage(value) {
    try {
      setValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
      var uri = 'https://oscarce10-photogram.herokuapp.com/api/v1/photos';
      var params = {
        photo_id: key,
        action: value === true ? 'like' : 'dislike'
      };
      axios__WEBPACK_IMPORTED_MODULE_2___default().put(uri, params).then(function (response) {
        return response.data;
      })["catch"](function (error) {
        console.error(error);
        console.error(error.response.data);
      });
    } catch (e) {
      console.error(e);
    }
  };
  return [storedValue, setLocalStorage];
};

/***/ }),

/***/ "./src/hooks/useNearScreen.js":
/*!************************************!*\
  !*** ./src/hooks/useNearScreen.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useNearScreen": () => (/* binding */ useNearScreen)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/slicedToArray.js");
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());


var useNearScreen = function useNearScreen() {
  var _useState = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(false),
    _useState2 = (0,_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_useState, 2),
    show = _useState2[0],
    setShow = _useState2[1];
  var ref = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(null);
  Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(function () {
    var observer = new window.IntersectionObserver(function (entries) {
      var isIntersecting = entries[0].isIntersecting;
      if (isIntersecting) {
        setTimeout(function () {
          setShow(true);
        }, 1000);
        // para evitar que el observer se ejecute mas de una vez
        observer.disconnect();
      }
    });
    observer.observe(ref.current);
  }, [show, ref]);
  return [show, ref];
};

/***/ }),

/***/ "./src/pages/Error/index.jsx":
/*!***********************************!*\
  !*** ./src/pages/Error/index.jsx ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Error)
/* harmony export */ });
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());

function Error() {
  return /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("div", {
    className: "raiz"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("div", {
    className: "err404"
  }, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("div", null, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("div", {
    className: "not-found"
  }, "OOPS!"), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("div", {
    className: "not-found"
  }, "404 - PAGE NOT FOUND"), /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("div", {
    className: "return"
  }, ' ', /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("a", {
    href: '/'
  }, "BACK TO HOME")))));
}

/***/ }),

/***/ "./src/styles/GlobalStyles.js":
/*!************************************!*\
  !*** ./src/styles/GlobalStyles.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GlobalStyle": () => (/* binding */ GlobalStyle)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/taggedTemplateLiteral */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js");
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());

var _templateObject;

var GlobalStyle = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_templateObject || (_templateObject = (0,_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\nhtml {\n    box-sizing: border-box;\n    background-color: #fafafa;\n    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;\n  }\n\n  *, *:before, *:after {\n    box-sizing: inherit;\n  }\n\n  ul, li, h1, h2, h3, p, button {\n    margin: 0;\n    padding: 0;\n  }\n\n  ul {\n    list-style: none;\n  }\n\n  button: {\n    background: transparent;\n    border: 0;\n    outline: 0;\n  }\n\n  body {\n    background: #fefefe;\n    height: 100vh;\n    margin: 0 auto;\n    max-width: 500px;\n    overscroll-behavior: none;\n    width: 100%;\n  }\n\n  #app {\n    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);\n    overflow-x: hidden;\n    min-height: 100vh;\n    padding-bottom: 10px;\n  }\n"])));

/***/ }),

/***/ "./src/styles/animation.js":
/*!*********************************!*\
  !*** ./src/styles/animation.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fadeIn": () => (/* binding */ fadeIn)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/taggedTemplateLiteral */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js");
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());

var _templateObject, _templateObject2;

var fadeInKeyFrames = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_templateObject || (_templateObject = (0,_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\n  from {\n    filter: blur(5px);\n    opacity: 0;\n  }\n  to {\n    filter: blur(0);\n    opacity: 1;\n  }\n"])));
var fadeIn = function fadeIn() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$time = _ref.time,
    time = _ref$time === void 0 ? '1s' : _ref$time,
    _ref$type = _ref.type,
    type = _ref$type === void 0 ? 'ease-in-out' : _ref$type;
  return Object(function webpackMissingModule() { var e = new Error("Cannot find module 'styled-components'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_templateObject2 || (_templateObject2 = (0,_babel_runtime_helpers_taggedTemplateLiteral__WEBPACK_IMPORTED_MODULE_0__["default"])(["\n  animation: ", " ", " ", ";\n"])), time, fadeInKeyFrames, type);
};

/***/ }),

/***/ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/regeneratorRuntime.js":
/*!************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/regeneratorRuntime.js ***!
  \************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(/*! ./typeof.js */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/typeof.js")["default"]);
function _regeneratorRuntime() {
  "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return exports;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function value(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function stop() {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/typeof.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/typeof.js ***!
  \************************************************************************************************/
/***/ ((module) => {

function _typeof(obj) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/regenerator/index.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/regenerator/index.js ***!
  \***************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(/*! ../helpers/regeneratorRuntime */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/regeneratorRuntime.js")();
module.exports = runtime;

// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ }),

/***/ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js":
/*!**************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayLikeToArray)
/* harmony export */ });
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

/***/ }),

/***/ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js":
/*!************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayWithHoles)
/* harmony export */ });
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

/***/ }),

/***/ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js":
/*!**************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _asyncToGenerator)
/* harmony export */ });
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}

/***/ }),

/***/ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/extends.js":
/*!*****************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

/***/ }),

/***/ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js":
/*!******************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _iterableToArrayLimit)
/* harmony export */ });
function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}

/***/ }),

/***/ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/nonIterableRest.js":
/*!*************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/nonIterableRest.js ***!
  \*************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _nonIterableRest)
/* harmony export */ });
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/slicedToArray.js":
/*!***********************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/slicedToArray.js ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _slicedToArray)
/* harmony export */ });
/* harmony import */ var _arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithHoles.js */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js");
/* harmony import */ var _iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArrayLimit.js */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableRest.js */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/nonIterableRest.js");




function _slicedToArray(arr, i) {
  return (0,_arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || (0,_iterableToArrayLimit_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arr, i) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arr, i) || (0,_nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}

/***/ }),

/***/ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js":
/*!*******************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js ***!
  \*******************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _taggedTemplateLiteral)
/* harmony export */ });
function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(Object.defineProperties(strings, {
    raw: {
      value: Object.freeze(raw)
    }
  }));
}

/***/ }),

/***/ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js":
/*!************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js ***!
  \************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _unsupportedIterableToArray)
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/.pnpm/@babel+runtime@7.20.7/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***********************!*\
  !*** ./src/index.jsx ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _Routes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Routes */ "./src/Routes/index.jsx");




Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())( /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react-router-dom'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), null, /*#__PURE__*/Object(function webpackMissingModule() { var e = new Error("Cannot find module 'react'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(_Routes__WEBPACK_IMPORTED_MODULE_1__.Router, null)), document.getElementById('root'));
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map