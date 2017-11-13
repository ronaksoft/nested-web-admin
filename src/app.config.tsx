export default {
    'APP_CLIENT_ID': 'WEBAPP_DEVELOPMENT',
    'VERSION' : '0.0.4',
    'APP_VERSION': 4,
    'DOMAIN': '_DOMAIN_',
    'LOG': {
        'LEVEL': 3,
        'GATEWAY': {
            'TYPE': 'console',
            'OPTIONS': {}
        }
    },
    'SIGN_OUT_TARGET': 'https://nested.me',
    'WEBSOCKET': {
        'URL': 'wss://webapp.ronaksoftware.com:81',
        'TIMEOUT': 60000,
        'REQUEST_MAX_RETRY_TIMES': 16
    },
    'STORE': {
        'URL': 'https://webapp.ronaksoftware.com:83',
        'TOKEN_EXPMS': 3550000
    },
    'REGISTER': {
        'AJAX': {
            'URL': 'https://webapp.ronaksoftware.com:81'
        }
    },
    'GRAND_PLACE_REGEX': /^[a-zA-Z][a-zA-Z0-9-]{3,30}[a-zA-Z0-9]$/,
    'GOOGLE_ANALYTICS_TOKEN': 'UA-92612481-1',
    'UPLOAD_SIZE_LIMIT': 209715200,
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
