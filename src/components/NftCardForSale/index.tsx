import React from "react"
import styles from './index.module.scss'
import { Button } from "@web3uikit/core"
import Image from "next/image"
import { Gift, Heart} from '@web3uikit/icons'
import classNames from "classnames"

interface IProps {
    className?: string
    handleNftMint?: () => void
}
const NftCardForSale = (props: IProps) => {
    const { className = '', handleNftMint} = props
    return (
        <div className={classNames(styles.nftCardForSale, className)}>
            <div className={styles.nftInfo}>
                <div className={styles.image} >
                    <Image src="/images/nftDemo.jpg" alt="" width={300} height={380} style={{height: '100%'}}/>
                </div>
                <div className={styles.info}>
                    <div className={styles.name}>
                        <span>NFT1</span>
                        <Gift fontSize='24px'/>
                    </div>
                    <div className={styles.like}>
                        <Heart fontSize='20px'/>
                        <span>232</span>
                    </div>
                </div>
            </div>
            <div>
                <Button 
                    text="Burn" 
                    type="button" 
                    theme="colored" 
                    size="large" 
                    onClick={() => {
                        handleNftMint?.()
                    }}
                />
                <Button 
                    text="Buy" 
                    type="button" 
                    theme="primary" 
                    size="large" 
                    onClick={() => {
                        handleNftMint?.()
                    }}
                />
            </div>
        </div>
    )
}

export default NftCardForSale