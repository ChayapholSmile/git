const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: 'คุณสามารถใช้คำสั่งนี้ได้เฉพาะในเซิร์ฟเวอร์เท่านั้น.',
        ephemeral: true,
      });
      return;
    }

    const targetUserId = interaction.options.get('user')?.value || interaction.member.id;

    await interaction.deferReply();

    const user = await User.findOne({ userId: targetUserId, guildId: interaction.guild.id });

    if (!user) {
      interaction.editReply(`<@${targetUserId}> ยังไม่มีโปรไฟล์.`);
      return;
    }

    interaction.editReply(
      targetUserId === interaction.member.id
        ? `ยอดเงินของคุณคือ **${user.balance}** บาท`
        : `ยอดเงินของ <@${targetUserId}> คือ **${user.balance}** บาท`
    );
  },

  name: 'balance',
  description: 'ดูยอดเงินของคุณหรือของผู้อื่น',
  options: [
    {
      name: 'user',
      description: 'ผู้ใช้ที่คุณต้องการดูยอดเงิน.',
      type: ApplicationCommandOptionType.User,
    },
  ],
};
