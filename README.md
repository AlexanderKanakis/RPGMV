# RPGMV

//=============================================================================
// Spriter Pro Plugin
// by KanaX
// version 1.4.0
// Last Update: 2018.11.09
//=============================================================================

Contact: 
[1] forums.rpgmakerweb.com: KanaX

Special Thanks to ivan.popelyshev (https://github.com/pixijs/pixi-display/tree/layers)

Terms of Use:
*[1] Free for use in all projects.
*[2] Please provide credits to KanaX.
*[3] Feel free to let me know about your project, or any ideas regarding the plugin.

Spriter Pro Plugin Instructions:

Installation:
*[1] Paste js file in js/plugins/
*[2] Create path img/characters/Spriter/ and inside Spriter, a folder named Single Bitmaps.
*[3] Create path data/animations/.
*[4] Enable the plugin from the Plugin Manager.
*[5] Have some ramen noodles, because you deserve them.

Regarding Spriter:
*[1] The plugin should work as expected in most regards (please check "Future Updates/Fixes" for more information).
*[2] The first 4 animations in a Spriter project will respond to the character's 4 directions. If you want your character
    to move without Direction Fix, you have to create at least 4 animations.
*[3] While you can change the pivot of your bitmaps when you have inserted them into your project, you must not edit pivot x 
    and pivot y in Edit Image's Default Pivot 
*[4] Spriter might face some problems with its documentation, so if something inexplicably does not work, try redoing the animation.
    If that does not fix your problem, feel free to contact the plugin creator.

Plugin Operation:
*[1] Paste Spriter Pro save file in data/animations/. The file name will be the skeleton,
*[2] Create a folder in img/character/Spriter/, named after the Skinset. The Skinset folder should have 4 folder which each taking the parts for each direction.
    Example: Folder_1: [head,torso,r_arm,_r_leg,_l_arm,l_leg], Folder_2: [head,torso,r_arm,_r_leg,_l_arm,l_leg], Folder_3: [head,torso,r_arm,_r_leg,_l_arm,l_leg], Folder_4: [head,torso,r_arm,_r_leg,_l_arm,l_leg] 
*[3] Inside the Skinset folder, create the folders with the bitmaps you used for the animation.
    Note: If you want to use Texture Packer, just place the sprite sheet and json file inside the Skinset folder. Their names should be the same as the Skinset folder.
*[4] If you want certain Spriter Sprites to appear globally across the game (such as animated armor and weapons for actors) you need to create them in the SpriterObjects.json file in your data folder.
    (See more info about SpriterObjects.json in About SpriterObjects.json).
*[5] To create a Spriter Sprite for actors, go to Tools -> Database and write this on the actors' notes:
    <Spriter:{
    "_skeleton": The file name of the animation you want to choose from data/animations/,
    "_skin": The folder name of the Skinset you want to choose from img/characters/Spriter,
    "_speed": Speed of animation,
    "_cellX": Width of the area the main animation takes part in (example: the standard MV character cell width is 48),
    "_cellY": Height of the area the main animation takes part in (example: the standard MV character cell height is 48),
    "_spriterMask": Determine if the sprite will have a mask around it. If true, you need to fill the tags below,
    "_spriteMaskX": X value of mask origin. 0, 0 is the top left corner of the cell,
    "_spriteMaskY": Y value of mask origin. 0, 0 is the top left corner of the cell,
    "_spriteMaskW": Width of the mask,
    "_spriteMaskH": Height of the mask

    Example:
    <Spriter:{
    "_skeleton": "f",
    "_skin": "Side/f7",
    "_speed": 7,
    "_cellX": 32,
    "_cellY": 48,
    "_spriterMask": false
    }>  

*[6] To create a Spriter Sprite for an event create a comment in the active event page:
    <Spriter, skeleton, skinset, speed, cellX, cellY, false>
    or
    <Spriter, skeleton, skinset, speed, cellX, cellY, true, maskX, maskY, maskW, maskH> 
 
    Example
    <Spriter, doggo, sheperd, 10, 48, 32, true, 0, 0, 48, 32>

WARNING: 01/24/2018 THERE IS A PIXI.JS BUG IN v4.5.4 THAT MAKES MASKS NOT WORK IF THE MAP HAS TILES. 

*[7] Animations play when 1) an actor/event has walking animation on and is moving, or 2) an actor/event has stepping animation on.

*[8] Animations that are supposed to loop (walking animations, rolling balls, etc.) you need to toggle the Repeat Playback button in the Spriter Pro timeline.

About Spriter Objects:
Much like the MV Sprite_Character class, Spriter_Character class looks for data in the actor/event object in order to create/update a sprite. But what happens 
when we want our character to hold an animated sprite? A sprite whose animation is separate from the animation of its parent? Like a torch, or a magic aura. 
And what do we do when we want to keep these sprites for multiple maps?
That's why we create SpriterObjects!
In SpriterObjects we create faux game objects, with just the bare minimum data to satisfy the needs of the Spriter_Character class. You create a new object, 
you give it a name, skeleton, skin and then you can attach it to any character you want!
These object are created as comments in the COMMON EVENT with the ID that you assigned on the Spriter Objects Common Event ID:

<objectName, skeleton, skin, speed, cellX, cellY>

Example: <shiny_axe, shiny_axe, shiny_axe, 7, 48, 48>

Plugin Commands:
*[1] eventSkeleton eventId data/animations/skeleton Spriter/skinsetName                                     (Changes skeleton. Since skeleton changes, skinset needs to change as well.)
    Example: eventSkeleton 1 waving_hello male_1

