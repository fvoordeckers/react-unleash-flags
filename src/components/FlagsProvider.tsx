import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import FlagsClient, { FlagsConfig } from '../client/FlagsClient';
import FlagsContext from './FlagsContext';

export type FlagsProviderProps = {
    children: ReactNode,
    config?: FlagsConfig | {}
};

/**
 * The flags provider, wraps a component with the context
 * and initializes the unleash api
 */
const FlagsProvider = ({children, config}: FlagsProviderProps) => {

    // use a memo to store the config to prevent rerender loops
    const defaultConfig = useMemo(() => ({
        // the name of the current app
        appName: process.env.REACT_APP_FLAGS_CTX_APP_NAME || '',
        // the unleash instance ID (typically just one instance)
        instanceId: process.env.REACT_APP_FLAGS_CTX_INSTANCE_ID || '',
        // url to the unleash API
        url: process.env.REACT_APP_FLAGS_CTX_URL || '',
    }), []);

    // store the api instance on the state
    const [flagsClient, setFlagsClient] = useState<FlagsClient>();

    // initialize the api instance
    const initState = useCallback(async () => {
        const flagsClientInstance = new FlagsClient({...defaultConfig, ...config });
        await flagsClientInstance.init();

        setFlagsClient(flagsClientInstance);
    }, [defaultConfig, config]);

    // call the init on load
    useEffect(() => {
        initState();
    }, [initState]);

    return (
        <FlagsContext.Provider value={flagsClient}>
            {children}
        </FlagsContext.Provider>
    );
};

export default FlagsProvider;
