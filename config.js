System.config({
  defaultJSExtensions: true,
  transpiler: "babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "ant": "npm:ant@0.2.0",
    "antd": "npm:antd@2.13.11",
    "babel": "npm:babel-core@5.8.38",
    "babel-plugin-import": "npm:babel-plugin-import@1.6.3",
    "babel-polyfill": "npm:babel-polyfill@6.26.0",
    "babel-preset-react": "npm:babel-preset-react@6.24.1",
    "babel-runtime": "npm:babel-runtime@6.26.0",
    "classnames": "npm:classnames@2.2.5",
    "cookies": "npm:cookies@0.7.1",
    "cookies-js": "npm:cookies-js@1.2.3",
    "core-js": "npm:core-js@1.2.7",
    "css": "github:systemjs/plugin-css@0.1.36",
    "es6-shim": "npm:es6-shim@0.35.3",
    "immutable": "npm:immutable@3.8.2",
    "jquery": "npm:jquery@3.2.1",
    "less": "npm:systemjs-less-plugin@2.2.2",
    "lodash": "npm:lodash@4.17.4",
    "loglevel": "npm:loglevel@1.6.0",
    "md5": "npm:md5@2.2.1",
    "moment": "npm:moment@2.20.1",
    "react-addons-test-utils": "npm:react-addons-test-utils@15.6.2",
    "react-image-crop": "npm:react-image-crop@3.0.8",
    "react-inlinesvg": "npm:react-inlinesvg@0.6.2",
    "react-json-tree": "npm:react-json-tree@0.11.0",
    "react-platform-js": "npm:react-platform-js@0.0.1",
    "react-redux": "npm:react-redux@5.0.6",
    "react-router": "npm:react-router@3.2.0",
    "recharts": "npm:recharts@0.22.4",
    "reqwest": "npm:reqwest@2.0.5",
    "todomvc-app-css": "npm:todomvc-app-css@2.1.0",
    "ts": "github:frankwallis/plugin-typescript@7.0.3",
    "vuzonp/systemjs-plugin-svg": "github:vuzonp/systemjs-plugin-svg@0.1.1",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.4.1"
    },
    "github:jspm/nodelibs-buffer@0.1.1": {
      "buffer": "npm:buffer@5.0.8"
    },
    "github:jspm/nodelibs-constants@0.1.0": {
      "constants-browserify": "npm:constants-browserify@0.0.1"
    },
    "github:jspm/nodelibs-crypto@0.1.0": {
      "crypto-browserify": "npm:crypto-browserify@3.12.0"
    },
    "github:jspm/nodelibs-domain@0.1.0": {
      "domain-browser": "npm:domain-browser@1.1.7"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-http@1.7.1": {
      "Base64": "npm:Base64@0.2.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.3",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-https@0.1.0": {
      "https-browserify": "npm:https-browserify@0.0.0"
    },
    "github:jspm/nodelibs-path@0.1.0": {
      "path-browserify": "npm:path-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.10"
    },
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-string_decoder@0.1.0": {
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "github:jspm/nodelibs-url@0.1.0": {
      "url": "npm:url@0.10.3"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:jspm/nodelibs-vm@0.1.0": {
      "vm-browserify": "npm:vm-browserify@0.0.4"
    },
    "github:jspm/nodelibs-zlib@0.1.0": {
      "browserify-zlib": "npm:browserify-zlib@0.1.4"
    },
    "npm:@babel/helper-module-imports@7.0.0-beta.35": {
      "@babel/types": "npm:@babel/types@7.0.0-beta.35",
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "lodash": "npm:lodash@4.17.4"
    },
    "npm:@babel/types@7.0.0-beta.35": {
      "esutils": "npm:esutils@2.0.2",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "lodash": "npm:lodash@4.17.4",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "to-fast-properties": "npm:to-fast-properties@2.0.0"
    },
    "npm:add-dom-event-listener@1.0.2": {
      "object-assign": "npm:object-assign@4.1.1"
    },
    "npm:ant@0.2.0": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:antd@2.13.11": {
      "array-tree-filter": "npm:array-tree-filter@1.0.1",
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "classnames": "npm:classnames@2.2.5",
      "create-react-class": "npm:create-react-class@15.6.2",
      "css-animation": "npm:css-animation@1.4.1",
      "dom-closest": "npm:dom-closest@0.2.0",
      "lodash.debounce": "npm:lodash.debounce@4.0.8",
      "moment": "npm:moment@2.20.1",
      "omit.js": "npm:omit.js@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.5.10",
      "rc-animate": "npm:rc-animate@2.4.3",
      "rc-calendar": "npm:rc-calendar@9.0.4",
      "rc-cascader": "npm:rc-cascader@0.11.6",
      "rc-checkbox": "npm:rc-checkbox@2.0.3",
      "rc-collapse": "npm:rc-collapse@1.7.7",
      "rc-dialog": "npm:rc-dialog@6.5.11",
      "rc-dropdown": "npm:rc-dropdown@1.5.1",
      "rc-editor-mention": "npm:rc-editor-mention@0.6.13",
      "rc-form": "npm:rc-form@1.4.8",
      "rc-input-number": "npm:rc-input-number@3.6.10",
      "rc-menu": "npm:rc-menu@5.0.14",
      "rc-notification": "npm:rc-notification@2.0.6",
      "rc-pagination": "npm:rc-pagination@1.12.12",
      "rc-progress": "npm:rc-progress@2.2.5",
      "rc-rate": "npm:rc-rate@2.1.1",
      "rc-select": "npm:rc-select@6.9.7",
      "rc-slider": "npm:rc-slider@8.3.5",
      "rc-steps": "npm:rc-steps@2.5.2",
      "rc-switch": "npm:rc-switch@1.5.3",
      "rc-table": "npm:rc-table@5.6.13",
      "rc-tabs": "npm:rc-tabs@9.1.10",
      "rc-time-picker": "npm:rc-time-picker@2.4.1",
      "rc-tooltip": "npm:rc-tooltip@3.4.9",
      "rc-tree": "npm:rc-tree@1.7.10",
      "rc-tree-select": "npm:rc-tree-select@1.10.13",
      "rc-upload": "npm:rc-upload@2.4.4",
      "rc-util": "npm:rc-util@4.3.1",
      "react": "npm:react@16.2.0",
      "react-dom": "npm:react-dom@16.2.0",
      "react-lazy-load": "npm:react-lazy-load@3.0.13",
      "react-slick": "npm:react-slick@0.15.4",
      "shallowequal": "npm:shallowequal@1.0.2",
      "warning": "npm:warning@3.0.0"
    },
    "npm:asap@2.0.6": {
      "domain": "github:jspm/nodelibs-domain@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:asn1.js@4.9.2": {
      "bn.js": "npm:bn.js@4.11.8",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:assert@1.4.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "npm:util@0.10.3"
    },
    "npm:async-validator@1.8.2": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:babel-helper-builder-react-jsx@6.26.0": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "babel-types": "npm:babel-types@6.26.0",
      "esutils": "npm:esutils@2.0.2"
    },
    "npm:babel-plugin-import@1.6.3": {
      "@babel/helper-module-imports": "npm:@babel/helper-module-imports@7.0.0-beta.35",
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:babel-plugin-transform-flow-strip-types@6.22.0": {
      "babel-plugin-syntax-flow": "npm:babel-plugin-syntax-flow@6.18.0",
      "babel-runtime": "npm:babel-runtime@6.26.0"
    },
    "npm:babel-plugin-transform-react-display-name@6.25.0": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:babel-plugin-transform-react-jsx-self@6.22.0": {
      "babel-plugin-syntax-jsx": "npm:babel-plugin-syntax-jsx@6.18.0",
      "babel-runtime": "npm:babel-runtime@6.26.0"
    },
    "npm:babel-plugin-transform-react-jsx-source@6.22.0": {
      "babel-plugin-syntax-jsx": "npm:babel-plugin-syntax-jsx@6.18.0",
      "babel-runtime": "npm:babel-runtime@6.26.0"
    },
    "npm:babel-plugin-transform-react-jsx@6.24.1": {
      "babel-helper-builder-react-jsx": "npm:babel-helper-builder-react-jsx@6.26.0",
      "babel-plugin-syntax-jsx": "npm:babel-plugin-syntax-jsx@6.18.0",
      "babel-runtime": "npm:babel-runtime@6.26.0"
    },
    "npm:babel-polyfill@6.26.0": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "core-js": "npm:core-js@2.5.3",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "regenerator-runtime": "npm:regenerator-runtime@0.10.5"
    },
    "npm:babel-preset-flow@6.23.0": {
      "babel-plugin-transform-flow-strip-types": "npm:babel-plugin-transform-flow-strip-types@6.22.0"
    },
    "npm:babel-preset-react@6.24.1": {
      "babel-plugin-syntax-jsx": "npm:babel-plugin-syntax-jsx@6.18.0",
      "babel-plugin-transform-react-display-name": "npm:babel-plugin-transform-react-display-name@6.25.0",
      "babel-plugin-transform-react-jsx": "npm:babel-plugin-transform-react-jsx@6.24.1",
      "babel-plugin-transform-react-jsx-self": "npm:babel-plugin-transform-react-jsx-self@6.22.0",
      "babel-plugin-transform-react-jsx-source": "npm:babel-plugin-transform-react-jsx-source@6.22.0",
      "babel-preset-flow": "npm:babel-preset-flow@6.23.0"
    },
    "npm:babel-runtime@6.26.0": {
      "core-js": "npm:core-js@2.5.3",
      "regenerator-runtime": "npm:regenerator-runtime@0.11.1"
    },
    "npm:babel-types@6.26.0": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "esutils": "npm:esutils@2.0.2",
      "lodash": "npm:lodash@4.17.4",
      "to-fast-properties": "npm:to-fast-properties@1.0.3"
    },
    "npm:browserify-aes@1.1.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "buffer-xor": "npm:buffer-xor@1.0.3",
      "cipher-base": "npm:cipher-base@1.0.4",
      "create-hash": "npm:create-hash@1.1.3",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
      "inherits": "npm:inherits@2.0.1",
      "safe-buffer": "npm:safe-buffer@5.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:browserify-cipher@1.0.0": {
      "browserify-aes": "npm:browserify-aes@1.1.1",
      "browserify-des": "npm:browserify-des@1.0.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "evp_bytestokey": "npm:evp_bytestokey@1.0.3"
    },
    "npm:browserify-des@1.0.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "cipher-base": "npm:cipher-base@1.0.4",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "des.js": "npm:des.js@1.0.0",
      "inherits": "npm:inherits@2.0.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:browserify-rsa@4.0.1": {
      "bn.js": "npm:bn.js@4.11.8",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "constants": "github:jspm/nodelibs-constants@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "randombytes": "npm:randombytes@2.0.5",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:browserify-sign@4.0.4": {
      "bn.js": "npm:bn.js@4.11.8",
      "browserify-rsa": "npm:browserify-rsa@4.0.1",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "create-hash": "npm:create-hash@1.1.3",
      "create-hmac": "npm:create-hmac@1.1.6",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "elliptic": "npm:elliptic@6.4.0",
      "inherits": "npm:inherits@2.0.1",
      "parse-asn1": "npm:parse-asn1@5.1.0",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:browserify-zlib@0.1.4": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "pako": "npm:pako@0.2.9",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "readable-stream": "npm:readable-stream@2.3.3",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:buffer-xor@1.0.3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:buffer@5.0.8": {
      "base64-js": "npm:base64-js@1.2.1",
      "ieee754": "npm:ieee754@1.1.8"
    },
    "npm:chain-function@1.0.0": {
      "assert": "github:jspm/nodelibs-assert@0.1.0"
    },
    "npm:cipher-base@1.0.4": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "safe-buffer": "npm:safe-buffer@5.1.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:component-classes@1.2.6": {
      "component-indexof": "npm:component-indexof@0.0.3"
    },
    "npm:constants-browserify@0.0.1": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:cookies@0.7.1": {
      "depd": "npm:depd@1.1.1",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "keygrip": "npm:keygrip@1.0.2"
    },
    "npm:core-js@1.2.7": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:core-js@2.4.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:core-js@2.5.3": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:core-util-is@1.0.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1"
    },
    "npm:create-ecdh@4.0.0": {
      "bn.js": "npm:bn.js@4.11.8",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "elliptic": "npm:elliptic@6.4.0"
    },
    "npm:create-hash@1.1.3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "cipher-base": "npm:cipher-base@1.0.4",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "ripemd160": "npm:ripemd160@2.0.1",
      "sha.js": "npm:sha.js@2.4.9"
    },
    "npm:create-hmac@1.1.6": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "cipher-base": "npm:cipher-base@1.0.4",
      "create-hash": "npm:create-hash@1.1.3",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "inherits": "npm:inherits@2.0.1",
      "ripemd160": "npm:ripemd160@2.0.1",
      "safe-buffer": "npm:safe-buffer@5.1.1",
      "sha.js": "npm:sha.js@2.4.9"
    },
    "npm:create-react-class@15.6.2": {
      "fbjs": "npm:fbjs@0.8.16",
      "loose-envify": "npm:loose-envify@1.3.1",
      "object-assign": "npm:object-assign@4.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:crypto-browserify@3.12.0": {
      "browserify-cipher": "npm:browserify-cipher@1.0.0",
      "browserify-sign": "npm:browserify-sign@4.0.4",
      "create-ecdh": "npm:create-ecdh@4.0.0",
      "create-hash": "npm:create-hash@1.1.3",
      "create-hmac": "npm:create-hmac@1.1.6",
      "diffie-hellman": "npm:diffie-hellman@5.0.2",
      "inherits": "npm:inherits@2.0.1",
      "pbkdf2": "npm:pbkdf2@3.0.14",
      "public-encrypt": "npm:public-encrypt@4.0.0",
      "randombytes": "npm:randombytes@2.0.5",
      "randomfill": "npm:randomfill@1.0.3",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:css-animation@1.4.1": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "component-classes": "npm:component-classes@1.2.6"
    },
    "npm:d3-interpolate@1.1.6": {
      "d3-color": "npm:d3-color@1.0.3"
    },
    "npm:d3-scale@1.0.4": {
      "d3-array": "npm:d3-array@1.2.1",
      "d3-collection": "npm:d3-collection@1.0.4",
      "d3-color": "npm:d3-color@1.0.3",
      "d3-format": "npm:d3-format@1.2.1",
      "d3-interpolate": "npm:d3-interpolate@1.1.6",
      "d3-time": "npm:d3-time@1.0.8",
      "d3-time-format": "npm:d3-time-format@2.1.1"
    },
    "npm:d3-shape@1.0.4": {
      "d3-path": "npm:d3-path@1.0.5"
    },
    "npm:d3-time-format@2.1.1": {
      "d3-time": "npm:d3-time@1.0.8"
    },
    "npm:depd@1.1.1": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:des.js@1.0.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
    },
    "npm:diffie-hellman@5.0.2": {
      "bn.js": "npm:bn.js@4.11.8",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "miller-rabin": "npm:miller-rabin@4.0.1",
      "randombytes": "npm:randombytes@2.0.5",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:dom-closest@0.2.0": {
      "dom-matches": "npm:dom-matches@2.0.0"
    },
    "npm:domain-browser@1.1.7": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:draft-js@0.10.4": {
      "fbjs": "npm:fbjs@0.8.16",
      "immutable": "npm:immutable@3.7.6",
      "object-assign": "npm:object-assign@4.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "react": "npm:react@16.2.0",
      "react-dom": "npm:react-dom@16.2.0"
    },
    "npm:elliptic@6.4.0": {
      "bn.js": "npm:bn.js@4.11.8",
      "brorand": "npm:brorand@1.1.0",
      "hash.js": "npm:hash.js@1.1.3",
      "hmac-drbg": "npm:hmac-drbg@1.0.1",
      "inherits": "npm:inherits@2.0.1",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
      "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:encoding@0.1.12": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "iconv-lite": "npm:iconv-lite@0.4.19"
    },
    "npm:es6-shim@0.35.3": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:evp_bytestokey@1.0.3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "md5.js": "npm:md5.js@1.3.4",
      "safe-buffer": "npm:safe-buffer@5.1.1"
    },
    "npm:fbjs@0.8.16": {
      "core-js": "npm:core-js@1.2.7",
      "isomorphic-fetch": "npm:isomorphic-fetch@2.2.1",
      "loose-envify": "npm:loose-envify@1.3.1",
      "object-assign": "npm:object-assign@4.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "promise": "npm:promise@7.3.1",
      "setimmediate": "npm:setimmediate@1.0.5",
      "ua-parser-js": "npm:ua-parser-js@0.7.17"
    },
    "npm:hammerjs@2.0.8": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:hash-base@2.0.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0"
    },
    "npm:hash-base@3.0.4": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "inherits": "npm:inherits@2.0.3",
      "safe-buffer": "npm:safe-buffer@5.1.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0"
    },
    "npm:hash.js@1.1.3": {
      "inherits": "npm:inherits@2.0.3",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.0"
    },
    "npm:history@3.3.0": {
      "invariant": "npm:invariant@2.2.2",
      "loose-envify": "npm:loose-envify@1.3.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "query-string": "npm:query-string@4.3.4",
      "warning": "npm:warning@3.0.0"
    },
    "npm:hmac-drbg@1.0.1": {
      "hash.js": "npm:hash.js@1.1.3",
      "minimalistic-assert": "npm:minimalistic-assert@1.0.0",
      "minimalistic-crypto-utils": "npm:minimalistic-crypto-utils@1.0.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:httpplease@0.16.4": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "urllite": "npm:urllite@0.5.0",
      "xmlhttprequest": "npm:xmlhttprequest@1.8.0",
      "xtend": "npm:xtend@3.0.0"
    },
    "npm:https-browserify@0.0.0": {
      "http": "github:jspm/nodelibs-http@1.7.1"
    },
    "npm:iconv-lite@0.4.19": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "github:jspm/nodelibs-string_decoder@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:immutable@3.7.6": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:immutable@3.8.2": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:inherits@2.0.3": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:invariant@2.2.2": {
      "loose-envify": "npm:loose-envify@1.3.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:is-buffer@1.1.6": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1"
    },
    "npm:isarray@1.0.0": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:isomorphic-fetch@2.2.1": {
      "node-fetch": "npm:node-fetch@1.7.3",
      "whatwg-fetch": "npm:whatwg-fetch@2.0.3"
    },
    "npm:json2mq@0.2.0": {
      "string-convert": "npm:string-convert@0.2.1"
    },
    "npm:keygrip@1.0.2": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:lodash.curry@4.1.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:lodash.debounce@4.0.8": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:lodash.get@4.4.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:lodash.keys@3.1.2": {
      "lodash._getnative": "npm:lodash._getnative@3.9.1",
      "lodash.isarguments": "npm:lodash.isarguments@3.1.0",
      "lodash.isarray": "npm:lodash.isarray@3.0.4"
    },
    "npm:lodash.throttle@4.1.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:loglevel@1.6.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:loose-envify@1.3.1": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "js-tokens": "npm:js-tokens@3.0.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:md5.js@1.3.4": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "hash-base": "npm:hash-base@3.0.4",
      "inherits": "npm:inherits@2.0.3"
    },
    "npm:md5@2.2.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "charenc": "npm:charenc@0.0.2",
      "crypt": "npm:crypt@0.0.2",
      "is-buffer": "npm:is-buffer@1.1.6"
    },
    "npm:miller-rabin@4.0.1": {
      "bn.js": "npm:bn.js@4.11.8",
      "brorand": "npm:brorand@1.1.0",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:node-fetch@1.7.3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "encoding": "npm:encoding@0.1.12",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "is-stream": "npm:is-stream@1.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0",
      "zlib": "github:jspm/nodelibs-zlib@0.1.0"
    },
    "npm:omit.js@1.0.0": {
      "babel-runtime": "npm:babel-runtime@6.26.0"
    },
    "npm:once@1.4.0": {
      "wrappy": "npm:wrappy@1.0.2"
    },
    "npm:pako@0.2.9": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:parse-asn1@5.1.0": {
      "asn1.js": "npm:asn1.js@4.9.2",
      "browserify-aes": "npm:browserify-aes@1.1.1",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "create-hash": "npm:create-hash@1.1.3",
      "evp_bytestokey": "npm:evp_bytestokey@1.0.3",
      "pbkdf2": "npm:pbkdf2@3.0.14",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:path-browserify@0.0.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:pbkdf2@3.0.14": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "create-hash": "npm:create-hash@1.1.3",
      "create-hmac": "npm:create-hmac@1.1.6",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "ripemd160": "npm:ripemd160@2.0.1",
      "safe-buffer": "npm:safe-buffer@5.1.1",
      "sha.js": "npm:sha.js@2.4.9"
    },
    "npm:performance-now@2.1.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process-nextick-args@1.0.7": {
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:process@0.11.10": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:promise@7.3.1": {
      "asap": "npm:asap@2.0.6",
      "fs": "github:jspm/nodelibs-fs@0.1.2"
    },
    "npm:prop-types@15.5.10": {
      "fbjs": "npm:fbjs@0.8.16",
      "loose-envify": "npm:loose-envify@1.3.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:prop-types@15.6.0": {
      "fbjs": "npm:fbjs@0.8.16",
      "loose-envify": "npm:loose-envify@1.3.1",
      "object-assign": "npm:object-assign@4.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:public-encrypt@4.0.0": {
      "bn.js": "npm:bn.js@4.11.8",
      "browserify-rsa": "npm:browserify-rsa@4.0.1",
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "create-hash": "npm:create-hash@1.1.3",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "parse-asn1": "npm:parse-asn1@5.1.0",
      "randombytes": "npm:randombytes@2.0.5"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:pure-color@1.3.0": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:query-string@4.3.4": {
      "object-assign": "npm:object-assign@4.1.1",
      "strict-uri-encode": "npm:strict-uri-encode@1.1.0"
    },
    "npm:raf@3.4.0": {
      "performance-now": "npm:performance-now@2.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:randombytes@2.0.5": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "safe-buffer": "npm:safe-buffer@5.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:randomfill@1.0.3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "crypto": "github:jspm/nodelibs-crypto@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "randombytes": "npm:randombytes@2.0.5",
      "safe-buffer": "npm:safe-buffer@5.1.1"
    },
    "npm:rc-align@2.3.5": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "dom-align": "npm:dom-align@1.6.6",
      "prop-types": "npm:prop-types@15.6.0",
      "rc-util": "npm:rc-util@4.3.1"
    },
    "npm:rc-animate@2.4.3": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "css-animation": "npm:css-animation@1.4.1",
      "prop-types": "npm:prop-types@15.6.0"
    },
    "npm:rc-calendar@9.0.4": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "classnames": "npm:classnames@2.2.5",
      "create-react-class": "npm:create-react-class@15.6.2",
      "moment": "npm:moment@2.20.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0",
      "rc-trigger": "npm:rc-trigger@1.11.5",
      "rc-util": "npm:rc-util@4.3.1"
    },
    "npm:rc-cascader@0.11.6": {
      "array-tree-filter": "npm:array-tree-filter@1.0.1",
      "prop-types": "npm:prop-types@15.6.0",
      "rc-trigger": "npm:rc-trigger@1.11.5",
      "rc-util": "npm:rc-util@4.3.1",
      "shallow-equal": "npm:shallow-equal@1.0.0"
    },
    "npm:rc-checkbox@2.0.3": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "classnames": "npm:classnames@2.2.5",
      "prop-types": "npm:prop-types@15.6.0",
      "rc-util": "npm:rc-util@4.3.1"
    },
    "npm:rc-collapse@1.7.7": {
      "classnames": "npm:classnames@2.2.5",
      "css-animation": "npm:css-animation@1.4.1",
      "prop-types": "npm:prop-types@15.6.0",
      "rc-animate": "npm:rc-animate@2.4.3"
    },
    "npm:rc-dialog@6.5.11": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "create-react-class": "npm:create-react-class@15.6.2",
      "object-assign": "npm:object-assign@4.1.1",
      "rc-animate": "npm:rc-animate@2.4.3",
      "rc-util": "npm:rc-util@4.3.1"
    },
    "npm:rc-dropdown@1.5.1": {
      "prop-types": "npm:prop-types@15.6.0",
      "rc-trigger": "npm:rc-trigger@1.11.5"
    },
    "npm:rc-editor-core@0.7.9": {
      "draft-js": "npm:draft-js@0.10.4",
      "immutable": "npm:immutable@3.8.2",
      "lodash": "npm:lodash@4.17.4",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0",
      "setimmediate": "npm:setimmediate@1.0.5"
    },
    "npm:rc-editor-mention@0.6.13": {
      "classnames": "npm:classnames@2.2.5",
      "dom-scroll-into-view": "npm:dom-scroll-into-view@1.2.1",
      "draft-js": "npm:draft-js@0.10.4",
      "immutable": "npm:immutable@3.7.6",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0",
      "rc-animate": "npm:rc-animate@2.4.3",
      "rc-editor-core": "npm:rc-editor-core@0.7.9"
    },
    "npm:rc-form@1.4.8": {
      "async-validator": "npm:async-validator@1.8.2",
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "create-react-class": "npm:create-react-class@15.6.2",
      "dom-scroll-into-view": "npm:dom-scroll-into-view@1.2.1",
      "hoist-non-react-statics": "npm:hoist-non-react-statics@1.2.0",
      "lodash": "npm:lodash@4.17.4",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "warning": "npm:warning@3.0.0"
    },
    "npm:rc-hammerjs@0.6.9": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "hammerjs": "npm:hammerjs@2.0.8",
      "prop-types": "npm:prop-types@15.6.0",
      "react": "npm:react@16.2.0"
    },
    "npm:rc-input-number@3.6.10": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "classnames": "npm:classnames@2.2.5",
      "create-react-class": "npm:create-react-class@15.6.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0",
      "rc-touchable": "npm:rc-touchable@1.2.3"
    },
    "npm:rc-menu@5.0.14": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "classnames": "npm:classnames@2.2.5",
      "create-react-class": "npm:create-react-class@15.6.2",
      "dom-scroll-into-view": "npm:dom-scroll-into-view@1.2.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0",
      "rc-animate": "npm:rc-animate@2.4.3",
      "rc-util": "npm:rc-util@4.3.1"
    },
    "npm:rc-notification@2.0.6": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "classnames": "npm:classnames@2.2.5",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0",
      "rc-animate": "npm:rc-animate@2.4.3",
      "rc-util": "npm:rc-util@4.3.1"
    },
    "npm:rc-pagination@1.12.12": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0"
    },
    "npm:rc-progress@2.2.5": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0"
    },
    "npm:rc-rate@2.1.1": {
      "classnames": "npm:classnames@2.2.5",
      "prop-types": "npm:prop-types@15.6.0"
    },
    "npm:rc-select@6.9.7": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "classnames": "npm:classnames@2.2.5",
      "component-classes": "npm:component-classes@1.2.6",
      "dom-scroll-into-view": "npm:dom-scroll-into-view@1.2.1",
      "prop-types": "npm:prop-types@15.6.0",
      "rc-animate": "npm:rc-animate@2.4.3",
      "rc-menu": "npm:rc-menu@5.0.14",
      "rc-trigger": "npm:rc-trigger@1.11.5",
      "rc-util": "npm:rc-util@4.3.1",
      "warning": "npm:warning@3.0.0"
    },
    "npm:rc-slider@8.3.5": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "classnames": "npm:classnames@2.2.5",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0",
      "rc-tooltip": "npm:rc-tooltip@3.4.9",
      "rc-util": "npm:rc-util@4.3.1",
      "shallowequal": "npm:shallowequal@1.0.2",
      "warning": "npm:warning@3.0.0"
    },
    "npm:rc-steps@2.5.2": {
      "classnames": "npm:classnames@2.2.5",
      "lodash.debounce": "npm:lodash.debounce@4.0.8",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0"
    },
    "npm:rc-switch@1.5.3": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "classnames": "npm:classnames@2.2.5",
      "prop-types": "npm:prop-types@15.6.0"
    },
    "npm:rc-table@5.6.13": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "component-classes": "npm:component-classes@1.2.6",
      "lodash.get": "npm:lodash.get@4.4.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0",
      "rc-util": "npm:rc-util@4.3.1",
      "shallowequal": "npm:shallowequal@0.2.2",
      "warning": "npm:warning@3.0.0"
    },
    "npm:rc-tabs@9.1.10": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "classnames": "npm:classnames@2.2.5",
      "create-react-class": "npm:create-react-class@15.6.2",
      "lodash.debounce": "npm:lodash.debounce@4.0.8",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0",
      "rc-hammerjs": "npm:rc-hammerjs@0.6.9",
      "rc-util": "npm:rc-util@4.3.1",
      "warning": "npm:warning@3.0.0"
    },
    "npm:rc-time-picker@2.4.1": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "classnames": "npm:classnames@2.2.5",
      "moment": "npm:moment@2.20.1",
      "prop-types": "npm:prop-types@15.6.0",
      "rc-trigger": "npm:rc-trigger@1.11.5"
    },
    "npm:rc-tooltip@3.4.9": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0",
      "rc-trigger": "npm:rc-trigger@1.11.5"
    },
    "npm:rc-touchable@1.2.3": {
      "babel-runtime": "npm:babel-runtime@6.26.0"
    },
    "npm:rc-tree-select@1.10.13": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "classnames": "npm:classnames@2.2.5",
      "object-assign": "npm:object-assign@4.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0",
      "rc-animate": "npm:rc-animate@2.4.3",
      "rc-tree": "npm:rc-tree@1.7.10",
      "rc-trigger": "npm:rc-trigger@1.11.5",
      "rc-util": "npm:rc-util@4.3.1"
    },
    "npm:rc-tree@1.7.10": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "classnames": "npm:classnames@2.2.5",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0",
      "rc-animate": "npm:rc-animate@2.4.3",
      "rc-util": "npm:rc-util@4.3.1",
      "warning": "npm:warning@3.0.0"
    },
    "npm:rc-trigger@1.11.5": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "create-react-class": "npm:create-react-class@15.6.2",
      "prop-types": "npm:prop-types@15.6.0",
      "rc-align": "npm:rc-align@2.3.5",
      "rc-animate": "npm:rc-animate@2.4.3",
      "rc-util": "npm:rc-util@4.3.1"
    },
    "npm:rc-upload@2.4.4": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "classnames": "npm:classnames@2.2.5",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0",
      "warning": "npm:warning@2.1.0"
    },
    "npm:rc-util@4.3.1": {
      "add-dom-event-listener": "npm:add-dom-event-listener@1.0.2",
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0",
      "shallowequal": "npm:shallowequal@0.2.2"
    },
    "npm:react-addons-test-utils@15.6.2": {
      "process": "github:jspm/nodelibs-process@0.1.2",
      "react-dom": "npm:react-dom@15.6.2"
    },
    "npm:react-base16-styling@0.5.3": {
      "base16": "npm:base16@1.0.0",
      "lodash.curry": "npm:lodash.curry@4.1.1",
      "lodash.flow": "npm:lodash.flow@3.5.0",
      "pure-color": "npm:pure-color@1.3.0"
    },
    "npm:react-dom@15.6.2": {
      "fbjs": "npm:fbjs@0.8.16",
      "loose-envify": "npm:loose-envify@1.3.1",
      "object-assign": "npm:object-assign@4.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0",
      "react": "npm:react@15.6.2"
    },
    "npm:react-dom@16.2.0": {
      "fbjs": "npm:fbjs@0.8.16",
      "loose-envify": "npm:loose-envify@1.3.1",
      "object-assign": "npm:object-assign@4.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0",
      "react": "npm:react@16.2.0",
      "stream": "github:jspm/nodelibs-stream@0.1.0"
    },
    "npm:react-image-crop@3.0.8": {
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.5.10",
      "react": "npm:react@16.2.0"
    },
    "npm:react-inlinesvg@0.6.2": {
      "httpplease": "npm:httpplease@0.16.4",
      "once": "npm:once@1.4.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.5.10",
      "react": "npm:react@15.6.2"
    },
    "npm:react-json-tree@0.11.0": {
      "babel-runtime": "npm:babel-runtime@6.26.0",
      "prop-types": "npm:prop-types@15.5.10",
      "react": "npm:react@16.2.0",
      "react-base16-styling": "npm:react-base16-styling@0.5.3",
      "react-dom": "npm:react-dom@16.2.0"
    },
    "npm:react-lazy-load@3.0.13": {
      "eventlistener": "npm:eventlistener@0.0.1",
      "lodash.debounce": "npm:lodash.debounce@4.0.8",
      "lodash.throttle": "npm:lodash.throttle@4.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0",
      "react": "npm:react@16.2.0",
      "react-dom": "npm:react-dom@16.2.0"
    },
    "npm:react-platform-js@0.0.1": {
      "ua-parser-js": "npm:ua-parser-js@0.7.17"
    },
    "npm:react-redux@5.0.6": {
      "hoist-non-react-statics": "npm:hoist-non-react-statics@2.3.1",
      "invariant": "npm:invariant@2.2.2",
      "lodash": "npm:lodash@4.17.4",
      "lodash-es": "npm:lodash-es@4.17.4",
      "loose-envify": "npm:loose-envify@1.3.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.5.10",
      "react": "npm:react@16.2.0",
      "redux": "npm:redux@3.7.2"
    },
    "npm:react-resize-detector@0.4.1": {
      "prop-types": "npm:prop-types@15.6.0",
      "react": "npm:react@15.6.2"
    },
    "npm:react-router@3.2.0": {
      "create-react-class": "npm:create-react-class@15.6.2",
      "history": "npm:history@3.3.0",
      "hoist-non-react-statics": "npm:hoist-non-react-statics@1.2.0",
      "invariant": "npm:invariant@2.2.2",
      "loose-envify": "npm:loose-envify@1.3.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.5.10",
      "react": "npm:react@16.2.0",
      "warning": "npm:warning@3.0.0"
    },
    "npm:react-slick@0.15.4": {
      "can-use-dom": "npm:can-use-dom@0.1.0",
      "classnames": "npm:classnames@2.2.5",
      "create-react-class": "npm:create-react-class@15.6.2",
      "enquire.js": "npm:enquire.js@2.1.6",
      "json2mq": "npm:json2mq@0.2.0",
      "object-assign": "npm:object-assign@4.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "react": "npm:react@15.6.2",
      "react-dom": "npm:react-dom@15.6.2",
      "slick-carousel": "npm:slick-carousel@1.8.1"
    },
    "npm:react-smooth@0.3.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "lodash": "npm:lodash@4.17.4",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.5.10",
      "raf": "npm:raf@3.4.0",
      "react": "npm:react@15.6.2",
      "react-dom": "npm:react-dom@15.6.2",
      "react-transition-group": "npm:react-transition-group@1.2.1"
    },
    "npm:react-transition-group@1.2.1": {
      "chain-function": "npm:chain-function@1.0.0",
      "dom-helpers": "npm:dom-helpers@3.2.1",
      "loose-envify": "npm:loose-envify@1.3.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0",
      "react": "npm:react@16.2.0",
      "react-dom": "npm:react-dom@16.2.0",
      "warning": "npm:warning@3.0.0"
    },
    "npm:react@15.6.2": {
      "create-react-class": "npm:create-react-class@15.6.2",
      "fbjs": "npm:fbjs@0.8.16",
      "loose-envify": "npm:loose-envify@1.3.1",
      "object-assign": "npm:object-assign@4.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0"
    },
    "npm:react@16.2.0": {
      "fbjs": "npm:fbjs@0.8.16",
      "loose-envify": "npm:loose-envify@1.3.1",
      "object-assign": "npm:object-assign@4.1.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.6.0"
    },
    "npm:readable-stream@1.1.14": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.3",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "npm:readable-stream@2.3.3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.3",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "process-nextick-args": "npm:process-nextick-args@1.0.7",
      "safe-buffer": "npm:safe-buffer@5.1.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "string_decoder": "npm:string_decoder@1.0.3",
      "util-deprecate": "npm:util-deprecate@1.0.2"
    },
    "npm:recharts@0.22.4": {
      "classnames": "npm:classnames@2.2.5",
      "core-js": "npm:core-js@2.4.1",
      "d3-scale": "npm:d3-scale@1.0.4",
      "d3-shape": "npm:d3-shape@1.0.4",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "lodash": "npm:lodash@4.17.4",
      "path": "github:jspm/nodelibs-path@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "prop-types": "npm:prop-types@15.5.10",
      "react": "npm:react@15.6.2",
      "react-resize-detector": "npm:react-resize-detector@0.4.1",
      "react-smooth": "npm:react-smooth@0.3.0",
      "react-transition-group": "npm:react-transition-group@1.2.1",
      "recharts-scale": "npm:recharts-scale@0.3.0",
      "reduce-css-calc": "npm:reduce-css-calc@1.3.0"
    },
    "npm:reduce-css-calc@1.3.0": {
      "balanced-match": "npm:balanced-match@0.4.2",
      "math-expression-evaluator": "npm:math-expression-evaluator@1.2.17",
      "reduce-function-call": "npm:reduce-function-call@1.0.2"
    },
    "npm:reduce-function-call@1.0.2": {
      "balanced-match": "npm:balanced-match@0.4.2"
    },
    "npm:redux@3.7.2": {
      "lodash": "npm:lodash@4.17.4",
      "lodash-es": "npm:lodash-es@4.17.4",
      "loose-envify": "npm:loose-envify@1.3.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "symbol-observable": "npm:symbol-observable@1.1.0"
    },
    "npm:regenerator-runtime@0.10.5": {
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:regenerator-runtime@0.11.1": {
      "path": "github:jspm/nodelibs-path@0.1.0"
    },
    "npm:reqwest@2.0.5": {
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:ripemd160@2.0.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "hash-base": "npm:hash-base@2.0.2",
      "inherits": "npm:inherits@2.0.1"
    },
    "npm:safe-buffer@5.1.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:setimmediate@1.0.5": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:sha.js@2.4.9": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "safe-buffer": "npm:safe-buffer@5.1.1"
    },
    "npm:shallowequal@0.2.2": {
      "lodash.keys": "npm:lodash.keys@3.1.2"
    },
    "npm:slick-carousel@1.8.1": {
      "jquery": "npm:jquery@3.2.1"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.3",
      "readable-stream": "npm:readable-stream@1.1.14"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1"
    },
    "npm:string_decoder@1.0.3": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "safe-buffer": "npm:safe-buffer@5.1.1"
    },
    "npm:ua-parser-js@0.7.17": {
      "process": "github:jspm/nodelibs-process@0.1.2",
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:url@0.10.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:urllite@0.5.0": {
      "xtend": "npm:xtend@4.0.1"
    },
    "npm:util-deprecate@1.0.2": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:vm-browserify@0.0.4": {
      "indexof": "npm:indexof@0.0.1"
    },
    "npm:warning@2.1.0": {
      "loose-envify": "npm:loose-envify@1.3.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:warning@3.0.0": {
      "loose-envify": "npm:loose-envify@1.3.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:xmlhttprequest@1.8.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.1",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "url": "github:jspm/nodelibs-url@0.1.0"
    },
    "npm:xtend@3.0.0": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    },
    "npm:xtend@4.0.1": {
      "systemjs-json": "github:systemjs/plugin-json@0.1.2"
    }
  }
});
