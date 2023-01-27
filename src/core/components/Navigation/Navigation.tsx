import React from 'react';
import { makeCn } from 'shared/utils';
import styles from './Navigation.scss';
import { Link } from 'react-router-dom';

const cn = makeCn('Navigation', styles);

export const Navigation: React.FC = () => (
  <div className={cn()}>
    <Link to="wallet">Wallet</Link>
    <Link to="online-store">Online store</Link>
  </div>
);
