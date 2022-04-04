//SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract ICO {

    uint public campaignId;

    constructor() {
        campaignId = 1;
    }

    struct Campaign {
        address initiator;
        uint participant;
        address tokenAddress;
        uint campaignStartTime;
        uint campaignEndTime;
        uint tokenPerETHInCampaign;
        uint maxTokenLiquidity;
        uint tokenLiquidityAchived;
    }

    mapping(uint => Campaign) public campaigns;
    mapping(address => uint) public userDepositedCampaigns;
    mapping(address => uint) public userETHBalance;

    receive () payable external {

    }

    function startCampaign(
        address token_, 
        uint endTime_, 
        uint tokenPerETHInCampaign_, 
        uint maxTokenLiquidity_
    ) 
    public 
    {
        Campaign storage campaign = campaigns[campaignId];
        require(campaign.initiator == address(0), "Campaign Has Been Already Created!");
        campaign.initiator = msg.sender;
        campaign.tokenAddress = token_;
        campaign.campaignStartTime = block.timestamp;
        campaign.campaignEndTime = endTime_;
        campaign.tokenPerETHInCampaign = tokenPerETHInCampaign_;
        campaign.maxTokenLiquidity = maxTokenLiquidity_;
        IERC20(token_).approve(address(this), maxTokenLiquidity_ * 1e18);
        IERC20(token_).transferFrom(msg.sender,address(this), maxTokenLiquidity_ * 1e18);
        campaignId++;
    }

    function depositETH() public payable {
        userETHBalance[msg.sender] += msg.value;
    }

    function calculateMaxNormalPurchase(uint campaignId_) public view returns (uint) {
        Campaign storage campaign = campaigns[campaignId_];
        uint balance_ = userETHBalance[msg.sender];
        uint maxPurchase_ = uint(balance_ * campaign.tokenPerETHInCampaign/1e18);
        return maxPurchase_;
    }

    function normalPurchase(
        uint campaignId_,
        uint amount_
    )
    public
    {
        Campaign storage campaign = campaigns[campaignId_];
        uint balance_ = calculateMaxNormalPurchase(campaignId_);
        require(amount_ <= balance_, "Not Have Sufficient Balance");
        require(campaign.tokenLiquidityAchived <= campaign.maxTokenLiquidity,"Max Cap Has Been Reached!");
        require(campaign.campaignEndTime >= block.timestamp, "Presale Has Been Closed!");
        IERC20(campaign.tokenAddress).transfer(msg.sender, amount_ * 1e18);
        campaign.tokenLiquidityAchived += amount_;
    }

    function endCampaign(
        uint campaignId_
    )
    public
    {
        Campaign storage campaign = campaigns[campaignId_];
        campaign.campaignEndTime = block.timestamp;     
    }

    function getETH(
        uint campaignId_
    ) 
    public
    payable
    {
        Campaign storage campaign = campaigns[campaignId_];
        uint amountToBeReverted = campaign.maxTokenLiquidity - campaign.tokenLiquidityAchived;
        address payable initiator_ = payable(msg.sender);
        initiator_.transfer(amountToBeReverted * 1e18);
    }

}