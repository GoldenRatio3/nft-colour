const { expect } = require("chai");
const { ethers } = require("hardhat");

const abi = require("../artifacts/contracts/Colour.sol/Colour.json").abi;

describe("Colours", () => {
  let colour, owner, IColour;

  beforeEach(async () => {
    const Colour = await ethers.getContractFactory("Colour");
    colour = await Colour.deploy();
    [owner] = await ethers.getSigners();
    IColour = new ethers.utils.Interface(abi);
    await colour.deployed();
  });

  it("should deploy Colours smart contract", async () => {
    expect(await colour.address).to.not.equal("");
    expect(await colour.address).to.not.equal(0x0);
    expect(await colour.address).to.not.equal(null);
    expect(await colour.address).to.not.equal(undefined);
  });

  it("has a name", async () => {
    const name = await colour.name();
    expect(name).to.equal("Colour");
  });

  it("has a symbol", async () => {
    const symbol = await colour.symbol();
    expect(symbol).to.equal("COLOUR");
  });

  describe("minting", () => {
    it("creates a new token", async () => {
      const result = await colour.mint("#FFFFFF");
      const balance = await colour.balanceOf(owner.address);
      const input = await IColour.decodeFunctionData("mint", result.data);

      expect(balance).to.equal(1);
      expect(result.from).to.equal(owner.address);
      expect(result.to).to.equal(colour.address);
      expect(input._colour).to.equal("#FFFFFF");
    });

    it("creates new token with the same colour", async () => {
      expect(colour.mint("#FFFFFF")).to.be.revertedWith(
        "colour needs to be unique"
      );
    });
  });

  describe("indexing", async () => {
    it("lists colours", async () => {
      // mint three tokens
      await colour.mint("#FFFFFF");
      await colour.mint("#000000");
      await colour.mint("#EC026B");
      const total = await colour.totalSupply();

      let colourStr;
      const result = [];

      for (let i = 0; i < total; i++) {
        colourStr = await colour.colours(i);
        result.push(colourStr);
      }
      const expected = ["#FFFFFF", "#000000", "#EC026B"];
      expect(result.join(",")).to.be.equal(expected.join(","));
    });
  });
});
