"use client";

import React, { useState, useEffect } from "react";
import { parseEther, WriteContractReturnType } from 'viem'
import { mainnet } from 'viem/chains'
import { useAccount, useSignMessage, useTransactionCount, useSwitchChain, useSendTransaction, useWriteContract, useWatchContractEvent } from 'wagmi'
import abi from '@/abis/points.json'
// import { WriteContractVariables } from "wagmi/query";

const contract_address = '0xda9996d80EFdaE2C30B3036C47E2A5617F8BA8Ca'
const UserInfo = () => {
  // const {  } = useSimulateContract()
  const { address } = useAccount()

  // const {  } = useWatchContractEvent()
  const { data, error, failureReason, writeContract } = useWriteContract()

  const [isRequesting, setIsRequesting] = useState(false);
  const [points, setPoints] = useState<null | number>(10);

  const { data: signature, isSuccess, signMessage } = useSignMessage()
  const { chains, switchChain } = useSwitchChain()

  // const { data, isSuccess, sendTransaction } = useSendTransaction()
  // const result = useTransactionCount({
  //   address: '0x4557B18E779944BFE9d78A672452331C186a9f48',
  // })

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

  useWatchContractEvent({
    address: contract_address,
    abi,
    poll: true,
    eventName: 'Transfer',
    onLogs(logs: any) {
      console.log('New logs!', logs)
    },
    onError(error) { 
      console.log('Error', error) 
    } 
  })

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
  return <div>
    <p onClick={handleSign}>address: {address}</p>
    {/* <div>{signature}</div> */}
    <div>{points}</div>
    <span onClick={spinWheel}>click me to excute a contract</span>
    <p>{error && 'colding down!Please try after 10 minutes'}</p>
    <p>data: {data}</p>
    
  </div>
}

export default UserInfo