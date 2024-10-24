FROM lapig/app_base:stable_1.4

# Clone app and npm install on server
ENV URL_TO_APPLICATION_GITHUB="https://github.com/lapig-ufg/tvi-indonesia.git"
ENV BRANCH="master"

LABEL maintainer="Tharles de Sousa Andrade <irtharles@gmail.com> e Rocha Jairo <devjairomr.gmail.com.br>"

RUN if [ -d "/APP/tvi-indonesia" ]; then rm -Rf /APP/tvi-indonesia; fi  && \
    cd /APP && git clone -b ${BRANCH} ${URL_TO_APPLICATION_GITHUB}
    
ADD ./src/server/node_modules /APP/tvi-indonesia/src/server/node_modules

ENTRYPOINT [ "/APP/monitor.sh"]