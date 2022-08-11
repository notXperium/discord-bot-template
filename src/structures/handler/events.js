const { Events } = require("../misc/validation");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);

module.exports = async (client) => {
    
    const paths = await PG(`${process.cwd()}/src/events/**/*.js`);
    paths.map(async (_) => {
        const event = require(_);

        if (!event.name || !Events.includes(event?.name))
            return console.log("[EVENTS]".blue + " Invalid Event Name ".white + _.white);

        if (event.once) {
            client.once(event.name, (...args) => event.run(...args, client));
        } else {
            client.on(event.name, (...args) => event.run(...args, client));
        }
    });

    if (paths.length) console.log("[EVENTS]".blue + " Events Loaded!".white);
};
