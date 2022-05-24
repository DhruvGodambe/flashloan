// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.10;

import "./aave/FlashLoanSimpleReceiverBase.sol";
import './aave/interfaces/IPoolAddressesProvider.sol';
import "../WethInterface.sol";
import "../Arbitrage.sol";

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IFaucet {
    function mint(
        address _token,
        uint256 _amount
    ) external;
}

contract FlashloanSimpleV3 is FlashLoanSimpleReceiverBase, Arbitrage {
    // IFaucet public immutable FAUCET;
    address public immutable owner;

    constructor(address _addressProvider)
        FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_addressProvider))
    {
        // FAUCET = IFaucet(_faucet);
        owner = msg.sender;
    }

    event PoolAddress(address pool);

    /**
     * @dev This function must be called only be the POOL and takes care of repaying
     * active debt positions, migrating collateral and incurring new V2 debt token debt.
     *
     * @param asset The flash loaned asset used to repay debts.
     * @param amount The flash loaned asset amount used to repay debts.
     * @param premium The premium incurred as additional debts.
     * @param initiator The address that initiated the flash loan, unused.
     * @param params The byte array containing, in this case, the arrays of aTokens and aTokenAmounts.
     */
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        //
        // This contract now has the funds requested.
        // Your logic goes here.
        //
        ArbIt(amount, asset);
        // At the end of your logic above, this contract owes
        // the flashloaned amounts + premiums.
        // Therefore ensure your contract has enough to repay
        // these amounts.
        uint amountOwed = amount + premium;
        // FAUCET.mint(asset,premium);

        // Approve the LendingPool contract allowance to *pull* the owed amount
        IERC20(asset).approve(address(POOL), amountOwed);

        return true;
    }

    function transferERC20(address _asset) public {
        IERC20(_asset).transfer(owner, IERC20(_asset).balanceOf(address(this)));
    }

    function getPoolAddress() public returns(address) {
        emit PoolAddress(address(POOL));
        return address(POOL);
    }

    function _flashloan(address[] memory assets, uint256[] memory amounts)
        internal
    {
        address receiverAddress = address(this);

        address onBehalfOf = address(this);
        bytes memory params = "";
        uint16 referralCode = 0;

        uint256[] memory modes = new uint256[](assets.length);

        // 0 = no debt (flash), 1 = stable, 2 = variable
        for (uint256 i = 0; i < assets.length; i++) {
            modes[i] = 0;
        }

        POOL.flashLoan(
            receiverAddress,
            assets,
            amounts,
            modes,
            onBehalfOf,
            params,
            referralCode
        );
    }

    /*
     *  Flash multiple assets
     */
    // function flashloan(address[] memory assets, uint256[] memory amounts)
    //     public
    //     onlyOwner
    // {
    //     _flashloan(assets, amounts);
    // }

    /*
     *  Flash loan 100000000000000000 wei (0.1 ether) worth of `_asset`
     */
    function flashloan(address _asset, uint256 _amount) public {
        uint256 amount = _amount;

        // _flashloan(assets, amounts);
        address receiverAddress = address(this);
        address asset = _asset;
        bytes memory params = "";
        uint16 referralCode = 0;

        POOL.flashLoanSimple(
            receiverAddress,
            asset,
            amount,
            params,
            referralCode
        );
    }
}
