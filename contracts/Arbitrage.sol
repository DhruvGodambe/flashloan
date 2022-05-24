// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface ISwapRouterV03 {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(
        ExactInputSingleParams calldata params
    ) external returns (uint256 amountOut);
}

interface ISwapRouterV02 {
    function WETH() external pure returns (address);

    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transfer(address to, uint256 amount) external returns (bool);
}

contract Arbitrage {
    address DAI = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063;
    address WETH = 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619;
    address WMATIC = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;

    address uniswapV3SwapRouter = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    address sushiswapV2SwapRouter = 0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506;
    
    ISwapRouterV03 uniswapRouter = ISwapRouterV03(uniswapV3SwapRouter);
    ISwapRouterV02 sushiswapRouter = ISwapRouterV02(sushiswapV2SwapRouter);

    IERC20 erc20Weth = IERC20(WETH);
    IERC20 erc20Dai = IERC20(DAI);
    
    event UniswapTradeExecuted(uint256);
    event SushiswapTradeExecuted(uint[]);

    function executeUniswapTrade(uint amountIn, address token0, address token1) internal returns(uint256 amountOut){
        IERC20(token0).approve(uniswapV3SwapRouter, amountIn);
        
        ISwapRouterV03.ExactInputSingleParams memory params =
            ISwapRouterV03.ExactInputSingleParams({
                tokenIn: token0,
                tokenOut: token1,
                fee: 3000,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        amountOut = uniswapRouter.exactInputSingle(params);
        emit UniswapTradeExecuted(amountOut);
    }

    function executeSushiswapTrade(uint _amountIn, address token0, address token1) internal {
        IERC20(token0).approve(sushiswapV2SwapRouter, _amountIn);

        address[] memory path;
        path = new address[](2); 
        path[0] = token0;
        path[1] = token1;

        uint[] memory amounts = sushiswapRouter.swapExactTokensForTokens(_amountIn, 0, path, address(this), block.timestamp);

        emit SushiswapTradeExecuted(amounts);
    }

    function ArbIt(uint amount_in, address currency) public {

        if(currency == WETH) {
            uint256 amountOut = executeUniswapTrade(amount_in, WETH, DAI);
            
            executeSushiswapTrade(amountOut, DAI, WETH);

        } else if (currency == DAI) {
            uint256 amountOut = executeUniswapTrade(amount_in, DAI, WETH);
            
            executeSushiswapTrade(amountOut, WETH, DAI);
            
        }

    }

    // function transferERC20(address asset) public {
    //     uint balance = IERC20(asset).balanceOf(address(this));
    //     IERC20(asset).transfer(owner, balance);
    // }
}