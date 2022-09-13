import { ethers, network } from "hardhat";
import { DESCRIPTION, developmentChains, FUNC, FUNC_ARGS, VOTING_DELAY, PROPOSAL_FILE } from "../helper-hardhat-config";
import { moveBlocks } from "../helpers";

import * as fs from "fs";

export async function makeProposal(functionToCall: string, args: number[], proposalDescription: string) {

    const governor = await ethers.getContract("GovernorContract");
    const box = await ethers.getContract("Box");

    const encodedFunctionCall = box.interface.encodeFunctionData(functionToCall, args);

    const proposeTx = await governor.propose([box.address], [0], [encodedFunctionCall], proposalDescription);

    const proposeReceipt = await proposeTx.wait(1);

    if(developmentChains.includes(network.name)) {

        await moveBlocks(VOTING_DELAY + 1);
    }

    const proposalId = proposeReceipt.events[0].args.proposalId;

    fs.writeFileSync(
        PROPOSAL_FILE,
        JSON.stringify({
            [network.config.chainId!.toString()]: [proposalId.toString()],
        })
    );
}

makeProposal(FUNC, [FUNC_ARGS], DESCRIPTION).then(() => process.exit(0) ).catch( err => {
    console.log(err), process.exit(1);
});