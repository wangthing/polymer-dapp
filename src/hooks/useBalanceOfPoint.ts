import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";
import abi from '@/abis/points.json'
import { useConfig } from "wagmi";
import { decimal, pts_contract_address } from "@/const";

const useBalanceOfPoint = (address?: string) => {
    const [balance, setBalance] = useState(0)
    const config = useConfig()
    useEffect(() => {
        if(!address) {
            return
        }
        const fetchBalance = async () => {
            try {
                const res = await readContract(config, {
                    address: pts_contract_address,
                    abi,
                    functionName: 'balanceOf',
                    args: [address]
                  })
                console.log(res, 'balance2222')
                setBalance(parseInt(res as string) / decimal)
            } catch (error) {
                
                console.log(error, 'balance2222')
            }
        }
        fetchBalance()
    }, [address])
    return balance
}

export default useBalanceOfPoint