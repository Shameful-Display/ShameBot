class MessageEmbed {
  constructor() {
    this.title = undefined;
    this.color = undefined;
    this.description = undefined;
    this.author = undefined;
    this.url = undefined;
    this.thumbnail = undefined;
    this.image = undefined;
    this.footer = undefined;
    this.fields = [];
  }
  setTitle(t) { this.title = t; return this; }
  setColor(c) { this.color = c; return this; }
  setDescription(d) { this.description = d; return this; }
  setAuthor(name, iconURL) { this.author = { name, iconURL }; return this; }
  setURL(u) { this.url = u; return this; }
  setThumbnail(t) { this.thumbnail = t; return this; }
  setImage(i) { this.image = i; return this; }
  setFooter(f) { this.footer = f; return this; }
  addField(name, value, inline) { this.fields.push({ name, value, inline }); return this; }
  addFields(...fields) { this.fields.push(...fields); return this; }
}

class MessageAttachment {
  constructor(path) { this.path = path; }
}

class Client {}

module.exports = { MessageEmbed, MessageAttachment, Client };