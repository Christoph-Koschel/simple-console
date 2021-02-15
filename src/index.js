"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Console = void 0;
var event_1 = require("./event");
var Console = /** @class */ (function () {
    function Console(process) {
        this.process = process;
    }
    Console.prototype.emit = function () {
        var process = this.process;
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
        event_1.ConsoleEvent.emit(process.argv[2], values);
    };
    Console.prototype.on = function (keyword, callback, options) {
        if (options === void 0) { options = undefined; }
        event_1.ConsoleEvent.on(keyword, callback, options);
    };
    return Console;
}());
exports.Console = Console;
//# sourceMappingURL=index.js.map