import { PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';

import { useParams } from 'react-router-dom';

import { ExplorerLink } from '../cluster/cluster-ui';
import { AppHero, ellipsify } from '../ui/ui-layout';
import {
  AccountBalance,
  AccountButtons,
  AccountTokens,
  AccountTransactions,
} from './account-ui';

