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
|HasContracts| **298874** | [0xe362905a12b5c930ff2cd2a67dcaa63fa4f4812b](https://ropsten.etherscan.io/address/0xe362905a12b5c930ff2cd2a67dcaa63fa4f4812b)|
|TokenHandler| **817108** | [0xc324c5e80ccc3d3f3378c37f65654aa84a6d64b4](https://ropsten.etherscan.io/address/0xc324c5e80ccc3d3f3378c37f65654aa84a6d64b4)|
|VestingHandler| **750843** | [0x5fe9ed691159d01b040a4d54f186e92fcbea495d](https://ropsten.etherscan.io/address/0x5fe9ed691159d01b040a4d54f186e92fcbea495d)|
|TokenDistributor| **817108** | [0xc324c5e80ccc3d3f3378c37f65654aa84a6d64b4](https://ropsten.etherscan.io/address/0xc324c5e80ccc3d3f3378c37f65654aa84a6d64b4)|  
|WeightedTokenDistributor| **1139882** |[0xd24e0a367ee372baa0b7be01186ff69ff62a3cc7](https://ropsten.etherscan.io/address/0xd24e0a367ee372baa0b7be01186ff69ff62a3cc7)|  
|WithVestingContract| **1559142** |[0x08ebc99f994b3b0982aedaf537424db145d0031a](https://ropsten.etherscan.io/address/0x08ebc99f994b3b0982aedaf537424db145d0031a)|  
|HasDistributorHandler| **487789** |[0x4d71fff9e31e31d2c45c859ca684549952223a6f](https://ropsten.etherscan.io/address/0x4d71fff9e31e31d2c45c859ca684549952223a6f)|  
|HasVestingHandler| **1559142** |[0xa18f2357e709ffa84a15e8fd458493ae10b719d6](https://ropsten.etherscan.io/address/0xa18f2357e709ffa84a15e8fd458493ae10b719d6)|  
|DistributorHasVestingHandler| **1310369** |[0x36180f92b81eb026d550a58b8bccbcad873d8c73](https://ropsten.etherscan.io/address/0x36180f92b81eb026d550a58b8bccbcad873d8c73)|  
|VestingHasDistributorHandler| **997525** |[0x40efa2e35838433052b769aecfa32ee9825bb25c](https://ropsten.etherscan.io/address/0x40efa2e35838433052b769aecfa32ee9825bb25c)|  

#### Kovan

|Contract| Deployment Cost | Address |
|-|-| --|
|HasContracts (`null _targetToken`)| **298874** | [0x8520afbebc3a5bd16d71be07d7cec354fd9afcd6](https://kovan.etherscan.io/address/0x8520afbebc3a5bd16d71be07d7cec354fd9afcd6)|  
|TokenHandler (`null _targetToken`)| **800828** | [0x1501fb5e28d20187ecd3e9ee7e9ebd336da183c3](https://kovan.etherscan.io/address/0x1501fb5e28d20187ecd3e9ee7e9ebd336da183c3)|  
|VestingHandler (`null _targetToken`)| **750843** | [0x6a12a18ee3bcfb026f853d0003671204ac807257](https://kovan.etherscan.io/address/0x6a12a18ee3bcfb026f853d0003671204ac807257)|  
|TokenDistributor (`null _targetToken`)| **800828** | [0x1501fb5e28d20187ecd3e9ee7e9ebd336da183c3](https://kovan.etherscan.io/address/0x1501fb5e28d20187ecd3e9ee7e9ebd336da183c3)|  
|WeightedTokenDistributor (`null _targetToken`)| **1130083** |[0x00bd2ee631905348190f3470ba0d71354f0c3d91](https://kovan.etherscan.io/address/0x00bd2ee631905348190f3470ba0d71354f0c3d91)|  
|WithVestingContract (`null _targetToken`)| **1555796** |[0xc9e244a6447ea6c663aab0b78c1855e76f36d1f2](https://kovan.etherscan.io/address/0xc9e244a6447ea6c663aab0b78c1855e76f36d1f2)|
|HasDistributorHandler (`null _targetToken`)| **487789** |[0x5f99e32b30b4f9696eeef04c2d4e81a8b793a051](https://kovan.etherscan.io/address/0x5f99e32b30b4f9696eeef04c2d4e81a8b793a051)| |HasVestingHandler (`null _targetToken`)| **1544142** |[0x11a6f8b3c3ee1e8f405b0f110071d02528e04769](https://kovan.etherscan.io/address/0x11a6f8b3c3ee1e8f405b0f110071d02528e04769)| |DistributorHasVestingHandler (`null _targetToken`)| **1294089** |[0x27c73530381cdd9e1f94b4009ccb4c09bc7709a1](https://kovan.etherscan.io/address/0x27c73530381cdd9e1f94b4009ccb4c09bc7709a1)| |VestingHasDistributorHandler (`null _targetToken`)| **1544142** |[0x6dcda6831ca7d4362dde928b9362e39e050d4da0](https://kovan.etherscan.io/address/0x6dcda6831ca7d4362dde928b9362e39e050d4da0)|  
