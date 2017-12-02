/* tslint:disable */
function generateConfig(): any {
    const windowObj: any = window;
    if (!window.hasOwnProperty('__NESTED_CONFIG__')) {
        window.__NESTED_CONFIG__ = {
            APP_CLIENT_ID: 'WEBAPP_DEVELOPMENT',
            APP_VERSION: 353,
            DOMAIN: 'nested.me',
            SIGN_OUT_TARGET: 'https://nested.me',
            WEBSOCKET: {
                URL: '_WS_CYRUS_CYRUS_URL_CONF_',
                TIMEOUT: 60000,
                REQUEST_MAX_RETRY_TIMES: 16,
            },
            STORE: {
                URL: '_XERXES_URL_CONF_',
                TOKEN_EXPMS: 3550000,
            },
            REGISTER: {
                AJAX: {
                    URL: '_HTTP_CYRUS_URL_CONF_',
                },
            },
            GRAND_PLACE_REGEX: /^[a-zA-Z][a-zA-Z0-9-]{3,30}[a-zA-Z0-9]$/,
            GOOGLE_ANALYTICS_TOKEN: 'UA-92612481-1',
            UPLOAD_SIZE_LIMIT: 209715200,
        };
    }
    if (windowObj.__NESTED_CONFIG__.WEBSOCKET.URL.indexOf('://') === -1) {
        windowObj.__NESTED_CONFIG__.WEBSOCKET.URL = 'wss://webapp.ronaksoftware.com:81';
    }
    if (windowObj.__NESTED_CONFIG__.STORE.URL.indexOf('://') === -1) {
        windowObj.__NESTED_CONFIG__.STORE.URL = 'https://webapp.ronaksoftware.com:83';
    }
    if (windowObj.__NESTED_CONFIG__.REGISTER.AJAX.URL.indexOf('://') === -1) {
        windowObj.__NESTED_CONFIG__.REGISTER.AJAX.URL = 'https://webapp.ronaksoftware.com:81';
    }
    return {
        APP_CLIENT_ID: 'WEBAPP_DEVELOPMENT',
        APP_VERSION: 353,
        DOMAIN: windowObj.__NESTED_CONFIG__.DOMAIN,
        SIGN_OUT_TARGET: '/',
        WEBSOCKET: {
            URL: windowObj.__NESTED_CONFIG__.WEBSOCKET.URL,
            TIMEOUT: 60000,
            REQUEST_MAX_RETRY_TIMES: 16,
        },
        STORE: {
            URL: windowObj.__NESTED_CONFIG__.STORE.URL,
            TOKEN_EXPMS: 3550000,
        },
        REGISTER: {
            AJAX: {
                URL: windowObj.__NESTED_CONFIG__.REGISTER.AJAX.URL,
            },
        },
        GRAND_PLACE_REGEX: /^[a-zA-Z][a-zA-Z0-9-]{3,30}[a-zA-Z0-9]$/,
        GOOGLE_ANALYTICS_TOKEN: 'UA-92612481-1',
        UPLOAD_SIZE_LIMIT: 209715200,
        'DEFAULT_PLACE_MAX_CHILDREN': 50,
        'DEFAULT_PLACE_MIN_CHILDREN': 5,
        'DEFAULT_PLACE_MAX_CREATORS': 200,
        'DEFAULT_PLACE_MIN_CREATORS': 5,
        'DEFAULT_PLACE_MAX_KEYHOLDERS': 2500,
        'DEFAULT_PLACE_MIN_KEYHOLDERS': 25,
        'DEFAULT_PLACE_MAX_LEVELS': 5,
        'DEFAULT_PLACE_MIN_LEVELS': 3,
        'DEFAULT_POST_MAX_ATTACHMENTS': 50,
        'DEFAULT_POST_MIN_ATTACHMENTS': 5,
        'DEFAULT_POST_MAX_TARGETS': 50,
        'DEFAULT_POST_MIN_TARGETS': 5,
        'DEFAULT_POST_MAX_RETRACT_TIME': 86400000,
        'DEFAULT_POST_MIN_RETRACT_TIME': 0,
        'DEFAULT_ACCOUNT_MAX_GRAND_PLACES': 1000,
        'DEFAULT_ACCOUNT_MIN_GRAND_PLACES': 0,
        'DEFAULT_MAX_CACHE_LIFETIME': 86400,
        'DEFAULT_MIN_CACHE_LIFETIME': 60,
        'DEFAULT_ACCOUNT_MAX_REGISTER_MODE': 2,
        'DEFAULT_ACCOUNT_MIN_REGISTER_MODE': 1,
    };
}

/**
 * replace current end points with new configs
 *
 * @param {string} DOMAIN
 * @param {string} WEBSOCKET_URL cyrus web socket url
 * @param REGISTER_AJAX_URL   cyrus http url
 * @param {string} STORE_URL xerxes http url
 */
export function setNewConfig(DOMAIN: string, WEBSOCKET_URL: string, REGISTER_AJAX_URL, STORE_URL: string): void {
    const windowObj: any = window;
    windowObj.__NESTED_CONFIG__.DOMAIN = DOMAIN;
    windowObj.__NESTED_CONFIG__.WEBSOCKET.URL = WEBSOCKET_URL;
    windowObj.__NESTED_CONFIG__.REGISTER.AJAX.URL = REGISTER_AJAX_URL;
    windowObj.__NESTED_CONFIG__.STORE.URL = STORE_URL;
}

export default generateConfig;
