// const ethers = require("ethers");
// const flashloanV2Abi = require("../artifacts/contracts/v2/FlashloanV2.sol/FlashloanV2.json");
const { ethers } = require("hardhat");
const flashloanSimpleV3Abi = require("../artifacts/contracts/v3/FlashloanSimpleV3.sol/FlashloanSimpleV3.json");
const WethInterface = require("../artifacts/contracts/WethInterface.sol/WethInterface.json");

async function main() {
    const [account] = await ethers.getSigners();
    const MINIMUM_FLASHLOAN_WETH_BALANCE = ethers.utils.parseEther("0.00009");

    const flashloanSimpleV3Address = "0xf3d1E06Eb29930736cDBb11E7cC177D69dBA4a9B";
    const kovanWeth = "0xd0a1e359811322d97991e03f863a0c30c2cf029c";
    const rinkebyWeth = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
    const rinkebyWeth2 = "0xd74047010D77c5901df5b0f9ca518aED56C85e8D";
    const rinkebyDai = "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735";

    const polygonDai = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
    const polygonWeth = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";

    const flashloanSimpleV3 = new ethers.Contract(flashloanSimpleV3Address, flashloanSimpleV3Abi.abi, account);
    const weth = new ethers.Contract(polygonWeth, WethInterface.abi, account);

    // if((await weth.balanceOf(flashloanSimpleV3.address)) < MINIMUM_FLASHLOAN_WETH_BALANCE) {
    //     console.log("transferring Weth...")
    //     const tx = await weth.connect(account).transfer(
    //         flashloanSimpleV3Address,
    //         MINIMUM_FLASHLOAN_WETH_BALANCE
    //     )
    //     console.log(tx);
    //     console.log("View on polygon scan: ", `https://polygonscan.com/tx/${tx.hash}`)
    // }
    // console.log("Executing flashloan...")

    // try {
    //     const tx2 = await flashloanSimpleV3.flashloan(weth.address, "10000000000000000");
    //     console.log(tx2);
    // console.log("View on polygon scan: ", `https://polygonscan.com/tx/${tx2.hash}`)

    // } catch(e) {
    //     console.log(e)
    // }

    // const tx2 = await flashloanSimpleV3.ArbIt("12690027534648603000", "DAI");
    // console.log(tx2);
    // console.log("View on polygon scan: ", `https://polygonscan.com/tx/${tx2.hash}`)


    const tx3 = await flashloanSimpleV3.transferERC20(weth.address);
    console.log(tx3);
    console.log("View on polygon scan: ", `https://polygonscan.com/tx/${tx3.hash}`)

    // const tx4 = await flashloanSimpleV3.connect(account).getPoolAddress();
    // console.log(tx4)
    // console.log((await tx4.wait()).events)
}

main();