# Social Media NFT (ERC-7847)

This is a Hardhat project showcasing a proposed ERC-7847 “Social Media NFT.” It combines an ERC-721 contract with an auto-incremented `createPost` function that emits `PubEvent` for on-chain social posts.

Standard explained in [ERC-7847: Social Media NFT](https://ethereum-magicians.org/t/erc-7847-social-media-nfts/22280).

## Features

- **ERC-721 Compliant**: Uses OpenZeppelin libraries.
- **Auto-Incremented Token IDs**: No need to specify token IDs.
- **createPost Function**: Mints a token and emits `PubEvent` with post data.
- **Testing**: A Hardhat test suite verifies contract functionality.

## Setup

1. **Install**: `npm install`
2. **Compile**: `npx hardhat compile`
3. **Test**: `npx hardhat test`
4. **Deploy**: Edit `hardhat.config.js` and run:

    ```bash
    npx hardhat run scripts/deploy.js --network <networkName>
    ```

## File Overview

```bash
contracts/
  SocialMediaNFT.sol        # Main contract
test/
  SocialMediaNFT.test.js    # Test suite
scripts/
  deploy.js                 # Example deployment script
hardhat.config.js
package.json
.gitignore
```

## License

MIT
