export namespace ConsoleEvent {
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
