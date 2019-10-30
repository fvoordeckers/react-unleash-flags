import { createContext } from 'react';
import FlagsClient from '../client/FlagsClient';

/**
 * The flags context provider, will use env settings as default values
 */
const FlagsContext = createContext<FlagsClient | undefined>(undefined);

export default FlagsContext;
