import FlagsClient, { FlagsConfig } from './FlagsClient';

describe('FlagsClient', () => {
  const config: FlagsConfig = {
    appName: 'production',
    instanceId: 'foo',
    url: 'https://foo.bar/api',
    uri: '/client/features',
  };
  const fakeFetch = jest.fn();

  beforeEach(() => {
    fakeFetch.mockReset();
    fakeFetch.mockImplementation(() => {
      return Promise.resolve({
        json: () => {
          return {
            features: [
              { name: 'hello', enabled: false },
              { name: 'world', enabled: true },
            ],
          };
        },
        ok: true,
      });
    });

    window.fetch = fakeFetch;
  });

  it('constructs a FlagApi with invalid config', () => {
    const invalidFlagsClient = () => new FlagsClient({} as FlagsConfig);
    expect(invalidFlagsClient).toThrowError('Provided config is incomplete!');
  });

  it('constructs a FlagApi without config', () => {
    const invalidFlagsClient = () => new FlagsClient((undefined as unknown) as FlagsConfig);
    expect(invalidFlagsClient).toThrowError('No config provided!');
  });

  it('constructs a FlagApi instance', () => {
    const flagsClient = new FlagsClient(config);
    expect(JSON.stringify(flagsClient.config)).toEqual(JSON.stringify(config));
  });

  it('constructs a FlagApi instance with custom uri', () => {
    const configWithCustomURI = { ...config, uri: 'custom_uri' };
    const flagsClient = new FlagsClient(configWithCustomURI);
    expect(JSON.stringify(flagsClient.config)).toEqual(JSON.stringify(configWithCustomURI));
  });

  it('fetches the initial data', async () => {
    const flagsClient = new FlagsClient(config);
    await flagsClient.init();

    expect(fakeFetch).toHaveBeenCalledWith('https://foo.bar/api/client/features', {
      headers: {
        'Content-Type': 'application/json',
        'UNLEASH-APPNAME': 'production',
        'UNLEASH-INSTANCEID': 'foo',
      },
      method: 'GET',
    });
  });

  it('returns all the flags', async () => {
    const flagsClient = new FlagsClient(config);
    await flagsClient.init();

    const flags = flagsClient.getFlags();

    expect(flags).toEqual([
      { name: 'hello', enabled: false },
      { name: 'world', enabled: true },
    ]);
  });

  it('returns a single flag by name', async () => {
    const flagsClient = new FlagsClient(config);
    await flagsClient.init();

    const flag = flagsClient.getFlag('hello');

    expect(flag).toEqual({ name: 'hello', enabled: false });
  });

  it('passes additional no additional headers', async () => {
    const flagsClient = new FlagsClient(config);
    await flagsClient.init();

    const call = fakeFetch.mock.calls[0];
    const headers = call[1].headers;
    expect(Object.keys(headers)).toHaveLength(3);
  });

  it('passes additional http headers', async () => {
    config.extraHttpHeaders = { Authorization: 'token123' };
    const flagsClient = new FlagsClient(config);
    await flagsClient.init();

    const call = fakeFetch.mock.calls[0];
    const headers = call[1].headers;
    expect(headers.Authorization).toEqual('token123');
  });
});
