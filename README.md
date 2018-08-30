# token-allocation-distributor
Distribute allocated ERC20 tokens based on set conditions

### Testnet Deployment

```
stakeHolders: [address...]  (4)
stakeHoldersWeight: [uint256...] (4)
targetToken: address
totalStakeHolders: uint256

targetVersion: uint256
vestingContract: address
```

```
EVM Optimization: ON
Optimization: 200
```

#### Ropsten  

|Contract| Deployment Cost | Address |
|-|-| --|
|TokenDistributor| **777107** | [0xe18bac062d374fb3611635e3acd16aaf308177b5](https://ropsten.etherscan.io/address/0xe18bac062d374fb3611635e3acd16aaf308177b5)|  
|WeightedTokenDistributor| **1088205** |[0x7434c433fbb79a60b94bb6fa117f2e2c00dcc2f9](https://ropsten.etherscan.io/address/0x7434c433fbb79a60b94bb6fa117f2e2c00dcc2f9)|  
|WithVestingContract| **1423579** |[0xca4f37a2790125dde37733dbae51599b884a117c](https://ropsten.etherscan.io/address/0xca4f37a2790125dde37733dbae51599b884a117c)|  


#### Kovan  

|Contract| Deployment Cost | Address |
|-|-| --|
|TokenDistributor (`null _targetToken`)| **760827** | [0x52009d78b41275d301d2446c07695b9938abeb1e](https://kovan.etherscan.io/address/0x52009d78b41275d301d2446c07695b9938abeb1e)|  
|WeightedTokenDistributor (`null _targetToken`)| **1071925** |[0x5027d4ae8af4643892280b4f9ea794a69877f86a](https://kovan.etherscan.io/address/0x5027d4ae8af4643892280b4f9ea794a69877f86a)|  
|WithVestingContract (`null _targetToken`)| **1407299** |[0x1e3edc6f66a84b8ef4cd6dad46b352cdac509829](https://kovan.etherscan.io/address/0x1e3edc6f66a84b8ef4cd6dad46b352cdac509829)|  
