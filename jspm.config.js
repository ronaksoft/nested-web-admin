SystemJS.config({
  nodeConfig: {
    'paths': {
      'github:': 'jspm_packages/github/',
      'npm:': 'jspm_packages/npm/'
    }
  },
  devConfig: {
    'map': {
      'react-addons-test-utils': 'npm:react-addons-test-utils@15.5.1',
      'babel-preset-react': 'npm:babel-preset-react@6.24.1'
    },
    'packages': {
      'npm:react-addons-test-utils@15.5.1': {
        'map': {
          'object-assign': 'npm:object-assign@4.1.1',
          'fbjs': 'npm:fbjs@0.8.12'
        }
      },
      'npm:babel-preset-react@6.24.1': {
        'map': {
          'babel-plugin-transform-react-display-name': 'npm:babel-plugin-transform-react-display-name@6.23.0',
          'babel-plugin-syntax-jsx': 'npm:babel-plugin-syntax-jsx@6.18.0',
          'babel-preset-flow': 'npm:babel-preset-flow@6.23.0',
          'babel-plugin-transform-react-jsx': 'npm:babel-plugin-transform-react-jsx@6.24.1',
          'babel-plugin-transform-react-jsx-self': 'npm:babel-plugin-transform-react-jsx-self@6.22.0',
          'babel-plugin-transform-react-jsx-source': 'npm:babel-plugin-transform-react-jsx-source@6.22.0'
        }
      },
      'npm:babel-plugin-transform-react-display-name@6.23.0': {
        'map': {
          'babel-runtime': 'npm:babel-runtime@6.26.0'
        }
      },
      'npm:babel-plugin-transform-react-jsx-self@6.22.0': {
        'map': {
          'babel-runtime': 'npm:babel-runtime@6.26.0',
          'babel-plugin-syntax-jsx': 'npm:babel-plugin-syntax-jsx@6.18.0'
        }
      },
      'npm:babel-plugin-transform-react-jsx-source@6.22.0': {
        'map': {
          'babel-runtime': 'npm:babel-runtime@6.26.0',
          'babel-plugin-syntax-jsx': 'npm:babel-plugin-syntax-jsx@6.18.0'
        }
      },
      'npm:babel-plugin-transform-react-jsx@6.24.1': {
        'map': {
          'babel-runtime': 'npm:babel-runtime@6.26.0',
          'babel-plugin-syntax-jsx': 'npm:babel-plugin-syntax-jsx@6.18.0',
          'babel-helper-builder-react-jsx': 'npm:babel-helper-builder-react-jsx@6.24.1'
        }
      },
      'npm:babel-preset-flow@6.23.0': {
        'map': {
          'babel-plugin-transform-flow-strip-types': 'npm:babel-plugin-transform-flow-strip-types@6.22.0'
        }
      },
      'npm:babel-plugin-transform-flow-strip-types@6.22.0': {
        'map': {
          'babel-runtime': 'npm:babel-runtime@6.26.0',
          'babel-plugin-syntax-flow': 'npm:babel-plugin-syntax-flow@6.18.0'
        }
      },
      'npm:babel-helper-builder-react-jsx@6.24.1': {
        'map': {
          'babel-runtime': 'npm:babel-runtime@6.26.0',
          'babel-types': 'npm:babel-types@6.24.1',
          'esutils': 'npm:esutils@2.0.2'
        }
      },
      'npm:babel-types@6.24.1': {
        'map': {
          'babel-runtime': 'npm:babel-runtime@6.26.0',
          'esutils': 'npm:esutils@2.0.2',
          'lodash': 'npm:lodash@4.17.4',
          'to-fast-properties': 'npm:to-fast-properties@1.0.3'
        }
      }
    }
  },
  packages: {
    'app': {
      'defaultExtension': 'tsx',
      'main': 'index'
    },
    'jsmp_packages': {
      'defaultExtension': 'js',
      'main': 'index'
    }
  },
  transpiler: 'ts',
  typescriptOptions: {
    'sourceMap': true,
    'emitDecoratorMetadata': true,
    'experimentalDecorators': true,
    'removeComments': false,
    'noImplicitAny': false,
    'jsx': 2
  },
  paths: {
    'app/': 'src/'
  },
  meta: {
    '*.less': {
      'loader': 'less'
    },
    '*.css': {
      'loader': 'css'
    }
  },
  map: {
    'jquery-migrate': 'npm:jquery-migrate@1.4.1'
  }
});

