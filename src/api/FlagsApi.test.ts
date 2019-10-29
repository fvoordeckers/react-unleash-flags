import FlagsApi, { FlagsConfig } from './FlagsApi';

describe('FlagsApi', () => {
    const config = {
        appName: 'production',
        instanceId: 'foo',
        url: 'https://foo.bar/api',
    }
    const fakeFetch = jest.fn();

    beforeEach(() => {
        fakeFetch.mockImplementation(() => {
            return Promise.resolve({
                json: () => { 
                    return { features: [
                        { name: 'hello', enabled: false },
                        { name: 'world', enabled: true }
                    ]}
                },
                ok: true
            });
        });

        window.fetch = fakeFetch;
    });

    it('constructs a FlagApi with invalid config', () => {
        const invalidFlagsApi = () => new FlagsApi({} as FlagsConfig);
        expect(
            invalidFlagsApi
        ).toThrowError('Provided config is incomplete!');
    });

    it('constructs a FlagApi without config', () => {
        const invalidFlagsApi = () => new FlagsApi((undefined as unknown) as FlagsConfig);
        expect(
            invalidFlagsApi
        ).toThrowError('No config provided!');
    });

    it('constructs a FlagApi instance', () => {
        const flagsApi = new FlagsApi(config);
        expect(JSON.stringify(flagsApi.config)).toEqual(JSON.stringify(config));
    });

    it('fetches the initial data', async () => {
        const flagsApi = new FlagsApi(config);
        await flagsApi.init();

        expect(fakeFetch).toHaveBeenCalledWith('https://foo.bar/api/client/features/', {
            headers: {
                'Content-Type': 'application/json',
                'UNLEASH-APPNAME': 'production',
                'UNLEASH-INSTANCEID': 'foo'
            },
            method: 'GET'
        });
    });

    it('returns all the flags', async () => {
        const flagsApi = new FlagsApi(config);
        await flagsApi.init();

        const flags = flagsApi.getFlags();

        expect(flags).toEqual([
            { name: 'hello', enabled: false },
            { name: 'world', enabled: true }
        ]);
    });

    it('returns a single flag by name', async () => {
        const flagsApi = new FlagsApi(config);
        await flagsApi.init();

        const flag = flagsApi.getFlag('hello');

        expect(flag).toEqual({ name: 'hello', enabled: false });
    });
});
