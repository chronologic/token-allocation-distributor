TokenDistributor
----------------

- [ ] ~~setStakeholder = is not checking for empty address, check is only in constructor, recommended to move here~~
- [x] isDistributionDue - > 1 assumption will cause issues having more stakeholders than 1, as it will yield 0, this obviously will happend for tokens with 0 decimals, or in general token with small amount of decimals and high value.
- [x] For the case of small amount of valueble tokens - I would consider something like “withdraw remaining” when the remaining amount is < stakeholder (div will yield 0)
- [ ] ~~consider either not storing token address and thus making this contract reusable for further tokens, or fix all methods to use targetToken - currently it’s a mix~~
------------------------

WeghtedTokenDistributor
----------------

- [x] I would recommend to use mapping(address=>uint) for keeping weights, this seems to be safer than array and assuming matching indexes 
- [x] getPortion - consider moving getTotalWeight outside the loop or just update and store it after stakeholders update happen (it won’t change otherwise)
- [x] distrubute - getPortion is mapping back and forth the index to address - look at 1) to get rid of search (getStakeHolderIndex)
- [ ] ~~assuming all weights = 0, totalWeight =0, which leads to division by 0 (edited)~~
