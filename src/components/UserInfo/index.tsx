"use client";

import React, { useEffect, useRef, useState } from "react";
import { type BaseError, useWaitForTransactionReceipt, useWriteContract, useWatchContractEvent, useConfig } from 'wagmi'
import { watchContractEvent,  http, readContract } from '@wagmi/core'
import { baseSepolia, optimismSepolia } from '@wagmi/core/chains'
import styles from "@/styles/Home.module.css";

// import { WriteContractVariables } from "wagmi/query";
import { LuckyWheel } from '@lucky-canvas/react'
import { Button, NftCard } from '@web3uikit/core';
import abi from '@/abis/points.json'
import { WriteContractReturnType } from "viem";
// import { readContract } from "viem/actions";

const contract_address = '0xfda75cbf5517260417B8bEF47B74F4553C53924E'
export function UserInfo() {
  const myLucky = useRef()
  const {
    data: hash,
    error,
    isPending,
    writeContract
  } = useWriteContract()
  const config = useConfig()

  useEffect(() => {
    // TODO: try to replace createConfig with config returned by useConfig
    const unwatch = (watchContractEvent as any)(config, {
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
        if(logs.length) {
          const { args } = logs[0]
          const res = parseInt(args?.amount)
          startWheel(res)
        }
        unwatch()
      },
    })
    return () => {
      unwatch()
    }
  }, [])

  const startWheel = (index: number) => {
    setTimeout(() => {
      myLucky?.current?.stop(index)
    }, 2500)
  }

  const canMint = async () => {
    const res = await (readContract as any)(config, {
      address: contract_address,
      abi: [{
        "inputs": [],
        "name": "_canFunMint",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }],
      functionName: '_canFunMint',
      args: []
    })

    return res
  }

  const submit = async () => {
    const flag = await canMint();
    console.log(flag, 'can mint?')
    if(!flag) {
      console.log("you can't mint now")
      return
    }
    (writeContract as any)(
      {
        address: contract_address,
        abi: [
          {
            "inputs": [],
            "name": "funMint",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          },
        ],
        functionName: 'funMint',
        args: [],
      },
      {
        onSuccess: (data: WriteContractReturnType, variables: any, context: any) => {
          myLucky?.current?.play()
          console.log(data, variables, context)
        },
        onError: (err: WriteContractReturnType) => {
          console.log(err)
        },
      }
    )
  }
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const [prizes] = useState([
    { background: '#e9e8fe', fonts: [{ text: '1BTC', top: '20px' }], id: 1 },
    { background: '#b8c5f2', fonts: [{ text: '1ETH', top: '20px' }], id: 2  },
    { background: '#e9e8fe', fonts: [{ text: '1BNB', top: '20px' }], id: 3  },
    { background: '#b8c5f2', fonts: [{ text: '1SOL', top: '20px' }], id: 4 },
    { background: '#e9e8fe', fonts: [{ text: '1DOT', top: '20px' }], id: 5  },
    { background: '#b8c5f2', fonts: [{ text: '1USDT', top: '20px' }], id: 6  },
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

  return (
    <div>
        <Button
          disabled={isPending}
          type="submit"
          onClick={submit}
          text={isPending ? 'Confirming...' : 'Mint'}
        >
        </Button>
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
    </div>
  )
}

export default UserInfo;