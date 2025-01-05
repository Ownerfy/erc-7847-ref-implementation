const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SocialMediaNFT", function () {
  let SocialMediaNFT, socialMediaNFT;
  let owner, addr1;

  before(async function () {
    [owner, addr1] = await ethers.getSigners();
    SocialMediaNFT = await ethers.getContractFactory("SocialMediaNFT");
  });

  beforeEach(async function () {
    socialMediaNFT = await SocialMediaNFT.deploy();
    await socialMediaNFT.deployed();
  });

  it("Should deploy successfully and set initial currentTokenId to 0", async function () {
    expect(await socialMediaNFT.currentTokenId()).to.equal(0);
  });

  it("Should create a post and increment tokenId", async function () {
    // Create a new post
    const tx = await socialMediaNFT.createPost(
      "https://example.com/metadata.json",
      "0xd283f3979d00cb5493f2da07819695bc299fba24aa6e0bacb484fe07a2fc0ae0",
      "0x4659db3b248cae1bb6856ee63308af6c9c15239e3bb76f425fbacdd84bb15330",
      "0xc3cea60c7e452527daae9d5eb78805f44aac272a8075eeb6779be011e572fff2",
      1736063047889,
      1, // kind
      "Hello, world!", // content
      '["imeta", "url https://nostr.build/i/my-image.jpg", "m image/jpeg" "dim 3024x4032", "alt A scenic photo overlooking the coast of Costa Rica", "fallback https://nostrcheck.me/alt1.jpg", "fallback https://void.cat/alt1.jpg"]',
      "0xc3cea60c7e452527daae9d5eb78805f44aac272a8075eeb6779be011e572fff2c3cea60c7e452527daae9d5eb78805f44aac272a8075eeb6779be011e572fff2" // sig
    );
    await tx.wait();

    // currentTokenId should now be 1
    expect(await socialMediaNFT.currentTokenId()).to.equal(1);

    const tx2 = await socialMediaNFT.createPost(
      "https://example.com/metadata2.json",
      "0xd283f3979d00cb5493f2da07819695bc299fba24aa6e0bacb484fe07a2fc0ae0",
      "0x4659db3b248cae1bb6856ee63308af6c9c15239e3bb76f425fbacdd84bb15330",
      "0xc3cea60c7e452527daae9d5eb78805f44aac272a8075eeb6779be011e572fff2",
      1736063047889,
      1, // kind
      "Hello, world!", // content
      '["imeta", "url https://nostr.build/i/my-image2.jpg", "m image/jpeg" "dim 3024x4032", "alt A scenic photo overlooking the coast of Costa Rica", "fallback https://nostrcheck.me/alt2.jpg", "fallback https://void.cat/alt2.jpg"]',
      "0xc3cea60c7e452527daae9d5eb78805f44aac272a8075eeb6779be011e572fff2c3cea60c7e452527daae9d5eb78805f44aac272a8075eeb6779be011e572fff2" // sig
    );
    await tx2.wait();

    // currentTokenId should now be 2
    expect(await socialMediaNFT.currentTokenId()).to.equal(2);

    // tokenURI(0) should be stored as "https://example.com/metadata.json"
    expect(await socialMediaNFT.tokenURI(0)).to.equal(
      "https://example.com/metadata.json"
    );
  });

  it("Should emit PubEvent with correct args on createPost", async function () {
    await expect(
      socialMediaNFT.createPost(
        "https://example.com/metadata2.json",
        "0xd283f3979d00cb5493f2da07819695bc299fba24aa6e0bacb484fe07a2fc0ae0",
        "0x4659db3b248cae1bb6856ee63308af6c9c15239e3bb76f425fbacdd84bb15330",
        "0xc3cea60c7e452527daae9d5eb78805f44aac272a8075eeb6779be011e572fff2",
        1736063047889,
        1, // kind
        "Hello, world 2!", // content
        '["imeta", "url https://nostr.build/i/my-image2.jpg", "m image/jpeg" "dim 3024x4032", "alt A scenic photo overlooking the coast of Costa Rica", "fallback https://nostrcheck.me/alt2.jpg", "fallback https://void.cat/alt2.jpg"]',
        "0xc3cea60c7e452527daae9d5eb78805f44aac272a8075eeb6779be011e572fff2c3cea60c7e452527daae9d5eb78805f44aac272a8075eeb6779be011e572fff2" // sig
      )
    )
      .to.emit(socialMediaNFT, "PubEvent")
      // We check only some arguments to keep the test simpler,
      // especially since some fields are `indexed`.
      // Hardhat Chai matchers let us verify them in a partial manner:
      .withArgs(
        0, // tokenId
        "https://example.com/metadata2.json",
        "0xd283f3979d00cb5493f2da07819695bc299fba24aa6e0bacb484fe07a2fc0ae0",
        "0x4659db3b248cae1bb6856ee63308af6c9c15239e3bb76f425fbacdd84bb15330",
        "0xc3cea60c7e452527daae9d5eb78805f44aac272a8075eeb6779be011e572fff2",
        1736063047889,
        1, // kind
        "Hello, world 2!", // content
        '["imeta", "url https://nostr.build/i/my-image2.jpg", "m image/jpeg" "dim 3024x4032", "alt A scenic photo overlooking the coast of Costa Rica", "fallback https://nostrcheck.me/alt2.jpg", "fallback https://void.cat/alt2.jpg"]',
        "0xc3cea60c7e452527daae9d5eb78805f44aac272a8075eeb6779be011e572fff2c3cea60c7e452527daae9d5eb78805f44aac272a8075eeb6779be011e572fff2" // sig
      );
  });

  it("Should allow a different account to create a post", async function () {
    // Connect contract to addr1
    const socialMediaNFT_addr1 = socialMediaNFT.connect(addr1);

    await socialMediaNFT_addr1.createPost(
      "https://example.com/addr1.json",
      "0xd283f3979d00cb5493f2da07819695bc299fba24aa6e0bacb484fe07a2fc0ae0",
      "0x4659db3b248cae1bb6856ee63308af6c9c15239e3bb76f425fbacdd84bb15330",
      "0x301de8ee9925fb0b5eb5f2e23a2c06019846f57430cbd0b1b1a8555e9c0e8e56",
      1736063047889,
      1, // kind
      "Hello, world 2!", // content
      '["imeta", "url https://nostr.build/i/my-image2.jpg", "m image/jpeg" "dim 3024x4032", "alt A scenic photo overlooking the coast of Costa Rica", "fallback https://nostrcheck.me/alt2.jpg", "fallback https://void.cat/alt2.jpg"]',
      "0xc3cea60c7e452527daae9d5eb78805f44aac272a8075eeb6779be011e572fff2c3cea60c7e452527daae9d5eb78805f44aac272a8075eeb6779be011e572fff2" // sig
    );

    // currentTokenId() should be 1 after first mint
    expect(await socialMediaNFT.currentTokenId()).to.equal(1);

    // tokenURI(0) => "https://example.com/addr1.json"
    expect(await socialMediaNFT.tokenURI(0)).to.equal(
      "https://example.com/addr1.json"
    );
  });
});
