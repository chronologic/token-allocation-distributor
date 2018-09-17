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
|HasContracts| **509302** | [0xfCeDaE243eD70aCCAF2F65FA40aaafDd7b0591eB](https://ropsten.etherscan.io/address/0xfcedae243ed70accaf2f65fa40aaafdd7b0591eb)|
|TokenHandler| **601112** | []

|HasContracts| **298874** | [0xa5bf4ceaf442c4dc44a8656f8064c7693cf8eab1](https://ropsten.etherscan.io/address/0xa5bf4ceaf442c4dc44a8656f8064c7693cf8eab1)|
|TokenHandler| **381400** | [0x64446d8899ebe87e708ff783dbe127d10c3fec05](https://ropsten.etherscan.io/address/0x64446d8899ebe87e708ff783dbe127d10c3fec05)|
|VestingHandler| **749052** | [0x935222ac155452b438bed392266c7da629c172c7](https://ropsten.etherscan.io/address/0x935222ac155452b438bed392266c7da629c172c7)|
|TokenDistributor| **823394** | [0xa121f3b1bf636612bc9ace753c5110f8d6dee493](https://ropsten.etherscan.io/address/0xa121f3b1bf636612bc9ace753c5110f8d6dee493)|  
|WeightedTokenDistributor| **1146363** |[0xc46899eb466d190061ec1928262ae3e9d99881e3](https://ropsten.etherscan.io/address/0xc46899eb466d190061ec1928262ae3e9d99881e3)|  
|WithVestingContract| **1559142** |[0x68789c1da9a03ab0c1120f1c6f394eca508ddc38](https://ropsten.etherscan.io/address/0x68789c1da9a03ab0c1120f1c6f394eca508ddc38)|  
|HasDistributorHandler| **1559142** |[0x68789c1da9a03ab0c1120f1c6f394eca508ddc38](https://ropsten.etherscan.io/address/0x68789c1da9a03ab0c1120f1c6f394eca508ddc38)|  
|HasVestingHandler| **1559142** |[0x68789c1da9a03ab0c1120f1c6f394eca508ddc38](https://ropsten.etherscan.io/address/0x68789c1da9a03ab0c1120f1c6f394eca508ddc38)|  
|DistributorHasVestingHandler| **1559142** |[0x68789c1da9a03ab0c1120f1c6f394eca508ddc38](https://ropsten.etherscan.io/address/0x68789c1da9a03ab0c1120f1c6f394eca508ddc38)|  
|VestingHasDistributorHandler| **1559142** |[0x68789c1da9a03ab0c1120f1c6f394eca508ddc38](https://ropsten.etherscan.io/address/0x68789c1da9a03ab0c1120f1c6f394eca508ddc38)|  

#### Kovan

|Contract| Deployment Cost | Address |
|-|-| --|
|HasContracts (`null _targetToken`)| **365120** | [0xca5857d7214aab2b95ebe6b07892573c378a75a6](https://kovan.etherscan.io/address/0xca5857d7214aab2b95ebe6b07892573c378a75a6)|  
|TokenHandler (`null _targetToken`)| **365120** | [0xca5857d7214aab2b95ebe6b07892573c378a75a6](https://kovan.etherscan.io/address/0xca5857d7214aab2b95ebe6b07892573c378a75a6)|  
|VestingHandler (`null _targetToken`)| **732772** | [0x85363bc863a9a5054476628a1c79fec9f23730bc](https://kovan.etherscan.io/address/0x85363bc863a9a5054476628a1c79fec9f23730bc)|  
|TokenDistributor (`null _targetToken`)| **807114** | [0x90319e0f8590d1ba10d212f119b8cc10be2d2fb6](https://kovan.etherscan.io/address/0x90319e0f8590d1ba10d212f119b8cc10be2d2fb6)|  
|WeightedTokenDistributor (`null _targetToken`)| **1130083** |[0x6f44ab9f41723ee6c9ae8048225f4497c00cc73b](https://kovan.etherscan.io/address/0x6f44ab9f41723ee6c9ae8048225f4497c00cc73b)|  
|WithVestingContract (`null _targetToken`)| **1544142** |[0x53761ae6b2ad99120825843b9422be2781020d7d](https://kovan.etherscan.io/address/0x53761ae6b2ad99120825843b9422be2781020d7d)|
|HasDistributorHandler (`null _targetToken`)| **1544142** |[0x53761ae6b2ad99120825843b9422be2781020d7d](https://kovan.etherscan.io/address/0x53761ae6b2ad99120825843b9422be2781020d7d)| |HasVestingHandler (`null _targetToken`)| **1544142** |[0x53761ae6b2ad99120825843b9422be2781020d7d](https://kovan.etherscan.io/address/0x53761ae6b2ad99120825843b9422be2781020d7d)| |DistributorHasVestingHandler (`null _targetToken`)| **1544142** |[0x53761ae6b2ad99120825843b9422be2781020d7d](https://kovan.etherscan.io/address/0x53761ae6b2ad99120825843b9422be2781020d7d)| |VestingHasDistributorHandler (`null _targetToken`)| **1544142** |[0x53761ae6b2ad99120825843b9422be2781020d7d](https://kovan.etherscan.io/address/0x53761ae6b2ad99120825843b9422be2781020d7d)|  
