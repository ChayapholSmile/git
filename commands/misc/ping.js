module.exports = {
  name: 'ping',
  description: 'ตอบกลับด้วยค่าปิงของบอท!(เล่นปิงปอง)',

  callback: async (client, interaction) => {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const ping = reply.createdTimestamp - interaction.createdTimestamp;

    interaction.editReply(
      `ปอง!  ค่าปิงของ ไคลเอนต์ ${ping} มิลลิวินาที | ซ็อกเก็ต ${client.ws.ping} มิลลิวินาที`
    );
  },
};
