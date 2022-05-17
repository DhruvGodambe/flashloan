const {ethers} = require("hardhat");
const WethInterface = require("../artifacts/contracts/WethInterface.sol/WethInterface.json");

async function main() {
    const [account] = await ethers.getSigners();
    const rinkebyWeth = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
    const kovanWeth = "0xd0a1e359811322d97991e03f863a0c30c2cf029c";
    
    const flashloanV3Address = "0xc5258F923DaBD87AC86cD82E379f1ffD02E43E22";

    const WethAddress = kovanWeth;
    console.log("account address:", account.address)

    const Weth = new ethers.Contract(WethAddress, WethInterface.abi, account);

    // const tx = await Weth.connect(account).deposit({
    //     value: "55000000000000000" // 0.055
    // })
    // console.log(tx);

    console.log("balance of", account.address, " : ", (await Weth.balanceOf(account.address)).toString())
    console.log("balance of", flashloanV3Address, " : ", (await Weth.balanceOf(flashloanV3Address)).toString())
}

main();