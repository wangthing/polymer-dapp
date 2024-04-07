
import Navbar from '../navigation/navbar';
// import Footer from '../layout/Footer';
import React from 'react';
import styles from './index.module.scss'

interface ILayour {
  children?: React.ReactNode,
  className?: string
}
const Layout = ({ children, className }: ILayour) => {
  return (
    <div className={styles.layoutWrapper}>
        <Navbar />
        <main className={styles.main}>{children}</main>
        <footer>footer</footer>
    </div>
  );
};

export default Layout;