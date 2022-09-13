import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ADDRESS_ZERO } from "../helper-hardhat-config";

const deployBox: DeployFunction = async(hre: HardhatRuntimeEnvironment) => {

    const {getNamedAccounts, deployments,  network } = hre;
    const { deployer } = await getNamedAccounts(); 
    const { deploy, log, get } = deployments;  

    log("Déploiement du boxContract");

    const box = await deploy("Box", {
        from: deployer,
        args:  [],
        log: true,
    });

    const boxContract = await ethers.getContract("boxContract", box.address);
    const timeLock = await ethers.getContract("TimeLock");

    const transferTx = await boxContract.transferOwnerShip(timeLock.address);
    await transferTx.wait(1);
};

export default deployBox;
deployBox.tags = ["all", "box"];