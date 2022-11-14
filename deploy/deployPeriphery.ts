import { Wallet, Provider, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

import { sk } from "../.secret"
import { dev, prod} from '../scripts/deployed'

export default async function (hre: HardhatRuntimeEnvironment) {

  const netType = process.env.NET_TYPE
  const perName = process.env.PER_NAME
  const contracts = netType === 'dev' ? dev : prod
  const fee = process.env.FEE
  console.log('nettype: ', netType)
  console.log('contracts: ', contracts)
  console.log('fee: ', fee)
  console.log('periphery name: ', perName)

  const weth = contracts.wrapChainToken
  const factory = contracts.factory

  // Initialize the wallet.
  const provider = new Provider(hre.userConfig.zkSyncDeploy?.zkSyncNetwork);
  const wallet = new Wallet(sk);

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const contractFactory = await deployer.loadArtifact(perName);

  const args = [
    factory, weth
  ]
  console.log('args: ', args)
  const deploymentFee = await deployer.estimateDeployFee(contractFactory, args);
  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  if (Number(parsedFee) >= 0.3) {
    console.log('too much fee, revert!')
    return
  }
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  const periphery = await deployer.deploy(contractFactory, args);

  //obtain the Constructor Arguments
  console.log("constructor args:" + periphery.interface.encodeDeploy(args));

  // Show the contract info.
  const contractAddress = periphery.address;
  console.log(`${contractFactory.contractName} was deployed to ${contractAddress}`);
}