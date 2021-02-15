"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleEvent = void 0;
var ConsoleEvent;
(function (ConsoleEvent) {
    var eventList = {};
    function on(command, callback, options) {
        // @ts-ignore
        if (eventList[command] === undefined) {
            eventList[command] = [];
        }
        eventList[command].push({
            callback: callback,
            options: options
        });
    }
    ConsoleEvent.on = on;
    function emit(command, values) {
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
    ConsoleEvent.emit = emit;
})(ConsoleEvent = exports.ConsoleEvent || (exports.ConsoleEvent = {}));
//# sourceMappingURL=event.js.map