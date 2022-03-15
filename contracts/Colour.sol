// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Colour is ERC721, ERC721Enumerable {
    string[] public colours;
    mapping(string => bool) private _colourExists;

    constructor() ERC721("Colour", "COLOUR") {}

    function mint(string memory _colour) public {
        require(!_colourExists[_colour], "colour needs to be unique");
        colours.push(_colour);
        uint256 _id = colours.length - 1;
        _safeMint(msg.sender, _id);
        _colourExists[_colour] = true;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
