pragma solidity ^0.8.9;

import "@openzeppelin/contracts/governance/TimeLockController.sol";

contract TimeLock is TimelockController {

    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors
    ) TimelockController(minDelay, proposers, executors) {}
}