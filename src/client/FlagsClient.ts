export type FlagsConfig = {
  appName: string;
  instanceId: string;
  url: string;
};

export type FlagValue = {
  description: string;
  enabled: boolean;
  name: string;
  strategies: Array<{
    name: string;
    parameters: { [key: string]: string | number | boolean };
  }>;
};

class FlagsClient {
  private flags: FlagValue[] = [];

  constructor(public config: FlagsConfig) {
    this.checkValidInstance();
  }

  /**
   * Populate the flags
   */
  public async init() {
    await this.fetchFlags();
  }

  /**
   * Fetch all the flags for the current application
   */
  public getFlags(): FlagValue[] {
    return this.flags;
  }

  /**
   * Get a single Flag
   * @param flagName the name of the flag
   */
  public getFlag(flagName: string): FlagValue | undefined {
    return this.flags.filter(flag => flag.name === flagName)[0];
  }

  /**
   * Fetch all the flags from the API and store them on the flags prop
   */
  private async fetchFlags() {
    const { url, appName, instanceId } = this.config;
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
      'UNLEASH-APPNAME': appName || '',
      'UNLEASH-INSTANCEID': instanceId || '',
    };

    const response = await fetch(`${url}/client/features/`, {
      headers,
      method: 'GET',
    });

    try {
      const json = await response.json();
      this.flags = json.features;
    } catch {
      // no json, return nothing
      this.flags = [];
    }
  }

  /**
   * Check if config is complete
   */
  private checkValidInstance() {
    if (!this.config) {
      throw Error('No config provided!');
    }

    const { url, appName, instanceId } = this.config;
    if (!url || !appName || !instanceId) {
      throw Error('Provided config is incomplete!');
    }
  }
}

export default FlagsClient;
