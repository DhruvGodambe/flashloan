// const ethers = require("ethers");
// const flashloanV2Abi = require("../artifacts/contracts/v2/FlashloanV2.sol/FlashloanV2.json");
const flashloanSimpleV3Abi = require("../artifacts/contracts/v3/FlashloanSimpleV3.sol/FlashloanSimpleV3.json");
const WethInterface = require("../artifacts/contracts/WethInterface.sol/WethInterface.json");

async function main() {
    const [account] = await ethers.getSigners();
    const MINIMUM_FLASHLOAN_WETH_BALANCE = 55000000000000000;

    const flashloanSimpleV3Address = "0x9061E1aF32e7d345FfDbDabEBc2d915fAf667bfe";
    const kovanWeth = "0xd0a1e359811322d97991e03f863a0c30c2cf029c";
    const rinkebyWeth = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
    const rinkebyDai = "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735";

    const flashloanSimpleV3 = new ethers.Contract(flashloanSimpleV3Address, flashloanSimpleV3Abi.abi, account);
    const weth = new ethers.Contract(rinkebyWeth, WethInterface.abi, account);

    if((await weth.balanceOf(flashloanSimpleV3.address)) < MINIMUM_FLASHLOAN_WETH_BALANCE) {
        console.log("transferring Weth...")
        const tx = await weth.connect(account).transfer(
            flashloanSimpleV3Address,
            "55000000000000000"
        )
        console.log(tx);
    }
    console.log("Executing flashloan...")

    try {
        const tx2 = await flashloanSimpleV3.flashloan(weth.address);
        console.log(tx2);
    } catch(e) {
        console.log(e)
    }

    const tx3 = await flashloanSimpleV3.connect(account).transferWeth(weth.address);
    console.log(tx3);

    // const tx4 = await flashloanSimpleV3.connect(account).getPoolAddress();
    // console.log(tx4)
    // console.log((await tx4.wait()).events)
}

main();