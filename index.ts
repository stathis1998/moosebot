import { Client, GatewayIntentBits } from "discord.js";
import { Configuration, OpenAIApi } from "openai";

import { config } from "dotenv";

config();

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Logged in as ${client?.user?.tag}!`);
});

client.on("messageCreate", async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Get server name
  const serverName = message.guild?.name;

  // Get channel name
  const channelName = message.guild?.channels.cache.get(
    message.channelId
  )?.name;

  // If channel id is 868886833315074098

  // Send message to the channel if the bot is mentioned
  if (
    message.content.includes("MooseBot") ||
    message.content.includes("moosebot") ||
    message.content.includes("Moosebot") ||
    message.content.includes("mooseBot") ||
    message.content.includes("Moose Bot") ||
    message.content.includes("moose bot") ||
    message.content.includes("Moose bot") ||
    message.content.includes("<@894632735417700433>")
  ) {
    // Disable for Never Late server
    // if (message.guildId === "868886833315074098") {
    //   // Send this
    //   message.channel.send(
    //     `Moose disabled me for this server. I am sorry uwu...`
    //   );
    //   return;
    // }

    const messages = await message.channel.messages.fetch({
      limit: 3,
    });

    let prompt =
      "The following conversation is a casual chat in a server, the bot is a friendly, clever, funny, creative and helpful. Bot must use emojis to talk when it can. Also the creator of the bot is Moose, the best player alive.\n\n";

    messages.reverse().forEach((message) => {
      prompt += `${message.author.username}: ${message.content}\n`;
    });

    prompt += `MooseBot:`;

    // translate discord <@[0-9]> to username
    const regex = /<@([0-9]+)>/g;
    const matches = prompt.match(regex);

    if (matches) {
      matches.forEach((match) => {
        const id = match.replace("<@", "").replace(">", "");
        const user = message.guild?.members.cache.get(id)?.user;

        if (user) {
          prompt = prompt.replace(match, user.username);
        }
      });
    }

    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt,
      max_tokens: 512,
      temperature: 0.6,
      top_p: 1,
      frequency_penalty: 1.6,
      presence_penalty: 1.6,
      best_of: 1,
      n: 1,
    });

    if (response.data.choices && response.data.choices[0].text) {
      message.reply(response.data.choices[0].text);
      console.log(message.content, response.data.choices[0].text);
    } else {
      message.reply(
        "I don't know what to say. Got an internalll erro.rr.. v.v"
      );
    }
  }
});

client.login(process.env.TOKEN);
