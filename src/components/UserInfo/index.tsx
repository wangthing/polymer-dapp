"use client";

import React, { useEffect, useRef, useState } from "react";
import { type BaseError, useWaitForTransactionReceipt, useWriteContract, useWatchContractEvent } from 'wagmi'
import { watchContractEvent,  http, createConfig  } from '@wagmi/core'
import { baseSepolia, optimismSepolia } from '@wagmi/core/chains'
import styles from "@/styles/Home.module.css";

// import { WriteContractVariables } from "wagmi/query";
import { LuckyWheel } from '@lucky-canvas/react'

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


  const [prizes] = useState([
    { background: '#e9e8fe', fonts: [{ text: '1BTC', top: '20px' }], range: 100 },
    { background: '#b8c5f2', fonts: [{ text: '1ETH', top: '20px' }], range: 0  },
    { background: '#e9e8fe', fonts: [{ text: '1BNB', top: '20px' }], range: 0  },
    { background: '#b8c5f2', fonts: [{ text: '1SOL', top: '20px' }], range: 0  },
    { background: '#e9e8fe', fonts: [{ text: '1DOT', top: '20px' }], range: 0  },
    { background: '#b8c5f2', fonts: [{ text: '1USDT', top: '20px' }], range: 0  },
  ])
  const [buttons] = useState([
    { radius: '40%', background: '#617df2' },
    { radius: '35%', background: '#afc8ff' },
    {
      radius: '30%', background: '#869cfa',
      pointer: true,
      fonts: [{ text: 'Start', top: '-10px' }]
    }
  ])
  const [blocks] = useState([
    { padding: '10px', background: '#869cfa' }
  ])
  const myLucky = useRef()
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

      <LuckyWheel width="300px" height="300px"
        ref={myLucky} 
        blocks={blocks}
        prizes={prizes}
        buttons={buttons}
        onStart={() => { // 点击抽奖按钮会触发star回调
          myLucky?.current.play()
          setTimeout(() => {
            
            myLucky?.current.stop()
          }, 2500)
        }}
        onEnd={prize => { // 抽奖结束会触发end回调
          alert('恭喜你抽到 ' + prize.fonts[0].text + ' 号奖品')
        }}
      />
      <p onClick={() => { // 点击抽奖按钮会触发star回调
          myLucky?.current.play()
          setTimeout(() => {
            const index = Math.random() * 6 >> 0
            myLucky?.current.stop(index)
          }, 2500)
        }}>Start</p>
    </button>
  )
}

export default UserInfo;