import { ethers } from "ethers";
import dotenv from "dotenv";
import { sendToDiscord } from "./discordAlert";

dotenv.config();

// Detect the selected network (either "fuji" or "avalanche")
const NETWORK = process.env.NETWORK?.toLowerCase();
const RPC_URL: string | undefined = NETWORK === "fuji" ? process.env.FUJI_RPC_URL : process.env.AVAX_RPC_URL;
const EXPLORER_URL: string = 
    NETWORK === "fuji" ? process.env.FUJI_EXPLORER_URL || "" : process.env.AVAX_EXPLORER_URL || "";

if (!EXPLORER_URL) {
    throw new Error("❌ EXPLORER_URL is missing in .env file. Check FUJI_EXPLORER_URL or AVAX_EXPLORER_URL.");
}

if (!RPC_URL) {
    console.error("❌ RPC URL is missing in .env file");
    process.exit(1);
}

const provider = new ethers.JsonRpcProvider(RPC_URL);

// ERC-20 ABI to check token details
const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
];

console.log(`🚀 Monitoring for new ERC-20 tokens on ${NETWORK?.toUpperCase()}...`);

// Listen for new blocks
provider.on("block", async (blockNumber: number) => {
    console.log(`🔍 Checking Block: ${blockNumber}`);

    try {
        const block = await provider.getBlock(blockNumber);
        if (!block || !block.transactions.length) return;

        for (const txHash of block.transactions) {
            const receipt = await provider.getTransactionReceipt(txHash);
            if (receipt && receipt.contractAddress) {
                const contractAddress: string = receipt.contractAddress;

                // Fetch transaction details to get the deployer (creator) address
                const tx = await provider.getTransaction(txHash);

                if (!tx) {
                    console.warn(`⚠️ Warning: Transaction ${txHash} not found. Skipping...`);
                    continue;
                }

                const creatorAddress: string = tx.from;

                // Check if it's an ERC-20 token
                const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);

                try {
                    const [name, symbol, decimals, totalSupply] = await Promise.all([
                        contract.name(),
                        contract.symbol(),
                        contract.decimals(),
                        contract.totalSupply(),
                    ]);

                    const formattedSupply = parseFloat(ethers.formatUnits(totalSupply, decimals));

                    if (formattedSupply > 1) {
                        console.log("🆕 New ERC-20 Token Detected!");
                        console.log(`📍 Contract Address: ${EXPLORER_URL}${contractAddress}`);
                        console.log(`👤 Creator Address: ${EXPLORER_URL}${creatorAddress}`);
                        console.log(`🔤 Name: ${name}`);
                        console.log(`🔣 Symbol: ${symbol}`);
                        console.log(`📊 Decimals: ${decimals}`);
                        console.log(`💰 Total Supply: ${formattedSupply}`);
                        console.log("----------------------------------");

                        await sendToDiscord(name, symbol, contractAddress, creatorAddress, decimals, EXPLORER_URL);
                    } else {
                        console.log(`❌ Ignored ${name} (${symbol}) - Supply too low: ${formattedSupply}`);
                    }

                } catch (error) {
                    console.error(`❌ Failed to fetch token details for ${contractAddress}:`, error);
                }
            }
        }
    } catch (error) {
        console.error("❌ Error fetching block data:", error);
    }
});
