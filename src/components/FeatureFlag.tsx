import React, { Fragment, ReactNode, useContext } from 'react';
import { FlagsContext } from '..';

export type FeatureFlagComponentProps = {
    name: string,
    defaultValue?: boolean,
    invert?: boolean,
    children: ReactNode,
};

/**
 * FeatureFlag component to use to wrap JSX
 *
 * @param name the name of the flag
 * @param default the default value used before the flag is fetched, default = false
 * @param invert if the component should render when its disabled and hide when enabled
 */
const FeatureFlag = (
    { name, defaultValue = false, invert = false, children }: FeatureFlagComponentProps
) => {
    // get the flagsClient from the context
    const flagsClient = useContext(FlagsContext);

    // load the flag using the useFlag hook
    const flag = flagsClient ? flagsClient.getFlag(name) : undefined;

    let isEnabled = defaultValue;

    // set the flag value if found and check if inverted
    if (flag !== undefined) {
        isEnabled = invert ? !flag.enabled : flag.enabled;
    }

    // if the child element is a function, we'll return the flag as a param of that function
    // otherwise we'll render the children as jsx or null based on the flag value
    return (
        <Fragment>
            {typeof children === 'function' ? children(flag) : isEnabled ? children : null}
        </Fragment>
    );
};

export default FeatureFlag;
