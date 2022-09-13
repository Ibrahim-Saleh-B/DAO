import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ADDRESS_ZERO } from "../helper-hardhat-config";

const setupGovernanceContracts: DeployFunction = async(hre: HardhatRuntimeEnvironment) => {

    const {getNamedAccounts, deployments,  network } = hre;
    const { deployer } = await getNamedAccounts(); 
    const { deploy, log, get } = deployments;  
    
    
    const governanceToken = await ethers.getContract("governanceToken", deployer);
    const timeLock = await ethers.getContract("TimeLock", deployer);
    const governor = await ethers.getContract("GovernorContract", deployer);

    log("Setting up governance roles...");
    const proposerRole = await timeLock.PROPOSER_ROLE();
    const executorRole = await timeLock.EXECUTOR_ROLE();
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

    const proposerTx = await timeLock.grantRole(proposerRole, governor.address);
    await proposerTx.wait(1);

    const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO);
    await executorTx.wait(1);

    const revokeTx = await timeLock.grantRole(adminRole, deployer);
    await revokeTx.wait(1);
};

export default setupGovernanceContracts;
setupGovernanceContracts.tags = ["all", "setup"];
