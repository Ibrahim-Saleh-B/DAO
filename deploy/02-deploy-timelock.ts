import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { MIN_DELAY, PROPOSERS, EXECUTORS } from "../helper-hardhat-config";

const deployTimeLock: DeployFunction = async(hre: HardhatRuntimeEnvironment) => {

    const {getNamedAccounts, deployments,  network } = hre;
    const { deployer } = await getNamedAccounts(); 
    const { deploy, log } = deployments;

    const timelock = await deploy("TimeLock", {
        from: deployer,
        args: [MIN_DELAY, PROPOSERS, EXECUTORS],
        log: true,
    });

    log(`'TimeLock' déployé à ${timelock.address} `)
};

export default deployTimeLock;
deployTimeLock.tags = ["all", "timelock"];
