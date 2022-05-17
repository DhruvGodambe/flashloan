const {ethers} = require("hardhat");
const WethInterface = require("../artifacts/contracts/WethInterface.sol/WethInterface.json");

async function main() {
    const [account] = await ethers.getSigners();
    const rinkebyWeth = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
    const kovanWeth = "0xd0a1e359811322d97991e03f863a0c30c2cf029c";
    const ropstenWeth = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
    
    const flashloanV2Address = "0xc5258F923DaBD87AC86cD82E379f1ffD02E43E22";
    const ropstenSushiswapRouter = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506";

    const WethAddress = ropstenWeth;
    console.log("account address:", account.address)

    const Weth = new ethers.Contract(WethAddress, WethInterface.abi, account);

    // const tx = await Weth.connect(account).deposit({
    //     value: "55000000000000000"
    // })
    // console.log(tx);

    console.log("balance of", account.address, " : ", (await Weth.balanceOf("0x164aa3dd06b085e660A541D23594b04d5de643A1")).toString())
    // console.log("approve Weth ", account.address, " : ", (await Weth.approve(ropstenSushiswapRouter, "100000000000000000")))
    console.log("allowance to sushiswap router: ", await Weth.allowance("0x164aa3dd06b085e660A541D23594b04d5de643A1", ropstenSushiswapRouter))
    // console.log("balance of", flashloanV2Address, " : ", (await Weth.balanceOf(flashloanV2Address)).toString())
}

main();