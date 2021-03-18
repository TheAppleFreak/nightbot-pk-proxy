# Nightbot-PluralKit Proxy

A web service that fetches and returns the current fronter(s) from PluralKit.

## Setup

1. [Install Node.js](https://nodejs.org/en/) (preferably the latest version).
2. [Clone or download this repository locally](https://github.com/TheAppleFreak/nightbot-pk-proxy/archive/main.zip).
3. Run `npm install` to install dependencies. Alternatively, if you don't feel comfortable with the command line or terminal, double click `install.bat` to run the command for you.
4. Rename `.env.sample` to `.env`, then fill out each line with the appropriate information. Not all information is required, but it is recommended that you fill everything applicable out regardless. If you miss a value, the application will crash at startup and inform you that the specified value is missing. 
  * Proxy settings are not required if `USE_PROXY` is set to `false`.
5. Build the application using `npm run build`, then launch the application by running `npm start`. Alternatively, if you don't feel comfortable with the command line or terminal, double click `start.bat` to run the commands for you.