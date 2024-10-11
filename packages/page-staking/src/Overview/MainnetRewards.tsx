// Copyright 2017-2020 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import { ActiveEraInfo } from '@polkadot/types/interfaces';

import React from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import BN from 'bn.js';
import { Icon, Tooltip } from '@polkadot/react-components';
import { useTranslation } from '@polkadot/apps/translate';
import { formatBalance } from '@polkadot/util';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
}

const UNIT = new BN(1_000_000_000_000)

async function getAllRewards(idx: number): Promise<number> {
  const { api } = useApi();

  // erasStakingPayout
  const erasp = await api.query.staking.erasStakingPayout(idx);

  const erasStakingPayout = JSON.parse(JSON.stringify(erasp));
  // console.log(`erasStakingPayout: ${idx}: ${erasStakingPayout}`);

  // erasAuthoringPayout
  const keys = await api.query.staking.erasAuthoringPayout.keys(idx);

  let totalValue = new BN(0);

  for (const key of keys) {
    const [_, accountId] = key.args;
    const value = await api.query.staking.erasAuthoringPayout(idx, accountId);
    totalValue = totalValue.add(new BN(value.toString()));
  }

  // console.log(`erasAuthoringPayout ${idx}: ${totalValue.toString()}`);

  return totalValue.add(new BN(erasStakingPayout as string)).div(UNIT).toNumber();
}

function MainnetReward ({ children, className = '', label }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const activeEraInfo = useCall<ActiveEraInfo>(api.query.staking.activeEra);

  const activeEra = activeEraInfo && (JSON.parse(JSON.stringify(activeEraInfo)).index);
  const marketPayout = useCall<any>(api.query.staking.erasMarketPayout, [activeEra]);
  const stakingRewards = new BN(3011.635871031734).mul(UNIT)
  const total = marketPayout && stakingRewards.add(new BN(Number(marketPayout).toString()))

  getAllRewards(activeEra as number - 1).then((res) => {
    console.log("================> getAllRewards: ", res);
  })

  return (
    <div className={className}>
      {label || ''}
      <FormatBalance
        value={total}
        withSi
        label={
          <Icon
            icon='info-circle'
            tooltip={`mainnet-reward-trigger`}
          />
        }
      >
        <Tooltip
          text={
            <>
              <div>
                <div className='faded'>{t('staking payout: {{stakingRewards}}', {
                  replace: {
                    stakingRewards: formatBalance(stakingRewards)
                  }
                })}</div>
                <div className='faded'>{t('market payout: {{marketPayout}}', {
                  replace: {
                    marketPayout: marketPayout && formatBalance(new BN(Number(marketPayout).toString()))
                  }
                })}</div>
              </div>
            </>
          }
          trigger={`mainnet-reward-trigger`}
        />
      </FormatBalance>
      {children}
    </div>
  );
}

export default React.memo(MainnetReward);
