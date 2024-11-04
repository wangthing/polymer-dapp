import Layout from "@/components/Layout"
import styles from './index.module.scss'
import { Button } from "@web3uikit/core"
import { sepolia_counter_address } from "@/const"
import { useEffect, useState } from 'react';
import { useCheckChain } from '@/hooks/index';
import { readContract } from "@wagmi/core";
import counterAbi from '@/abis/counter.json';
import { useConfig, useWriteContract } from "wagmi";
import {
    sepolia
} from "wagmi/chains";

const LeaderBoard = () => {
    const config = useConfig()
    const { checkChain: checkSepoliaChain } = useCheckChain(sepolia.id)
    const [currentCount, setCurrentCount] = useState(0)
    useEffect(() => {
        checkSepoliaChain()
        getCurrentCount()
    }, [])

    const {
        data: hash,
        error,
        isPending,
        writeContract
      } = useWriteContract()

    const getCurrentCount = async () => {
        console.log(counterAbi, ">>>>")
        try {
            const res = await (readContract as any)(config, {
                address: sepolia_counter_address,
                abi: counterAbi,
                functionName: 'count',
              })
              setCurrentCount(parseInt(res))
        } catch (error) {
            console.log(error)
        }
    }

    const increment = async () => {
        try {
            const res = await (writeContract as any)({
                address: sepolia_counter_address,
                abi: counterAbi,
                functionName: 'increment',
              })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Layout>
            <div className={styles.counterWrapper}>
                <Button text="Mint nft" type="button" theme="outline" size="large" onClick={increment}/>
                <p>current counter: {currentCount}</p>
            </div>
        </Layout>
    )
}

export default LeaderBoard