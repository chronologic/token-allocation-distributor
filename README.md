# token-allocation-distributor
Distribute allocated ERC20 tokens based on set conditions

### Testnet Deployment

```
stakeHolders: [address...]  
stakeHoldersWeight: [uint256...]
targetToken: address
totalStakeHolders: uint256
```

#### Ropsten  

|Contract| Deployment Cost | Address |
|-|-| --|
|TokenDistributor| **775378** | [0x23f88110bb11b7eeb72d1e31ad204d42312033ca](https://ropsten.etherscan.io/address/0x23f88110bb11b7eeb72d1e31ad204d42312033ca)|  
|WeightedTokenDistributor| **1086359** |[0xad0c594b0c8074ab4de2b0c26d86e228307b52f6](https://ropsten.etherscan.io/address/0xad0c594b0c8074ab4de2b0c26d86e228307b52f6)|  
|WithVestingContract| **1523594** |[0x48d48683e717e08d46ca45885950e9de3bac8478](https://ropsten.etherscan.io/address/0x48d48683e717e08d46ca45885950e9de3bac8478)|


#### Kovan  

|Contract| Deployment Cost | Address |
|-|-| --|
|TokenDistributor (`null _targetToken`)| **1149894** | [0x4e2e2f81eec9d327ac87a4263c3bf95b06176915](https://kovan.etherscan.io/address/0x4e2e2f81eec9d327ac87a4263c3bf95b06176915)|  
|WeightedTokenDistributor (`null _targetToken`)| **1588458** |[0x7899b7f6c304d770300aed4fdab46c9a90892391](https://kovan.etherscan.io/address/0x7899b7f6c304d770300aed4fdab46c9a90892391)|  
|WithVestingContract (`null _targetToken`)| **2313697** |[0x4009940a4eb5c0d431d5c24f77ad8f97c5e36ec0](https://ropsten.etherscan.io/address/0x4009940a4eb5c0d431d5c24f77ad8f97c5e36ec0)|
