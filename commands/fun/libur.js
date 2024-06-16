const { default: axios } = require("axios");
const { SlashCommandBuilder } = require("discord.js");
const { Pagination } = require("pagination.djs");

const bulan = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("libur")
    .setDescription("Get a list of holidays in Indonesia!")
    .addIntegerOption((option) =>
      option
        .setName("year")
        .setDescription("Pick a year to see the holidays!")
        .setRequired(false)
        .setMaxValue(new Date().getFullYear())
        .setMinValue(1900)
    )
    .addIntegerOption((option) =>
      option
        .setName("month")
        .setDescription("Pick a month to see the holidays!")
        .setRequired(false)
        .setMaxValue(12)
        .setMinValue(1)
    ),

  async execute(interaction) {
    const year = interaction.options.getInteger("year");
    const month = interaction.options.getInteger("month");

    try {
      const pagination = new Pagination(interaction)
        .setLimit(10)
        .setColor(interaction.member.displayHexColor)
        .setFooter({
          text: `Requested by ${interaction.member.displayName}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      const mapToEmbed = (holiday, index) => ({
        name: index + 1 + ". " + holiday.keterangan,
        value: new Intl.DateTimeFormat("id-ID", { dateStyle: "full" }).format(
          new Date(holiday.tanggal)
        ),
      });

      let query = "https://dayoffapi.vercel.app/api";

      if (year && month) {
        query += `?year=${year}`;
        query += `${query ? "&" : ""}month=${month}`;
      } else if (year) {
        query += `?year=${year}`;
      } else if (month) {
        query += `?month=${month}`;
      }

      const { data: holidays } = await axios.get(query, {});

      if (!holidays.length) {
        await interaction.reply({
          content: "There are no holidays for this year or month.",
          ephemeral: true,
        });
      }

      const mappedHolidays = holidays.map(mapToEmbed);

      pagination.setFields(mappedHolidays);

      pagination.setTitle("Here are the list of holidays in Indonesia! 🎊");

      if (year && month) {
        pagination.setTitle(
          `Here are the list of holidays in Indonesia for ${new Intl.DateTimeFormat(
            "id-ID",
            { month: "long" }
          ).format(new Date(year, month - 1))} ${year}! 🎊`
        );
      } else if (year) {
        pagination.setTitle(
          `Here are the list of holidays in Indonesia for ${year}! 🎊`
        );
      } else if (month) {
        pagination.setTitle(
          `Here are the list of holidays in Indonesia for month ${
            bulan[month - 1]
          }! 🎊`
        );
      }

      pagination.paginateFields();

      pagination.render();
    } catch (error) {
      await interaction.reply({
        content:
          "Sorry, I couldn't fetch the holidays. Please try again later.",
        ephemeral: true,
      });
    }
  },
};
