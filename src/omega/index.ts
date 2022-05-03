import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { Inputs } from './input';

export class OmegaHandler {
  public frame: number;
  public delay: number;
  private readonly path: string;
  private readonly romPath: string;
  inputs: Inputs;
  private _refresh: boolean;

  constructor(path: string, romPath: string) {
    this.frame = 12;
    this.delay = 30;
    this.path = path;
    this.romPath = romPath;
    this.inputs = new Inputs();
    this._refresh = false;
  }

  refresh() {
    this._refresh = true;
  }

  run = () => {
    this._refresh = false;
    const frames = `-f ${this.frame}`;
    const delays = `-d ${this.delay}`;

    const keys = this.inputs.updated() ? `-k ${this.inputs}` : '';
    this.inputs.clear();

    const command = `${this.path} ${frames} ${delays} ${keys} ${this.romPath}`;

    console.log(`Execute: ${command}`);
    execSync(command);
  };

  screen = (): {
    data: Buffer;
  } => {
    let statePath = '';
    switch (true) {
      case this.romPath.endsWith('.gbc'):
        statePath = this.romPath.replaceAll('.gbc', '.ss0');
        break;
      case this.romPath.endsWith('.gb'):
        statePath = this.romPath.replaceAll('.gb', '.ss0');
        break;
    }
    const data = readFileSync(statePath);

    return {
      data: data,
    };
  };

  updated = (): boolean => {
    return this._refresh || this.inputs.updated();
  };
}

export * from './input';
