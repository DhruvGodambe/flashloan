// const ethers = require("ethers");

async function main() {
    const [account] = await ethers.getSigners();

    const aaveLendingPoolV2Kovan = "0x88757f2f99175387ab4c6a4b3067c77a695b0349"
    const aaveLendingPoolV2 = aaveLendingPoolV2Kovan;
    const kovanWeth = "0xd0a1e359811322d97991e03f863a0c30c2cf029c";
    
    const FlashloanV2 = await ethers.getContractFactory("FlashloanV2");
    const flashloanV2 = await FlashloanV2.deploy(aaveLendingPoolV2);
    await flashloanV2.deployed();

    console.log("flashloanV2 contract deployed at: ", flashloanV2.address);
}

main();