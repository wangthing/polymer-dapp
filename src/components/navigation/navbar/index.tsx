import React from "react";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
const Navbar = () => {
  return (
    <>
      <div className={styles.logo}>
        <Image
          src="/Logo-Dark.svg"
          alt="Polymer Logo"
          height="32"
          width="203"
        />
      </div>

      <Link href="/pts" className="text-xl font-bold">
        <p>Earn Pts</p>
      </Link>

      <Link href="/nfts" className="text-xl font-bold">
        <p>Operate NFTs</p>
      </Link>
      <Link href="/leaderboard" className="text-xl font-bold">
        <p>Leaderboard</p>
      </Link>
    </>
  );
};

export default Navbar;