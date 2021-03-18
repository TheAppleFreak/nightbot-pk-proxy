# Nightbot-PluralKit Proxy

A web service that fetches and returns the current fronter(s) from PluralKit.

## Demo

[I've set up a quick and dirty demo using an alt account here](https://nightbot-pk-proxy.ascend.today/). Username is `demo`, password is `pkproxytest`. Auth is there to keep web crawlers from endlessly hitting the PluralKit API.

First two system members are standard. Third has their privacy setting set to `private`, which is chosen randomly from a pool of replacement names. Last one is defined in the config file, which never changes.

## Setup

1. [Install Node.js](https://nodejs.org/en/) (preferably the latest version).
2. [Clone or download this repository locally](https://github.com/TheAppleFreak/nightbot-pk-proxy/archive/main.zip).
3. Run `npm install` to install dependencies. Alternatively, if you don't feel comfortable with the command line or terminal, double click `install.bat` to run the command for you.
4. Rename `.env.sample` to `.env`, then fill out each line with the appropriate information. Not all information is required, but it is recommended that you fill everything applicable out regardless. If you miss a value, the application will crash at startup and inform you that the specified value is missing. 
    * Proxy settings are not required if `USE_PROXY` is set to `false`.
5. Build the application using `npm run build`, then launch the application by running `npm start`. Alternatively, if you don't feel comfortable with the command line or terminal, double click `start.bat` to run the commands for you.
6. In Nightbot, create a new command with the following text. 
  
        $(urlfetch <your.website.here>)
  
    Other bots should also work with this, but this application was built for Nightbot. Out of respect for the PluralKit API, make sure that you have reasonable limits on how often users can call this application, as it calls the PluralKit API on every hit. This will be improved in the future.

## Proxy

Due to the requirements of the person I wrote this application for, there is a built-in SSH-based reverse proxy solution that will forward a port from a remote server to the local application. This can be useful if you'd like to run the application on local hardware while using an external server to expose it to the internet, such as a cheap cloud VPS. I personally use a $5/mo DigitalOcean VPS and a cheap domain from Namecheap for this purpose. If you want $100 in DigitalOcean credit for 60 days, [feel free to sign up using my referral link](https://m.do.co/c/5c880460536c).

This is easily disabled if you'd rather run the application as a standalone web server. Simply set `USE_PROXY` in the environment variables to `false` to disable that feature.

## Todo

* [ ] Add caching support as not to call the PluralKit API too much
* [ ] Split out SSH proxy into its own package (this is largely based off of [reverse-tunnel-ssh](https://github.com/agebrock/reverse-tunnel-ssh) by @agebrock, but I had trouble actually getting that working as-is so it's probably worth doing anyways)
* [ ] Add localization support
* [ ] Improve error handling
* [ ] Multi-system support, for multiple users? Would likely be a nice hosted service eventually
* [ ] Improve documentation to better help inexperienced users set this project up for themselves
