# token-allocation-distributor
Distribute allocated ERC20 tokens based on set conditions

### Testnet Deployment

```
stakeHolders: [address...]  
stakeHoldersWeight: [uint256...]
targetToken: address
totalStakeHolders: uint256
```

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
|WithVestingContract| **1396500** |[0x48d48683e717e08d46ca45885950e9de3bac8478](https://ropsten.etherscan.io/address/0x48d48683e717e08d46ca45885950e9de3bac8478)|  


#### Kovan  

|Contract| Deployment Cost | Address |
|-|-| --|
|TokenDistributor (`null _targetToken`)| **753445** | [0x203D7794aE117E8294e48F393A815CC8FFAf64b6](https://kovan.etherscan.io/address/0x203D7794aE117E8294e48F393A815CC8FFAf64b6)|  
|WeightedTokenDistributor (`null _targetToken`)| **1064426** |[0x31f7C8a02230a75BD3d6b534DD46415b5c9a1b53](https://kovan.etherscan.io/address/0x31f7C8a02230a75BD3d6b534DD46415b5c9a1b53)|  
|WithVestingContract (`null _targetToken`)| **1374631** |[0x7BC4e040729982DB3b12C91aAa34ac6498703827](https://kovan.etherscan.io/address/0x7BC4e040729982DB3b12C91aAa34ac6498703827)|  
