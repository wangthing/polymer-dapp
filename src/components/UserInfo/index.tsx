"use client";

import React, { useEffect } from "react";
import { type BaseError, useWaitForTransactionReceipt, useWriteContract, useWatchContractEvent } from 'wagmi'
import { watchContractEvent,  http, createConfig  } from '@wagmi/core'
import { baseSepolia, optimismSepolia } from '@wagmi/core/chains'
import styles from "@/styles/Home.module.css";

// import { WriteContractVariables } from "wagmi/query";

const contract_address = '0xda9996d80EFdaE2C30B3036C47E2A5617F8BA8Ca'
export function UserInfo() {
  const {
    data: hash,
    error,
    isPending,
    writeContract
  } = useWriteContract()

  useEffect(() => {
    const unwatch = (watchContractEvent as any)((createConfig as any)({
      chains: [baseSepolia, optimismSepolia ],
      transports: {
        [baseSepolia.id]: http(),
        [optimismSepolia.id]: http(),
      },
    }), {
      address: contract_address,
      abi: [{
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "receiver",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "PointsAdded",
        "type": "event"
      }],
      eventName: 'PointsAdded',
      onLogs(logs:any) {
        console.log('New logs!', logs)
        unwatch()
      },
    })
    return () => {
      unwatch()
    }
  }, [])


  const submit = () => {
    (writeContract as any)(
      {
        address: contract_address,
        abi: [
          {
            inputs: [],
            name: 'funMint',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function'
          },
        ],
        functionName: 'funMint',
        args: [],
      }
    )
  }
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })
  return (
    <button onClick={submit} className={styles.button}>
      <button
        disabled={isPending}
        type="submit"
      >
        {isPending ? 'Confirming...' : 'Mint'}
      </button>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isConfirmed && <div>Transaction confirmed. data: {hash}</div>}
      {error && (
        <div>Error: {(error as BaseError).details || error.stack}</div>
      )}
    </button>
  )
}

export default UserInfo;