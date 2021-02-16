"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleConsole = void 0;
var eventList = {
    commands: {},
    global: {}
};
var eventObj = {
    on: function on(command, callback, options) {
        // @ts-ignore
        if (eventList[command] === undefined) {
            eventList[command] = [];
        }
        eventList[command].push({
            callback: callback,
            options: options
        });
    },
    emit: function emit(command, values) {
        var runCallback = [];
        if (eventList[command] === undefined) {
            return;
        }
        for (var k = 0; k < values.args.length; k++) {
            for (var i = 0; i < eventList[command].length; i++) {
                var event = eventList[command][i];
                var options = event.options;
                if (options === undefined) {
                    runCallback[i] = event.callback;
                }
                else if (typeof values.args[k] === options.overload[k].type) {
                    runCallback[i] = event.callback;
                }
                else {
                    runCallback[i] = null;
                }
            }
        }
        for (var i = 0; i < runCallback.length; i++) {
            if (runCallback[i] !== null) {
                // @ts-ignore
                runCallback[i](values);
            }
        }
    }
};
var callbackEvent = {
    on: function (command, callback, options) {
        if (options === void 0) { options = undefined; }
        eventObj.on(command, callback, options);
    }
};
exports.simpleConsole = {
    on: function (event, callback) {
        function emit() {
            var args = [];
            for (var i in process.argv) {
                if (i === "0" || i === "1" || i === "2") {
                    continue;
                }
                else {
                    var value = process.argv[i];
                    value = (value === "true") ? true : value;
                    value = (value === "false") ? false : value;
                    var int = parseFloat(value);
                    value = (isNaN(int)) ? value : int;
                    try {
                        var obj = JSON.parse(value);
                        value = (typeof obj === "object") ? obj : value;
                    }
                    catch (err) {
                    }
                    args.push(value);
                }
            }
            var values = {
                cwd: process.cwd(),
                args: args
            };
            eventObj.emit(process.argv[2], values);
        }
        switch (event) {
            case "ready":
                callback(callbackEvent);
                emit();
                break;
        }
    }
};
//# sourceMappingURL=index.js.map