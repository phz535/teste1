module.exports = {
  name: "ready",
  once: true,

  execute(client) {
    console.log(`✅ Nexa Bot online como ${client.user.tag}`);
    client.user.setPresence({
      activities: [{ name: "Nexa Store", type: 3 }],
      status: "online"
    });
  }
};
