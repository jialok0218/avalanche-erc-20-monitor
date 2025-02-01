import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const DISCORD_WEBHOOK_URL: string = process.env.DISCORD_WEBHOOK_URL || "";
const NETWORK: string = process.env.NETWORK?.toUpperCase() || "UNKNOWN"; // Get Network from .env

if (!DISCORD_WEBHOOK_URL) {
    throw new Error("❌ DISCORD_WEBHOOK_URL is missing in .env file");
}

/**
 * Sends an alert to Discord when a new ERC-20 token is detected.
 */
export async function sendToDiscord(
    name: string, 
    symbol: string, 
    contractAddress: string, 
    creatorAddress: string, 
    decimals: number, 
    explorerUrl: string
): Promise<void> {
    const message = {
        username: "ERC-20 Token Monitor",
        embeds: [
            {
                title: "🆕 New ERC-20 Token Detected!",
                color: 15844367, // Yellow color
                fields: [
                    { name: "🌍 Network", value: NETWORK, inline: true }, // ✅ Added Network info
                    { name: "📍 Contract Address", value: `[${contractAddress}](${explorerUrl}${contractAddress})`, inline: false },
                    { name: "👤 Creator Address", value: `[${creatorAddress}](${explorerUrl}${creatorAddress})`, inline: false },
                    { name: "🔤 Name", value: name, inline: true },
                    { name: "🔣 Symbol", value: symbol, inline: true },
                    { name: "📊 Decimals", value: decimals.toString(), inline: true }
                ],
                timestamp: new Date(),
            }
        ]
    };

    try {
        await axios.post(DISCORD_WEBHOOK_URL, message);
        console.log("✅ Sent alert to Discord!");
    } catch (error) {
        console.error("❌ Failed to send message to Discord:", error);
    }
}
