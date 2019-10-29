import { useContext, useEffect, useState } from 'react';
import { FlagValue } from '../api/FlagsApi';
import FlagsContext from '../components/FlagsContext';

/**
 * A hook to get the value of a flag
 * @param flagName the name of the flag
 */
const useFlag = (flagName: string) => {
    const [flagValue, setFlagValue] = useState<FlagValue>();
    const flagsApiCtx = useContext(FlagsContext);

    useEffect(() => {

        if (flagsApiCtx) {
            if (!flagsApiCtx.getFlags().length) {
                // refresh the current flags set if there are no flags yet
                const refresh = async () => {
                    await flagsApiCtx.init();
                    const refreshedFlag = flagsApiCtx.getFlag(flagName);
                    setFlagValue(refreshedFlag);
                };
                refresh();
            } else {
                // return the current flag if available
                const flag = flagsApiCtx.getFlag(flagName);
                setFlagValue(flag);
            }
        }
    }, [flagsApiCtx, flagName]);
    return flagValue;
  };

export default useFlag;
