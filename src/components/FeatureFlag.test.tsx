import { shallow } from 'enzyme';
import React from 'react';
import { FlagValue } from '../client/FlagsClient';
import * as useFlag from '../hooks/useFlag';
import FeatureFlag from './FeatureFlag';

describe('FeatureFlag', () => {

    it('renders an enabled feature', () => {
        jest.spyOn(useFlag, 'default').mockImplementation((name: string) => {
            return { name, enabled: true } as FlagValue;
        });

        const rendered = shallow(<FeatureFlag name='foo'>bar</FeatureFlag>);
        expect(rendered.contains('bar')).toBeTruthy();
    })

    it('renders an disabled feature', () => {
        jest.spyOn(useFlag, 'default').mockImplementation((name: string) => {
            return { name, enabled: false } as FlagValue;
        });

        const rendered = shallow(<FeatureFlag name='foo'>bar</FeatureFlag>);
        expect(rendered.contains('bar')).toBeFalsy();
    })

    it('renders the default fallback value', () => {
        jest.spyOn(useFlag, 'default').mockImplementation(() => {
            return undefined;
        });

        const rendered = shallow(<FeatureFlag name='foo'>bar</FeatureFlag>);
        expect(rendered.contains('bar')).toBeFalsy();
    })
    
    it('renders the default false value', () => {
        jest.spyOn(useFlag, 'default').mockImplementation(() => {
            return undefined;
        });

        const rendered = shallow(<FeatureFlag name='foo' defaultValue={false}>bar</FeatureFlag>);
        expect(rendered.contains('bar')).toBeFalsy();
    })

    it('renders the default false value', () => {
        jest.spyOn(useFlag, 'default').mockImplementation(() => {
            return undefined;
        });
    
        const rendered = shallow(<FeatureFlag name='foo' defaultValue={true}>bar</FeatureFlag>);
        expect(rendered.contains('bar')).toBeTruthy();
    })

    it('renders an inverted feature', () => {
        jest.spyOn(useFlag, 'default').mockImplementation(() => {
            return { enabled: false } as FlagValue;
        });
    
        const rendered = shallow(<FeatureFlag name='foo' invert={true}>bar</FeatureFlag>);
        expect(rendered.contains('bar')).toBeTruthy();
    })
});
