"use client";

<<<<<<< HEAD
import React, { useEffect } from "react";
import { type BaseError, useWaitForTransactionReceipt, useWriteContract, useWatchContractEvent } from 'wagmi'
import { watchContractEvent,  http, createConfig  } from '@wagmi/core'
import { baseSepolia, optimismSepolia } from '@wagmi/core/chains'
import styles from "@/styles/Home.module.css";

=======
import React, { useState, useEffect, useRef } from "react";
import { parseEther, WriteContractReturnType } from 'viem'
import { mainnet } from 'viem/chains'
import { useAccount, useSignMessage, useTransactionCount, useSwitchChain, useSendTransaction, useWriteContract, useWatchContractEvent, useConfig } from 'wagmi'
import abi from '@/abis/points.json'
import { watchContractEvent } from "viem/actions";
import { getClient } from '@wagmi/core'
>>>>>>> 3380648 (feat: add spin wheel)
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

<<<<<<< HEAD
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
=======
  const [isRequesting, setIsRequesting] = useState(false);
  const [points, setPoints] = useState<null | number>(10);

  // const { data: signature, isSuccess, signMessage } = useSignMessage()
  // const { chains, switchChain } = useSwitchChain()

  // const { data, isSuccess, sendTransaction } = useSendTransaction()
  // const result = useTransactionCount({
  //   address: '0x4557B18E779944BFE9d78A672452331C186a9f48',
  // })

  useWatchContractEvent({
    address: contract_address,
    abi,
    poll: true,
    pollingInterval: 3000,
    eventName: 'Transfer',
    onLogs(logs: any) {
      console.log('New logs!', logs)
    },
    onError(error) { 
      console.log('Error', error) 
    } 
  })

  const handleSign = () => {
    // signMessage({
    //   message: 'hello wordl'
    // })
    // switchChain({
    //   chainId: chains[0]?.id
    // })

    // sendTransaction({
    //   to: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
    //   value: parseEther('0.01'),
    // })
    spinWheel()
  }

  // useEffect(() => {
  //   const unwatch = useWatchContractEvent(config, {
  //     address: contract_address,
  //     abi,
  //     poll: true,
  //     pollingInterval: 3000,
  //     eventName: 'Transfer',
  //     onLogs(logs: any) {
  //       console.log('New logs!', logs)
  //     },
  //     onError(error) { 
  //       console.log('Error', error) 
  //     } 
  //   })

  //   return () => unwatch()
  // }, [])

  const onSuccess = (data: WriteContractReturnType, variables: any) => {
    console.log(data, variables, '>>>>>>>>')
  }

  const onError = () => {
    console.log('eerrroroasdas')
  }

  const spinWheel = () => {
    // init contract with the address of the deployed contract
    try {
      writeContract({ 
        abi,
        address: contract_address,
        functionName: 'funMint',
        account: address,
     },
     { onSuccess, onError }
     )
      
      // listen to the event emitted by the contract
      // contract.on("PointsAdded", (addr, randomNumber) => {
      //   if (addr === signer?.address) {
      //     setPoints(Number(randomNumber));
      //     setIsRequesting(false);
      //   }
      // });

      setIsRequesting(true);
      // const tx = await contract.funMint();
      // await tx.wait();
    } catch (e) {
      console.error(e, '..asd...sdas');
      setIsRequesting(false);
      setPoints(0);
    }
  };



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

  return <div>
    <p onClick={handleSign}>address: {address}</p>
    {/* <div>{signature}</div> */}
    <div>{points}</div>
    <span onClick={spinWheel}>click me to excute a contract</span>
    <p>{error && 'colding down!Please try after 10 minutes'}</p>
    <p>data: {data}</p>
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
  </div>
>>>>>>> 3380648 (feat: add spin wheel)
}

export default UserInfo;