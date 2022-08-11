const { connect } = require("mongoose");

class Database {
    async createConnection(url) {
        const start = Date.now();

        await connect(url, {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(() => {
                console.log(
                    "[DATABASE]".blue +
                        ` Connected To Database | System: ${process.platform} | Latency: ${Math.round(Date.now() - start)}ms`.white
                );
            })
            .catch(( )=> null);
    }
}

module.exports = Database;
