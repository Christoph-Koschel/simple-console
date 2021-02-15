import {ConsoleEvent} from "./event";

export namespace SimpleConsole {

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
}
