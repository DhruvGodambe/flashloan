// const ethers = require("ethers");

async function main() {
    const [account] = await ethers.getSigners();

    const aavePoolAddressesProvider = "0x651b8A8cA545b251a8f49B57D5838Da0a8DFbEF9"
    const kovanWeth = "0xd0a1e359811322d97991e03f863a0c30c2cf029c";
    
    const FlashloanV3 = await ethers.getContractFactory("FlashloanV3");
    const flashloanV3 = await FlashloanV3.deploy(aavePoolAddressesProvider, kovanWeth);
    await flashloanV3.deployed();

    console.log("flashloanV3 contract deployed at: ", flashloanV3.address);
}

main();