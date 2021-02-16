const {simpleConsole} = require("./src/index");
simpleConsole.on("ready", (event) => {
    event.on("wasd",options => {
        options.args;
    });
});
