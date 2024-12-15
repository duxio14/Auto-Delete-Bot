# Auto Bot Deleter

This project is a script designed to automate the management and deletion of Discord bots linked to specific accounts. It leverages **Playwright** to interact with the Discord Developer Portal. 

The script logs into Discord accounts using provided credentials, deletes bots based on their IDs, handles Multi-Factor Authentication (MFA) if required, and automatically updates the `tokens.txt` file after bot deletion.

## Installation and Setup

To use this script, clone the repository and navigate to the project folder. Install the required dependencies with `npm install playwright`. Create a `.env` file in the project directory and add your Discord password using the format `DISCORD_PASSWORD=your_password`. Prepare a `tokens.txt` file listing your bot tokens, IDs, and emails in the format `token:bot_id:email`. 

Run the script using `node index.js`, and it will log into your Discord accounts, delete the bots listed in `tokens.txt`, and update the file by removing processed bots. 

## Project Structure

The project consists of the following files:  
- `index.js`: The main script.  
- `tokens.txt`: A file containing the list of bots to be deleted.  
- `.env`: A file for storing environment variables.  
- `README.md`: Documentation.  
- `package.json`: Dependencies and project metadata.

## Prerequisites

Ensure you have **Node.js** (version 14 or higher) and **npm** installed. The Playwright library is included as a dependency.

## Important Notes

Please respect Discord's terms of service. Use this script only for managing your own accounts and bots. Any misuse of this tool that violates Discord's policies may result in penalties. Do not share your credentials and always use secure accounts.

For questions or suggestions, feel free to reach out on [GitHub](https://github.com/your-profile).  
**Author**: Ali  
_"Automate today to simplify tomorrow."_  
