# Reaktor Chat Client
Socket.io, IRC-like chat application, made with [Vue.js](https://vuejs.org/).
Originally made for Reaktor, as part of their summer internship challenge.

They ended up hiring me, if you've stumbled upon this repository to dig for
more info!
## Features
- Registering and logging in
- Private and public channels
- Mobile-friendly interface
- Full message history for any channel
- Desktop/mobile notifications
- Scalable [backend architecture](https://github.com/melonmanchan/reaktor-chat-server)
- Markdown and emoji support!

Once logged in, feel free to join any of the channels in the lobby, or create
your own.

![Screenshot](https://i.imgur.com/MBAFwRb.png)

## Build Setup
First off, install Yarn:

https://yarnpkg.com/

``` bash
# install dependencies
git clone https://github.com/melonmanchan/reaktor-chat-client
cd reaktor-chat-client
yarn

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
The local build assumes you have the backend running at localhost:8000

[![Build Status](https://travis-ci.org/melonmanchan/reaktor-chat-client.svg?branch=master)](https://travis-ci.org/melonmanchan/reaktor-chat-client)
