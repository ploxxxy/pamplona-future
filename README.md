# Pamplona Future
### An open-source private server implementation for Mirror's Edge™: Catalyst.
Currently available as a work-in-progress proof of concept. End goal is to replicate the server logic and social features Catalyst had originally.

![image](https://github.com/user-attachments/assets/0edcb839-c66c-4f55-8503-e2dabb4628e5)

## Current Progress
More info will be available in the [wiki](https://github.com/ploxxxy/pamplona-future/wiki).
- [x] Patch the game's SSL certificate verification (Big thanks to WarrantyVoider)
- [x] Collect and analyze a ton of network packets
- [x] Implement EA's packet format
- [x] Create a mock Blaze server to make the game think we're online
- [ ] Replicate core parts of the Blaze server:
  - [ ] Authentication
  - [ ] Per-player config (maybe)
  - [ ] Real time notifications (created a UGC, beat a record, etc)
  - [ ] Player location updates
  - [ ] Runner's Emblem updates
- [x] Create a mock Gateway API to make the game think we're online
- [ ] Replicate core parts of the Gateway:
  - [x] Player inventory & profile
  - [x] Player customization
  - [x] Player progress
  - [x] Hackable billboards
  - [x] Dashes
  - [x] Beat L.Es
  - [ ] TimeTrials
  - [ ] Replays
  - [ ] Followers
  - [ ] Notifications
  - [ ] Bookmarks
  - [ ] Stats & latest played
  - [ ] Divisions
  - [ ] Authentication

## Setup
### Requirements
- Recent version of Node.js installed using the official Windows installer or via [fnm](https://github.com/Schniz/fnm) on other platforms
- Local PostgreSQL server and permission to create databases

### Installation
Once you have Node.js properly installed, clone the repository and run `npm install` from the root of the project. This will install all the necessary packages. Now, we will prepare the database.

Create a new PostgreSQL database and make sure you can connect to it with an account that has editing permissions. Then, create a new file called `.env` in the project root. In this file add a connection string in the following format:

```
DATABASE_URL=postgresql://[username]:[password]@localhost:5432/[database]
```

To test the connection and initialize the database, run the command `npm run resetdb`. Once that completes successfully, run `npm start` to launch the server.

### Connecting
Add [catalyst-mitm](https://github.com/ploxxxy/catalyst-mitm) to the installation directory of the game to redirect all traffic to localhost. When launched, the game should connect to your new server.

## Credits & Resources
- WarrantyVoider
  - https://github.com/zeroKilo/BFP4FToolsWV
  - https://github.com/zeroKilo/BF1SuckerWV
  - https://github.com/zeroKilo/LSX-Dumper
- Retard010xx
  - https://www.unknowncheats.me/forum/battlefield-4-a/169865-battlefield-4-blaze-emulator.html
- Bag123
  - https://bitbucket.org/Bag123/ea-mitm
- jacobtread
  - https://pocket-relay.pages.dev/docs/technical/client
  - https://github.com/PocketRelay/PocketArk
  - https://github.com/jacobtread/tdf
- Aim2Strike
  - https://github.com/Aim4kill/BlazeSDK
- Tratos
  - https://github.com/Tratos/New-Blaze-Emulator
- av1d & wagwan-piffting-blud
  - mec-scrape (deleted)
- Doomaholic
  - https://github.com/Beat-Revival/catalyst-noencrypt

**Huge thanks to everyone who contributed in other ways: packet captures, Frosty mods, game knowledge, community updates, motivation and many more!**

Contributions are very welcome and any assistance with reverse engineering, function hooking, etc. would be extremely helpful.
