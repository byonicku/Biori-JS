// const { default: axios } = require("axios");
// const { SlashCommandBuilder } = require("discord.js");
// const { Pagination } = require("pagination.djs");

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("free_games")
//     .setDescription("Get a list of free games from Epic Games Store!"),

//   async execute(interaction) {
//     try {
//       const pagination = new Pagination(interaction)
//         .setLimit(10)
//         .setColor(interaction.member.displayHexColor)
//         .setFooter({
//           text: `Requested by ${interaction.member.displayName}`,
//           iconURL: interaction.user.displayAvatarURL(),
//         });

//       const mapToEmbed = (data, index) => ({
//         name: index + 1 + ". " + data.keterangan,
//         value: new Intl.DateTimeFormat("id-ID", { dateStyle: "full" }).format(
//           new Date(data.tanggal)
//         ),
//       });

//       const response = await axios.get(
//         "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions",
//         {
//           params: { locale: "ID", includeAll: "true" },
//           headers: { "Access-Control-Allow-Origin": "*" },
//         }
//       );

//       console.log(response.data);

//       const mappedResponse = response.map(mapToEmbed);

//       pagination.setFields(mappedHolidays);

//       pagination.setTitle("Here are the list of holidays in Indonesia! 🎊");

//       if (year && month) {
//         pagination.setTitle(
//           `Here are the list of holidays in Indonesia for ${new Intl.DateTimeFormat(
//             "id-ID",
//             { month: "long" }
//           ).format(new Date(year, month - 1))} ${year}! 🎊`
//         );
//       } else if (year) {
//         pagination.setTitle(
//           `Here are the list of holidays in Indonesia for ${year}! 🎊`
//         );
//       } else if (month) {
//         pagination.setTitle(
//           `Here are the list of holidays in Indonesia for month ${
//             bulan[month - 1]
//           }! 🎊`
//         );
//       }

//       pagination.paginateFields();

//       pagination.render();
//     } catch (error) {
//       await interaction.reply({
//         content:
//           "Sorry, I couldn't fetch the holidays. Please try again later.",
//         ephemeral: true,
//       });
//     }
//   },
// };
