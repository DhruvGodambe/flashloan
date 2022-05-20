// const ethers = require("ethers");

async function main() {
    const [account] = await ethers.getSigners();

    const aavePoolAddressesProvider = "0x651b8A8cA545b251a8f49B57D5838Da0a8DFbEF9"
    const aavePoolAddressesProviderRinkeby = "0xBA6378f1c1D046e9EB0F538560BA7558546edF3C"
    const aavePoolAddressesProviderRegistry = "0x3179C833fF0035D3BD42654f3aCAE4B0908af7A7"
    const kovanWeth = "0xd0a1e359811322d97991e03f863a0c30c2cf029c";
    const rinkebyWeth = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
    const rinkebyFaucet = "0x88138CA1e9E485A1E688b030F85Bb79d63f156BA";
    
    const FlashloanSimpleV3 = await ethers.getContractFactory("FlashloanSimpleV3");
    const flashloanSimpleV3 = await FlashloanSimpleV3.deploy(aavePoolAddressesProviderRinkeby, rinkebyWeth, rinkebyFaucet);
    await flashloanSimpleV3.deployed();

    console.log("flashloanSimpleV3 contract deployed at: ", flashloanSimpleV3.address);
}

main();