const playwright = require("playwright");
const fs = require("fs");
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Se connecte au compte Discord avec les informations d'identification fournies.
 * @param {string} email - L'email du compte Discord.
 * @param {string} password - Le mot de passe du compte Discord.
 * @returns {Promise<{browser: object, page: object}>} - L'objet browser et page de Playwright.
 */
async function connectToAccount(email, password) {
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto('https://discordapp.com/login?redirect_to=%2Fdevelopers%2Fapplications');

        await page.waitForSelector('input[name="email"]');
        await page.type('input[name="email"]', email);
        await page.type('input[name="password"]', password);
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle' });
        console.log(`Connecté avec succès au compte : ${email}`);

        return { browser, page };
    } catch (error) {
        console.error(`Erreur lors de la connexion au compte ${email} :`, error);
        await browser.close();
        throw error;
    }
}

/**
 * Supprime les bots associés aux IDs donnés.
 * @param {object} page - La page Playwright pour interagir avec Discord.
 * @param {Array<string>} botIds - Les IDs des bots à supprimer.
 */
async function deleteBots(page, botIds) {
    let mfaDone = false; 

    for (const id of botIds) {
        console.log(`Suppression du bot avec ID : ${id}`);

        await delay(1000 * 2);

        await page.goto(`https://discord.com/developers/applications/${id}/information`);

        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        await page.waitForSelector('.button-f2h6uQ.filledRed-2IV6U1.filledDefault-25rIra.buttonHeightMedium-2UpIaI');
        await page.click('.button-f2h6uQ.filledRed-2IV6U1.filledDefault-25rIra.buttonHeightMedium-2UpIaI');

        await page.waitForSelector('input[name="appName"]');
        await page.type('input[name="appName"]', 'Daisuki');
        await page.waitForSelector('.button-f2h6uQ.filledBrand-3fai8P.filledDefault-25rIra.buttonHeightTall-Yz4Cm8.dangerButton-XvH6ej.modalFooterButton-2Kh0NI');
        await page.click('.button-f2h6uQ.filledBrand-3fai8P.filledDefault-25rIra.buttonHeightTall-Yz4Cm8.dangerButton-XvH6ej.modalFooterButton-2Kh0NI');
        if (!mfaDone) {
            try {
                await page.waitForSelector('input[name="mfaCode"]', { timeout: 5000 });
                await page.type('input[name="mfaCode"]', 'panDu69100');
                await page.waitForSelector('body > div:nth-child(6) > div > form > footer > button');
                await page.click('body > div:nth-child(6) > div > form > footer > button');
                mfaDone = true; 
            } catch (error) {
                console.log('Pas de demande MFA ou elle a déjà été traitée.');
            }
        }

        const tokens = fs.readFileSync("tokens.txt", "utf-8").split('\n');
        const updatedTokens = tokens.filter(line => {
            const parts = line.split(':');
            return parts[1] !== id; 
        });

        fs.writeFileSync("tokens.txt", updatedTokens.join('\n'), "utf-8");

        console.log(`Bot avec ID ${id} supprimé.`);
    }

    console.log("Tous les bots ont été supprimés avec succès.");
}

/**
 * Fonction principale exécutant le traitement des comptes et des bots.
 */
async function main() {
    const data = fs.readFileSync("tokens.txt", "utf-8");
    const lines = data.split("\n").filter(line => line.trim() !== "");

    const accounts = {};

    for (const line of lines) {
        const [token, id, email] = line.split(":").map(s => s.trim());
        if (!accounts[email]) accounts[email] = [];
        accounts[email].push(id);
    }

    for (const email in accounts) {
        const botIds = accounts[email];
        console.log(`Traitement du compte : ${email}`);

        const password = process.env.DISCORD_PASSWORD || ""; 

        try {
            const { browser, page } = await connectToAccount(email, password);
            console.log(`On va supprimer ${botIds.length} bots pour le compte ${email}.`);
            await deleteBots(page, botIds, email);
            await browser.close();
        } catch (error) {
            console.error(`Erreur lors du traitement du compte ${email} :`, error);
        }
    }
}

main().catch(error => console.error('Une erreur est survenue:', error));
