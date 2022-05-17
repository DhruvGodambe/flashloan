const { ethers } = require("ethers");

async function main() {
    const url = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API}`; // get alchemy api by creating account from www.alchemy.com
    let provider = new ethers.providers.JsonRpcProvider(url);

    const txid = "0xb2629529a597580f3bd2b51d56f51068af94a3b0084e8f95e31114ceca603b75"; // this transaction id will be returned by the cybavo callback object
    tx = await provider.getTransactionReceipt(txid);
    // console.log(tx)
    const mintingFactory = "0x39fCca39d3dDf922d5D01217527449BA6e6e80c4";
    filteredEvents = tx.logs.filter(log => log.address == mintingFactory);
    console.log(filteredEvents);


    function mintNFTLog(filteredEvents) {
        let mintNFTabi = [ "event NFTMinted(address nftContract, uint256 tokenId)" ];
        let iface = new ethers.utils.Interface(mintNFTabi);

        filteredEvents.forEach(log => {
            let parsed = iface.parseLog(log);

            let {nftContract, tokenId} = parsed.args;
            console.log(nftContract, parseInt(tokenId))
        })
    }

    function createNFTContractLog(filteredEvents) {
        let createNFTContractabi = [ "event NFTContractCreated(string name, string symbol, address nftContract, address creator)" ];
        let iface = new ethers.utils.Interface(createNFTContractabi);

        filteredEvents.forEach(log => {
            let parsed = iface.parseLog(log);
    
            let {name, symbol, nftContract, creator} = parsed.args;
            console.log(name, symbol, nftContract, creator);
        })
    }

    mintNFTLog(filteredEvents)

}

main();