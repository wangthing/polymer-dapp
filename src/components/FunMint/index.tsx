"use client";

import React, { useEffect, useRef, useState } from "react";
import { type BaseError, useWaitForTransactionReceipt, useWriteContract, useWatchContractEvent, useConfig, useAccount } from 'wagmi'
import { watchContractEvent, readContract } from '@wagmi/core'

// import { WriteContractVariables } from "wagmi/query";
import { LuckyWheel } from '@lucky-canvas/react'
import { Button, useNotification } from '@web3uikit/core';
import abi from '@/abis/points.json'
import nftAbi from '@/abis/nft.json'
import { WriteContractReturnType } from "viem";
import { pts_contract_address as contract_address, nft_contract_address, pointList } from "@/const";
import styles from './index.module.scss'

export function UserInfo() {
  const myLucky = useRef()
  const account = useAccount()
  const dispatch = useNotification();
  const {
    data: hash,
    error,
    isPending,
    writeContract
  } = useWriteContract()
  const config = useConfig()

  useEffect(() => {
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

  const startWheel = (point: number) => {
    setTimeout(() => {
      const index = pointList.findIndex(item => item.id === point)
      myLucky?.current?.stop(index)
    }, 2500)
  }

  const approve = async () => {
    const approveAmount = '999999999999999999999999999'
    const res = await (writeContract as any)({
      address: contract_address,
      abi,
      functionName: 'approve',
      args: [nft_contract_address, approveAmount]
    },
    {
      onSuccess: (data: WriteContractReturnType, variables: any, context: any) => {
        // dispatch({
        //   type: 'info',
        //   message: "minting in progress",
        //   title: 'New Notification',
        //   position: 'topR',
        // })
        console.log(data, 'approve success')
      },
      onError: (err: WriteContractReturnType) => {
        console.log(err, 'approve failed')
      },
    })

    console.log('approve res', res)
  }

  const checkAllowance = async () => {
    const res = await (readContract as any)(config, {
      address: contract_address,
      abi,
      functionName: 'allowance',
      args: [account.address, nft_contract_address]
    })
    const allowance = parseInt(res)
    console.log('allowance>>>', res)
    // 
    if(allowance === 0) {
      return await approve()
    }
    return res
  }

  const canMint = async () => {
    const allowance = await checkAllowance ();
    const res = await (readContract as any)(config, {
      address: contract_address,
      abi,
      functionName: '_canFunMint',
      args: [account.address]
    })
    return res
  }

  const startMint = async () => {
    const flag = await canMint();
    console.log(flag, 'can mint?')
    if(!flag) {
      dispatch({
        type: 'error',
        message: "You can only fun mint once every 10min",
        title: 'New Notification',
        position: 'topR',
      })
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
          myLucky?.current?.play();
          dispatch({
            type: 'info',
            message: "minting in progress",
            title: 'New Notification',
            position: 'topR',
          })
          console.log(data, variables, context)
        },
        onError: (err: WriteContractReturnType) => {
          console.log(err)
        },
      }
    )
  }

  const mintNft = async () => {
    const res = await (writeContract as any)({
      address: nft_contract_address,
      abi: nftAbi,
      functionName: 'mintNFT1',
      args: [account.address]
    },
    {
      onSuccess: (data: WriteContractReturnType) => {
        dispatch({
          type: 'info',
          message: "minting in progress",
          title: 'New Notification',
          position: 'topR',
        })
        console.log(data, 'mintNft1')
      },
      onError: (err: WriteContractReturnType) => {
        console.log(err, 'mintNft1 failed')
      },
    })
    console.log(res, 'mintNft1 res')
  }

  const randomMintNft = async () => {
    const res = await (writeContract as any)({
      address: nft_contract_address,
      abi,
      functionName: 'randomMint',
      args: [account.address]
    },
    {
      onSuccess: (data: WriteContractReturnType, variables: any, context: any) => {
        dispatch({
          type: 'info',
          message: "minting in progress",
          title: 'New Notification',
          position: 'topR',
        })
        console.log(data, 'randomMintNft')
      },
      onError: (err: WriteContractReturnType) => {
        console.log(err, 'randomMintNft failed')
      },
    })
    console.log(res, 'randomMintNft res')
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const [prizes] = useState(pointList)
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
    <div className={styles.funMint}>
        <LuckyWheel width="300px" height="300px"
          ref={myLucky} 
          blocks={blocks}
          prizes={prizes}
          buttons={buttons}
          onEnd={(prize: any)  => { // 抽奖结束会触发end回调
            dispatch({
              type: 'info',
              message: '恭喜你抽到 ' + prize.fonts[0].text + ' 号奖品',
              title: 'New Notification',
              position: 'topR',
            })
          }}
          onStart={startMint}
        />
        <Button
          disabled={isPending}
          type="button"
          theme="primary"
          onClick={startMint}
          text={isPending ? 'Confirming...' : 'funMint'}
          style={{marginTop: '32px'}}
        />
        {/* {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed. data: {hash}</div>}
        {error && (
          <div>Error: {(error as BaseError).details || error.stack}</div>
        )} */}
        {/* <Button
          disabled={isPending}
          type="button"
          theme="primary"
          onClick={mintNft}
          text={isPending ? 'Confirming...' : 'nft Mint'}
        />
        <Button
          disabled={isPending}
          type="button"
          theme="primary"
          onClick={randomMintNft}
          text={isPending ? 'Confirming...' : 'random nft Mint'}
        /> */}
    </div>
  )
}

export default UserInfo;