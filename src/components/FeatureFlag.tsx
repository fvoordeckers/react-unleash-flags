import React, { Fragment, ReactNode, useContext } from 'react';
import { x86 } from 'murmurhash3js';
import { FlagsContext, FlagValue } from '..';

export type FeatureFlagComponentProps = {
    name: string,
    defaultValue?: boolean,
    invert?: boolean,
    children: ReactNode,
};

const checkFlagStrategies = (flag: FlagValue, userId: string | undefined) => {
    for (const strategy of flag.strategies) {
        switch (strategy.name) {
            case "default": {
                return true;
            }
            case "userWithId": {
                if (userId !== undefined && strategy.parameters.userIds.toString().split(/\s*,\s*/).includes(userId)) return true;
                break;
            }
            case "gradualRolloutUserId": {
                if (userId !== undefined) {
                    // reused from nodejs unleash client https://github.com/Unleash/unleash-client-node/blob/master/src/strategy/gradual-rollout-user-id.ts
                    const percentage = Number(strategy.parameters.percentage);
                    const groupId = strategy.parameters.groupId || '';
                    const normalizedUserId = (x86.hash32(`${groupId}:${userId}`) % 100) + 1;
                    if (percentage > 0 && normalizedUserId <= percentage) return true;
                }
                break;
            }
        }
    }
    return false;
}

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

    if (flag !== undefined) {

        if (flag.enabled && flag.strategies) {
            // check if strategies match
            const flagStrategyResult = checkFlagStrategies(flag, flagsClient ? flagsClient.getUserId() : undefined);
            isEnabled = flagStrategyResult;
        } else {
            // if the flag is disabled or no strategies are present then result is false
            isEnabled = false;
        }

        isEnabled = invert ? !isEnabled : isEnabled
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
