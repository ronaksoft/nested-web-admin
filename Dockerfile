FROM node:6-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN npm install -g local-web-server
EXPOSE 80

COPY ./bin/nested-reconfig.js /bin/nested-reconfig.js
CMD node /bin/nested-reconfig.js && \
    sleep 1 && \
    if [ -n "${NST_ADDR_PORT}" ]; then \
        echo ""; \
    else \
        export NST_ADDR_PORT=80; \
    fi && \
    if  [[ -n "${NST_TLS_KEY_FILE}" && -n "${NST_TLS_CERT_FILE}" ]] ; then \
         if  [[ -f $NST_TLS_CERT_FILE && -f $NST_TLS_KEY_FILE ]]; then \
            echo "Webapp started over SSL" ; \
            ws -p $NST_ADDR_PORT -s index.html --ssl --cert $NST_TLS_CERT_FILE --key $NST_TLS_KEY_FILE; \
         else \
            echo "Webapp started without SSL" ; \
            ws -p $NST_ADDR_PORT -s index.html;\
         fi ;\
    else \
         echo "Webapp started without SSL" ; \
         ws -p $NST_ADDR_PORT -s index.html;\
    fi



# Install app dependencies
COPY ./dist /usr/src/app/
