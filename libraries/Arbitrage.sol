// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
        ExactInputSingleParams memory params
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
    address DAI = 0xaD6D458402F60fD3Bd25163575031ACDce07538D;
    address WETH = 0xc778417E063141139Fce010982780140Aa0cD5Ab;

    address uniswapV3SwapRouter = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    address sushiswapV2SwapRouter = 0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506;
    
    ISwapRouterV03 uniswapRouter = ISwapRouterV03(uniswapV3SwapRouter);
    ISwapRouterV02 sushiswapRouter = ISwapRouterV02(sushiswapV2SwapRouter);

    IERC20 erc20Weth = IERC20(WETH);
    IERC20 erc20Dai = IERC20(DAI);
    
    event UniswapTradeExecuted(uint256);
    event SushiswapTradeExecuted(string);

    function executeUniswapTrade(uint amountIn, address token0, address token1) internal returns(uint256 amountOut){
        
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

        address[] memory path;
        path = new address[](2); 
        path[0] = token0;
        path[1] = token1;

        sushiswapRouter.swapExactTokensForTokens(_amountIn, 0, path, msg.sender, block.timestamp);

        emit SushiswapTradeExecuted("HAHA");
    }

    function ArbIt(uint amount_in, string memory currency) public {
        address tokenIn;
        address tokenOut;

        if(keccak256(abi.encodePacked(currency)) == keccak256(abi.encodePacked("WETH"))) {
            erc20Weth.approve(uniswapV3SwapRouter, amount_in);
            uint256 amountOut = executeUniswapTrade(amount_in, WETH, DAI);
            
            erc20Dai.approve(sushiswapV2SwapRouter, amountOut);
            executeSushiswapTrade(amountOut, tokenOut, tokenIn);

        } else if (keccak256(abi.encodePacked(currency)) == keccak256(abi.encodePacked("DAI"))) {
            erc20Dai.approve(uniswapV3SwapRouter, amount_in);
            uint256 amountOut = executeUniswapTrade(amount_in, DAI, WETH);
            
            erc20Weth.approve(sushiswapV2SwapRouter, amountOut);
            executeSushiswapTrade(amountOut, WETH, DAI);
            
        }

    }

    function transferWeth() public {
        uint balance = erc20Weth.balanceOf(address(this));
        erc20Weth.transfer(msg.sender, balance);
    }
}