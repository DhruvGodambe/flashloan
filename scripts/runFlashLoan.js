// const ethers = require("ethers");
// const flashloanV2Abi = require("../artifacts/contracts/v2/FlashloanV2.sol/FlashloanV2.json");
const flashloanV3Abi = require("../artifacts/contracts/v3/FlashloanV3.sol/FlashloanV3.json");
const WethInterface = require("../artifacts/contracts/WethInterface.sol/WethInterface.json");

async function main() {
    const [account] = await ethers.getSigners();
    const MINIMUM_FLASHLOAN_WETH_BALANCE = 55000000000000000;

    const flashloanV3Address = "0x64C1AFe274D1c6C1593Ef005f63d04103E404a54";
    const kovanWeth = "0xd0a1e359811322d97991e03f863a0c30c2cf029c";

    const flashloanV3 = new ethers.Contract(flashloanV3Address, flashloanV3Abi.abi, account);
    const weth = new ethers.Contract(kovanWeth, WethInterface.abi, account);

    if((await weth.balanceOf(flashloanV3.address)) < MINIMUM_FLASHLOAN_WETH_BALANCE) {
        console.log("transferring Weth...")
        const tx = await weth.connect(account).transfer(
            flashloanV3Address,
            "55000000000000000"
        )
        console.log(tx);
    }
    console.log("Executing flashloan...")

    try {
        const tx2 = await flashloanV3.flashloan(kovanWeth);
        console.log(tx2);
    } catch(e) {
        console.log(e)
    }

    const tx3 = await flashloanV3.connect(account).transferWeth(account.address);
    console.log(tx3);

    // const tx4 = await flashloanV3.connect(account).getPoolAddress();
    // console.log(tx4)
    // console.log((await tx4.wait()).events)
}

main();