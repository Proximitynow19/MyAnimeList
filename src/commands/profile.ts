import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
// @ts-ignore
import jikanjs from "@mateoaranda/jikanjs";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Fetch a user's profile from MyAnimeList.")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("The MyAnimeList username of the target.")
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("The Discord user of the target.")
    ),
  async execute(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const username = interaction.options.getString("username");

    const user = interaction.options.getUser("user");

    if (!user) {
      if (!username)
        return interaction.editReply("Log in through MyAnimeList to continue.");
    } else {
      return interaction.editReply(
        `${user.tag} has not yet linked their account.`
      );
    }

    const res = await jikanjs.loadUser(username);

    await interaction.followUp({
      components: [
        {
          type: 1,
          components: [
            {
              style: 5,
              label: `MyAnimeList`,
              url: res.data.url,
              disabled: false,
              emoji: {
                id: null,
                name: `🔗`,
              },
              type: 2,
            },
          ],
        },
      ],
      embeds: [
        {
          title: res.data.username,
          description: "",
          color: 0x2e51a2,
          fields: [
            {
              name: `ID`,
              value: `\`${res.data.mal_id}\``,
              inline: true,
            },
            {
              name: `Username`,
              value: `\`${res.data.username}\``,
              inline: true,
            },
            {
              name: `Last Online`,
              value: `<t:${new Date(res.data.last_online).getTime() / 1000}:R>`,
              inline: true,
            },
            {
              name: `Gender`,
              value: `\`${res.data.gender}\``,
              inline: true,
            },
            {
              name: `Birthday`,
              value: `\`${res.data.birthday}\``,
              inline: true,
            },
            {
              name: `Location`,
              value: `\`${res.data.location}\``,
              inline: true,
            },
            {
              name: `Joined`,
              value: `<t:${new Date(res.data.joined).getTime() / 1000}:R>`,
              inline: true,
            },
          ],
          thumbnail: {
            url: res.data.images.jpg.image_url,
            height: 0,
            width: 0,
          },
          footer: {
            text: `MyAnimeList`,
            icon_url: `https://upload.wikimedia.org/wikipedia/commons/7/7a/MyAnimeList_Logo.png`,
          },
        },
      ],
      ephemeral: true,
    });
  },
};
