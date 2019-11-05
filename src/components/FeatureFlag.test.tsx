import { mount } from 'enzyme';
import React, { ReactNode } from 'react';
import FlagsClient, { FlagValue } from '../client/FlagsClient';
import FeatureFlag from './FeatureFlag';
import FlagsContext from './FlagsContext';

describe('FeatureFlag', () => {
    const config = {
        appName: 'production',
        instanceId: 'foo',
        url: 'https://foo.bar/api',
    };
    let flagsClient: FlagsClient;
    const fakeFetch = jest.fn();

    const withFlagContext = (children: ReactNode) => (
        <FlagsContext.Provider value={flagsClient}>
            {children}
        </FlagsContext.Provider>
    );

    beforeAll(async (cb) => {
        fakeFetch.mockImplementation(() => {
            return Promise.resolve({
                json: () => ({}),
                ok: true,
            });
        });

        window.fetch = fakeFetch;

        flagsClient = new FlagsClient(config);
        await flagsClient.init();
        cb();
    });

    it('renders an enabled feature', () => {
        flagsClient.getFlag = jest.fn().mockImplementation((name: string) => {
            return { name, enabled: true } as FlagValue;
        });

        const rendered = mount(withFlagContext(<FeatureFlag name='foo'>bar</FeatureFlag>));
        expect(rendered.contains('bar')).toBeTruthy();
    })

    it('renders a disabled feature', () => {
        flagsClient.getFlag = jest.fn().mockImplementation((name: string) => {
            return { name, enabled: false } as FlagValue;
        });

        const rendered = mount(withFlagContext(<FeatureFlag name='foo'>bar</FeatureFlag>));
        expect(rendered.contains('bar')).toBeFalsy();
    })

    it('renders the default fallback value', () => {
        flagsClient.getFlag = jest.fn().mockImplementation((name: string) => {
            return undefined;
        });

        const rendered = mount(withFlagContext(<FeatureFlag name='foo'>bar</FeatureFlag>));
        expect(rendered.contains('bar')).toBeFalsy();
    })

    it('renders the default false value', () => {
        flagsClient.getFlag = jest.fn().mockImplementation((name: string) => {
            return undefined;
        });

        const rendered = mount(withFlagContext(<FeatureFlag name='foo' defaultValue={false}>bar</FeatureFlag>));
        expect(rendered.contains('bar')).toBeFalsy();
    })

    it('renders the default true value', () => {
        flagsClient.getFlag = jest.fn().mockImplementation((name: string) => {
            return undefined;
        });

        const rendered = mount(withFlagContext(<FeatureFlag name='foo' defaultValue={true}>bar</FeatureFlag>));
        expect(rendered.contains('bar')).toBeTruthy();
    })

    it('renders an inverted feature', () => {
        flagsClient.getFlag = jest.fn().mockImplementation((name: string) => {
            return { enabled: false } as FlagValue;
        });

        const rendered = mount(withFlagContext(<FeatureFlag name='foo' invert={true}>bar</FeatureFlag>));
        expect(rendered.contains('bar')).toBeTruthy();
    })
});
