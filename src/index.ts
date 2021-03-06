let eventList: any | any[] = {
    commands: {},
    global: {}
};

const eventObj: any = {
    on: function on(command: string, callback: CommandCallback, options: CommandOptions | undefined) {
        // @ts-ignore
        if (eventList[command] === undefined) {
            eventList[command] = [];
        }
        eventList[command].push({
            callback: callback,
            options: options
        });
    },
    emit: function emit(command: string, values: CommandArgs) {
        let runCallback: CommandCallback[] | null[] = [];
        if (eventList[command] === undefined) {
            return;
        }
        for (let k: number = 0; k < values.args.length; k++) {
            for (let i: number = 0; i < eventList[command].length; i++) {

                let event: EventList = eventList[command][i];
                let options: CommandOptions = event.options;
                if (options === undefined) {
                    runCallback[i] = event.callback;
                } else if (typeof values.args[k] === options.overload[k].type) {
                    runCallback[i] = event.callback;
                } else {
                    runCallback[i] = null;
                }
            }
        }

        for (let i: number = 0; i < runCallback.length; i++) {
            if (runCallback[i] !== null) {
                // @ts-ignore
                runCallback[i](values);
            }
        }
    }
}

const callbackEvent: CallbackEvent  = {
    on: function (command:string, callback: CommandCallback, options: CommandOptions | undefined = undefined) {
        eventObj.on(command, callback, options);
    }
}

export const simpleConsole: SimpleConsole = {
    on: (event: "ready", callback: Callback) => {
        function emit() {
            let args: Array<string> = [];
            for (let i in process.argv) {
                if (i === "0" || i === "1" || i === "2") {
                    continue;
                } else {
                    let value: any = process.argv[i];
                    value = (value === "true") ? true : value;
                    value = (value === "false") ? false : value;

                    let int = parseFloat(value);
                    value = (isNaN(int)) ? value : int;

                    try {
                        let obj = JSON.parse(value);
                        value = (typeof obj === "object") ? obj : value;
                    } catch (err) {
                    }

                    args.push(value);
                }
            }
            const values: CommandArgs = {
                cwd: process.cwd(),
                args: args
            }

            eventObj.emit(process.argv[2], values);
        }

        switch (event) {
            case "ready":
                callback(callbackEvent);
                emit();
                break;
        }
    }
}

interface SimpleConsole {
    on(event: "ready", callback: Callback): void
}

interface CommandArgs {
    args: any[];
    cwd: string;
}

interface CommandCallback {
    (options: CommandArgs): void;
}

interface CommandOptions {
    overload: Overload[];
}

interface Overload {
    type: "number" | "string" | "object" | "boolean";
}

interface EventList {
    callback: CommandCallback;
    options: CommandOptions;
}

interface Callback {
    (event: CallbackEvent): void
}

interface CallbackEvent {
    on(command: string, callback: CommandCallback, options?: CommandOptions | undefined): void;
}

