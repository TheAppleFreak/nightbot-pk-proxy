@echo off

where node -v >nul 2>&1 && (
    if not exist node_modules\ (
        .\install.bat
    )
    if exist .env (
        if not exist build\ (
            echo Building application, one moment...
            npm run build
        )
        echo Starting server! To exit, press Ctrl-C
        npm start
    ) else (
        echo You don't have a configuration file! Please rename .env to .env.sample, then fill out each line with your configuration. Run this again once you've done that.
        pause
    )
) || (
    echo You don't have Node.js installed! Please download it from https://nodejs.org, install it, then try running this again.
    pause
)