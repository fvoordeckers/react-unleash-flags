import { useContext, useEffect, useState } from 'react';
import { FlagValue } from '../client/FlagsClient';
import FlagsContext from '../components/FlagsContext';

/**
 * A hook to get the value of a flag
 * @param flagName the name of the flag
 */
const useFlag = (flagName: string) => {
  const [flagValue, setFlagValue] = useState<FlagValue>();
  const flagsClient = useContext(FlagsContext);

  useEffect(() => {
    if (flagsClient) {
      if (!flagsClient.getFlags().length) {
        // refresh the current flags set if there are no flags yet
        const refresh = async () => {
          await flagsClient.init();
          const refreshedFlag = flagsClient.getFlag(flagName);
          setFlagValue(refreshedFlag);
        };
        refresh();
      } else {
        // return the current flag if available
        const flag = flagsClient.getFlag(flagName);
        setFlagValue(flag);
      }
    }
  }, [flagsClient, flagName]);
  return flagValue;
};

export default useFlag;
