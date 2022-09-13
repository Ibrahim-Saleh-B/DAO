import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployGovernanceToken: DeployFunction = async(hre: HardhatRuntimeEnvironment) => {

    const {getNamedAccounts, deployments,  network } = hre;
    const { deployer } = await getNamedAccounts(); 
    const { deploy, log } = deployments;

    log("Déploiement du Token de gouvernance");
    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        args:[],
        log: true,
        waitConfirmations: 3
    });

    log(`'GovernanceToken' déployé à ${governanceToken.address}`);

    await delegate(governanceToken.address, deployer);
};

export default deployGovernanceToken;
deployGovernanceToken.tags = ["all", "governanceToken"];

const delegate = async (governanceTokenAddress: string, delegatedAccount: string) => {

    const governanceToken = await ethers.getContractAt("GovernanceToken", governanceTokenAddress);
    const reponse = await governanceToken.delegate(delegatedAccount);

    await reponse.wait(1);
}