SystemJS.config({
  packageConfigPaths: [
    'npm:@*/*.json',
    'npm:*.json',
    'github:*/*.json'
  ],
  map: {
    'ant': 'npm:ant@0.2.0',
    'antd': 'npm:antd@2.9.3',
    'assert': 'github:jspm/nodelibs-assert@0.2.0-alpha',
    'babel-plugin-import': 'npm:babel-plugin-import@1.1.1',
    'babel-polyfill': 'npm:babel-polyfill@6.23.0',
    'babel-runtime': 'npm:babel-runtime@6.26.0',
    'buffer': 'github:jspm/nodelibs-buffer@0.2.0-alpha',
    'child_process': 'github:jspm/nodelibs-child_process@0.2.0-alpha',
    'classnames': 'npm:classnames@2.2.5',
    'constants': 'github:jspm/nodelibs-constants@0.2.0-alpha',
    'cookies': 'npm:cookies@0.7.0',
    'cookies-js': 'npm:cookies-js@1.2.3',
    'crypto': 'github:jspm/nodelibs-crypto@0.2.0-alpha',
    'css': 'github:systemjs/plugin-css@0.1.36',
    'domain': 'github:jspm/nodelibs-domain@0.2.0-alpha',
    'es6-shim': 'npm:es6-shim@0.35.3',
    'events': 'github:jspm/nodelibs-events@0.2.2',
    'fs': 'github:jspm/nodelibs-fs@0.2.0-alpha',
    'http': 'github:jspm/nodelibs-http@0.2.0-alpha',
    'https': 'github:jspm/nodelibs-https@0.2.0-alpha',
    'immutable': 'npm:immutable@3.8.1',
    'jquery': 'npm:jquery@3.2.1',
    'less': 'npm:systemjs-less-plugin@2.0.0',
    'lodash': 'npm:lodash@4.17.4',
    'loglevel': 'npm:loglevel@1.4.1',
    'md5': 'npm:md5@2.2.1',
    'module': 'github:jspm/nodelibs-module@0.2.0-alpha',
    'moment': 'npm:moment@2.18.1',
    'net': 'github:jspm/nodelibs-net@0.2.0-alpha',
    'os': 'github:jspm/nodelibs-os@0.2.0-alpha',
    'path': 'github:jspm/nodelibs-path@0.2.3',
    'process': 'github:jspm/nodelibs-process@0.2.0-alpha',
    'prop-types': 'npm:prop-types@15.6.0',
    'react': 'npm:react@15.6.2',
    'react-dom': 'npm:react-dom@15.6.2',
    'react-image-crop': 'npm:react-image-crop@3.0.8',
    'react-inlinesvg': 'npm:react-inlinesvg@0.6.0',
    'react-json-tree': 'npm:react-json-tree@0.11.0',
    'react-platform-js': 'npm:react-platform-js@0.0.1',
    'react-redux': 'npm:react-redux@5.0.4',
    'react-router': 'npm:react-router@3.0.5',
    'react-transition-group': 'npm:react-transition-group@1.1.3',
    'recharts': 'npm:recharts@0.22.4',
    'redux': 'npm:redux@3.6.0',
    'reqwest': 'npm:reqwest@2.0.5',
    'stream': 'github:jspm/nodelibs-stream@0.2.0-alpha',
    'string_decoder': 'github:jspm/nodelibs-string_decoder@0.2.0-alpha',
    'todomvc-app-css': 'npm:todomvc-app-css@2.1.0',
    'ts': 'github:frankwallis/plugin-typescript@7.0.3',
    'typescript': 'npm:typescript@2.3.2',
    'url': 'github:jspm/nodelibs-url@0.2.0-alpha',
    'util': 'github:jspm/nodelibs-util@0.2.0-alpha',
    'vm': 'github:jspm/nodelibs-vm@0.2.0-alpha',
    'vuzonp/systemjs-plugin-svg': 'github:vuzonp/systemjs-plugin-svg@0.1.1',
    'zlib': 'github:jspm/nodelibs-zlib@0.2.0-alpha'
  },
  packages: {
    'npm:react-router@3.0.5': {
      'map': {
        'prop-types': 'npm:prop-types@15.5.8',
        'loose-envify': 'npm:loose-envify@1.3.1',
        'create-react-class': 'npm:create-react-class@15.5.2',
        'history': 'npm:history@3.3.0',
        'hoist-non-react-statics': 'npm:hoist-non-react-statics@1.2.0',
        'invariant': 'npm:invariant@2.2.2',
        'warning': 'npm:warning@3.0.0'
      }
    },
    'npm:redux@3.6.0': {
      'map': {
        'loose-envify': 'npm:loose-envify@1.3.1',
        'lodash': 'npm:lodash@4.17.4',
        'lodash-es': 'npm:lodash-es@4.17.4',
        'symbol-observable': 'npm:symbol-observable@1.0.4'
      }
    },
    'npm:babel-polyfill@6.23.0': {
      'map': {
        'core-js': 'npm:core-js@2.4.1',
        'regenerator-runtime': 'npm:regenerator-runtime@0.10.5',
        'babel-runtime': 'npm:babel-runtime@6.26.0'
      }
    },
    'npm:react-redux@5.0.4': {
      'map': {
        'create-react-class': 'npm:create-react-class@15.5.2',
        'hoist-non-react-statics': 'npm:hoist-non-react-statics@1.2.0',
        'invariant': 'npm:invariant@2.2.2',
        'lodash': 'npm:lodash@4.17.4',
        'lodash-es': 'npm:lodash-es@4.17.4',
        'loose-envify': 'npm:loose-envify@1.3.1',
        'prop-types': 'npm:prop-types@15.5.8'
      }
    },
    'npm:prop-types@15.5.8': {
      'map': {
        'fbjs': 'npm:fbjs@0.8.12'
      }
    },
    'npm:create-react-class@15.5.2': {
      'map': {
        'fbjs': 'npm:fbjs@0.8.12',
        'object-assign': 'npm:object-assign@4.1.1'
      }
    },
    'npm:history@3.3.0': {
      'map': {
        'invariant': 'npm:invariant@2.2.2',
        'warning': 'npm:warning@3.0.0',
        'loose-envify': 'npm:loose-envify@1.3.1',
        'query-string': 'npm:query-string@4.3.4'
      }
    },
    'npm:fbjs@0.8.12': {
      'map': {
        'core-js': 'npm:core-js@1.2.7',
        'loose-envify': 'npm:loose-envify@1.3.1',
        'object-assign': 'npm:object-assign@4.1.1',
        'isomorphic-fetch': 'npm:isomorphic-fetch@2.2.1',
        'promise': 'npm:promise@7.1.1',
        'ua-parser-js': 'npm:ua-parser-js@0.7.12',
        'setimmediate': 'npm:setimmediate@1.0.5'
      }
    },
    'npm:invariant@2.2.2': {
      'map': {
        'loose-envify': 'npm:loose-envify@1.3.1'
      }
    },
    'npm:loose-envify@1.3.1': {
      'map': {
        'js-tokens': 'npm:js-tokens@3.0.2'
      }
    },
    'npm:warning@3.0.0': {
      'map': {
        'loose-envify': 'npm:loose-envify@1.3.1'
      }
    },
    'npm:query-string@4.3.4': {
      'map': {
        'object-assign': 'npm:object-assign@4.1.1',
        'strict-uri-encode': 'npm:strict-uri-encode@1.1.0'
      }
    },
    'github:jspm/nodelibs-stream@0.2.0-alpha': {
      'map': {
        'stream-browserify': 'npm:stream-browserify@2.0.1'
      }
    },
    'npm:isomorphic-fetch@2.2.1': {
      'map': {
        'node-fetch': 'npm:node-fetch@1.7.3',
        'whatwg-fetch': 'npm:whatwg-fetch@2.0.3'
      }
    },
    'npm:promise@7.1.1': {
      'map': {
        'asap': 'npm:asap@2.0.5'
      }
    },
    'npm:stream-browserify@2.0.1': {
      'map': {
        'readable-stream': 'npm:readable-stream@2.3.3',
        'inherits': 'npm:inherits@2.0.3'
      }
    },
    'npm:encoding@0.1.12': {
      'map': {
        'iconv-lite': 'npm:iconv-lite@0.4.19'
      }
    },
    'github:jspm/nodelibs-http@0.2.0-alpha': {
      'map': {
        'http-browserify': 'npm:stream-http@2.7.2'
      }
    },
    'github:jspm/nodelibs-domain@0.2.0-alpha': {
      'map': {
        'domain-browserify': 'npm:domain-browser@1.1.7'
      }
    },
    'github:jspm/nodelibs-url@0.2.0-alpha': {
      'map': {
        'url-browserify': 'npm:url@0.11.0'
      }
    },
    'github:jspm/nodelibs-buffer@0.2.0-alpha': {
      'map': {
        'buffer-browserify': 'npm:buffer@4.9.1'
      }
    },
    'github:jspm/nodelibs-zlib@0.2.0-alpha': {
      'map': {
        'zlib-browserify': 'npm:browserify-zlib@0.1.4'
      }
    },
    'npm:buffer@4.9.1': {
      'map': {
        'isarray': 'npm:isarray@1.0.0',
        'base64-js': 'npm:base64-js@1.2.1',
        'ieee754': 'npm:ieee754@1.1.8'
      }
    },
    'npm:browserify-zlib@0.1.4': {
      'map': {
        'readable-stream': 'npm:readable-stream@2.3.3',
        'pako': 'npm:pako@0.2.9'
      }
    },
    'npm:url@0.11.0': {
      'map': {
        'punycode': 'npm:punycode@1.3.2',
        'querystring': 'npm:querystring@0.2.0'
      }
    },
    'npm:typescript@2.3.2': {
      'map': {
        'source-map-support': 'npm:source-map-support@0.4.15'
      }
    },
    'github:jspm/nodelibs-string_decoder@0.2.0-alpha': {
      'map': {
        'string_decoder-browserify': 'npm:string_decoder@0.10.31'
      }
    },
    'npm:source-map-support@0.4.15': {
      'map': {
        'source-map': 'npm:source-map@0.5.6'
      }
    },
    'github:jspm/nodelibs-crypto@0.2.0-alpha': {
      'map': {
        'crypto-browserify': 'npm:crypto-browserify@3.12.0'
      }
    },
    'github:jspm/nodelibs-os@0.2.0-alpha': {
      'map': {
        'os-browserify': 'npm:os-browserify@0.2.1'
      }
    },
    'npm:diffie-hellman@5.0.2': {
      'map': {
        'randombytes': 'npm:randombytes@2.0.5',
        'bn.js': 'npm:bn.js@4.11.8',
        'miller-rabin': 'npm:miller-rabin@4.0.1'
      }
    },
    'npm:public-encrypt@4.0.0': {
      'map': {
        'create-hash': 'npm:create-hash@1.1.3',
        'randombytes': 'npm:randombytes@2.0.5',
        'bn.js': 'npm:bn.js@4.11.8',
        'browserify-rsa': 'npm:browserify-rsa@4.0.1',
        'parse-asn1': 'npm:parse-asn1@5.1.0'
      }
    },
    'npm:browserify-sign@4.0.4': {
      'map': {
        'create-hash': 'npm:create-hash@1.1.3',
        'create-hmac': 'npm:create-hmac@1.1.6',
        'inherits': 'npm:inherits@2.0.3',
        'bn.js': 'npm:bn.js@4.11.8',
        'elliptic': 'npm:elliptic@6.4.0',
        'browserify-rsa': 'npm:browserify-rsa@4.0.1',
        'parse-asn1': 'npm:parse-asn1@5.1.0'
      }
    },
    'npm:create-ecdh@4.0.0': {
      'map': {
        'bn.js': 'npm:bn.js@4.11.8',
        'elliptic': 'npm:elliptic@6.4.0'
      }
    },
    'npm:browserify-cipher@1.0.0': {
      'map': {
        'browserify-aes': 'npm:browserify-aes@1.1.1',
        'browserify-des': 'npm:browserify-des@1.0.0',
        'evp_bytestokey': 'npm:evp_bytestokey@1.0.3'
      }
    },
    'npm:elliptic@6.4.0': {
      'map': {
        'bn.js': 'npm:bn.js@4.11.8',
        'inherits': 'npm:inherits@2.0.3',
        'hash.js': 'npm:hash.js@1.1.3',
        'brorand': 'npm:brorand@1.1.0',
        'hmac-drbg': 'npm:hmac-drbg@1.0.1',
        'minimalistic-crypto-utils': 'npm:minimalistic-crypto-utils@1.0.1',
        'minimalistic-assert': 'npm:minimalistic-assert@1.0.0'
      }
    },
    'npm:browserify-des@1.0.0': {
      'map': {
        'cipher-base': 'npm:cipher-base@1.0.4',
        'inherits': 'npm:inherits@2.0.3',
        'des.js': 'npm:des.js@1.0.0'
      }
    },
    'npm:browserify-rsa@4.0.1': {
      'map': {
        'bn.js': 'npm:bn.js@4.11.8',
        'randombytes': 'npm:randombytes@2.0.5'
      }
    },
    'npm:parse-asn1@5.1.0': {
      'map': {
        'browserify-aes': 'npm:browserify-aes@1.1.1',
        'create-hash': 'npm:create-hash@1.1.3',
        'evp_bytestokey': 'npm:evp_bytestokey@1.0.3',
        'pbkdf2': 'npm:pbkdf2@3.0.14',
        'asn1.js': 'npm:asn1.js@4.9.2'
      }
    },
    'npm:hmac-drbg@1.0.1': {
      'map': {
        'hash.js': 'npm:hash.js@1.1.3',
        'minimalistic-assert': 'npm:minimalistic-assert@1.0.0',
        'minimalistic-crypto-utils': 'npm:minimalistic-crypto-utils@1.0.1'
      }
    },
    'npm:des.js@1.0.0': {
      'map': {
        'inherits': 'npm:inherits@2.0.3',
        'minimalistic-assert': 'npm:minimalistic-assert@1.0.0'
      }
    },
    'npm:antd@2.9.3': {
      'map': {
        'lodash.debounce': 'npm:lodash.debounce@4.0.8',
        'dom-closest': 'npm:dom-closest@0.2.0',
        'array-tree-filter': 'npm:array-tree-filter@1.0.1',
        'moment': 'npm:moment@2.18.1',
        'omit.js': 'npm:omit.js@0.1.0',
        'css-animation': 'npm:css-animation@1.3.2',
        'rc-checkbox': 'npm:rc-checkbox@1.5.0',
        'rc-animate': 'npm:rc-animate@2.3.6',
        'rc-collapse': 'npm:rc-collapse@1.7.3',
        'rc-dialog': 'npm:rc-dialog@6.5.8',
        'rc-editor-mention': 'npm:rc-editor-mention@0.5.5',
        'rc-dropdown': 'npm:rc-dropdown@1.4.11',
        'rc-input-number': 'npm:rc-input-number@3.4.14',
        'rc-notification': 'npm:rc-notification@1.4.2',
        'rc-menu': 'npm:rc-menu@5.0.10',
        'rc-pagination': 'npm:rc-pagination@1.8.7',
        'rc-progress': 'npm:rc-progress@2.1.1',
        'rc-radio': 'npm:rc-radio@2.0.1',
        'rc-rate': 'npm:rc-rate@2.1.1',
        'rc-steps': 'npm:rc-steps@2.5.1',
        'rc-slider': 'npm:rc-slider@7.0.2',
        'rc-calendar': 'npm:rc-calendar@8.0.1',
        'rc-switch': 'npm:rc-switch@1.4.4',
        'rc-table': 'npm:rc-table@5.2.15',
        'rc-time-picker': 'npm:rc-time-picker@2.3.5',
        'rc-tooltip': 'npm:rc-tooltip@3.4.3',
        'rc-tabs': 'npm:rc-tabs@7.3.4',
        'rc-tree': 'npm:rc-tree@1.4.8',
        'rc-cascader': 'npm:rc-cascader@0.11.3',
        'rc-form': 'npm:rc-form@1.3.1',
        'rc-tree-select': 'npm:rc-tree-select@1.9.4',
        'rc-upload': 'npm:rc-upload@2.3.5',
        'rc-util': 'npm:rc-util@4.0.2',
        'react-lazy-load': 'npm:react-lazy-load@3.0.12',
        'babel-runtime': 'npm:babel-runtime@6.26.0',
        'classnames': 'npm:classnames@2.2.5',
        'prop-types': 'npm:prop-types@15.5.8',
        'object-assign': 'npm:object-assign@4.1.1',
        'warning': 'npm:warning@3.0.0',
        'react-slick': 'npm:react-slick@0.14.11',
        'shallowequal': 'npm:shallowequal@0.2.2',
        'rc-select': 'npm:rc-select@6.8.4'
      }
    },
    'npm:omit.js@0.1.0': {
      'map': {
        'object-assign': 'npm:object-assign@4.1.1'
      }
    },
    'npm:rc-animate@2.3.6': {
      'map': {
        'css-animation': 'npm:css-animation@1.3.2',
        'prop-types': 'npm:prop-types@15.5.8'
      }
    },
    'npm:rc-collapse@1.7.3': {
      'map': {
        'classnames': 'npm:classnames@2.2.5',
        'css-animation': 'npm:css-animation@1.3.2',
        'prop-types': 'npm:prop-types@15.5.8',
        'rc-animate': 'npm:rc-animate@2.3.6'
      }
    },
    'npm:rc-dialog@6.5.8': {
      'map': {
        'babel-runtime': 'npm:babel-runtime@6.26.0',
        'object-assign': 'npm:object-assign@4.1.1',
        'rc-animate': 'npm:rc-animate@2.3.6',
        'rc-util': 'npm:rc-util@4.0.2'
      }
    },
    'npm:rc-editor-mention@0.5.5': {
      'map': {
        'classnames': 'npm:classnames@2.2.5',
        'rc-animate': 'npm:rc-animate@2.3.6',
        'dom-scroll-into-view': 'npm:dom-scroll-into-view@1.2.1',
        'rc-editor-core': 'npm:rc-editor-core@0.6.19',
        'draft-js': 'npm:draft-js@0.10.0',
        'immutable': 'npm:immutable@3.8.1'
      }
    },
    'npm:rc-dropdown@1.4.11': {
      'map': {
        'prop-types': 'npm:prop-types@15.5.8',
        'rc-trigger': 'npm:rc-trigger@1.10.3'
      }
    },
    'npm:rc-menu@5.0.10': {
      'map': {
        'prop-types': 'npm:prop-types@15.5.8',
        'babel-runtime': 'npm:babel-runtime@6.26.0',
        'classnames': 'npm:classnames@2.2.5',
        'rc-animate': 'npm:rc-animate@2.3.6',
        'rc-util': 'npm:rc-util@4.0.2',
        'dom-scroll-into-view': 'npm:dom-scroll-into-view@1.2.1',
        'create-react-class': 'npm:create-react-class@15.5.2'
      }
    },
    'npm:rc-notification@1.4.2': {
      'map': {
        'classnames': 'npm:classnames@2.2.5',
        'prop-types': 'npm:prop-types@15.5.8',
        'rc-animate': 'npm:rc-animate@2.3.6',
        'rc-util': 'npm:rc-util@4.0.2'
      }
    },
    'npm:rc-progress@2.1.1': {
      'map': {
        'prop-types': 'npm:prop-types@15.5.8'
      }
    },
    'npm:rc-pagination@1.8.7': {
      'map': {
        'prop-types': 'npm:prop-types@15.5.8'
      }
    },
    'npm:rc-rate@2.1.1': {
      'map': {
        'classnames': 'npm:classnames@2.2.5',
        'prop-types': 'npm:prop-types@15.5.8'
      }
    },
    'npm:rc-steps@2.5.1': {
      'map': {
        'classnames': 'npm:classnames@2.2.5',
        'lodash.debounce': 'npm:lodash.debounce@4.0.8',
        'prop-types': 'npm:prop-types@15.5.8'
      }
    },
    'npm:rc-slider@7.0.2': {
      'map': {
        'babel-runtime': 'npm:babel-runtime@6.26.0',
        'classnames': 'npm:classnames@2.2.5',
        'prop-types': 'npm:prop-types@15.5.8',
        'warning': 'npm:warning@3.0.0',
        'rc-tooltip': 'npm:rc-tooltip@3.4.3',
        'rc-util': 'npm:rc-util@4.0.2'
      }
    },
    'npm:rc-switch@1.4.4': {
      'map': {
        'classnames': 'npm:classnames@2.2.5',
        'prop-types': 'npm:prop-types@15.5.8'
      }
    },
    'npm:rc-calendar@8.0.1': {
      'map': {
        'rc-util': 'npm:rc-util@3.4.1',
        'babel-runtime': 'npm:babel-runtime@6.26.0',
        'classnames': 'npm:classnames@2.2.5',
        'moment': 'npm:moment@2.18.1',
        'rc-trigger': 'npm:rc-trigger@1.10.3'
      }
    },
    'npm:rc-table@5.2.15': {
      'map': {
        'warning': 'npm:warning@3.0.0',
        'rc-util': 'npm:rc-util@4.0.2',
        'shallowequal': 'npm:shallowequal@0.2.2',
        'component-classes': 'npm:component-classes@1.2.6',
        'lodash.get': 'npm:lodash.get@4.4.2'
      }
    },
    'npm:rc-input-number@3.4.14': {
      'map': {
        'babel-runtime': 'npm:babel-runtime@6.26.0',
        'classnames': 'npm:classnames@2.2.5',
        'prop-types': 'npm:prop-types@15.5.8',
        'create-react-class': 'npm:create-react-class@15.5.2',
        'rc-touchable': 'npm:rc-touchable@1.1.0'
      }
    },
    'npm:rc-tabs@7.3.4': {
      'map': {
        'babel-runtime': 'npm:babel-runtime@6.26.0',
        'classnames': 'npm:classnames@2.2.5',
        'prop-types': 'npm:prop-types@15.5.8',
        'warning': 'npm:warning@3.0.0',
        'create-react-class': 'npm:create-react-class@15.5.2',
        'react-hammerjs': 'npm:react-hammerjs@0.5.0'
      }
    },
    'npm:rc-tree@1.4.8': {
      'map': {
        'classnames': 'npm:classnames@2.2.5',
        'object-assign': 'npm:object-assign@4.1.1',
        'prop-types': 'npm:prop-types@15.5.8',
        'rc-animate': 'npm:rc-animate@2.3.6',
        'rc-util': 'npm:rc-util@4.0.2'
      }
    },
    'npm:rc-cascader@0.11.3': {
      'map': {
        'prop-types': 'npm:prop-types@15.5.8',
        'array-tree-filter': 'npm:array-tree-filter@1.0.1',
        'rc-util': 'npm:rc-util@4.0.2',
        'rc-trigger': 'npm:rc-trigger@1.10.3',
        'shallow-equal': 'npm:shallow-equal@1.0.0'
      }
    },
    'npm:rc-radio@2.0.1': {
      'map': {
        'rc-checkbox': 'npm:rc-checkbox@1.5.0'
      }
    },
    'npm:rc-form@1.3.1': {
      'map': {
        'babel-runtime': 'npm:babel-runtime@6.26.0',
        'warning': 'npm:warning@3.0.0',
        'dom-scroll-into-view': 'npm:dom-scroll-into-view@1.2.1',
        'async-validator': 'npm:async-validator@1.6.9',
        'lodash.set': 'npm:lodash.set@4.3.2',
        'lodash.has': 'npm:lodash.has@4.5.2',
        'lodash.get': 'npm:lodash.get@4.4.2',
        'hoist-non-react-statics': 'npm:hoist-non-react-statics@1.2.0'
      }
    },
    'npm:rc-checkbox@1.5.0': {
      'map': {
        'classnames': 'npm:classnames@2.2.5',
        'rc-util': 'npm:rc-util@4.0.2'
      }
    },
    'npm:rc-tooltip@3.4.3': {
      'map': {
        'prop-types': 'npm:prop-types@15.5.8',
        'rc-trigger': 'npm:rc-trigger@1.10.3'
      }
    },
    'npm:rc-tree-select@1.9.4': {
      'map': {
        'classnames': 'npm:classnames@2.2.5',
        'object-assign': 'npm:object-assign@4.1.1',
        'prop-types': 'npm:prop-types@15.5.8',
        'rc-tree': 'npm:rc-tree@1.5.0',
        'rc-animate': 'npm:rc-animate@2.3.6',
        'rc-util': 'npm:rc-util@4.0.2',
        'rc-trigger': 'npm:rc-trigger@1.10.3'
      }
    },
    'npm:rc-upload@2.3.5': {
      'map': {
        'warning': 'npm:warning@2.1.0',
        'babel-runtime': 'npm:babel-runtime@6.26.0',
        'classnames': 'npm:classnames@2.2.5',
        'prop-types': 'npm:prop-types@15.5.8'
      }
    },
    'npm:rc-time-picker@2.3.5': {
      'map': {
        'babel-runtime': 'npm:babel-runtime@6.26.0',
        'classnames': 'npm:classnames@2.2.5',
        'moment': 'npm:moment@2.18.1',
        'prop-types': 'npm:prop-types@15.5.8',
        'rc-trigger': 'npm:rc-trigger@1.10.3'
      }
    },
    'npm:css-animation@1.3.2': {
      'map': {
        'component-classes': 'npm:component-classes@1.2.6'
      }
    },
    'npm:dom-closest@0.2.0': {
      'map': {
        'dom-matches': 'npm:dom-matches@2.0.0'
      }
    },
    'npm:rc-util@4.0.2': {
      'map': {
        'shallowequal': 'npm:shallowequal@0.2.2',
        'add-dom-event-listener': 'npm:add-dom-event-listener@1.0.2'
      }
    },
    'npm:react-lazy-load@3.0.12': {
      'map': {
        'lodash.debounce': 'npm:lodash.debounce@4.0.8',
        'prop-types': 'npm:prop-types@15.5.8',
        'lodash.throttle': 'npm:lodash.throttle@4.1.1',
        'eventlistener': 'npm:eventlistener@0.0.1'
      }
    },
    'npm:react-slick@0.14.11': {
      'map': {
        'classnames': 'npm:classnames@2.2.5',
        'create-react-class': 'npm:create-react-class@15.5.2',
        'object-assign': 'npm:object-assign@4.1.1',
        'can-use-dom': 'npm:can-use-dom@0.1.0',
        'json2mq': 'npm:json2mq@0.2.0',
        'slick-carousel': 'npm:slick-carousel@1.6.0',
        'enquire.js': 'npm:enquire.js@2.1.6'
      }
    },
    'npm:rc-select@6.8.4': {
      'map': {
        'rc-menu': 'npm:rc-menu@4.13.0',
        'babel-runtime': 'npm:babel-runtime@6.26.0',
        'classnames': 'npm:classnames@2.2.5',
        'create-react-class': 'npm:create-react-class@15.5.2',
        'prop-types': 'npm:prop-types@15.5.8',
        'rc-animate': 'npm:rc-animate@2.3.6',
        'component-classes': 'npm:component-classes@1.2.6',
        'dom-scroll-into-view': 'npm:dom-scroll-into-view@1.2.1',
        'rc-trigger': 'npm:rc-trigger@1.10.3',
        'rc-util': 'npm:rc-util@4.0.2',
        'warning': 'npm:warning@2.1.0'
      }
    },
    'npm:shallowequal@0.2.2': {
      'map': {
        'lodash.keys': 'npm:lodash.keys@3.1.2'
      }
    },
    'npm:rc-util@3.4.1': {
      'map': {
        'classnames': 'npm:classnames@2.2.5',
        'add-dom-event-listener': 'npm:add-dom-event-listener@1.0.2',
        'shallowequal': 'npm:shallowequal@0.2.2'
      }
    },
    'npm:rc-tree@1.5.0': {
      'map': {
        'classnames': 'npm:classnames@2.2.5',
        'object-assign': 'npm:object-assign@4.1.1',
        'prop-types': 'npm:prop-types@15.5.8',
        'rc-animate': 'npm:rc-animate@2.3.6',
        'rc-util': 'npm:rc-util@4.0.2'
      }
    },
    'npm:rc-trigger@1.10.3': {
      'map': {
        'babel-runtime': 'npm:babel-runtime@6.26.0',
        'create-react-class': 'npm:create-react-class@15.5.2',
        'prop-types': 'npm:prop-types@15.5.8',
        'rc-animate': 'npm:rc-animate@2.3.6',
        'rc-util': 'npm:rc-util@4.0.2',
        'rc-align': 'npm:rc-align@2.3.4'
      }
    },
    'npm:rc-editor-core@0.6.19': {
      'map': {
        'draft-js': 'npm:draft-js@0.10.0',
        'immutable': 'npm:immutable@3.8.1',
        'fbjs': 'npm:fbjs@0.8.12',
        'lodash': 'npm:lodash@4.17.4'
      }
    },
    'npm:draft-js@0.10.0': {
      'map': {
        'immutable': 'npm:immutable@3.7.6',
        'object-assign': 'npm:object-assign@4.1.1',
        'fbjs': 'npm:fbjs@0.8.12'
      }
    },
    'npm:rc-touchable@1.1.0': {
      'map': {
        'babel-runtime': 'npm:babel-runtime@6.26.0',
        'object-assign': 'npm:object-assign@4.1.1'
      }
    },
    'npm:warning@2.1.0': {
      'map': {
        'loose-envify': 'npm:loose-envify@1.3.1'
      }
    },
    'npm:rc-menu@4.13.0': {
      'map': {
        'rc-animate': 'npm:rc-animate@2.3.6',
        'rc-util': 'npm:rc-util@3.4.1',
        'classnames': 'npm:classnames@2.2.5',
        'dom-scroll-into-view': 'npm:dom-scroll-into-view@1.2.1',
        'object-assign': 'npm:object-assign@4.1.1'
      }
    },
    'npm:component-classes@1.2.6': {
      'map': {
        'component-indexof': 'npm:component-indexof@0.0.3'
      }
    },
    'npm:react-hammerjs@0.5.0': {
      'map': {
        'hammerjs': 'npm:hammerjs@2.0.8'
      }
    },
    'npm:json2mq@0.2.0': {
      'map': {
        'string-convert': 'npm:string-convert@0.2.1'
      }
    },
    'npm:slick-carousel@1.6.0': {
      'map': {
        'jquery': 'npm:jquery@3.2.1'
      }
    },
    'npm:lodash.keys@3.1.2': {
      'map': {
        'lodash._getnative': 'npm:lodash._getnative@3.9.1',
        'lodash.isarguments': 'npm:lodash.isarguments@3.1.0',
        'lodash.isarray': 'npm:lodash.isarray@3.0.4'
      }
    },
    'npm:add-dom-event-listener@1.0.2': {
      'map': {
        'object-assign': 'npm:object-assign@4.1.1'
      }
    },
    'npm:rc-align@2.3.4': {
      'map': {
        'prop-types': 'npm:prop-types@15.5.8',
        'rc-util': 'npm:rc-util@4.0.2',
        'dom-align': 'npm:dom-align@1.5.3'
      }
    },
    'npm:systemjs-less-plugin@2.0.0': {
      'map': {
        'css': 'github:systemjs/plugin-css@0.1.36'
      }
    },
    'npm:cookies@0.7.0': {
      'map': {
        'depd': 'npm:depd@1.1.0',
        'keygrip': 'npm:keygrip@1.0.1'
      }
    },
    'npm:recharts@0.22.4': {
      'map': {
        'react-resize-detector': 'npm:react-resize-detector@0.4.1',
        'react-smooth': 'npm:react-smooth@0.3.0',
        'd3-shape': 'npm:d3-shape@1.0.4',
        'reduce-css-calc': 'npm:reduce-css-calc@1.3.0',
        'd3-scale': 'npm:d3-scale@1.0.4',
        'recharts-scale': 'npm:recharts-scale@0.3.0',
        'core-js': 'npm:core-js@2.4.1',
        'classnames': 'npm:classnames@2.2.5',
        'lodash': 'npm:lodash@4.17.4',
        'prop-types': 'npm:prop-types@15.5.8'
      }
    },
    'npm:react-smooth@0.3.0': {
      'map': {
        'react-transition-group': 'npm:react-transition-group@1.1.3',
        'raf': 'npm:raf@3.3.2',
        'lodash': 'npm:lodash@4.17.4',
        'prop-types': 'npm:prop-types@15.5.8'
      }
    },
    'npm:reduce-css-calc@1.3.0': {
      'map': {
        'reduce-function-call': 'npm:reduce-function-call@1.0.2',
        'balanced-match': 'npm:balanced-match@0.4.2',
        'math-expression-evaluator': 'npm:math-expression-evaluator@1.2.17'
      }
    },
    'npm:d3-shape@1.0.4': {
      'map': {
        'd3-path': 'npm:d3-path@1.0.5'
      }
    },
    'npm:d3-scale@1.0.4': {
      'map': {
        'd3-collection': 'npm:d3-collection@1.0.3',
        'd3-color': 'npm:d3-color@1.0.3',
        'd3-array': 'npm:d3-array@1.2.0',
        'd3-format': 'npm:d3-format@1.2.0',
        'd3-interpolate': 'npm:d3-interpolate@1.1.4',
        'd3-time-format': 'npm:d3-time-format@2.0.5',
        'd3-time': 'npm:d3-time@1.0.6'
      }
    },
    'npm:reduce-function-call@1.0.2': {
      'map': {
        'balanced-match': 'npm:balanced-match@0.4.2'
      }
    },
    'npm:react-transition-group@1.1.3': {
      'map': {
        'warning': 'npm:warning@3.0.0',
        'prop-types': 'npm:prop-types@15.5.8',
        'chain-function': 'npm:chain-function@1.0.0',
        'dom-helpers': 'npm:dom-helpers@3.2.1'
      }
    },
    'npm:react-resize-detector@0.4.1': {
      'map': {
        'prop-types': 'npm:prop-types@15.5.8'
      }
    },
    'npm:d3-interpolate@1.1.4': {
      'map': {
        'd3-color': 'npm:d3-color@1.0.3'
      }
    },
    'npm:raf@3.3.2': {
      'map': {
        'performance-now': 'npm:performance-now@2.1.0'
      }
    },
    'npm:d3-time-format@2.0.5': {
      'map': {
        'd3-time': 'npm:d3-time@1.0.6'
      }
    },
    'npm:react-inlinesvg@0.6.0': {
      'map': {
        'fbjs': 'npm:fbjs@0.8.12',
        'once': 'npm:once@1.4.0',
        'httpplease': 'npm:httpplease@0.16.4'
      }
    },
    'npm:httpplease@0.16.4': {
      'map': {
        'xtend': 'npm:xtend@3.0.0',
        'urllite': 'npm:urllite@0.5.0',
        'xmlhttprequest': 'npm:xmlhttprequest@1.8.0'
      }
    },
    'npm:once@1.4.0': {
      'map': {
        'wrappy': 'npm:wrappy@1.0.2'
      }
    },
    'npm:urllite@0.5.0': {
      'map': {
        'xtend': 'npm:xtend@4.0.1'
      }
    },
    'npm:create-hash@1.1.3': {
      'map': {
        'inherits': 'npm:inherits@2.0.3',
        'sha.js': 'npm:sha.js@2.4.9',
        'cipher-base': 'npm:cipher-base@1.0.4',
        'ripemd160': 'npm:ripemd160@2.0.1'
      }
    },
    'npm:ripemd160@2.0.1': {
      'map': {
        'inherits': 'npm:inherits@2.0.3',
        'hash-base': 'npm:hash-base@2.0.2'
      }
    },
    'npm:hash-base@2.0.2': {
      'map': {
        'inherits': 'npm:inherits@2.0.3'
      }
    },
    'npm:create-hmac@1.1.6': {
      'map': {
        'cipher-base': 'npm:cipher-base@1.0.4',
        'create-hash': 'npm:create-hash@1.1.3',
        'inherits': 'npm:inherits@2.0.3',
        'ripemd160': 'npm:ripemd160@2.0.1',
        'safe-buffer': 'npm:safe-buffer@5.1.1',
        'sha.js': 'npm:sha.js@2.4.9'
      }
    },
    'npm:md5@2.2.1': {
      'map': {
        'crypt': 'npm:crypt@0.0.2',
        'is-buffer': 'npm:is-buffer@1.1.5',
        'charenc': 'npm:charenc@0.0.2'
      }
    },
    'npm:react-platform-js@0.0.1': {
      'map': {
        'ua-parser-js': 'npm:ua-parser-js@0.7.14'
      }
    },
    'npm:react-json-tree@0.11.0': {
      'map': {
        'babel-runtime': 'npm:babel-runtime@6.23.0',
        'prop-types': 'npm:prop-types@15.5.10',
        'react-base16-styling': 'npm:react-base16-styling@0.5.3'
      }
    },
    'npm:babel-runtime@6.26.0': {
      'map': {
        'regenerator-runtime': 'npm:regenerator-runtime@0.11.1',
        'core-js': 'npm:core-js@2.5.2'
      }
    },
    'npm:prop-types@15.6.0': {
      'map': {
        'loose-envify': 'npm:loose-envify@1.3.1',
        'fbjs': 'npm:fbjs@0.8.16',
        'object-assign': 'npm:object-assign@4.1.1'
      }
    },
    'npm:fbjs@0.8.16': {
      'map': {
        'core-js': 'npm:core-js@1.2.7',
        'loose-envify': 'npm:loose-envify@1.3.1',
        'object-assign': 'npm:object-assign@4.1.1',
        'isomorphic-fetch': 'npm:isomorphic-fetch@2.2.1',
        'promise': 'npm:promise@7.3.1',
        'setimmediate': 'npm:setimmediate@1.0.5',
        'ua-parser-js': 'npm:ua-parser-js@0.7.17'
      }
    },
    'npm:react-base16-styling@0.5.3': {
      'map': {
        'pure-color': 'npm:pure-color@1.3.0',
        'base16': 'npm:base16@1.0.0',
        'lodash.curry': 'npm:lodash.curry@4.1.1',
        'lodash.flow': 'npm:lodash.flow@3.5.0'
      }
    },
    'npm:promise@7.3.1': {
      'map': {
        'asap': 'npm:asap@2.0.6'
      }
    },
    'npm:node-fetch@1.7.3': {
      'map': {
        'is-stream': 'npm:is-stream@1.1.0',
        'encoding': 'npm:encoding@0.1.12'
      }
    },
    'npm:readable-stream@2.3.3': {
      'map': {
        'inherits': 'npm:inherits@2.0.3',
        'safe-buffer': 'npm:safe-buffer@5.1.1',
        'util-deprecate': 'npm:util-deprecate@1.0.2',
        'process-nextick-args': 'npm:process-nextick-args@1.0.7',
        'string_decoder': 'npm:string_decoder@1.0.3',
        'isarray': 'npm:isarray@1.0.0',
        'core-util-is': 'npm:core-util-is@1.0.2'
      }
    },
    'npm:string_decoder@1.0.3': {
      'map': {
        'safe-buffer': 'npm:safe-buffer@5.1.1'
      }
    },
    'npm:crypto-browserify@3.12.0': {
      'map': {
        'inherits': 'npm:inherits@2.0.3',
        'randomfill': 'npm:randomfill@1.0.3',
        'create-ecdh': 'npm:create-ecdh@4.0.0',
        'create-hmac': 'npm:create-hmac@1.1.6',
        'randombytes': 'npm:randombytes@2.0.5',
        'public-encrypt': 'npm:public-encrypt@4.0.0',
        'diffie-hellman': 'npm:diffie-hellman@5.0.2',
        'browserify-sign': 'npm:browserify-sign@4.0.4',
        'create-hash': 'npm:create-hash@1.1.3',
        'pbkdf2': 'npm:pbkdf2@3.0.14',
        'browserify-cipher': 'npm:browserify-cipher@1.0.0'
      }
    },
    'npm:randomfill@1.0.3': {
      'map': {
        'randombytes': 'npm:randombytes@2.0.5',
        'safe-buffer': 'npm:safe-buffer@5.1.1'
      }
    },
    'npm:randombytes@2.0.5': {
      'map': {
        'safe-buffer': 'npm:safe-buffer@5.1.1'
      }
    },
    'npm:pbkdf2@3.0.14': {
      'map': {
        'safe-buffer': 'npm:safe-buffer@5.1.1',
        'create-hash': 'npm:create-hash@1.1.3',
        'create-hmac': 'npm:create-hmac@1.1.6',
        'ripemd160': 'npm:ripemd160@2.0.1',
        'sha.js': 'npm:sha.js@2.4.9'
      }
    },
    'npm:sha.js@2.4.9': {
      'map': {
        'safe-buffer': 'npm:safe-buffer@5.1.1',
        'inherits': 'npm:inherits@2.0.3'
      }
    },
    'npm:cipher-base@1.0.4': {
      'map': {
        'safe-buffer': 'npm:safe-buffer@5.1.1',
        'inherits': 'npm:inherits@2.0.3'
      }
    },
    'npm:evp_bytestokey@1.0.3': {
      'map': {
        'safe-buffer': 'npm:safe-buffer@5.1.1',
        'md5.js': 'npm:md5.js@1.3.4'
      }
    },
    'npm:miller-rabin@4.0.1': {
      'map': {
        'bn.js': 'npm:bn.js@4.11.8',
        'brorand': 'npm:brorand@1.1.0'
      }
    },
    'npm:md5.js@1.3.4': {
      'map': {
        'hash-base': 'npm:hash-base@3.0.4',
        'inherits': 'npm:inherits@2.0.3'
      }
    },
    'npm:browserify-aes@1.1.1': {
      'map': {
        'cipher-base': 'npm:cipher-base@1.0.4',
        'evp_bytestokey': 'npm:evp_bytestokey@1.0.3',
        'create-hash': 'npm:create-hash@1.1.3',
        'inherits': 'npm:inherits@2.0.3',
        'safe-buffer': 'npm:safe-buffer@5.1.1',
        'buffer-xor': 'npm:buffer-xor@1.0.3'
      }
    },
    'npm:asn1.js@4.9.2': {
      'map': {
        'minimalistic-assert': 'npm:minimalistic-assert@1.0.0',
        'bn.js': 'npm:bn.js@4.11.8',
        'inherits': 'npm:inherits@2.0.3'
      }
    },
    'npm:hash-base@3.0.4': {
      'map': {
        'safe-buffer': 'npm:safe-buffer@5.1.1',
        'inherits': 'npm:inherits@2.0.3'
      }
    },
    'npm:hash.js@1.1.3': {
      'map': {
        'inherits': 'npm:inherits@2.0.3',
        'minimalistic-assert': 'npm:minimalistic-assert@1.0.0'
      }
    },
    'npm:stream-http@2.7.2': {
      'map': {
        'inherits': 'npm:inherits@2.0.3',
        'readable-stream': 'npm:readable-stream@2.3.3',
        'xtend': 'npm:xtend@4.0.1',
        'builtin-status-codes': 'npm:builtin-status-codes@3.0.0',
        'to-arraybuffer': 'npm:to-arraybuffer@1.0.1'
      }
    },
    'npm:react@15.6.2': {
      'map': {
        'fbjs': 'npm:fbjs@0.8.16',
        'loose-envify': 'npm:loose-envify@1.3.1',
        'object-assign': 'npm:object-assign@4.1.1',
        'prop-types': 'npm:prop-types@15.6.0',
        'create-react-class': 'npm:create-react-class@15.6.2'
      }
    },
    'npm:create-react-class@15.6.2': {
      'map': {
        'fbjs': 'npm:fbjs@0.8.16',
        'loose-envify': 'npm:loose-envify@1.3.1',
        'object-assign': 'npm:object-assign@4.1.1'
      }
    },
    'npm:react-dom@15.6.2': {
      'map': {
        'fbjs': 'npm:fbjs@0.8.16',
        'loose-envify': 'npm:loose-envify@1.3.1',
        'object-assign': 'npm:object-assign@4.1.1',
        'prop-types': 'npm:prop-types@15.6.0'
      }
    },
    'npm:prop-types@15.5.10': {
      'map': {
        'loose-envify': 'npm:loose-envify@1.3.1',
        'fbjs': 'npm:fbjs@0.8.16'
      }
    },
    'npm:babel-runtime@6.23.0': {
      'map': {
        'regenerator-runtime': 'npm:regenerator-runtime@0.10.5',
        'core-js': 'npm:core-js@2.5.2'
      }
    }
  }
});
