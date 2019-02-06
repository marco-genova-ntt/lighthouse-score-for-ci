FROM node:8

#works on application
WORKDIR /tmp

# Install utilities
RUN apt-get update --fix-missing && apt-get -y upgrade

# Install chrome
RUN \
  wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
  echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list && \
  apt-get update && \
  apt-get install -y google-chrome-stable && \
rm -rf /var/lib/apt/lists/*

#works on application
WORKDIR /app/lighthouse
COPY package.json /app/lighthouse
RUN npm install
COPY . /app/lighthouse

#launch node single run
CMD [ "npm", "run", "start" ]