// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require("discord.js");
const { commandsHandler, eventsHandler } = require("./handler.js");
const dotenv = require("dotenv");
dotenv.config();

const token = process.env.token;

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

commandsHandler(client);
eventsHandler(client);

client.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

// Log in to Discord with your client's token
client
  .login(token)
  .then(() => {
    client.user.setPresence({
      activities: [{ name: "with discord.js" }],
      status: "idle",
    });
  })
  .catch((error) => {
    console.error("Error logging in:", error);
  });
