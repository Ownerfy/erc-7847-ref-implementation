// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title ERC-7847 Social Media NFT using ERC-1155
 *
 * @dev Inherits from OpenZeppelin's ERC1155 and Ownable, and adds the `createPost` function
 *      required by the ERC-7847 spec. Token IDs are auto-incremented starting at 0.
 *      Compatible with Solidity 0.8.20.
 */
contract EtchV1 is ERC1155, ERC1155Supply, AccessControl {
    // -------------------------------------------------
    // Storage
    // -------------------------------------------------

    // Mapping of tokenId -> URI
    mapping(uint256 => string) private _tokenURIs;

    // Add a variable to track the highest token ID
    uint256 private _highestTokenId;

    // Add role identifier
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /**
     * @dev Emitted whenever a new social media post is created (ERC-7847).
     */
    event PubEvent(
        bytes32 id,
        bytes32 indexed pubkey,
        uint256 created_at,
        uint32 indexed kind,
        string content,
        string tags,
        string sig
    );

    /**
     * @dev Constructor initializes the contract with a base URI for metadata and sets up roles
     */
    constructor() ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    // -------------------------------------------------
    // Internal & Private Functions
    // -------------------------------------------------

    /**
     * @dev Internal function to mint tokens with a specified ID
     */
    function _mintToken(
        address recipient,
        uint256 tokenId,
        string memory url,
        uint256 quantity,
        bool allowMultiple
    ) internal returns (uint256) {
        if (!allowMultiple) {
            require(totalSupply(tokenId) == 0, "Token already exists");
        }

        _mint(recipient, tokenId, quantity, "");
        _tokenURIs[tokenId] = url;

        // Update highest token ID if necessary
        if (tokenId > _highestTokenId) {
            _highestTokenId = tokenId;
        }

        return tokenId;
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    // -------------------------------------------------
    // External / Public Functions
    // -------------------------------------------------

    /**
     * @dev Creates a new post (mints a new token) and emits `PubEvent` (ERC-7847).
     * Can only be called by addresses with MINTER_ROLE.
     */
    function createPost(
        string memory url,
        uint256 tokenId,
        bytes32 id,
        bytes32 pubkey,
        uint256 created_at,
        uint32 kind,
        string memory content,
        string memory tags,
        string memory sig,
        uint256 quantity,
        bool allowMultiple
    ) public onlyRole(MINTER_ROLE) {
        _mintToken(msg.sender, tokenId, url, quantity, allowMultiple);

        emit PubEvent(id, pubkey, created_at, kind, content, tags, sig);
    }

    /**
     * @dev Updates an existing post's URI and emits a new PubEvent
     * Can only be called by addresses with MINTER_ROLE.
     */
    function updatePost(
        uint256 tokenId,
        string memory newUrl,
        bytes32 id,
        bytes32 pubkey,
        uint256 created_at,
        uint32 kind,
        string memory content,
        string memory tags,
        string memory sig
    ) public onlyRole(MINTER_ROLE) {
        require(totalSupply(tokenId) > 0, "Post does not exist");

        _tokenURIs[tokenId] = newUrl;
        emit PubEvent(id, pubkey, created_at, kind, content, tags, sig);
    }

    /**
     * @dev Override the uri function to return token-specific URIs
     */
    function uri(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    /**
     * @dev Returns the total number of unique token IDs that have been minted
     */
    function totalPosts() external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i <= _highestTokenId; i++) {
            if (totalSupply(i) > 0) count++;
        }
        return count;
    }

    /**
     * @dev Required override for AccessControl when using ERC1155
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
