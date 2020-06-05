// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakingAccount } from '@polkadot/api-derive/types';

import React from 'react';
import { FormatBalance } from '@polkadot/react-query';
import BN from 'bn.js';

interface Props {
  className?: string;
  stakingInfo?: DeriveStakingAccount;
}

function StakingEffected ({ className = '', stakingInfo }: Props): React.ReactElement<Props> | null {
  // const balance = stakingInfo?.stakingLedger?.active.unwrap();
  const balance = stakingInfo && new BN(Number(JSON.parse(JSON.stringify(stakingInfo)).valid).toString());

  if (!balance?.gtn(0)) {
    return null;
  }

  return (
    <FormatBalance
      className={className}
      value={balance}
    />
  );
}

export default React.memo(StakingEffected);