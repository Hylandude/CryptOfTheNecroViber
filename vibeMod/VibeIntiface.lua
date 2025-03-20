-- Shift+F1 to show in game debug output, uncomment print statements
local localCoop = require "necro.client.LocalCoop"
local json = require "system.utils.serial.JSON"

-- Trigger when player gets hit
event.objectTakeDamage.add(
    "logDamageTaken",
    {order = "statistics",
    sequence = 1,
    filter = {"controllable", "playableCharacter"}
    }, function (ev)
        if localCoop.isLocal(ev.entity.controllable.playerID) then
            log.info("DAMAGE TAKEN " .. ev.damage)
            --print("DAMAGE TAKEN " .. ev.damage
        end
end)

-- Trigger when enemy gets hit
event.objectTakeDamage.add(
    "logDamageGiven",
    {order = "statistics",
    sequence = 1,
    filter = {"ai"}
    }, function (ev)
        log.info("DAMAGE GIVEN " .. ev.damage)
        --print("DAMAGE GIVEN " .. ev.damage)
    end
)

-- Trigger when digging
event.tileDig.add(
    "logTileDig",
    {order = "sound",
    sequence = 1,
    filter = {"controllable", "playableCharacter"}
    }, function (ev)
        log.info("TILE DIG")
        --print("TILE DIG")
    end
)

-- Trigger when a spell is cast
event.spellcast.add(
    "logSpellCast",
    {order = "sound",
    sequence = 1
    }, function (ev)
        log.info("SPELL CAST")
        --print("SPELL CAST")
    end
)

-- Trigger when an item is picked up
event.inventoryAddItem.add(
    "logItemPickup",
    {order = "statistics",
    sequence = 1
    }, function (ev)
        log.info("ITEM PICKUP")
        --print("ITEM PICKUP")
    end
)

-- Trigger when an item is used 
event.itemActivate.add(
    "logItemUse",
    {order = "sound",
    sequence = 1
    }, function (ev)
        log.info("ITEM USE")
        --print("ITEM USE")
    end
)

-- Trigger when a level is loaded
event.levelLoad.add(
    "logLevelLoad",
    {order = "spawnPlayers",
    sequence = 1
    }, function (ev)
        log.info("LEVEL LOAD")
        --print("LEVEL COMPLETE")
    end
)

-- Trigger when a level is completed
event.levelComplete.add(
    "logLevelComplete",
    {order = "winScreen",
    sequence = 1
    }, function (ev)
        log.info("LEVEL COMPLETE")
        --print("LEVEL COMPLETE")
    end
)

