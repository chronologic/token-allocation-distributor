# Audit of Token Allocator

September 6, 2018

This audit refactored some major pieces of the code base.

## TokenHandler.sol

 - `setTargetToken(addrss _targetToken)` does not allow the target token to be set to a new address later. _This was refactored to allow the owner to change the target token at a later date._

  - 

## TokenDistributor.sol

 - Does the `_distribute()` function need to emit an event or would it be okay to simply `revert` with an error message of insufficient balance?