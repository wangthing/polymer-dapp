import { Button, NftCard, useNotification } from '@web3uikit/core';
import useCurrentChain from '@/hooks/useCurrentChain';
import styles from './index.module.scss'
import Layout from "@/components/Layout";
import Link from 'next/link';
import Image from 'next/image';
import { WriteContractReturnType } from 'viem';
import { nft_contract_address } from '@/const';
import abi from '@/abis/points.json'
import { useAccount, useWriteContract } from 'wagmi';
import NftCardForSale from '@/components/NftCardForSale';

const demoData = [{
  "token_address": "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
  "token_id": "4789",
  "amount": "1",
  "owner_of": "0x6682f185d982bd341a0e1dfccbc2562e3cb1eea7",
  "token_hash": "61554743720b60143f35e7adcc2a6fc7",
  "block_number_minted": "12346998",
  "block_number": "15957801",
  "transfer_index": [
    15957801,
    92,
    206,
    0
  ],
  "contract_type": "ERC721",
  "name": "BoredApeYachtClub",
  "symbol": "BAYC",
  "token_uri": "https://gateway.ipfsscan.io/ipfs/QmZu7WiiKyytxwwKSwr6iPT1wqCRdgpqQNhoKUyn1CkMD3",
  "metadata": JSON.stringify({
    "name": "Polymer Challenge 4 NFT",
    "description": "Polymer Incentivized Testnet Challenge 4 NFT",
    "image": "https://emerald-uncertain-cattle-112.mypinata.cloud/ipfs/QmNUWSdgDUx6WXD5BKycUXUbimm6JZkNyENxXbAUiqLAG6"
}),
  "last_token_uri_sync": "2022-10-04T14:49:59.308Z",
  "last_metadata_sync": "2022-10-04T14:50:00.573Z",
  "minter_address": "0x8be13ff71224ad525f0474553aa7f8621b856bd4"
},
{
  "token_address": "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
  "token_id": "4789",
  "amount": "1",
  "owner_of": "0x6682f185d982bd341a0e1dfccbc2562e3cb1eea7",
  "token_hash": "61554743720b60143f35e7adcc2a6fc7",
  "block_number_minted": "12346998",
  "block_number": "15957801",
  "transfer_index": [
    15957801,
    92,
    206,
    0
  ],
  "contract_type": "ERC721",
  "name": "BoredApeYachtClub",
  "symbol": "BAYC",
  "token_uri": "https://ipfs.moralis.io:2053/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/4789",
  "metadata": "{\"image\":\"ipfs://QmZcRZu2cMJG9KUSta6WTrRek647WSG5mJZLhimwbC2y56\",\"attributes\":[{\"trait_type\":\"Background\",\"value\":\"Aquamarine\"},{\"trait_type\":\"Fur\",\"value\":\"Pink\"},{\"trait_type\":\"Eyes\",\"value\":\"3d\"},{\"trait_type\":\"Mouth\",\"value\":\"Bored\"},{\"trait_type\":\"Clothes\",\"value\":\"Service\"}]}",
  "last_token_uri_sync": "2022-10-04T14:49:59.308Z",
  "last_metadata_sync": "2022-10-04T14:50:00.573Z",
  "minter_address": "0x8be13ff71224ad525f0474553aa7f8621b856bd4"
},
{
  "token_address": "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
  "token_id": "4789",
  "amount": "1",
  "owner_of": "0x6682f185d982bd341a0e1dfccbc2562e3cb1eea7",
  "token_hash": "61554743720b60143f35e7adcc2a6fc7",
  "block_number_minted": "12346998",
  "block_number": "15957801",
  "transfer_index": [
    15957801,
    92,
    206,
    0
  ],
  "contract_type": "ERC721",
  "name": "BoredApeYachtClub",
  "symbol": "BAYC",
  "token_uri": "https://ipfs.moralis.io:2053/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/4789",
  "metadata": "{\"image\":\"ipfs://QmZcRZu2cMJG9KUSta6WTrRek647WSG5mJZLhimwbC2y56\",\"attributes\":[{\"trait_type\":\"Background\",\"value\":\"Aquamarine\"},{\"trait_type\":\"Fur\",\"value\":\"Pink\"},{\"trait_type\":\"Eyes\",\"value\":\"3d\"},{\"trait_type\":\"Mouth\",\"value\":\"Bored\"},{\"trait_type\":\"Clothes\",\"value\":\"Service\"}]}",
  "last_token_uri_sync": "2022-10-04T14:49:59.308Z",
  "last_metadata_sync": "2022-10-04T14:50:00.573Z",
  "minter_address": "0x8be13ff71224ad525f0474553aa7f8621b856bd4"
}]
export default function NFT() {
  const account = useAccount()
  const dispatch = useNotification();
  const currentChain = useCurrentChain()
  const {
    data: hash,
    error,
    isPending,
    writeContract
  } = useWriteContract()

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
  return (
  <Layout>
    <div className={styles.nftContainer}>
      <div className={styles.topInfo}>
        <div className={styles.info}>
          <h1 className={styles.title}>Purchase a Mystery NFT which could be any one of the Polymer Phase 2 NFT Types</h1>
          <div className={styles.action}>
            <Link href="/points" className="text-xl font-bold">
              <Button text="Explore" type="button" theme="moneyPrimary" size="large"/>
            </Link>
            <Button onClick={randomMintNft} text="Purchase random NFT" type="button" theme="outline" size="large"/>
          </div>
        </div>
        <Image src="/images/nftDemo.jpg" alt='' width={330} height={330}/>
      </div>
      <h2 className={styles.buyNftTitle}>Polymer Phase 2 NFTS</h2>
      <div className={styles.nftList}>
        {[...demoData,...demoData,...demoData].map(nft => (
          <NftCardForSale className={styles.nftItem} />
          // <NftCard 
          //   className={styles.nftItem} 
          //   moralisApiResult={nft} 
          //   detailsBorder="none"
          //   chain={currentChain?.name || ''} 
          //   width="360px"
          // />
        ))} 
      </div>
    </div>
  </Layout>)
}