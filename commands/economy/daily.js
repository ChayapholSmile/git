const { Client, Interaction } = require('discord.js');
const User = require('../../models/User');
const dailyAmount = 1000;

module.exports = {
  name: 'daily',
  description: 'รับรางวัลรายวันของคุณ!',
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

    try {
      await interaction.deferReply();

      const query = {
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      };

      let user = await User.findOne(query);

      if (user) {
        const lastDailyDate = user.lastDaily.toDateString();
        const currentDate = new Date().toDateString();

        if (lastDailyDate === currentDate) {
          interaction.editReply(
            'คุณได้รับรางวัลรายวันของคุณแล้ววันนี้ กลับมาใหม่พรุ่งนี้!'
          );
          return;
        }
        
        user.lastDaily = new Date();
      } else {
        user = new User({
          ...query,
          lastDaily: new Date(),
        });
      }

      user.balance += dailyAmount;
      await user.save();

      interaction.editReply(
        `${dailyAmount} บาท ถูกเพิ่มในยอดเงินของคุณ ยอดเงินใหม่ของคุณคือ ${user.balance}`
      );
    } catch (error) {
      interaction.editReply(`Error /daily: ${error}`);
    }
  },
};
