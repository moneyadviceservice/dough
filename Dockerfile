FROM ubuntu:16.04
MAINTAINER development.team@moneyadviceservice.org.uk

ENV BUNDLER_VERSION "1.16.1"
ENV NODE_VERSION "4.8.4"
ENV BOWER_VERSION "1.8.2"
ENV PHANTOMJS_VERSION "2.1.1"
ENV PATH usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/rvm/bin:$PATH
ENV RAILS_ENV test
ENV BUNDLE_WITHOUT development:build
ENV DEBIAN_FRONTEND noninteractive
ENV APT_PACKAGES " \
  build-essential apt-utils git libfontconfig libpq-dev libsqlite3-dev libmysqlclient-dev \
  libxml2-dev libreadline-dev zlib1g-dev apt-transport-https curl software-properties-common openssh-server"

#Install Prerequisites
RUN apt-get -qq update > /dev/null && \
  apt-get -qq dist-upgrade > /dev/null && \
  apt-get -qq install --no-install-recommends $APT_PACKAGES > /dev/null && \
  apt-get -qq clean  > /dev/null && \
  rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /tmp

#Install Ruby
COPY .ruby-version .ruby-version

#Download RVM as root
RUN \curl -#LO https://rvm.io/mpapis.asc && gpg --import mpapis.asc && \
  \curl -sSL https://get.rvm.io | bash -s stable

#Install RVM requirements
RUN /bin/bash -lc "rvm requirements" && \
  /bin/bash -lc  "rvm install $(cat .ruby-version) && rvm use $(cat .ruby-version) --default"

#Install Bundler & Geminabox
RUN /bin/bash -lc "gem install -v ${BUNDLER_VERSION} bundler"
RUN /bin/bash -lc "gem install geminabox"

#Install Node
RUN curl https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz \
  | tar -xz -C /usr --strip-components=1

#Install Bower
RUN npm install bower@${BOWER_VERSION} -g

#Install PhantomJs
RUN curl -L -O https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-${PHANTOMJS_VERSION}-linux-x86_64.tar.bz2
RUN tar jxf phantomjs-${PHANTOMJS_VERSION}-linux-x86_64.tar.bz2 \
  -C /usr/bin --strip-components 2 \
  phantomjs-${PHANTOMJS_VERSION}-linux-x86_64/bin/phantomjs

RUN mkdir -p /var/tmp/app
WORKDIR /var/tmp/app

#Copy Repo
COPY . /var/tmp/app/
