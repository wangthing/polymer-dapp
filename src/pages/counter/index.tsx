import Layout from "@/components/Layout"
import styles from './index.module.scss'
import { Button, Select } from "@web3uikit/core"
import { op_sepolia_counter_address_omni, base_sepolia_counter_address_omni} from "@/const"
import { useEffect, useState } from 'react';
import { useCheckChain } from '@/hooks/index';
import { readContract } from "@wagmi/core";
import omniCounterAbi from '@/abis/omniCounter.json';
import { useConfig, useWriteContract } from "wagmi";

import {
    baseSepolia,
    optimismSepolia,
} from "wagmi/chains";
import { formatUnits, solidityPacked } from "ethers";

// quote fee with default adapterParams
const adapterParams = solidityPacked(["uint16", "uint256"], [1, 200000]) // default adapterParams example
const LeaderBoard = () => {
    const config = useConfig()
    const { checkChain: checkSepoliaChain } = useCheckChain(optimismSepolia.id)
    const [currentCount, setCurrentCount] = useState(0)
    const [estimateFee, setEstimateFee] = useState('')
    useEffect(() => {
        // checkSepoliaChain()
        getCurrentCount()
        getEstimateFee()
    }, [])
    const {
        data: hash,
        error,
        isPending,
        writeContract
      } = useWriteContract()

    const getCurrentCount = async () => {
        try {
            const res = await (readContract as any)(config, {
                address: base_sepolia_counter_address_omni,
                abi: omniCounterAbi,
                functionName: 'counter',
                chainId: baseSepolia.id
              })
              setCurrentCount(parseInt(res))
        } catch (error) {
            console.log(error)
        }
    }

    const getEstimateFee = async () => {
        try {
            const res = await (readContract as any)(config, {
                address: base_sepolia_counter_address_omni,
                abi: omniCounterAbi,
                functionName: 'estimateFee',
                args: [10245, false, adapterParams],
                chainId: baseSepolia.id
              })
              setEstimateFee(res[0])
              return res[0]
        } catch (error) {
            console.log(error)
        }
    }

    const increment = async () => {
        try {
            const fee = await getEstimateFee()

            const res = await (writeContract as any)({
                address: op_sepolia_counter_address_omni,
                abi: omniCounterAbi,
                functionName: 'incrementCounter',
                args: [10245],
                value: '82467958234688' //can't get the right estimateFee
              })
            console.log(res, fee,  'res>>>>>')
        } catch (error) {
            console.log(error)
        }
    }
    console.log(estimateFee, 'estimateFee')
    return (
        <Layout>
            <div className={styles.counterWrapper}>
            <Select
                    onBlurTraditional={function noRefCheck() { } }
                    onChange={function noRefCheck() { } }
                    onChangeTraditional={function noRefCheck() { } }
                    defaultOptionIndex={0}
                    options={[
                        {
                            id: 'LayerzeroV1',
                            label: 'LayerzeroV1',
                        },
                        {
                            id: 'Polymer',
                            label: 'Polymer',
                        },
                        {
                            id: 'Other',
                            label: 'Other',
                        }
                    ]}
                    width="300px" name={""}                
                />
                <Button text="add counter" type="button" theme="outline" size="large" onClick={increment}/>
                <p>current counter: {currentCount}</p>
                <p>Estimate Fee: {estimateFee ? `${formatUnits(estimateFee, 18)} eth` : ''}</p>
            </div>
        </Layout>
    )
}

export default LeaderBoard