*[2] eventSkin eventId Spriter/skinsetName                                                                  (Changes Skinset. Needs to be compatible with skeleton.)
    Example: eventSkin 1 male_2

    Note: Adding a "$" infront of Spriter/skinsetname will load the bitmap
          from the respective TexturePacker bitmap, as long as it exists.

*[3] eventStop eventId true/false                                                                           (Stops Animation.)
    Example: eventStop 1 true

*[4] eventRecovery eventId ("snap"/"freeze")                                                                (Snap resets animation when movement stops. Freeze pauses animation.)
    Example: eventRecovery 1 freeze

*[5] eventSkinPart eventId imageName (Spriter/skinsetName)-or-(bitmap name from Single bitmaps) fullsprite? (Changes only a single image from that skinset to another, compatible one.)
                                                                                                           (fullsprite is set to true or false and determines if the new bitmap will be from a full spriteset or not)
                                                                                                           (if it is set to true then the user will have to use the desired spriteset path)
                                                                                                           (if it is set to false then the user will have to use the desired bitmap path from within the Single Bitmaps folder)
    Example1: eventSkinPart 1 hat Items/helmet true                                                        (helmet needs to be a folder with the same filename/location as the one of the previous bitmap)
    Example2: eventSkinPart 1 r_hand_weapon mace false 

    Note: Adding a "$" infront of Spriter/skinsetname will load the bitmap
          from the respective TexturePacker bitmap, as long as it exists.                                                    (mace needs to be a bitmap inside the Single Bitmaps folder)

*[6] eventRemoveSkinPart eventId imageName                                                                  (Removes Spriter/skinsetName bitmap from imageName)
    Example: eventRemoveSkinPart 1 r_hand_weapon 

*[7] eventChildSprite eventId imageName objectName                                                          (Assigns a sprite from data/SpriterObjects.json to imageName)
    Example: eventChildSpriter 1 r_hand_weapon glowing_mace                                                (glowing_mace needs to be an object in SpriterObjects)

*[8] eventRemoveChildSprite eventId imageName objectName                                                    (Remove sprite object)
    Example: eventChildSpriter 1 r_hand_weapon glowing_mace

-----------------------------------------------------------------------------
*[9] playerSkeleton data/animations/skeleton Spriter/skinsetName
*[10] playerSkin Spriter/skinsetName
*[11] playerStop true/false
*[12] playerRecovery ("snap"/"freeze")
*[13] playerSkinPart imageName Spriter/skinsetName
*[14] playerRemoveSkinPart imageName 
*[15] playerChildSprite imageName objectName
*[16] playerRemoveChildSprite imageName objectName
-----------------------------------------------------------------------------
*[17] followerSkeleton followerId data/animations/skeleton Spriter/skinsetName
*[18] followerSkin followerId Spriter/skinsetName
*[19] followerStop followerId true/false
*[20] followerRecovery followerId ("snap"/"freeze")
*[21] followerSkinPart  followerId imageName Spriter/skinsetName
*[22] followerRemoveSkinPart  followerId imageName 
*[23] followerChildSprite followerId imageName objectName
*[24] followerRemoveChildSprite followerId imageName objectName

Script Calls:
*[1] $gameMap._events[1].resetAnimation = true;                                                              (Resets animation)
*[2] $gamePlayer.resetAnimation = true;
*[3] $gamePlayer.followers()[1].resetAnimation = true;
*[4] $gameMap._events[1].hasActiveTag("tagName");                                                            (Checks if character has an active tag for this frame)
*[5] $gameMap._events[1]._spriter.var.variableName;                                                           (Returns value for variableName for this Frame)
*[6] $gamePlayer.changeSkinPart(parameters same as plugin command);
*[7] $gamePlayer.removeSkinPart(parameters same as plugin command);
*[8] $gamePlayer.createChildSprite(parameters same as plugin command);
*[9] $gamePlayer.removeChildSprite(parameters same as plugin command);

Tag Commands:                                                                                               (Place tags with the following labels for special effects)
*[1] se,seName,pan,pitch,volume,fade(, areaOfMaxVolume, areaOfTotalFade)                                     (Plays SE sound. If fade is true, the sound fades away the further the player is from the source)
    Example1: se,step,0,100,60,true,3,10
    Example2: se,clock,0,80,100,false

*[2] SkinPart,imageName,(Spriter/skinsetName)-or-(bitmap name from Single bitmaps),fullsprite?               (Works exactly like the plugin command. Useful for automatically spawning sprites with certain skinParts. Not so useful if those sprites change parts often.)
    Example1: SkinPart,hat,stink_lines,false
    Example2: SkinPart,torso,Items/tuxedo,true

*[3] RemoveSkinPart,imageName,(Spriter/skinsetName)-or-(bitmap name from Single bitmaps),fullsprite?
    Example: RemoveSkinPart,hat,stink_lines,false

*[4] ChildSprite,imageName,objectName                                                                        (Works exactly like the plugin command.Useful for automatically spawning sprites with certain childSprites. Not so useful if those sprites change children often.)
    Example: ChildSprite,r_hand_tool,twinking_axe

*[5] RemoveChildSprite,imageName,objectName
    Example: ChildSprite,r_hand_tool,twinking_axe

----------------------------------------------------------------------------
Revisions
*02/22/2018: Updated for MV version 1.6
*03/18/2018: Added Bezier Curve Tweening for Animations
            Added Instant Tweening for Animations
            Added TexturePacker Support.
            Added Paramaters to give Spriter Plugin better Performance.
*04/30/2018: Fixed saving bug.
            Formatted the core classes for future add-ons and updates.
            Added ability to tag sprites to be replaced with equiped items.
*07/12/2018: Fixed Bug regarding deletion of unused sprite parts.
			   Added game variable control via tags.
            Added self switch control via tags.
            Added functional update limiter.
            
----------------------------------------------------------------------------
