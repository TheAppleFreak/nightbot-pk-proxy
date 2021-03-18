@echo off

where npm -v >nul 2>&1 && (
    echo Installing program dependencies, please wait...
    npm install
    echo Installation completed. 
    pause
) || (
    echo You don't have npm installed! Please download it from https://nodejs.org, install it, then try running this again.
    pause
)
