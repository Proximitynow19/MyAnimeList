import { Client, Collection } from "discord.js";

export class MAL_Client extends Client {
  public commands: Collection<string, any> = new Collection();
}
