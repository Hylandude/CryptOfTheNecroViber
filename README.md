# Crypt of the Necrodancer vibe mod

Honestly I don't expect anyone to use this but I'll leave the documentation in case I forget how to use it. This is provided as is, if you use it good luck I just wanted to see if I could but didn't stop to think if I should. It feels good tho!

This is overly complicated for what it is but it works.
## Requirements

- Have [Intiface](https://intiface.com/central/) installed
- [Crypt of the Necrodancer](https://store.steampowered.com/app/247080/Crypt_of_the_NecroDancer/) installed
- "Special" Hardware, user's choice as long as it can connect to Intiface
- Set up CotN to use and [create mods](https://mod.io/g/crypt/r/introduction-to-crypt-of-the-necrodancer-synchrony-modding)
- [NodeJs](https://nodejs.org/en), v20.x was used will likely run on higher versions

## Instructions

1. Read the guide on how to create CotN mods, I am not publishing the mod you install it in your own game.
2. The mod files are located in the [vibeMod](./vibeMod/) folder, just copy-paste
3. Start Intiface and connect your hardware
4. If its the first time running it install the dependencies with `npm install`
5. Start the client using `node .\index.js`
6. Start the game and enable mods
7. Enjoy!

## How it works

The mod does nothing but log events into the file `steamapps/common/Crypt of the NecroDancer/NecroDancer64/NecroDancer.log` the mod's logs are prefaced with **"[VibeIntiface]"** so the client's code simply reads the file and everytime there's a log from the file and triggers the event. Yes this means that the events go like this:

```Event happens in game > Mod logs it > Client reads log > Client sends vibe signal > Server reads signal > Server sends signal up inside you```

I know this is overly complicated but there's no way to connect the game directly to the client or to send the events into the server within the mod's API. Yes there's delay, no I do not care.

## License

This software is unlicensed and provided as-is no guarantee is made about its working status. Do contact me if you find a better way to do this or if you fork it and change things up, its a fun project.