# 📌 Avalanche ERC-20 Monitor

🚀 A real-time monitoring tool that **detects new ERC-20 token deployments** on the **Avalanche (AVAX) C-Chain** and **sends automated alerts to Discord**.

---

## **📖 Features**
- ✅ **Real-time monitoring** of newly deployed ERC-20 contracts.
- 🔍 **Smart filtering** to detect only **new contract creations** (not token swaps or transfers).
- 🛠️ **ERC-20 validation** using:
  - `name()`, `symbol()`, `decimals()`, `totalSupply()`
- 📡 **Filtered detection**:
  - Only transactions with `to === null` (contract creation).
  - Contract bytecode **starts with `0x60806040`**.
  - Total supply **must be greater than 1**.
- 📢 **Automated Discord Alerts**:
  - Token Name, Symbol, Decimals, Total Supply.
  - Contract Address & Creator Address.
- 🌐 **Multi-Network Support**: Works on **Avalanche Mainnet** & **Fuji Testnet**.
- ⚡ **Optimized Performance**: Efficient API calls & background execution.

---

## **🔹 How It Works**
1️⃣ The bot **listens for new blocks** on the Avalanche blockchain.  
2️⃣ It **fetches transactions** and **filters only contract deployments**.  
3️⃣ The script **verifies ERC-20 compliance**.  
4️⃣ If valid, it **sends token details** to a **Discord Webhook**.  

---

## **🛠️ Installation & Setup**
### **1️⃣ Clone the Repository**
```bash
git clone <repo-url>
cd avalanche-erc20-monitor
npm install
```

### **2️⃣ Configure Environment Variables**
Create a `.env` file in the project root with the following configuration:

```ini
# Avalanche Mainnet RPC URL
AVAX_RPC_URL=your-alchemy-or-infura-url

# Avalanche Explorer URL
AVAX_EXPLORER_URL=https://snowtrace.io/address/

# Fuji Testnet RPC URL
FUJI_RPC_URL=your-testnet-url

# Fuji Explorer URL
FUJI_EXPLORER_URL=https://testnet.snowtrace.io/address/

# Discord Webhook URL for alerts
DISCORD_WEBHOOK_URL=your-discord-webhook-url

# Choose network: "avalanche" or "fuji"
NETWORK=avalanche
```

## **▶️ Start the Bot**
Once the `.env` file is configured, start the bot with:

```bash
npm start
```

To run it with TypeScript:
```bash
npx ts-node src/monitor.ts
```

## **🔔 Discord Alert Example**
```yaml
📢 New ERC-20 Token Detected!
🌍 Network: AVALANCHE
🔗 Contract Address: https://snowtrace.io/address/0xABC123
👤 Creator Address: https://snowtrace.io/address/0xCreatorXYZ
📝 Name: TestToken
💱 Symbol: TT
📊 Decimals: 18
💰 Total Supply: 1,000,000 TT
```

## **☁️ Deploying to Heroku**

### **1️⃣ Login & Create App**
```bash
heroku login
heroku create avalanche-erc20-monitor
```

### **2️⃣ Set Environment Variables**
```bash
heroku config:set AVAX_RPC_URL=your-alchemy-or-infura-url
heroku config:set AVAX_EXPLORER_URL=https://snowtrace.io/address/
heroku config:set FUJI_RPC_URL=your-testnet-url
heroku config:set FUJI_EXPLORER_URL=https://testnet.snowtrace.io/address/
heroku config:set DISCORD_WEBHOOK_URL=your-discord-webhook-url
heroku config:set NETWORK=avalanche
```

### **3️⃣ Deploy & Start**
```bash
git push heroku main
heroku ps:scale worker=1
```

## **🛠️ Technologies Used**
- 🟠 **TypeScript** - Type safety & maintainability.
- 🟢 **Node.js** - Backend runtime.
- ⚡ **Ethers.js** - Blockchain interaction.
- 🔗 **Alchemy / Infura** - Avalanche RPC provider.
- 💬 **Discord Webhooks** - Token alert notifications.
- ☁️ **Heroku** - For bot deployment.

---

## **📜 License**
This project is **open-source** under the **MIT License**.

