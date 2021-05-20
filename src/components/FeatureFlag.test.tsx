import { mount } from 'enzyme';
import React, { ReactNode } from 'react';
import FlagsClient, { FlagValue } from '../client/FlagsClient';
import FeatureFlag from './FeatureFlag';
import FlagsContext from './FlagsContext';

describe('FeatureFlag', () => {
    const config = {
        appName: 'production',
        instanceId: 'foo',
        host: 'https://foo.bar/api',
        userIdHook: () => '123'
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

    it('renders an enabled feature with the default srategy', () => {
        flagsClient.getFlag = jest.fn().mockImplementation((name: string) => {
            return { name, enabled: true, strategies: [{name: 'default'}] } as FlagValue;
        });

        const rendered = mount(withFlagContext(<FeatureFlag name='foo'>bar</FeatureFlag>));
        expect(rendered.contains('bar')).toBeTruthy();
    })

    it('renders a disabled feature regardless of strategy', () => {
        flagsClient.getFlag = jest.fn().mockImplementation((name: string) => {
            return { name, enabled: false , strategies: [{name: 'default'}]} as FlagValue;
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
            return { name, enabled: false, strategies: [{name: 'default'}] } as FlagValue;
        });

        const rendered = mount(withFlagContext(<FeatureFlag name='foo' invert={true}>bar</FeatureFlag>));
        expect(rendered.contains('bar')).toBeTruthy();
    })

    it('renders a true value using the userWithId strategy', () => {
        flagsClient.getFlag = jest.fn().mockImplementation((name: string) => {
            return { name, enabled: true, strategies: [{name: 'userWithId', parameters: {userIds: '123'}}] } as FlagValue;
        });

        const rendered = mount(withFlagContext(<FeatureFlag name='foo'>bar</FeatureFlag>));
        expect(rendered.contains('bar')).toBeTruthy();
    })

    it('renders a true value using the userWithId strategy with a list of userids', () => {
        flagsClient.getFlag = jest.fn().mockImplementation((name: string) => {
            return { name, enabled: true, strategies: [{name: 'userWithId', parameters: {userIds: '456, 123'}}] } as FlagValue;
        });

        const rendered = mount(withFlagContext(<FeatureFlag name='foo'>bar</FeatureFlag>));
        expect(rendered.contains('bar')).toBeTruthy();
    })

    it('renders the default value using the userWithId strategy when the user is not in the list', () => {
        flagsClient.getFlag = jest.fn().mockImplementation((name: string) => {
            return { name, enabled: true, strategies: [{name: 'userWithId', parameters: {userIds: '456, 789'}}] } as FlagValue;
        });

        const rendered = mount(withFlagContext(<FeatureFlag name='foo'>bar</FeatureFlag>));
        expect(rendered.contains('bar')).toBeFalsy();
    })

    it('renders a true value using the gradualRolloutUserId strategy', () => {
        flagsClient.getFlag = jest.fn().mockImplementation((name: string) => {
            return { name, enabled: true, strategies: [{name: 'gradualRolloutUserId', parameters: {percentage: 100, groupId: 'default'}}] } as FlagValue;
        });

        const rendered = mount(withFlagContext(<FeatureFlag name='foo'>bar</FeatureFlag>));
        expect(rendered.contains('bar')).toBeTruthy();
    })

    it('renders a false value using the gradualRolloutUserId strategy when the user id is not within percentage', () => {
        flagsClient.getFlag = jest.fn().mockImplementation((name: string) => {
            return { name, enabled: true, strategies: [{name: 'gradualRolloutUserId', parameters: {percentage: 50, groupId: 'default'}}] } as FlagValue;
        });

        const rendered = mount(withFlagContext(<FeatureFlag name='foo'>bar</FeatureFlag>));
        expect(rendered.contains('bar')).toBeFalsy();
    })

    it('renders a true value when there is one match from multiple startegies', () => {
        flagsClient.getFlag = jest.fn().mockImplementation((name: string) => {
            return { name, enabled: true, strategies: [{name: 'userWithId', parameters: {userIds: '456, 789'}},{name: 'userWithId', parameters: {userIds: '123'}}] } as FlagValue;
        });

        const rendered = mount(withFlagContext(<FeatureFlag name='foo'>bar</FeatureFlag>));
        expect(rendered.contains('bar')).toBeTruthy();
    })

});
