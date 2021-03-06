const {ethers} = require("hardhat");
const WethInterface = require("../artifacts/contracts/WethInterface.sol/WethInterface.json");

async function main() {
    const [account] = await ethers.getSigners();
    const rinkebyWeth = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
    const rinkebyWeth2 = "0xd74047010D77c5901df5b0f9ca518aED56C85e8D";
    const kovanWeth = "0xd0a1e359811322d97991e03f863a0c30c2cf029c";
    
    const flashloanSimpleV3Address = "0x28AbC4c38D1Ddda364a33ea691fc079F5A8da0b9";

    const WethAddress = rinkebyWeth2;
    console.log("account address:", account.address)

    const Weth = new ethers.Contract(WethAddress, WethInterface.abi, account);

    const tx = await Weth.connect(account).deposit({
        value: "55000000000000000" // 0.055
    })
    console.log(tx);

    console.log("balance of", account.address, " : ", (await Weth.balanceOf(account.address)).toString())
    // console.log("balance of", flashloanSimpleV3Address, " : ", (await Weth.balanceOf(flashloanSimpleV3Address)).toString())
}

main();