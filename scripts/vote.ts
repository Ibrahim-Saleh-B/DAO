import { developmentChains, PROPOSAL_FILE, VOTING_PERIOD } from "../helper-hardhat-config";
import {ethers, network} from "hardhat";

import * as fs from "fs";
import { moveBlocks } from "../helpers";

const VOTE_NO = 0;
const VOTE_YES = 1;
const VOTE_ABSTAIN = 2;

export async function vote(proposalId: string) {

    const governor = await ethers.getContract("GovernorContract");
    const voteTx = await governor.castVoteWithReason(proposalId, VOTE_YES, "test raison...");

    await voteTx.wait(1);

    let proposalState = await governor.state(proposalId);

    if(developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1);
    }

    proposalState = await governor.state(proposalId);
}

const proposals = JSON.parse(fs.readFileSync(PROPOSAL_FILE, "utf-8"));
const proposalId = proposals[network.config.chainId!][0];
vote(proposalId).then(() => process.exit(0)).catch(err => {console.log(err), process.exit(1)});