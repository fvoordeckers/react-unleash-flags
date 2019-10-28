import { createContext } from 'react';
import FlagsApi from '../api/FlagsApi';

/**
 * The flags context provider, will use env settings as default values
 */
const FlagsContext = createContext<FlagsApi | undefined>(undefined);

export default FlagsContext;
