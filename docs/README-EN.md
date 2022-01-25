# Contract Viewer

![logo](../image/logo.png)

[![Version](https://vsmarketplacebadge.apphb.com/version-short/Metaplasia.contract-viewer.svg)](https://marketplace.visualstudio.com/items?itemName=Metaplasia.contract-viewer)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/Metaplasia.contract-viewer.svg)](https://marketplace.visualstudio.com/items?itemName=Metaplasia.contract-viewer)
[![Ratings](https://vsmarketplacebadge.apphb.com/rating-star/Metaplasia.contract-viewer.svg)](https://marketplace.visualstudio.com/items?itemName=Metaplasia.contract-viewer#review-details)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](README-EN.md) | [Chinese](../README.md)

**Contract Viewer** is a VS Code extension that helps you download contract code from the blockchain viewer, just need a contract address to download, click [here](#SupportList) to see supported contracts.

> The example uses `Ethiopia Contracts`, which operates much the same way as other contract types.

## Quick start

1. Configure an API
    1. Register a user at [Erherscan](https://etherscan.io/login).
    2. After logging in, find the `API-KEYs` option to create a new API, and copy the Token content.

    ![Generate API](image/creat_api.png)

    ![Copy API](image/copy_api.jpg)
    3. Type `Config API` in the `VS Code command panel` and find the `Contract Viewer: Config API` option, then paste your Token content in the newly opened page.

    ![Config API](image/config_api.gif)
    4. Done! Now you can close this page.

2. Download a contract
    1. Type `getContract` in `VS Code's command panel` and find the `Contract Viewer: Get contract code` option.
    2. Select the type of contract you want to download.
    3. Enter the contract address.
    4. Wait for the parsing to complete.
    5. Select an **empty directory** to save the contract.
    6. Write the contract code to the file.
    ![Download contract](image/get_contract.gif)
    7. Done! Now you can view the contract you just downloaded.

## Commands

Type `Contract Viewer` in `VS Code's command panel` to retrieve all commands of `Contract Viewer`.

1. ***`Contract Viewer: Config API`***

    > Quickly open the Config API page.

2. ***`Contract Viewer: Get contract code`*** > Download contract.

    > Download the contract.

## VS Code configuration items

You can find the following `Contract Viewer` configuration items in the `VS Code User Settings`.

1. ***`contract-viewer.setting.api.eth`***
    Ethernet API configuration, if you don't configure the API, you will not be able to download contracts.

## Change Log

See Change Log [here](../CHANGELOG.md).

## SupportList

Ethereum contracts: <https://etherscan.io/>  
Binance Smart Contracts: <https://bscscan.com/>
