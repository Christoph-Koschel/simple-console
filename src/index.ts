export class Console {
    private readonly process: NodeJS.Process;

    public constructor(process: NodeJS.Process) {
        this.process = process;
    }

    public emit() {
        let process: NodeJS.Process = this.process;
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
        const values: ConsoleEvent.EventValues = {
            cwd: process.cwd(),
            args: args
        }

        ConsoleEvent.emit(process.argv[2], values);
    }

    public on(keyword: string, callback: ConsoleEvent.EventCallback, options: ConsoleEvent.EventOptions | undefined = undefined) {
        ConsoleEvent.on(keyword, callback, options);
    }
}

namespace ConsoleEvent {
    let eventList: any | any[] = {};

    export function on(command: string, callback: EventCallback, options: EventOptions | undefined) {
        // @ts-ignore
        if (eventList[command] === undefined) {
            eventList[command] = [];
        }
        eventList[command].push({
            callback: callback,
            options: options
        });

    }

    export function emit(command: string, values: EventValues) {
        let runCallback: EventCallback[] | null[] = [];
        if (eventList[command] === undefined) {
            return;
        }
        for (let k: number = 0; k < values.args.length; k++) {
            for (let i: number = 0; i < eventList[command].length; i++) {

                let event: EventList = eventList[command][i];
                let options: EventOptions = event.options;
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

    export interface EventValues {
        args: any[];
        cwd: string;
    }

    export interface EventCallback {
        (values: EventValues): void;
    }

    export interface EventOptions {
        overload: Overload[];
    }

    interface Overload {
        type: "number" | "string" | "object" | "boolean";
    }

    interface EventList {
        callback: EventCallback;
        options: EventOptions;
    }
}
