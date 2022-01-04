// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable */
import type { IconName } from '@fortawesome/fontawesome-svg-core';
import type { QueueStatus } from '@polkadot/react-components/Status/types';

import React, { useCallback } from 'react';
import styled from 'styled-components';

import AddressMini from '@polkadot/react-components/AddressMini';
import Button from '@polkadot/react-components/Button';
import Icon from '@polkadot/react-components/Icon';
import StatusContext from '@polkadot/react-components/Status/Context';
import { useTranslation } from '@polkadot/react-components/translate';

export { StatusContext };

interface Props {
  className?: string;
  isStatusOpen: boolean;
  setStatusOpen: (statusOpen: boolean) => void;
  message: string,
  status: 'error' | 'event' | 'queued' | 'received' | 'success'
}

function iconName (status: string): IconName {
  switch (status) {
    case 'error':
      return 'ban';

    case 'event':
      return 'assistive-listening-systems';

    case 'received':
      return 'telegram-plane';

    default:
      return 'check';
  }
}

function renderStatus ({ account, action, id, message, removeItem, status }: QueueStatus): React.ReactNode {
  return (
    <div
      className={`item ${status}`}
      key={id}
    >
      <div className='wrapper'>
        <div className='container'>
          <Icon
            icon='times'
            onClick={removeItem}
          />
          <div className='short'>
            <Icon icon={iconName(status)} />
          </div>
          <div className='desc'>
            <div className='header'>
              {Array.isArray(action)
                ? action.map((action, index) => <div key={index}>{action}</div>)
                : action}
            </div>
            {account && (
              <AddressMini value={account} />
            )}
            <div className='status'>
              {message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HttpStatus ({ className = '', isStatusOpen, message, setStatusOpen, status }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  const _onDismiss = useCallback(
    (): void => {
      setStatusOpen(false);
    },
    [isStatusOpen]
  );

  if (!isStatusOpen) {
    return null;
  }

  return (
    <div className={`ui--Status ${className}`}>
      {isStatusOpen && (
        <div className='dismiss'>
          <Button
            icon='times'
            isBasic
            isFull
            label={t<string>('Dismiss all notifications')}
            onClick={_onDismiss}
          />
        </div>
      )}
      {
        // @ts-ignore
        renderStatus({
          message,
          status
        })
      }
    </div>
  );
}

export default React.memo(styled(HttpStatus)`
  display: inline-block;
  position: fixed;
  right: 0.75rem;
  top: 0.75rem;
  width: 23rem;
  z-index: 1001;

  .dismiss {
    margin-bottom: 0.25rem;

    .ui--Button {
      border: 1px solid white;
    }
  }

  .item {
    display: block;

    > .wrapper > .container {
      align-items: center;
      background: #00688b;
      border-radius: 0.25rem;
      color: white;
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
      padding: 0 0.5rem;
      vertical-align: middle;
      position: relative;

      .desc {
        flex: 1;
        overflow: hidden;
        padding: 0.5rem 1rem;

        .status {
          font-weight: 400;
        }

        .ui--AddressMini {
          .ui--AddressMini-address {
            min-width: 0;
            text-align: left;
          }
        }
      }

      .header {
        opacity: 0.66;
      }

      .short {
        font-size: 2.5rem;
        opacity:  0.75;
        padding: 0.5rem 0 0.5rem 0.5rem;

        .ui--Icon {
          color: white !important;
          line-height: 1;
        }
      }

      .padded {
        padding: 0.25rem 0 0 0 !important;
      }

      .ui--Icon.isClickable {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        cursor: pointer;
      }
    }

    &.cancelled > .wrapper > .container {
      background: #cd9b1d
    }

    &.event > .wrapper > .container {
      background: teal;
    }

    &.completed,
    &.finalized,
    &.inblock,
    &.sent,
    &.success {
      & > .wrapper > .container {
        background: green;
      }
    }

    &.dropped,
    &.error,
    &.finalitytimeout,
    &.invalid,
    &.usurped {
      & > .wrapper > .container {
        background: red;
      }
    }
  }
`);
