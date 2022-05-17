// const ethers = require("ethers");
const flashloanV2Abi = require("../artifacts/contracts/v2/FlashloanV2.sol/FlashloanV2.json");
const flashloanV3Abi = require("../artifacts/contracts/v3/FlashloanV3.sol/FlashloanV3.json");
const WethInterface = require("../artifacts/contracts/WethInterface.sol/WethInterface.json");

async function main() {
    const [account] = await ethers.getSigners();
    const MINIMUM_FLASHLOAN_WETH_BALANCE = 55000000000000000;

    const flashloanV2Address = "0xc5258F923DaBD87AC86cD82E379f1ffD02E43E22";
    const kovanWeth = "0xd0a1e359811322d97991e03f863a0c30c2cf029c";

    const flashloanV2 = new ethers.Contract(flashloanV2Address, flashloanV2Abi.abi, account);
    const weth = new ethers.Contract(kovanWeth, WethInterface.abi, account);

    if((await weth.balanceOf(flashloanV2.address)) < MINIMUM_FLASHLOAN_WETH_BALANCE) {
        console.log("transferring Weth...")
        const tx = await weth.connect(account).transfer(
            flashloanV2Address,
            "55000000000000000"
        )
        console.log(tx);
    }
    console.log("Executing flashloan...")

    const tx2 = await flashloanV2.connect(account).flashloan(weth.address);
    console.log(tx2);
    // console.log(flashloanV2);
}

main();