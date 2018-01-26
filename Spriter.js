//=============================================================================
// Spriter Pro Plugin
// by KanaX
// version 1.0
// Last Update: 2018.01.24
//=============================================================================

/*:
 * @plugindesc Allows user to utilize Spriter Pro save files and sprite parts for Skeletal Animations
   <Spriter> v1.0
 * @author KanaX
 *
 * @param Storing Variable
 * @desc Index of the variable used for storing player, follower and event sprite changes (number)
 * @default 99
 * 
 * @param Show Skeleton
 * @desc Display the Animation Skeleton (true or false).
 * @default false 
 *
 * @param Show Frames
 * @desc Display the Animation Frames (true or false).
 * @default false 
 * 
 * @param Evaluate Parameters
 * @desc Use variables in plugin commands by adding "var_" in front of the variable (true or false).
 * @default false 
 *
 * @help 
 *
 * Contact: 
 * [1] forums.rpgmakerweb.com: KanaX
 *
 * Special Thanks to ivan.popelyshev (https://github.com/pixijs/pixi-display/tree/layers)
 *
 * Terms of Use:
 * [1] Free for use in all projects.
 * [2] Please provide credits to KanaX.
 * [3] Feel free to let me know about your project, or any ideas regarding the plugin.
 *
 * Spriter Pro Plugin Instructions:
 *
 * Installation:
 * [1] Paste js file in js/plugins/
 * [2] Create path img/characters/Spriter/ and inside Spriter, a folder named Single Bitmaps.
 * [3] Paste SpriterObjects.json in data/ or copy the one from the demo.
 * [4] Create path data/animations/.
 * [5] Enable the plugin from the Plugin Manager and assign a number for the variable which will store animation info.
 *     WARNING: Do not modify that variable after activating the plugin.
 * [6] Have some ramen noodles, because you deserve them.
 *
 * Regarding Spriter:
 * [1] The plugin should work as expected in most regards (please check "Future Updates/Fixes" for more information).
 * [2] The first 4 animations in a Spriter project will respond to the character's 4 directions. If you want your character
 *     to move without Direction Fix, you have to create at least 4 animations.
 * [3] While you can change the pivot of your bitmaps when you have inserted them into your project, you must not edit pivot x 
 *     and pivot y in Edit Image's Default Pivot 
 * [4] Spriter might face some problems with its documentation, so if something inexplicably does not work, try redoing the animation.
 *     If that does not fix your problem, feel free to contact the plugin creator.
 *
 * Plugin Operation:
 * [1] Paste Spriter Pro save file in data/animations/. The file name will be the skeleton,
 * [2] Create a folder in img/character/Spriter/, named after the Skinset. The Skinset folder should have 4 folder which each taking the parts for each direction.
 *     Example: Folder_1: [head,torso,r_arm,_r_leg,_l_arm,l_leg], Folder_2: [head,torso,r_arm,_r_leg,_l_arm,l_leg], Folder_3: [head,torso,r_arm,_r_leg,_l_arm,l_leg], Folder_4: [head,torso,r_arm,_r_leg,_l_arm,l_leg] 
 * [3] Inside the Skinset folder, create the folders with the bitmaps you used for the animation.
 * [4] If you want certain Spriter Sprites to appear globally across the game (such as animated armor and weapons for actors) you need to create them in the SpriterObjects.json file in your data folder.
 *     (See more info about SpriterObjects.json in About SpriterObjects.json).
 * [5] To create a Spriter Sprite for actors, go to Tools -> Database and write this on the actors' notes:
 *     <Spriter:>
 *     <_skeleton: The file name of the animation you want to choose from data/animations/>
 *     <_skin: The folder name of the Skinset you want to choose from img/characters/Spriter>
 *     <_speed: Speed of animation>
 *     <_cellX: Width of the area the main animation takes part in (example: the standard MV character cell width is 48)>
 *     <_cellY: Height of the area the main animation takes part in (example: the standard MV character cell height is 48)> 
 *     <_spriteMask: Determine if the sprite will have a mask around it. If true, you need to fill the tags below>
 *     <_spriteMaskX: X value of mask origin. 0, 0 is the top left corner of the cell>
 *     <_spriteMaskY: Y value of mask origin. 0, 0 is the top left corner of the cell>
 *     <_spriteMaskW: Width of the mask>
 *     <_spriteMaskH: Height of the mask>
 *
 *     Example:
 *     <Spriter:>
 *     <_skeleton:female_running>
 *     <_skin:female4>
 *     <_speed:4>
 *     <_cellX:48>
 *     <_cellY:48> 
 *     <_spriteMask:true>
 *     <_spriteMaskX:0>
 *     <_spriteMaskY:0>
 *     <_spriteMaskW:48>
 *     <_spriteMaskH:48>    
 *
 * [6] To create a Spriter Sprite for an event create a comment in the active event page:
 *     <Spriter, skeleton, skinset, speed, cellX, cellY, false>
 *     or
 *     <Spriter, skeleton, skinset, speed, cellX, cellY, true, maskX, maskY, maskW, maskH> 
 *  
 *     Example
 *     <Spriter, doggo, sheperd, 10, 48, 32, true, 0, 0, 48, 32>
 *
 * WARNING: 01/24/2018 THERE IS A PIXI.JS BUG IN v4.5.4 THAT MAKES MASKS NOT WORK IF THE MAP HAS TILES. 
 *
 * [7] Animations play when 1) an actor/event has walking animation on and is moving, or 2) an actor/event has stepping animation on.
 *
 * [8] Animations that are supposed to loop (walking animations, rolling balls, etc.) you need to toggle the Repeat Playback button in the Spriter Pro timeline.
 *
 * About SpriterObjects.json:
 * Much like the MV Sprite_Character class, Spriter_Character class looks for data in the actor/event object in order to create/update a sprite. But what happens 
 * when we want our character to hold an animated sprite? A sprite whose animation is separate from the animation of its parent? Like a torch, or a magic aura. 
 * And what do we do when we want to keep these sprites for multiple maps?
 * That's why we create SpriterObjects!
 * In SpriterObjects we create faux game objects, with just the bare minimum data to satisfy the needs of the Spriter_Character class. You create a new object, 
 * you give it a name, skeleton, skin and then you can attach it to any character you want!
 *
 * Example: https://i.imgur.com/dPLSF3W.png, or the SpriterObjects.json file in the demo.
 *
 * Plugin Commands:
 * [1] eventSkeleton eventId data/animations/skeleton Spriter/skinsetName                                     (Changes skeleton. Since skeleton changes, skinset needs to change as well.)
 *     Example: eventSkeleton 1 waving_hello male_1
 *
 * [2] eventSkin eventId Spriter/skinsetName                                                                  (Changes Skinset. Needs to be compatible with skeleton.)
 *     Example: eventSkin 1 male_2
 *
 * [3] eventStop eventId true/false                                                                           (Stops Animation.)
 *     Example: eventStop 1 true

 * [4] eventRecovery eventId ("snap"/"freeze")                                                                (Snap resets animation when movement stops. Freeze pauses animation.)
 *     Example: eventRecovery 1 freeze

 * [5] eventSkinPart eventId imageName (Spriter/skinsetName)-or-(bitmap name from Single bitmaps) fullsprite? (Changes only a single image from that skinset to another, compatible one.)
 *                                                                                                            (fullsprite is set to true or false and determines if the new bitmap will be from a full spriteset or not)
 *                                                                                                            (if it is set to true then the user will have to use the desired spriteset path)
 *                                                                                                            (if it is set to false then the user will have to use the desired bitmap path from within the Single Bitmaps folder)
 *     Example1: eventSkinPart 1 hat Items/helmet true                                                        (helmet needs to be a folder with the same filename/location as the one of the previous bitmap)
 *     Example2: eventSkinPart 1 r_hand_weapon mace false                                                     (mace needs to be a bitmap inside the Single Bitmaps folder)
 *
 * [6] eventRemoveSkinPart eventId imageName                                                                  (Removes Spriter/skinsetName bitmap from imageName)
 *     Example: eventRemoveSkinPart 1 r_hand_weapon 
 *
 * [7] eventChildSprite eventId imageName objectName                                                          (Assigns a sprite from data/SpriterObjects.json to imageName)
 *     Example: eventChildSpriter 1 r_hand_weapon glowing_mace                                                (glowing_mace needs to be an object in SpriterObjects)
 *
 * [8] eventRemoveChildSprite eventId imageName objectName                                                    (Remove sprite object)
 *     Example: eventChildSpriter 1 r_hand_weapon glowing_mace
 *
 * -----------------------------------------------------------------------------
 * [9] playerSkeleton data/animations/skeleton Spriter/skinsetName
 * [10] playerSkin Spriter/skinsetName
 * [11] playerStop true/false
 * [12] playerRecovery ("snap"/"freeze")
 * [13] playerSkinPart imageName Spriter/skinsetName
 * [14] playerRemoveSkinPart imageName 
 * [15] playerChildSprite imageName objectName
 * [16] playerRemoveChildSprite imageName objectName
 * -----------------------------------------------------------------------------
 * [17] followerSkeleton followerId data/animations/skeleton Spriter/skinsetName
 * [18] followerSkin followerId Spriter/skinsetName
 * [19] followerStop followerId true/false
 * [20] followerRecovery followerId ("snap"/"freeze")
 * [21] followerSkinPart  followerId imageName Spriter/skinsetName
 * [22] followerRemoveSkinPart  followerId imageName 
 * [23] followerChildSprite followerId imageName objectName
 * [24] followerRemoveChildSprite followerId imageName objectName
 *
 * Script Calls:
 * [1] $gameMap._events[1].resetAnimation = true;                                                              (Resets animation)
 * [2] $gamePlayer.resetAnimation = true;
 * [3] $gamePlayer.followers()[1].resetAnimation = true;
 * [4] $gameMap._events[1].hasActiveTag("tagName");                                                            (Checks if character has an active tag for this frame)
 * [5] $gameMap._events[1]._spriter.var.variableName                                                           (Returns value for variableName for this Frame)
 *
 * Tag Commands:                                                                                               (Place tags with the following labels for special effects)
 * [1] se,seName,pan,pitch,volume,fade(, areaOfMaxVolume, areaOfTotalFade)                                     (Plays SE sound. If fade is true, the sound fades away the further the player is from the source)
 *     Example1: se,step,0,100,60,true,3,10
 *     Example2: se,clock,0,80,100,false
 *
 * [2] SkinPart,imageName,(Spriter/skinsetName)-or-(bitmap name from Single bitmaps),fullsprite?               (Works exactly like the plugin command. Useful for automatically spawning sprites with certain skinParts. Not so useful if those sprites change parts often.)
 *     Example1: SkinPart,hat,stink_lines,false
 *     Example2: SkinPart,torso,Items/tuxedo,true
 *
 * [3] RemoveSkinPart,imageName,(Spriter/skinsetName)-or-(bitmap name from Single bitmaps),fullsprite?
 *     Example: RemoveSkinPart,hat,stink_lines,false
 *
 * [4] ChildSprite,imageName,objectName                                                                        (Works exactly like the plugin command.Useful for automatically spawning sprites with certain childSprites. Not so useful if those sprites change children often.)
 *     Example: ChildSprite,r_hand_tool,twinking_axe
 *
 * [5] RemoveChildSprite,imageName,objectName
 *     Example: ChildSprite,r_hand_tool,twinking_axe
 *
 * ----------------------------------------------------------------------------
 * Revisions
 *
 * ----------------------------------------------------------------------------
 *
 * ----------------------------------------------------------------------------
 * Future Updates/Fixes
 *
 * [1] Fix reverse animations (this._speed < 0).
 * [2] Utilize bezier lines for animation.
 * [3] Make functional masks after dealing with a pixi.js bug. 
 *
 * ----------------------------------------------------------------------------
 *
 *
 */
  var parameters = $plugins.filter(function(p) { return p.description.contains('<Spriter>'); })[0].parameters;
  var spriterVarId = parseInt(parameters['Storing Variable'] || 7);
  var showSkeleton = eval(parameters['Show Skeleton'] || false);
  var showFrames = eval(parameters['Show Frames'] || false);
  var evaluateParameters = eval(parameters['Evaluate Parameters'] || false);

//-------------------------------------------------------------------------------------------------------------
//*************************************************************************************************************
// Initializes New Parameters for Characters
//*************************************************************************************************************
//-------------------------------------------------------------------------------------------------------------

var spriter_alias_Game_CharacterBase_initmembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
    spriter_alias_Game_CharacterBase_initmembers.call(this);
    this._spriter = {};
    this._spriter._skeleton = null;
    this._spriter._skin = null;
    this._spriter._skinParts = [];
    this._spriter._spriteChildren = [];
    this._spriter._speed = 1;
    this._spriter._repeat = false;
    this._spriter._stop = false;
    this._spriter._recovery = "snap";
    this._spriter.tag = [];
    this._spriter.var = {};
    this._spriter._spriteMask = {};
};

//-------------------------------------------------------------------------------------------------------------
// Global Variables are used to return Sprites to their previous state before exiting their respective scene.
//-------------------------------------------------------------------------------------------------------------
Game_CharacterBase.prototype.initGlobalVars = function () {

    if (!$gameVariables._data[spriterVarId]) {
        $gameVariables._data[spriterVarId] = {};
    	$gameVariables._data[spriterVarId].player = {};
    	$gameVariables._data[spriterVarId].player.tag = [];
    	$gameVariables._data[spriterVarId].player.var = {};
    	$gameVariables._data[spriterVarId].player._children = [];
    	$gameVariables._data[spriterVarId].followers = {};
    	$gameVariables._data[spriterVarId].followers._children = [];
    	$gameVariables._data[spriterVarId].maps = {};
        $gameVariables._data[spriterVarId]._spriterCharacterSprites = [];
        $gameVariables._data[spriterVarId]._childSprites = [];
        $gameVariables._data[spriterVarId]._spriteRequests = [];
        $gameVariables._data[spriterVarId]._followerRequests = [];
    }

    var globalVariable = $gameVariables._data[spriterVarId];
    for (var i = 0; i < $gamePlayer.followers()._data.length; i++) {
    	var followerId = $gamePlayer.followers()._data[i]._memberIndex;
    	if (!globalVariable.followers.hasOwnProperty("follower_" + followerId)) {
	        globalVariable.followers["follower_" + followerId] = {};
	        globalVariable.followers["follower_" + followerId].tag = [];
	        globalVariable.followers["follower_" + followerId].var = {};
	    }
    }
    if (!globalVariable.maps.hasOwnProperty("map_" + String($gameMap._mapId))) {
    	globalVariable.maps["map_" + String($gameMap._mapId)] = {};
    	globalVariable.maps["map_" + String($gameMap._mapId)]._children = {};
    }
};

//-------------------------------------------------------------------------------------------------------------
// Give values to properies from meta or stored global values.
//-------------------------------------------------------------------------------------------------------------
Game_CharacterBase.prototype.setAnimationInfo = function(character, list, visible) {
	var notes;

	if (character.constructor == Game_Player) {
		notes = $dataActors[$gameParty.leader()._actorId].meta;
	}
	else if (character.constructor == Game_Follower) {
		notes = $dataActors[character.actor()._actorId].meta;
	}
	else if (character.constructor == Game_Event) {
		notes = {};
    	var comment = list.parameters[0].substring(9, list.parameters[0].length - 1);
    	param = comment.split(",");
    	notes._skeleton = param[0];
    	notes._skin = param[1];
    	notes._speed = param[2];
    	notes._cellX = param[3];
    	notes._cellY = param[4];
    	notes._spriteMask = param[5];
    	if (notes._spriteMask == "true") {
    		notes._spriteMaskX = param[6];
    		notes._spriteMaskY = param[7];
    		notes._spriteMaskW = param[8];
    		notes._spriteMaskH = param[9];
    	}
	}
    var globalInfo = this.getCharacterGlobalInfo(character);
    character._spriter._skeleton = visible ? globalInfo._skeleton || notes._skeleton.trim() : null;
    character._spriter._skin = visible ? globalInfo._skin || notes._skin.trim() : null;
    character._spriter._skinParts = globalInfo._skinParts || [];
    character._spriter._spriteChildren = globalInfo._spriteChildren || [];
    character._spriter._speed = globalInfo._speed || notes._speed.trim();
    character._spriter._cellX = notes._cellX.trim();
    character._spriter._cellY = notes._cellY.trim();
    character._spriter._stop = globalInfo._stop || false;
    character._spriter._spriteMask.available = eval(notes._spriteMask.trim());
    if (character._spriter._spriteMask.available) {
    	character._spriter._spriteMask.x = notes._spriteMaskX.trim();
    	character._spriter._spriteMask.y = notes._spriteMaskY.trim();
    	character._spriter._spriteMask.w = notes._spriteMaskW.trim();
    	character._spriter._spriteMask.h = notes._spriteMaskH.trim();
    }
};

Game_CharacterBase.prototype.getCharacterGlobalInfo = function (character) {
	this.initGlobalVars();
    var variable = $gameVariables._data[spriterVarId];
    var spriterVar;

    if (character.constructor === Game_Player) {
        spriterVar = variable.player;    
    }
    else if (character.constructor === Game_Follower) {
        spriterVar = variable.followers["follower_" + character._memberIndex];
    }
    else if (character.constructor === Game_Event) {
        spriterVar = this.initGlobalVarsForMap(character);
    }   
    else {
        spriterVar = this.initGlobalVarsForMap(character);
    }
    return spriterVar;
};

//-------------------------------------------------------------------------------------------------------------
// For Events and Children Sprites, which are constrained to a Map.
//-------------------------------------------------------------------------------------------------------------
Game_CharacterBase.prototype.initGlobalVarsForMap = function (character) {
	var spriterVar;
	var variable = $gameVariables._data[spriterVarId];
	var variableMap = variable.maps["map_" + String($gameMap._mapId)];

	if (character.constructor === Game_Event) {
        if (!variableMap.hasOwnProperty("event_" + String(character._eventId))) {
            variableMap["event_" + String(character._eventId)] = {};
        }
        spriterVar = variableMap["event_" + String(character._eventId)];
        spriterVar.tag = [];
        spriterVar.var = {};
    }
    else {
		if (!variableMap.hasOwnProperty("child_" + String(character._name))) {
            variableMap._children["child_" + String(character._name)] = {};
        }
        spriterVar = variableMap._children["child_" + String(character._name)];
        spriterVar.tag = [];
        spriterVar.var = {};
    }
    return spriterVar;	
};

//-------------------------------------------------------------------------------------------------------------
// Refreshes additional Spriter properties
//-------------------------------------------------------------------------------------------------------------
var spriter_alias_Game_Player_refresh = Game_Player.prototype.refresh;
Game_Player.prototype.refresh = function() {
    spriter_alias_Game_Player_refresh.call(this);
    var playerNotes = $dataActors[$gameParty.leader()._actorId].meta;
    if (playerNotes.hasOwnProperty("Spriter")) {
    	this.setAnimationInfo(this, null, true);
    }
};

var spriter_alias_Game_Follower_refresh = Game_Follower.prototype.refresh;
Game_Follower.prototype.refresh = function() {
    spriter_alias_Game_Follower_refresh.call(this);
    if (this.actor()) {
		var followerNotes = $dataActors[this.actor()._actorId].meta;
	    if (followerNotes.hasOwnProperty("Spriter")) {
			this.setAnimationInfo(this, null, this.isVisible());
	    }
    }
};

var spriter_alias_Game_Event_refresh = Game_Event.prototype.refresh;
Game_Event.prototype.refresh = function() {
	spriter_alias_Game_Event_refresh.call(this);
	if (this._pageIndex >= 0) {
		var commandList = this.page(this._pageIndex).list;	
		for (var i = 0; i < commandList.length; i++) {
	    	if (commandList[i].code == 108){
	        	if (commandList[i].parameters[0].substring(1,8) == "Spriter") {
	        		this.setAnimationInfo(this, commandList[i], true);
	        		break;
	        	}
	        }
	    }	
	}
};

//-------------------------------------------------------------------------------------------------------------
// When a new Actor is added, they are checked for Spriter Sprite
//-------------------------------------------------------------------------------------------------------------
var spriter_alias_Game_Party_addActor = Game_Party.prototype.addActor;
Game_Party.prototype.addActor = function(actorId) {
    spriter_alias_Game_Party_addActor.call(this, actorId);
    if (!this._actors.contains(actorId)) {
    	$gameVariables._data[spriterVarId]._followerRequests.push(actorId);
    }
        
};

//-------------------------------------------------------------------------------------------------------------
//*************************************************************************************************************
// Creates and Updates Sprite Characters from New Spriter Class
//*************************************************************************************************************
// Word "Spriter" is searched for in meta, event comments and SpriterObjects.json
//-------------------------------------------------------------------------------------------------------------

var spriter_alias_Spriteset_Map_createCharacters = Spriteset_Map.prototype.createCharacters;
Spriteset_Map.prototype.createCharacters = function() {
	spriter_alias_Spriteset_Map_createCharacters.call(this);    
   	this.createSpriterCharacters();
   	this.createGlobalSpriterCharacters();
};

Spriteset_Map.prototype.createSpriterCharacters = function() {
	this._spriterCharacterSprites = [];
	// Creating Spriter Event
    $gameMap.events().forEach(function(event) {
		if (this.hasSpriterSprite(event)) {
			this._spriterCharacterSprites.push(new Spriter_Character(event));
	    }
    }, this);
    // Creating Spriter Player
    var playerNotes = $dataActors[$gameParty.leader()._actorId].meta;
    if (playerNotes.hasOwnProperty("Spriter")) {
        this._spriterCharacterSprites.push(new Spriter_Character($gamePlayer));
    } 
    // Creating Spriter Followers
    $gamePlayer.followers().reverseEach(function(follower) {
    	if (follower.actor() && this.hasSpriterSprite(follower)) {
            this._spriterCharacterSprites.push(new Spriter_Character(follower));
        }
    }, this);

    for (var j = 0; j < this._spriterCharacterSprites.length; j++) {
        this._tilemap.addChild(this._spriterCharacterSprites[j]);
    }
    if ($gameVariables._data[spriterVarId]) {
    	$gameVariables._data[spriterVarId]._spriterCharacterSprites = this._spriterCharacterSprites;
    }
};

Spriteset_Map.prototype.createGlobalSpriterCharacters = function () {
    if ($gameVariables._data[spriterVarId]) {
	    this._childSprites = [];
		var playerChildren = $gameVariables._data[spriterVarId].player._children; 
	    var followerChildren = $gameVariables._data[spriterVarId].followers._children; 
		var eventChildren = $gameVariables._data[spriterVarId].maps['map_' + $gameMap._mapId]._children; 
	   	for (var i = 0; i < playerChildren.length; i++) {
	   		this.setChildAnimationInfo(playerChildren[i]);
	   		this._childSprites.push(new Spriter_Character(playerChildren[i]));
	   	}
	   	for (var j = 0; j < eventChildren.length; j++) {
	   		this.setChildAnimationInfo(eventChildren[j]);
	   		this._childSprites.push(new Spriter_Character(eventChildren[j]));
	   	}
	    for (var k = 0; k < followerChildren.length; k++) {
	        this.setChildAnimationInfo(followerChildren[k]);
	        this._childSprites.push(new Spriter_Character(followerChildren[k]));
	    }
	}
};


Spriteset_Map.prototype.setChildAnimationInfo = function(child) {
    var variable = $gameVariables._data[spriterVarId];
    var variableMap = variable.maps["map_" + String($gameMap._mapId)];
    if (!variableMap.hasOwnProperty("child_" + String(child._name))) {
        variableMap._children["child_" + String(child._name)] = {};
    }
    globalInfo = variableMap._children["child_" + String(child._name)];
    globalInfo.tag = [];
    globalInfo.var = {};
    child._spriter._skeleton = globalInfo._skeleton || child._spriter._skeleton;
    child._spriter._skin = globalInfo._skin || child._spriter._skin;
    child._spriter._speed = globalInfo._speed || child._spriter._speed;
    child._spriter._stop = globalInfo._stop || false;
    child._spriter.tag = globalInfo.tag || [];
    child._spriter.var = globalInfo.var || {};
};



var spriter_alias_Spriteset_Map_update = Spriteset_Map.prototype.update;
Spriteset_Map.prototype.update = function() {
	spriter_alias_Spriteset_Map_update.call(this);
	if ($gameVariables._data[spriterVarId]) {
		this.updateChildren();
		this.updateFollowers();
	}
};

// Checks Global Variable for Sprite Requests from Plugin Commands.
// The Spriter object that matches the name in the request is pulled from SpriterObject.JSON
// And used for a new Sprite.
Spriteset_Map.prototype.updateChildren = function() {
	var spriteRequests = $gameVariables._data[spriterVarId]._spriteRequests;
	for (var i = 0; i < spriteRequests.length; i++) {
		for (var j = 0; j < $dataSpriterObjects.length; j++) {
			if (spriteRequests[i].sprite == $dataSpriterObjects[j]._name) {
				var character =  $dataSpriterObjects[j];
		        this.setChildAnimationInfo(character);
				this._childSprites.push(new Spriter_Character(character));
				if (spriteRequests[i].parent == 'player') {
					$gameVariables._data[spriterVarId].player._children.push(character);
				}
				else if (spriteRequests[i].parent == 'follower') {
					$gameVariables._data[spriterVarId].followers._children.push(character);
				}
		    	$gameVariables._data[spriterVarId]._childSprites = this._childSprites;
		    	break;	
			}
		}
			
	}
	$gameVariables._data[spriterVarId]._spriteRequests = [];
};

Spriteset_Map.prototype.updateFollowers = function() {
	var followerRequests = $gameVariables._data[spriterVarId]._followerRequests;
	for (var i = 0; i < followerRequests.length; i ++) {
		var followerId = followerRequests[i];
		var followerNotes = $dataActors[followerId].meta;
    	if (followerNotes.hasOwnProperty("Spriter")) {
    		for (var j = 0; j < $gamePlayer.followers()._data.length; j++) {
    			var follower = $gamePlayer.followers()._data[j];
				if (follower.actor() && follower.actor()._actorId == followerId) {
		            this._spriterCharacterSprites.push(new Spriter_Character(follower));
		            var index = this._spriterCharacterSprites.length - 1;
		            this._tilemap.addChild(this._spriterCharacterSprites[index]);
		            $gameVariables._data[spriterVarId]._spriterCharacterSprites = this._spriterCharacterSprites;
					$gameVariables._data[spriterVarId]._followerRequests = [];

		        }
    		}
        }  
	}
};

//-------------------------------------------------------------------------------------------------------------
// Checks Character For Spriter Comment/Note 
//-------------------------------------------------------------------------------------------------------------
Spriteset_Map.prototype.hasSpriterSprite = function (character) {
	if (character.constructor === Game_Event) {
        if (character._pageIndex !== -1) {
            var commandList = character.page(character._pageIndex).list;    
            for (var i = 0; i < commandList.length; i++) {
                if (commandList[i].code == 108){
                    if (commandList[i].parameters[0].substring(1,8) == "Spriter") {
                        return true;
                    }
                }
            }
        }
	}
	else if (character.constructor === Game_Follower) {
		var followerId = character.actor()._actorId;
		var followerNotes = $dataActors[followerId].meta;
    	if (followerNotes.hasOwnProperty("Spriter")) {
            return true;
        }
	}
	return false;
};

//-------------------------------------------------------------------------------------------------------------
//*************************************************************************************************************
// New Sprite Class for Spriter
//*************************************************************************************************************
//-------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------
// Initializing Sprite
//-------------------------------------------------------------------------------------------------------------
function Spriter_Character() {
    this.initialize.apply(this, arguments);
}

Spriter_Character.prototype = Object.create(Sprite_Base.prototype);
Spriter_Character.prototype.constructor = Spriter_Character;

Spriter_Character.prototype.initialize = function(character) {
    Sprite_Base.prototype.initialize.call(this);
    this.initMembers();
    this.setCharacter(character);
    this.getAnimation(this._skeleton);
    this.initSprite();
    this.displaceSprite();
    this.start();
};

Spriter_Character.prototype.initMembers = function() {
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this._character = null;
    this._animationId = 0;
    this._balloonDuration = 0;
    this._tilesetId = 0;
    this._animation = null;
    this._pathMain = null;
    this._pathTime = null;
    this._animationFrame = 0;
    this._key = 0;
    this._sprite = null;
    this._skin = null;
    this._skinParts = [];
    this._spriteChildren = null;
    this._skeleton = null;
    this._speed = 1;
    this._cellX = null;
    this._cellY = null;
    this._spriteMaskX = null;
    this._spriteMaskY = null;
    this._repeat = false;
    this._resetter = false;
    this._recovery = "snap";
    this._globalAnimationInfo = null;
    this._spriteMask = {};
};

Spriter_Character.prototype.setCharacter = function(character) {

    //Getting Character Meta
    this._character = character;
    this._animationId = (character._direction - 2) / 2;
    this._skeleton = this._character._spriter._skeleton;
    this._skin = this._character._spriter._skin;
    this._skinParts = this._character._spriter._skinParts;
    this._spriteChildren = this._character._spriter._spriteChildren;
    this._cellX = Number(this._character._spriter._cellX);
    this._cellY = Number(this._character._spriter._cellY);
    this._speed = Number(this._character._spriter._speed);
    this._recovery = this._character._spriter._recovery;
    this._stop = this._character._spriter._stop;
    this._spriteMask.available = this._character._spriter._spriteMask.available;
    if (this._spriteMask.available) {
    	this._spriteMask.x = Number(this._character._spriter._spriteMask.x);
		this._spriteMask.y = Number(this._character._spriter._spriteMask.y);
		this._spriteMask.w = Number(this._character._spriter._spriteMask.w);
		this._spriteMask.h = Number(this._character._spriter._spriteMask.h);
    }


    //Getting Globals
    if (this._character.constructor === Game_Player) { 
        this._globalAnimationInfo = $gameVariables._data[spriterVarId].player;
    }
    else if (this._character.constructor === Game_Event) {
        var map = String(this._character._mapId);
        var id = String(this._character._eventId);
        this._globalAnimationInfo = $gameVariables._data[spriterVarId].maps["map_" + map]["event_" + id];
    }
    else if (this._character.constructor === Game_Follower) {
        var folId = String(this._character._memberIndex);
        this._globalAnimationInfo = $gameVariables._data[spriterVarId].followers["follower_" + folId];
    }
    else {
		var map = String($gameMap._mapId);
        var name = String(this._character._name);
        this._globalAnimationInfo = $gameVariables._data[spriterVarId].maps["map_" + map]._children["child_" + name];
    }

    // Initializing animation components
    if (!this._globalAnimationInfo.hasOwnProperty("bones")) {
        this._globalAnimationInfo.bones = {};
    }
    if (!this._globalAnimationInfo.hasOwnProperty("objects")) {    
        this._globalAnimationInfo.objects = {};
    }
    if (!this._globalAnimationInfo.hasOwnProperty("tag")) {    
        this._globalAnimationInfo.tag = [];
    }
    if (!this._globalAnimationInfo.hasOwnProperty("var")) {    
        this._globalAnimationInfo.var = {};
    }
    if (this._character._direction == this._globalAnimationInfo.dir) {
        console.log("in");
        this._animationFrame = this._globalAnimationInfo.frame || 0;
        this._key = this._globalAnimationInfo.key || 0;        
    }
    else {
        this._animationFrame = 0;
        this._key = 0;
    }
};

//-------------------------------------------------------------------------------------------------------------
// Get animation from $spriterAnimations
//-------------------------------------------------------------------------------------------------------------

Spriter_Character.prototype.getAnimation = function(name) {
    var property = name + ".scml";
    this._animation = $spriterAnimations[property];
};

//-------------------------------------------------------------------------------------------------------------
// Set sprite's objects, bones and layers
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.initSprite = function() {
    this._pathTime = this._animation.entity.animation[this._animationId].timeline;
    this._sprite = new Sprite();
    this._group = new PIXI.display.Group(0, true);
    this._layer = new PIXI.display.Layer(this._group);
    this.addChild(this._sprite);
    this._sprite.addChild(this._layer);
    this._layer.group.enableSort = true;
    this._element = [];
    this._animLength = Number(this._animation.entity.animation[this._animationId].length);
    this._repeat = this._animation.entity.animation[this._animationId].looping || "true";
    this._repeat = eval(this._repeat);

    var j = 0 ;

    // Creating All Objects and Bones in the Timeline
    for (var i = 0; i < this._pathTime.length; i++) {
        if (this._pathTime[i].object_type == "bone"){
            this._element[i] = new Sprite();
            this._element[i].parent = null;
        }
        else {
            this._element[i] = new Sprite();
            this._element[i].parent = null;
            this._element[i].removeChildren();
            this._element[i].parentGroup = this._group;
        }
    }

    // Info Sprite
    this._infoDisplaySprite = new Sprite();
    this.addChild(this._infoDisplaySprite);
    bitmapH = this._cellY;
    this._infoDisplaySprite.bitmap = new Bitmap(200, bitmapH);
    this._infoDisplaySprite.bitmap.fontSize = 10;
    this._infoDisplaySprite.y = - bitmapH - 35;
    this._infoDisplaySprite.x = -25;

    // Sprite Mask
    if (this._spriteMask.available) {
        var x = this._spriteMask.x;
        var y = this._spriteMask.y;
        var w = this._spriteMask.w;
        var h = this._spriteMask.h;
        var myMask = new PIXI.Graphics();
        myMask.beginFill();
        myMask.drawRect(-this._cellX/2 + 2 + x, -this._cellY + 2 + y, w + 2, h + 2);
        myMask.endFill();
        this.addChild(myMask);
        this.mask = myMask;
    }
};

//-------------------------------------------------------------------------------------------------------------
// Moves Sprite from 0,0 point to -width/2,-height point. 
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.displaceSprite = function() {
    this._sprite.x = -this._cellX/2;
    this._sprite.y = -this._cellY;
};

//-------------------------------------------------------------------------------------------------------------
// Draw First Sprite. 
// In case the Sprite has been used before, this._globalAnimationIfo will replace animation values
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.start = function() {
    this.setInitialCharacter();
};

Spriter_Character.prototype.setInitialCharacter = function() {

	var item;
    this._pathMain = this._animation.entity.animation[this._animationId].mainline.key;
    this._pathTime = this._animation.entity.animation[this._animationId].timeline;

    // Set Bones
    if (this._pathMain[this._key].hasOwnProperty('bone_ref')) {

        //Setting Bone Inheritance
        for(var j = 0; j < this._pathMain[this._key].bone_ref.length; j++) {
            this.updateBoneInheritance(j);
        
        }

        // Setting Bone Values
        for (var n = 0; n < this._pathMain[this._key].bone_ref.length; n++) {
        	id = Number(this._pathMain[this._key].bone_ref[n].timeline);
        	item = this._element[id];
        	item.timelineId = id;
        	item.key = Number(this._pathMain[this._key].bone_ref[n].key); // Id of bone key for this._key
            item.currentKey = this._pathTime[item.timelineId].key[item.key];
            item.type = "bone";
            this.setInitialElements(n, item);
        }
    }

    if (this._pathMain[this._key].hasOwnProperty('object_ref')) {

        //Going through all Objects for Current Key
        for (var i = 0; i < this._pathMain[this._key].object_ref.length; i++){
        	id = Number(this._pathMain[this._key].object_ref[i].timeline);
        	item = this._element[id];
        	item.timelineId = id;
        	item.key = Number(this._pathMain[this._key].object_ref[i].key); // Id of bone key for this._key
            item.currentKey = this._pathTime[item.timelineId].key[item.key];
            item.type = "object";
        	this.setInitialElements(i, item);

        }
    }
};

Spriter_Character.prototype.setInitialElements = function(n, item) {

    var globals = this._globalAnimationInfo;
    var elementGlobal;
    var w;
    var h;
    var element = item.type === "object" ? item.currentKey.object : item.currentKey.bone;
    var folderId = Number(element.folder);
	var fileId = Number(element.file);

    if (item.type === "object") {

    	// Reset Inheritance
	    if (!globals.objects.hasOwnProperty("object_" + Number(item.timelineId))) {
        	globals.objects["object_" + Number(item.timelineId)] = {};
    	}
    	elementGlobal = globals.objects["object_" + Number(item.timelineId)];
		
		// Set Inheritance
	    if (this._pathMain[this._key].object_ref[n].hasOwnProperty('parent')) {
	    	parentMainId = this._pathMain[this._key].object_ref[n].parent;
	    	parentTimeId = this.pathTimeId("bone", parentMainId);
	        this._element[parentTimeId].addChild(item);
	    } 
	    else {
            this._sprite.addChild(item);
	        
	    }

	    w = Number(this._animation.folder[folderId].file[fileId].width);
	    h = Number(this._animation.folder[folderId].file[fileId].height);

	}
	else {
	    if (!globals.bones.hasOwnProperty("bone_" + Number(item.timelineId))) {
	        globals.bones["bone_" + Number(item.timelineId)] = {};
	    }
	    elementGlobal = globals.bones["bone_" + Number(item.timelineId)];
	}

    var ex = Number(element.x) || 0;
    var ey = Number(element.y) || 0;
    var er = Number(element.angle) || 0;
    var esx = element.scale_x || 1;
    esx = Number(esx);
    var esy = element.scale_y || 1;
    esy = Number(esy);
    var x = elementGlobal.x || ex;
    var y = elementGlobal.y || -ey;
    item.move(x, y);
    item.rotation = elementGlobal.r || -er * Math.PI / 180;
    item.scale.x = elementGlobal.sx || esx;
    item.scale.y = elementGlobal.sy || esy;

    if (item.type === "object") {

	    var eax = Number(element.pivot_x) || 0;
	    var eay = 1 - Number(element.pivot_y) || 0;
	    var ea = element.a || 1;
	    ea = Number(ea);
	    var z = Number(this._pathMain[this._key].object_ref[n].z_index);

    	item.alpha = elementGlobal.a || ea;
		item.anchor.x = elementGlobal.ex || eax;
	    item.anchor.y = elementGlobal.ey || eay;		
		item.zIndex = elementGlobal.z || z;

	   	this.updateBitmaps(item);

		// Set Inherited Sprite
        
    	this.controlChildSprites(item.timelineId, w, h);
    }
};

//-------------------------------------------------------------------------------------------------------------
// Updating Sprite
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    this.updateDirection();
    this.updateSprite();
    this.updatePosition();
    this.updateOther();
};

Spriter_Character.prototype.updateDisplay = function() {
    if (showFrames) {
        this._infoDisplaySprite.bitmap.clear();
        this._infoDisplaySprite.bitmap.drawText("key: " + this._key, 0, 10, 100, 1, 'left');
        this._infoDisplaySprite.bitmap.drawText("frame: " + String(this._animationFrame), 0, 25, 100, 1, 'left');
    }
};

//-------------------------------------------------------------------------------------------------------------
// Change animation according to character direction and reser sprite
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.updateDirection = function() {
    if ((this._character._direction - 2) / 2 != this._animationId && !this._stop){
        this._animationId = (this._character._direction - 2) / 2;
        this._animationFrame = 0;
        this._key = 0;
        this._globalAnimationInfo.key = this._key; 
        this._globalAnimationInfo.frame = 0;
        this._globalAnimationInfo.key = 0;
        this.removeChildren();
        this._character._spriter.var = {};
        this._character._spriter.tag = [];
        this._globalAnimationInfo.var = {};
        this._globalAnimationInfo.tag = [];
        this.getAnimation(this._skeleton);
        delete this._sprite;
        delete this._layer;
        delete this._group;
        this.initSprite();
        this.displaceSprite();
        this._animLength = Number(this._animation.entity.animation[this._animationId].length);
        this._repeat = this._animation.entity.animation[this._animationId].looping || "true";
        this._repeat = eval(this._repeat);  
        this.updateDisplay();           
    }
};


//-------------------------------------------------------------------------------------------------------------
// Check elements of Sprite that should be updated according to the character's condition
//------------------------------------------------------------------------------------------------------------- 
Spriter_Character.prototype.updateSprite = function() {
    if (!this._stop) {
    	this.checkChanges();
        this.setCharacterSprite();
        this.updateTagsAndVars();
        if (this.isMoving(this._character)) {
            this._resetter = false;
            this.updateFrame();
        }

        // Snap Recovery resets animation when movement stops.
        else if (this._recovery == "snap") {

            // Character movement stops after the completion of a step
            // this._resetter resets the animation if !this._character.isMoving() for more that one update loop.
            if (this._resetter === true) {
                this._key = 0;
                this._animationFrame = 0;
                this._globalAnimationInfo.frame = 0;
                this._globalAnimationInfo.key = 0;
        		this.updateDisplay();
            }
            else {
                this._resetter = true;
            }
        }
    }
    else {
        this.checkChanges();	
    }
    this.checkReset();
};

Spriter_Character.prototype.checkReset = function() {
    if (this._character.resetAnimation) {
        this._key = 0;
        this._animationFrame = 0;
        this._globalAnimationInfo.key = this._key; 
        this._globalAnimationInfo.frame = this._animationFrame;
        this.updateDisplay();
        this._character.resetAnimation = false;
    }
};

Spriter_Character.prototype.isMoving = function(character) {
	return character._stepAnime || character.isMoving() && character._walkAnime;
};

Spriter_Character.prototype.checkChanges = function() {

    if (this._skeleton !== this._character._spriter._skeleton) {
        // Resetting the whole Sprite
    	this._skeleton = this._character._spriter._skeleton;
        this._skin = this._character._spriter._skin;
        this._animationFrame = 0;
        this._key = 0;
        this._globalAnimationInfo.key = this._key; 
        this._globalAnimationInfo.frame = 0;
        this._globalAnimationInfo.key = 0;
        this.removeChildren();
        this._character._spriter.var = {};
        this._character._spriter.tag = [];
        this._globalAnimationInfo.var = {};
        this._globalAnimationInfo.tag = [];
        this.getAnimation(this._skeleton);
        delete this._sprite;
        delete this._layer;
        delete this._group;
        this.initSprite();
        this.start();
        this.displaceSprite();
        this._animLength = Number(this._animation.entity.animation[this._animationId].length);
        this._repeat = this._animation.entity.animation[this._animationId].looping || "true";
        this._repeat = eval(this._repeat);   
        this.updateDisplay();
    }
    if (this._skin !== this._character._spriter._skin) {
        this._skin = this._character._spriter._skin;
    }
    if (this._skinParts !== this._character._spriter._skinParts) {
        this._skinParts = this._character._spriter._skinParts;
    }
    if (this._spriteChildren !== this._character._spriter._spriteChildren) {
        this._spriteChildren = this._character._spriter._spriteChildren;
    }
    if (this._cellX !== this._character._spriter._cellX) {
        this._cellX = Number(this._character._spriter._cellX);
        this.displaceSprite();
    }
    if (this._cellY !== this._character._spriter._cellY) {
        this._cellY = Number(this._character._spriter._cellY);
        this.displaceSprite();
    }
    if (this._speed !== Number(this._character._spriter._speed)) {
        this.fixKeys();
        this._speed = Number(this._character._spriter._speed);
        this.updateFrame();
    }
    if (this._recovery !== this._character._spriter._recovery) {
        this._recovery = this._character._spriter._recovery;
    }
    if (this._stop !== this._character._spriter._stop) {
        this._stop = this._character._spriter._stop;
    }
};

//-------------------------------------------------------------------------------------------------------------
// When this._speed changes sign, this._key is changed.
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.fixKeys = function () {
	if (this._speed < 0 && Number(this._character._spriter._speed) > 0) {
		if (this._key === 0 && this._repeat) {
			this._key = this._pathMain.length - 1;
		}
		else if (this._key === 0 && !this._repeat) {
		}
		else {
			this._key--;
		}
	}
	else if (this._speed > 0 && Number(this._character._spriter._speed) < 0) {
		if (this._key == this._pathMain.length - 1 && this._repeat) {
			this._key = 0;
		}
		else if (this._key == this._pathMain.length - 1 && !this._repeat) {
		}
		else {
			this._key++;
		}
	}
};

//-------------------------------------------------------------------------------------------------------------
// Updates frame. If mid key the frame increases by this._speed. If at key, the frame takes the key time.
// If animation is over, frame does not change or it resets to 0 according to this._repeat.
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.updateFrame = function() {
    this._pathMain = this._animation.entity.animation[this._animationId].mainline.key;
    var speed = this._speed;
    var nextKeyTime;
    var lastKeyTime = Number(this._pathMain[this._pathMain.length - 1].time);

    // Animation Going Forwards
    if (speed > 0) {

        // Works Until Last Key
        if (this._key < this._pathMain.length - 1) {

            nextKeyTime = Number(this._pathMain[this._key + 1].time) || 0;

            // If animationFrame is bigger than next Key Time, then  animationFrame = next Key Time
            if (this._animationFrame + speed >= nextKeyTime) {
                this._key++; 
                this._animationFrame = nextKeyTime;
            }
            else {
                this._animationFrame += speed;
            }  
        }

        // Works For Last Key
        else if (this._key == this._pathMain.length - 1) {

            // If animationFrame is bigger than Animation Length, animationFrame and key are reset.
            if (this._animationFrame == this._animLength && this._repeat) {
                this._animationFrame = 0;
                this._key = 0;
            } 

            // If animationFrame is bigger than Animation Length, then  animationFrame = Animation Length
            else if (this._animationFrame + speed >= this._animLength) {
                this._animationFrame = this._animLength;
                this._key = this._pathMain.length - 1;
            }
            else {
                this._animationFrame += speed;
            }

        }
    }
    else if (speed < 0) {

        // Works Until First Key
        if (this._key > 0) {

            nextKeyTime = Number(this._pathMain[this._key - 1].time) || 0;

            // If animationFrame is bigger than next Key Time, then  animationFrame = next Key Time
            if (this._animationFrame > nextKeyTime && this._animationFrame + speed <= nextKeyTime) {
                this._key--; 
                this._animationFrame = nextKeyTime;
            }
            else {
                this._animationFrame += speed;
            }  
        }

        // Works For First Key
        else if (this._key === 0) {

            // If animationFrame is 0 and Animation repeats, then animationFrame = Animation Length
    		if (this._animationFrame === 0 && this._repeat) {
                this._animationFrame = this._animLength;
            }
            // If animationFrame is smaller than 0 and Animation repeats  animationFrame = Animation Length
            else if (this._animationFrame + speed < 0 && this._repeat) {
                this._animationFrame = this._animLength;
            }
            else if (this._animationFrame + this._speed <= lastKeyTime && this._repeat) {
            	this._key = this._pathMain.length - 1; 
                this._animationFrame = lastKeyTime;
            }
            else if (this._animationFrame == lastKeyTime && this._repeat) {
				this._animationFrame += speed;
            } 
            else {
                this._animationFrame += speed;
            }  
        }
    }
    this._globalAnimationInfo.key = this._key; 
    this._globalAnimationInfo.frame = this._animationFrame;
    this.updateDisplay();
};

//-------------------------------------------------------------------------------------------------------------
// Update Bone and Object x/y/angle/opacity/scale/anchor/inheritance
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.setCharacterSprite = function() {
    this._pathMain = this._animation.entity.animation[this._animationId].mainline.key;
    this._pathTime = this._animation.entity.animation[this._animationId].timeline;

    // Set Bones
    if (this._pathMain[this._key].hasOwnProperty('bone_ref')) {

        //Going through all Bones for Current Key
        for(var j = 0; j < this._pathMain[this._key].bone_ref.length; j++) {
            item = this.getItemForTime("bone", j);
            //Setting Bone Inheritance
            this.updateBoneInheritance(j);
            //Setting Bone Values
            this.setUpdateType(item);
        }
    }
	// Set Object 
    if (this._pathMain[this._key].hasOwnProperty('object_ref')) {

        //Going through all Objects for Current Key
        for(var l = 0; l < this._pathMain[this._key].object_ref.length; l++){
            item = this.getItemForTime("object", l);
            //Setting Object Inheritance
        	this.objectInheritanceUpdate(l);
            //Setting Object Values
            this.setUpdateType(item);
        }
    }
    this.refreshSprite();
};

// Clears items which are not used for current Key
Spriter_Character.prototype.refreshSprite = function() {
    currentKeyTime = Number(this._pathMain[this._key].time) || 0;
    if (this._speed > 0 && this._animationFrame == currentKeyTime) {
        for (var i = 0; i < this._element.length; i++) {
            if (this._element[i].usedForKey) {
                this._element[i].usedForKey = false;
            }
            else {
                this._element[i].bitmap = null;
            }
        }
    }
};

// Determines if animation frame is in item's Key, or between Keys. 
Spriter_Character.prototype.setUpdateType = function(item) {
    if (this._animationFrame == item.currentKeyTime) {
        this.keyUpdate(item);
    }
    else if (!this._repeat && this._animationFrame > item.lastKeyTime && this.isAnimated(item)) {
        this.keyUpdate(item);
    }
    else if (!this.isAnimated(item)) {
        this.keyUpdate(item);
    }
    else if (this.isBetweenKeys(item) && this.isMoving(this._character) && this.isAnimated(item)) {
        this.midKeyUpdate(item);
    }
};

// Returns Id of item from Timeline. Timeline Id is static and can be used for this._element
Spriter_Character.prototype.pathTimeId = function(type, i) {
	return Number(this._pathMain[this._key][type + "_ref"][i].timeline);
};

// Assigns type, times, and other properties to item.
Spriter_Character.prototype.getItemForTime = function(type, i) {
	var item;
	id = this.pathTimeId(type, i);
	if (type == "bone") {
		item = this._element[id];
		item_ref = this._pathMain[this._key].bone_ref[i];
		item.type = "bone";
	}
	else {
		item = this._element[id];
		item_ref = this._pathMain[this._key].object_ref[i];
		item.type = "object";
	}
    item.timelineId = Number(item_ref.timeline); //Id of bone in the Timeline

    item.key = Number(item_ref.key); // Id of bone key for this._key

    item.currentKey = this._pathTime[item.timelineId].key[item.key];
    item.currentKeyTime = Number(item.currentKey.time) || 0;

    item.lastKey = this._pathTime[item.timelineId].key[this._pathTime[item.timelineId].key.length - 1];
    item.lastKeyTime = Number(item.lastKey.time) || 0;

    if (this.isAnimated(item)) {
    	item.firstKey = this._pathTime[item.timelineId].key[1];
    	item.firstKeyTime = Number(this._pathTime[item.timelineId].key[1].time);
    }
    else {
    	item.firstKey = this._pathTime[item.timelineId].key[0];
    	item.firstKeyTime = Number(this._pathTime[item.timelineId].key[0].time) || 0;
	}

	item.nextKey = this._pathTime[item.timelineId].key[this.getNextKey(item)];
    item.nextKeyTime = (item.nextKey.time) || 0;

    // True since this Item exists for the span of the current Key
    item.usedForKey = true;

    return item;
};

// Determines Next Key according to this._speed sign
Spriter_Character.prototype.getNextKey = function(item) {
	if (this._speed > 0) {
		if (item.currentKeyTime == item.lastKeyTime && this._repeat) {
			return 0;
		}
		else if (item.currentKeyTime == item.lastKeyTime && !this._repeat) {
			return item.key;
		}
		else {
			return item.key + 1;
		}
	}
	else {
		if (item.currentKeyTime === 0 && this._repeat) {
			return this._pathTime[item.timelineId].key.length - 1;
		}
		else if (item.currentKeyTime === 0 && !this._repeat) {
			return item.key;
		} 
		else {
			return item.key - 1;
		}
	}
};

// Checks if item has more than one Key (has change in values, ergo, animation)
Spriter_Character.prototype.isAnimated = function(item) {
	if (item.type == "bone") {
		id = item.timelineId;
		return this._pathTime[id].key.length > 1;
	}
	else {
		id = item.timelineId;
		return this._pathTime[id].key.length > 1;
	}
};


Spriter_Character.prototype.isBetweenKeys = function(item) {
	if (this._speed > 0) {
		if (this._animationFrame < item.lastKeyTime) {
			return this._animationFrame > item.currentKeyTime && this._animationFrame < item.nextKeyTime;
		}
		else {
			return this._animationFrame > item.lastKeyTime;
		}
	}
	else {
		if (this._animationFrame > item.lastKeyTime) {
			return true;
		}
		else if (this._animationFrame < item.lastKeyTime) {
			return this._animationFrame < item.currentKeyTime && this._animationFrame > item.nextKeyTime;
		}
		else {
			return item.lastKeyTime !== 0;
		}
	}
};

//-------------------------------------------------------------------------------------------------------------
// Updates item according to key info.
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.keyUpdate = function(item) {
    var globals = this._globalAnimationInfo;
    if (item.type === "bone") {
    	if (!globals.bones.hasOwnProperty("bone_" + String(item.timelineId))) {
        	globals.bones["bone_" + String(item.timelineId)] = {};
    	}
	}
	else {
	    if (!globals.objects.hasOwnProperty("object_" + String(item.timelineId))) {
    	    globals.objects["object_" + String(item.timelineId)] = {};
    	}
	}

    var element = item.type === "object" ? item.currentKey.object : item.currentKey.bone;

   	this.updateBitmaps(item);

    // General Values ------------------------------------

    // Getting item Values for Key
    var x = Number(element.x) || 0;
    var y = Number(element.y) || 0;
    var r = Number(element.angle) || 0;
    var sx = element.scale_x || 1;
    sx = Number(sx);
    var sy = element.scale_y || 1;
    sy = Number(sy);

    // Setting item Values for Key
    item.move(x, -y);
    item.rotation = ((-r) * Math.PI / 180);
    item.scale.x = sx;
    item.scale.y = sy;

    // ---------------------------------------------------

    // Object-specific Values ----------------------------
    if (item.type === "object") {
    
    	// Getting Object Values for Key
    	var folderId = Number(element.folder);
	    var fileId = Number(element.file);
	    var w = Number(this._animation.folder[folderId].file[fileId].width);
	    var h = Number(this._animation.folder[folderId].file[fileId].height);
	    var ax = Number(element.pivot_x) || 0;
	    var ay = 1 - Number(element.pivot_y) || 0;
	    var a = element.a || 1;
	    a = Number(a);

    	// Setting Object Values for Key
        item.alpha = a;
	    item.anchor.x = ax;
	    item.anchor.y = ay;
	    
		this.controlChildSprites(item.timelineId, w, h);
    }

    // ---------------------------------------------------

    // Storing Values to Global Variable 
    this.storeToGlobal(item);
};

// Assigns the correct image for object / draws bitmap for bone.
Spriter_Character.prototype.updateBitmaps = function (item) {

	// Object Bitmaps / Character Parts
	if (item.type === "object") {
    	var object = item.currentKey.object;
	    var folderId = Number(object.folder);
	    var fileId = Number(object.file);
	    var timelineName = this._pathTime[item.timelineId].name.replace(/\_(\d){3}/, '');
	    var fileName = this._animation.folder[folderId].file[fileId].name.replace(/\_(\d){3}/, '');
	    fileName = fileName.replace(".png", '');
	    var skin = this._skin;
	    var skinParts = this._skinParts;
        var path = "Spriter/"+ skin + "/" + fileName;

	    // Check for Skin Parts
	    for (var j = 0; j < skinParts.length; j++){
	        if (skinParts[j].skinName == timelineName) {

                // If Sprite Change is a Full Sprite, then redirect to another Skinset
                if (skinParts[j].fullSprite) {
                    path = "Spriter/"+ skinParts[j].skinSet + "/" + fileName;
                }

                // If not, then replace with an imagee from Single Bitmaps
                else {
                    path = "Spriter/Single Bitmaps/" + skinParts[j].skinSet;
                }
	            break;
	        }
	    }

	    // Set Bitmap
	    item.bitmap = ImageManager.loadCharacter(path);
	}
	// Bone Bitmaps / Skeleton Display
	else {
	    if (showSkeleton) {
	        var boneId = Number(this._pathTime[item.timelineId].obj);
	        var w = Number(this._animation.entity.obj_info[boneId].w);
	        var h = 4;
	        item.bitmap = new Bitmap(w, h);
	        item.bitmap.fillRect(0, -2, w, h, 'black');
	        item.bitmap.fillRect(1,-1, w-2, h-2, 'white');

    	}
	}

};

//-------------------------------------------------------------------------------------------------------------
// Check if item has a Child Sprite and set inheritance
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.controlChildSprites = function(i, w, h) {
    var timelineName = this._pathTime[this._element[i].timelineId].name.replace(/\_(\d){3}/, '');
    var spriteChildren = this._spriteChildren;
    for (var k = 0; k < spriteChildren.length; k++) {
        if (spriteChildren[k].skinName == timelineName) {
            var childSprites = $gameVariables._data[spriterVarId]._childSprites;  
            for (var l = 0; l < childSprites.length; l++) {
                if (this.isChildForThis(l, k) && this.hasNoParent(l) || this.hasSameParent(l, k)) {
                	if (!spriteChildren[k].remove) {
                		childSprites[l].x = 0;
	                    childSprites[l].y = 0;
	                    childSprites[l]._sprite.x = 0 - (this._element[i].anchor.x * w);
	                    childSprites[l]._sprite.y = 0 - (this._element[i].anchor.y * h);
	                    this._element[i].addChild(childSprites[l]);
	                    childSprites[l]._spriteParent = spriteChildren[k].parent;
	                    break;	
                	}
                    // Removes child Sprite from character's Sprite Children and Global 
                	else {
            		    spriteChildren.splice(k, 1);
                		childSprites.splice(l, 1);
                        this._element[i].removeChildren();
                		break;
                	}
                }
            }
        }
    }
};

Spriter_Character.prototype.isChildForThis = function(l ,k) {
    var spriteChildren = this._spriteChildren;
    var childSprites = $gameVariables._data[spriterVarId]._childSprites; 
	return childSprites[l]._character._name == spriteChildren[k].sprite;
};

Spriter_Character.prototype.hasNoParent = function(l) {
    var spriteChildren = this._spriteChildren;
    var childSprites = $gameVariables._data[spriterVarId]._childSprites;  
	return childSprites[l]._spriteParent === undefined;
};

Spriter_Character.prototype.hasSameParent = function(l ,k) {
    var spriteChildren = this._spriteChildren;
    var childSprites = $gameVariables._data[spriterVarId]._childSprites;  
	return childSprites[l]._spriteParent == spriteChildren[k].parent;
};

//-------------------------------------------------------------------------------------------------------------
// Checks if bone has parent and checks inheritance
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.updateBoneInheritance = function(j) {
	id = this.pathTimeId("bone", j);
	if (this._pathMain[this._key].bone_ref[j].hasOwnProperty('parent')) {
		parentMainId = this._pathMain[this._key].bone_ref[j].parent;
        parentTimeId = this.pathTimeId("bone", parentMainId);
        this._element[parentTimeId].addChild(this._element[id]);
    }
    else {
        this._sprite.addChild(this._element[id]);
    }
};

//-------------------------------------------------------------------------------------------------------------
// Checks if object has parent and checks inheritance
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.objectInheritanceUpdate = function(i) {
	id = this.pathTimeId("object", i);
    if (this._pathMain[this._key].object_ref[i].hasOwnProperty('parent')) {
    	parentMainId = this._pathMain[this._key].object_ref[i].parent;
    	parentTimeId = this.pathTimeId("bone", parentMainId);
        this._element[parentTimeId].addChild(this._element[id]);
    } 
    else {
        if (this._element[id].parent !== this._sprite || this._element[id].parent === null) {
            this._sprite.addChild(this._element[id]);
        }
    }
    var z = Number(this._pathMain[this._key].object_ref[i].z_index);
	this._element[id].zIndex = z;
};

//-------------------------------------------------------------------------------------------------------------
// Updates item according to the mid-key info.
// Difference in value between two keys is divided with the difference in time between two keys.
// The fraction is added to the previous frame value.
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.midKeyUpdate = function(item) {

    // Reset Global Value
    var globals = this._globalAnimationInfo;
    if (item.type === "bone") {
	    if (!globals.bones.hasOwnProperty("bone_" + String(item.timelineId))) {
	        globals.bones["bone_" + String(item.timelineId)] = {};
	    }
	}
    else {
	    if (!globals.objects.hasOwnProperty("object_" + String(item.timelineId))) {
	        globals.objects["object_" + String(item.timelineId)] = {};
	    }
    }

    // Getting Keys & Times
    var pt;
    if (this._repeat && this._speed < 0 && item.currentKeyTime === 0) {
        pt = this._animLength;
    }
    else {
        pt = item.currentKeyTime;
    }

    var nt;
    if (this._repeat && this._speed > 0 && item.currentKeyTime == item.lastKeyTime) {
        nt = this._animLength;
    }
    else if (this._repeat && this._speed < 0 && item.currentKeyTime === 0) {
        nt = item.lastKeyTime;
    }
    else {
        nt =  item.nextKeyTime;
    }

    var t = Math.abs((nt - pt) / this._speed);

    // General Values ------------------------------------

    //Getting Previous Key Bone Values
    var pElement = item.type === "object" ? item.currentKey.object : item.currentKey.bone;
    var px = Number(pElement.x) || 0;
    var py = Number(pElement.y) || 0;
    var pr = Number(pElement.angle) || 0;
    var psx = pElement.scale_x || 1;
    psx = Number(psx);
    var psy = pElement.scale_y || 1;
    psy = Number(psy);

    //Getting Next Key Bone Values
    var nElement = item.type === "object" ? item.nextKey.object : item.nextKey.bone;
    var nx = Number(nElement.x) || 0;
    var ny = Number(nElement.y) || 0;
    var nr = Number(nElement.angle) || 0;
    var nsx = nElement.scale_x || 1;
    nsx = Number(nsx);
    var nsy = nElement.scale_y || 1;
    nsy = Number(nsy);

    // forceUpdate is True when when the player uses a plugin command to change Bitmaps 
    this.updateBitmaps(item);
    if (item.type ==="object") {
        // Getting Object Values for Key
        var folderId = Number(pElement.folder);
        var fileId = Number(pElement.file);
        var w = Number(this._animation.folder[folderId].file[fileId].width);
        var h = Number(this._animation.folder[folderId].file[fileId].height);
        this.controlChildSprites(item.timelineId, w, h);
    }

    //Determining Spin
    var spin = this._speed > 0 ? (Number(item.currentKey.spin) || 1) : -(Number(item.nextKey.spin) || 1);
    var dr;

    if (spin == -1 && nr > pr) {
        dr = nr - pr - 360;
    }
    else if (spin == 1 && nr < pr) {
        dr = nr - pr + 360;
    }
    else {
        dr = nr - pr;
    }

    // Getting Previous Frame Values 
    var bx = item.x;
    var by = item.y;
    var br = item.rotation;
    var bsx = item.scale.x;
    var bsy = item.scale.y;

    // Setting Bone Values for Current Frame
    item.x = bx + ((nx - px) / t);
    item.y = by + ((-ny + py) / t);
    item.rotation = br + ((-dr / t) * Math.PI / 180);
    item.scale.x = bsx + ((nsx - psx) / t);
    item.scale.y = bsy + ((nsy - psy) / t);

    // ---------------------------------------------------

    // Object-specific Values ----------------------------
    if (item.type === "object") {

    	// Getting Previous Frame Values
    	var a = item.alpha;
   		
   		//Getting Previous Key Object Values
		var pa = (pElement.a) || 1;
	    pa = Number(pa);

   		//Getting Next Key Object Values
		var na = (nElement.a) || 1;
	    na = Number(na);
	    var nax = Number(nElement.pivot_x) || 0;
	    var nay = 1 - Number(nElement.pivot_y) || 0;
	    var pax = Number(pElement.pivot_x) || 0;
	    var pay = 1 - Number(pElement.pivot_y) || 0;

    	// Setting Object Values for Current Frame
	    item.alpha = a + ((na - pa) / t);
	    if (this._speed < 0) {
			item.anchor.x = nax;
	  		item.anchor.y = nay;
	    }
    }

    // ---------------------------------------------------

    //Storing Values to Global Variable 
    this.storeToGlobal(item);
};

//-------------------------------------------------------------------------------------------------------------
// Storing Element values to global
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.storeToGlobal = function(item) {
    var characterGlobal;
    if (this._character.constructor === Game_Player) {
        characterGlobal = $gameVariables._data[spriterVarId].player;
    }
    else if (this._character.constructor === Game_Event) {
        var map = String(this._character._mapId);
        var id = String(this._character._eventId);
        characterGlobal = $gameVariables._data[spriterVarId].maps["map_" + map]["event_" + id];
    }
    else if (this._character.constructor === Game_Follower) {
        var folId = String(this._character._memberIndex);
        characterGlobal = $gameVariables._data[spriterVarId].followers["follower_" + folId];
    }
    else {
    	var map = String($gameMap._mapId);
        var name = String(this._character._name);
        characterGlobal = $gameVariables._data[spriterVarId].maps["map_" + map]._children["child_" + name];
    }
    characterGlobal.dir = this._character._direction;
    if (item.type === "bone") {
        var bone = characterGlobal.bones[item.type + "_" + String(item.timelineId)];
        bone.x = item.x;
        bone.y = item.y;
        bone.r = item.rotation;
        bone.sx = item.scale.x;
        bone.sy = item.scale.y;
    }
    else if (item.type === "object") {
    	if (!characterGlobal.objects.hasOwnProperty(item.type + "_" + String(item.timelineId))) {
    		characterGlobal.objects[item.type + "_" + String(item.timelineId)] = {};
    	}
        var object = characterGlobal.objects[item.type + "_" + String(item.timelineId)];
        object.x = item.x;
        object.y = item.y;
        object.r = item.rotation;
        object.a = item.alpha;
        object.ax = item.anchor.x;
        object.ay = item.anchor.y;
        object.sx = item.scale.x;
        object.sy = item.scale.y;
        object.z = item.zIndex;
        object._fileName = item._fileName;
    }
};

//-------------------------------------------------------------------------------------------------------------
// Updating Tags and Vars
//-------------------------------------------------------------------------------------------------------------

Spriter_Character.prototype.updateTagsAndVars = function() {
    var map;
    var id;
    var event;
    if (this._animation.entity.animation[this._animationId].hasOwnProperty('meta')) {
        // Update Vars
        if (this._animation.entity.animation[this._animationId].meta.hasOwnProperty('varline')) {
            if (this._skeleton == "f_wood_cut_repeat") {
        }
            var varline = this._animation.entity.animation[this._animationId].meta.varline;
            for (var i = 0; i < varline.length; i++) {
                for (var j = 0; j < varline[i].key.length; j++) {
                    time = Number(varline[i].key[j].time);
                    case_1 = "this._animationFrame == time";
                    case_2 = "this._animationFrame > time && this._animationFrame < time + this._speed";

                    // Making Sure that the Var updates either in its key, or, in case the key is skipped because of this._speed, right after the key. 
                    if (eval(case_1) || eval(case_2)) {
                        var varId = Number(varline[i].def);
                        var def = this._animation.entity.var_defs.i[varId];
                        if (def.type === "string") {
                            this._character._spriter.var[def.name] = varline[i].key[j].val;
                            this._globalAnimationInfo.var[def.name] = varline[i].key[j].val;
                        }
                        else if (def.type === "int") {
                            this._character._spriter.var[def.name] = parseInt(varline[i].key[j].val);
                            this._globalAnimationInfo.var[def.name] = parseInt(varline[i].key[j].val);
                        }
                        else if (def.type === "float") {
                            this._character._spriter.var[def.name] = parseFloat(varline[i].key[j].val);
                            this._globalAnimationInfo.var[def.name] = parseFloat(varline[i].key[j].val);
                        }
                    }
                }
            }
        }

        // Update Tags
        if (this._animation.entity.animation[this._animationId].meta.hasOwnProperty('tagline')) {
            var tagline =  this._animation.entity.animation[this._animationId].meta.tagline;
            this._character._spriter.tag = [];
            this._globalAnimationInfo.tag = [];
            for (var i = 0; i < tagline.key.length; i++) {
                time = Number(tagline.key[i].time);
                case_1 = "this._animationFrame == time";
                case_2 = "this._animationFrame > time && this._animationFrame < time + this._speed";
                // Making Sure that the Tag updates either in its key, or, in case the key is skipped because of this._speed, right after the key. 
                if (eval(case_1) || eval(case_2)) {
                    if (tagline.key[i].tag) {
                        for (var j = 0; j < tagline.key[i].tag.length; j++) {

                            var tag = tagline.key[i].tag[j];
                            var tagName = this._animation.tag_list.i[tag.t];
                            this._character._spriter.tag.push(tagName);
                            this._globalAnimationInfo.tag.push(tagName);

                        }
                    }
                } 
            }
        }
    } 
};

//-------------------------------------------------------------------------------------------------------------
// Functions shared with Sprite_Characters
//-------------------------------------------------------------------------------------------------------------

Spriter_Character.prototype.updateVisibility = function() {
    Sprite_Base.prototype.updateVisibility.call(this);
    if (this.parent.constructor == ShaderTilemap && this._character.isTransparent()) {
        this.visible = false;
    }
};

Spriter_Character.prototype.updatePosition = function() {
    if (this.parent.constructor == ShaderTilemap) {
        this.x = this._character.screenX();
        this.y = this._character.screenY();
        this.z = this._character.screenZ();
    }
};

Spriter_Character.prototype.updateAnimation = function() {
    this.setupAnimation();
    if (!this.isAnimationPlaying()) {
        this._character.endAnimation();
    }
    if (!this.isBalloonPlaying()) {
        this._character.endBalloon();
    }
};

Spriter_Character.prototype.updateOther = function() {
    if (this.parent.constructor == ShaderTilemap) {
	    this.opacity = this._character.opacity();
	    this.blendMode = this._character.blendMode();
	    this._bushDepth = this._character.bushDepth();
	}
};

Spriter_Character.prototype.setupAnimation = function() {
    if (this._character.animationId() > 0) {
        var animation = $dataAnimations[this._character.animationId()];
        this.startAnimation(animation, false, 0);
        this._character.startAnimation();
    }
};

Spriter_Character.prototype.setupBalloon = function() {
    if (this._character.balloonId() > 0) {
        this.startBalloon();
        this._character.startBalloon();
    }
};

Spriter_Character.prototype.startBalloon = function() {
    if (!this._balloonSprite) {
        this._balloonSprite = new Sprite_Balloon();
    }
    this._balloonSprite.setup(this._character.balloonId());
    this.parent.addChild(this._balloonSprite);
};

Spriter_Character.prototype.updateBalloon = function() {
    this.setupBalloon();
    if (this._balloonSprite) {
        this._balloonSprite.x = this.x;
        this._balloonSprite.y = this.y - this.height;
        if (!this._balloonSprite.isPlaying()) {
            this.endBalloon();
        }
    }
};

Spriter_Character.prototype.endBalloon = function() {
    if (this._balloonSprite) {
        this.parent.removeChild(this._balloonSprite);
        this._balloonSprite = null;
    }
};

Spriter_Character.prototype.isBalloonPlaying = function() {
    return !!this._balloonSprite;
};


//-------------------------------------------------------------------------------------------------------------
//*************************************************************************************************************
// Preloading Bitmaps
//*************************************************************************************************************
//-------------------------------------------------------------------------------------------------------------

var spriter_alias_scene_map_initialize = Scene_Map.prototype.initialize;
Scene_Map.prototype.initialize = function() {
    spriter_alias_scene_map_initialize.call(this);
    this._animationsLoaded = false;
    this._spriterBitmaps = [];
};

var spriter_alias_scene_map_create = Scene_Map.prototype.create;
Scene_Map.prototype.create = function() {
    spriter_alias_scene_map_create.call(this);
    this.getBitmaps("/img/characters/Spriter/");
    this.loadBitmaps();
};

Scene_Map.prototype.isReady = function() {
    if (!this._mapLoaded && this._animationsLoaded && DataManager.isMapLoaded()) {
        this.onMapLoaded();
        this._mapLoaded = true;
    }
    return this._mapLoaded && Scene_Base.prototype.isReady.call(this);
};

Scene_Map.prototype.getBitmaps = function(dir) {
    var mainFolder = this.getDirContents(dir);
    for (var i = 0; i < mainFolder.length; i++) {
        var path = dir + mainFolder[i];
        if (mainFolder[i].slice(-4) === ".png") {
            path = path.replace(".png","");
            path = path.replace("/img/characters/","");
            this._spriterBitmaps.push(path);
        }
        else if (this.isDirectory(path)) {
            path = path + "/";
            this.getBitmaps(path);
        }
    }
};

Scene_Map.prototype.getDirContents = function(dir) {
    var files = [];
    var fs = require('fs');
    var path = require('path');
    var base = path.dirname(process.mainModule.filename);
    fs.readdirSync(base+dir).forEach(function(file){
        files.push(file);
    });
    return files;
};

Scene_Map.prototype.isDirectory = function(path) {
    var fs = require('fs');
    var basePath = require('path');
    var base = basePath.dirname(process.mainModule.filename);
    try{
        if (fs.lstatSync(base + path).isDirectory()) {
            return true;  
        }
        else {
            return false;
        }
    }
    catch(e){
        // Handle error
        if(e.code == 'ENOENT'){
            return false;
        }
        else {
            return false;

        }
    }
};

Scene_Map.prototype.loadBitmaps = function(){
    this._mapSprite = new Sprite();
    for (var i = 0; i < this._spriterBitmaps.length; i++) {
        this._mapSprite.bitmap = ImageManager.loadCharacter(this._spriterBitmaps[i]);
    }
    
    this._animationsLoaded = true;
};

//-------------------------------------------------------------------------------------------------------------
//*************************************************************************************************************
// Setting Global For Children Sprites
//*************************************************************************************************************
//-------------------------------------------------------------------------------------------------------------

var $dataSpriterObjects = null;
var spriterObjects = {};
spriterObjects.name = '$dataSpriterObjects';
spriterObjects.src = 'SpriterObjects.json';
DataManager._databaseFiles.push(spriterObjects);

//-------------------------------------------------------------------------------------------------------------
//*************************************************************************************************************
// Setting Global For Spriter Animations 
//*************************************************************************************************************
//-------------------------------------------------------------------------------------------------------------

var $spriterAnimations = {};

var spriter_alias_Scene_Boot_create = Scene_Boot.prototype.create;
Scene_Boot.prototype.create = function() {
    spriter_alias_Scene_Boot_create.call(this);
    this.loadSpriterAnimations();
};

Scene_Boot.prototype.loadSpriterAnimations = function(){
    var files = getFiles ("/data/animations/");
    for (var i = 0; i < files.length; i++){
        fetchSCMLFile('data/animations/' + files[i], setSpriterData, files[i]);
    }
};

//-------------------------------------------------------------------------------------------------------------
// Get Animation File
//-------------------------------------------------------------------------------------------------------------

// Fetch Function with Callback.

function fetchSCMLFile(path, callback, name) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            var data = XML2jsobj(httpRequest.responseXML.documentElement);
            if (callback) callback(data, name);
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send(); 
}

function setSpriterData(data, name){
    createAnimationGlobal(data, name);
}

//-------------------------------------------------------------------------------------------------------------     
// Creates Optimized Global
//-------------------------------------------------------------------------------------------------------------     
function createAnimationGlobal(data, name){
    obj2Arr(data);
    $spriterAnimations[name] = data;
    console.log(name);
    console.log(data);
    console.log('-----------------');
}

//-------------------------------------------------------------------------------------------------------------     
// Turns objects to Arrays with one element, to conform simple animations to the usual format.
//-------------------------------------------------------------------------------------------------------------     
function obj2Arr(data) {
    var temp;

    if (!data.hasOwnProperty('folder')) {
    	data.folder = [];
    }

    // folder
    if (data.folder.constructor == Object) {
        temp = data.folder;
        delete data.folder;
        data.folder = [temp];
    }

    for (h = 0; h < data.folder.length; h++) {
        // file
        if (data.folder[h].file.constructor == Object) {
            temp = data.folder[h].file;
            delete data.folder[h].file;
            data.folder[h].file = [temp];
        }
    }

    // tag_list
    if (data.hasOwnProperty("tag_list")) {
        if (data.tag_list.i.constructor == Object) {
            temp = data.tag_list.i;
            delete data.tag_list.i;
            data.tag_list.i = [temp];
        }
    }

    // object info
    if (data.entity.hasOwnProperty("obj_info")){
        if (data.entity.obj_info.constructor === Object) {
            temp = data.entity.obj_info;
            delete data.entity.obj_info;
            data.entity.obj_info = [temp];
        }
    }

    // animation
    if (data.entity.animation.constructor == Object) {
        temp = data.entity.animation;
        delete data.entity.animation;
        data.entity.animation = [temp];
    }

    if (data.entity.hasOwnProperty("var_defs")) {
       if (data.entity.var_defs.i.constructor == Object) {
            temp = data.entity.var_defs.i;
            delete data.entity.var_defs.i;
            data.entity.var_defs.i = [temp];
        } 
    }

    // meta
    for (var i = 0; i < data.entity.animation.length; i++){
        
        // varline
        if (data.entity.animation[i].hasOwnProperty("meta")){
            if (data.entity.animation[i].meta.hasOwnProperty("varline")) {
                if (data.entity.animation[i].meta.varline.constructor == Object) {
                    temp = data.entity.animation[i].meta.varline;
                    delete data.entity.animation[i].meta.varline;
                    data.entity.animation[i].meta.varline = [temp];
                }
                for (var j = 0; j < data.entity.animation[i].meta.varline.length; j++) {
                    if (data.entity.animation[i].meta.varline[j].key.constructor == Object) {
                        temp = data.entity.animation[i].meta.varline[j].key;
                        delete data.entity.animation[i].meta.varline[j].key;
                        data.entity.animation[i].meta.varline[j].key = [temp];
                    }
                }
            }

            // tagline
            if (data.entity.animation[i].meta.hasOwnProperty("tagline")) {
                if (data.entity.animation[i].meta.tagline.key.constructor == Object) {
                    temp = data.entity.animation[i].meta.tagline.key;
                    delete data.entity.animation[i].meta.tagline.key;
                    data.entity.animation[i].meta.tagline.key = [temp];
                }
                for (var j = 0; j < data.entity.animation[i].meta.tagline.key.length; j++) {
                    if (data.entity.animation[i].meta.tagline.key[j].tag) {
                        if (data.entity.animation[i].meta.tagline.key[j].tag.constructor == Object) {
                            temp = data.entity.animation[i].meta.tagline.key[j].tag;
                            delete data.entity.animation[i].meta.tagline.key[j].tag;
                            data.entity.animation[i].meta.tagline.key[j].tag = [temp];
                        }
                    }
                }
            }
        }
    }

    for (var i = 0; i < data.entity.animation.length; i++){

        // mainline.key
        if (data.entity.animation[i].mainline.key.constructor == Object) {
            temp = data.entity.animation[i].mainline.key;
            delete data.entity.animation[i].mainline.key;
            data.entity.animation[i].mainline.key = [temp];
        }

        for (var j = 0; j < data.entity.animation[i].mainline.key.length; j++) {

            // mainline.key[].bone_ref
            if (data.entity.animation[i].mainline.key[j].hasOwnProperty('bone_ref')) {
                if (data.entity.animation[i].mainline.key[j].bone_ref.constructor == Object) {
                    temp = data.entity.animation[i].mainline.key[j].bone_ref;
                    delete data.entity.animation[i].mainline.key[j].bone_ref;
                    data.entity.animation[i].mainline.key[j].bone_ref = [temp];
                }
            }
            

            // mainline.key[].object_ref
            if (data.entity.animation[i].mainline.key[j].hasOwnProperty('object_ref')) {
                if (data.entity.animation[i].mainline.key[j].object_ref.constructor == Object) {
                    temp = data.entity.animation[i].mainline.key[j].object_ref;
                    delete data.entity.animation[i].mainline.key[j].object_ref;
                    data.entity.animation[i].mainline.key[j].object_ref = [temp];
                }
            }
        }
        
        // timeline
        if (!data.entity.animation[i].hasOwnProperty('timeline')) {
        	data.entity.animation[i].timeline = [];
        }

        if (data.entity.animation[i].timeline.constructor == Object) {
            temp = data.entity.animation[i].timeline;
            delete data.entity.animation[i].timeline;
            data.entity.animation[i].timeline = [temp];
        }

        for (var k = 0; k < data.entity.animation[i].timeline.length; k++) {

            // timeline[].key
            if (data.entity.animation[i].timeline[k].key.constructor == Object) {
                temp = data.entity.animation[i].timeline[k].key;
                delete data.entity.animation[i].timeline[k].key;
                data.entity.animation[i].timeline[k].key = [temp];
            }
        }
    }
}

// Converts xml File to js Object
function XML2jsobj(node) {

    var data = {};

    // Append a value
    function Add(name, value) {
        if (data[name]) {
            if (data[name].constructor != Array) {
                data[name] = [data[name]];
            }
            data[name][data[name].length] = value;
        }
        else {
            data[name] = value;
        }
    }
    
    // Element attributes
    var c, cn;
    for (c = 0; cn = node.attributes[c]; c++) {
        Add(cn.name, cn.value);
    }
    
    // Child elements
    for (c = 0; cn = node.childNodes[c]; c++) {
        if (cn.nodeType == 1) {
            if (cn.childNodes.length == 1 && cn.firstChild.nodeType == 3) {
                // text value
                Add(cn.nodeName, cn.firstChild.nodeValue);
            }
            else {
                // sub-object
                Add(cn.nodeName, XML2jsobj(cn));
            }
        }
    }

    return data;

}

function getFiles (dir){
    var files = [];
    var path = require('path');
    var base = path.dirname(process.mainModule.filename);
    var fs = require('fs');
    fs.readdirSync(base+dir).forEach(function(file){
        files.push(file);
    });
    return files;
}

//-------------------------------------------------------------------------------------------------------------
//*************************************************************************************************************
// Plugin Commands
//*************************************************************************************************************
//-------------------------------------------------------------------------------------------------------------

var spriter_alias_game_interpreter_command356 = Game_Interpreter.prototype.command356;
Game_Interpreter.prototype.command356 = function() {
	if (evaluateParameters) {
		var args = this._params[0].split(" ");
	    for (var i = 1; i < args.length; i++) {
	    	if (args[i].contains("var_")) {
	    		args[i] = eval(args[i].replace("var_",""));
	    	}
	    }
	    var command = args.shift();
	    this.pluginCommand(command, args);
	}
	else {
		spriter_alias_game_interpreter_command356.call(this);
	}
    return true;
};

// Plugin Commands

var spriter_alias_game_interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    spriter_alias_game_interpreter_pluginCommand.call(this, command, args);

    //-------------------------------------------------------------------------------------------------------------     
    // Events
    //-------------------------------------------------------------------------------------------------------------     
    if (command === "eventSkeleton") {
        event = $gameMap.event(args[0])._spriter;
        mapId = "map_" + String($gameMap.event(args[0])._mapId);
        eventId = "event_" + String($gameMap.event(args[0])._eventId);
        eventGlobalInfo = $gameVariables._data[spriterVarId].maps[mapId][eventId];
        event._skeleton = args[1];
        eventGlobalInfo._skeleton = event._skeleton;
    }
    else if (command === "eventSkin") {
        event = $gameMap.event(args[0])._spriter;
        mapId = "map_" + String($gameMap.event(args[0])._mapId);
        eventId = "event_" + String($gameMap.event(args[0])._eventId);
        eventGlobalInfo = $gameVariables._data[spriterVarId].maps[mapId][eventId];
        event._skin = args[1];
        event._skinParts = [];
        eventGlobalInfo._skin = event._skin;
        eventGlobalInfo._skinParts = [];
    }
    else if (command === "eventSpeed") {
        event = $gameMap.event(args[0])._spriter;
        mapId = "map_" + String($gameMap.event(args[0])._mapId);
        eventId = "event_" + String($gameMap.event(args[0])._eventId);
        eventGlobalInfo = $gameVariables._data[spriterVarId].maps[mapId][eventId];
        event._speed = Number(args[1]);
        eventGlobalInfo._speed = $gameMap.event(args[0])._speed; 
    }
    else if (command === "eventStop") {
        event = $gameMap.event(args[0])._spriter;
        mapId = "map_" + String($gameMap.event(args[0])._mapId);
        eventId = "event_" + String($gameMap.event(args[0])._eventId);
        eventGlobalInfo = $gameVariables._data[spriterVarId].maps[mapId][eventId];
        event._stop = eval(args[1]);
        eventGlobalInfo._stop = $gameMap.event(args[0])._spriter._stop;
    }
    else if (command === "eventRecovery") {
        event = $gameMap.event(args[0])._spriter;
        mapId = "map_" + String($gameMap.event(args[0])._mapId);
        eventId = "event_" + String($gameMap.event(args[0])._eventId);
        eventGlobalInfo = $gameVariables._data[spriterVarId].maps[mapId][eventId];
        event._recovery = args[1];
        eventGlobalInfo._recovery = $gameMap.event(args[0])._recovery;
    }
    else if (command === "eventSkinPart") {
        event = $gameMap.event(args[0])._spriter;
        mapId = "map_" + String($gameMap.event(args[0])._mapId);
        eventId = "event_" + String($gameMap.event(args[0])._eventId);
        eventGlobalInfo = $gameVariables._data[spriterVarId].maps[mapId][eventId];
        a = {};
        a.skinName = args[1];
        a.skinSet = args[2];
        a.fullSprite = eval(args[3]);
        if (event._skinParts.length > 0) {
            for (i = 0; i < event._skinParts.length; i++) {
                if (event._skinParts[i].skinName == a.skinName) {
                    event._skinParts[i] = a;
                    break;
                }
                else if (i == event._skinParts.length - 1) {
                    event._skinParts.push(a);
                }
            }
        }
        else {
            event._skinParts.push(a);
        }
        eventGlobalInfo._skinParts = event._skinParts;
    }
    else if (command === "eventRemoveSkinPart") {
        event = $gameMap.event(args[0])._spriter;
        mapId = "map_" + String($gameMap.event(args[0])._mapId);
        eventId = "event_" + String($gameMap.event(args[0])._eventId);
        eventGlobalInfo = $gameVariables._data[spriterVarId].maps[mapId][eventId];
        a = {};
        a.skinName = args[1];
        if (event._skinParts.length > 0) {
            for (i = 0; i < event._skinParts.length; i++) {
                if (event._skinParts[i].skinName == a.skinName) {
                    event._skinParts.splice(i,1);
                    break;
                }
            }
        }
        eventGlobalInfo._skinParts = event._skinParts;
    }
    else if (command === "eventChildSprite") {
        event = $gameMap.event(args[0])._spriter;
        mapId = "map_" + String($gameMap.event(args[0])._mapId);
        eventId = "event_" + String($gameMap.event(args[0])._eventId);
        eventGlobalInfo = $gameVariables._data[spriterVarId].maps[mapId][eventId];
        a = {};
        a.skinName = args[1];
        a.sprite = args[2];
        a.remove = false;
        a.parent = 'event_' + args[0];
        if (event._spriteChildren.length > 0) {
            for (i = 0; i < event._spriteChildren.length; i++) {
                if (event._spriteChildren[i].skinName == a.skinName) {
                    event._spriteChildren[i] = a;
                    break;
                }
                else if (i == event._spriteChildren.length - 1){
                    event._spriteChildren.push(a);
                }
            }
        }
        else {
            event._spriteChildren.push(a);
        }
        
        eventGlobalInfo._spriteChildren = event._spriteChildren;
        $gameVariables._data[spriterVarId]._spriteRequests.push(a);
    }
    else if (command === "eventRemoveChildSprite") {
        event = $gameMap.event(args[0])._spriter;
        a = {};
        a.skinName = args[1];
        a.sprite = args[2];
        a.parent = 'event_' + args[0];
        a.remove = true;
        if (event._spriteChildren.length > 0) {
            for (i = 0; i < event._spriteChildren.length; i++) {
                if (event._spriteChildren[i].skinName == a.skinName) {
                    event._spriteChildren[i] = a;
                    break;
                }
                else if (i == event._spriteChildren.length - 1){
                    event._spriteChildren.push(a);
                }
            }
        }
        else {
            event._spriteChildren.push(a);
        }
    }

    //-------------------------------------------------------------------------------------------------------------     
    // Player
    //-------------------------------------------------------------------------------------------------------------     

    else if (command === "playerSkeleton") {
        playerGlobalInfo = $gameVariables._data[spriterVarId].player;
        $gamePlayer._spriter._skeleton = args[0];
        playerGlobalInfo._skeleton = args[0];
    }
    else if (command === "playerSkin") {
        playerGlobalInfo = $gameVariables._data[spriterVarId].player;
        $gamePlayer._spriter._skin = args[0];
        playerGlobalInfo._skin = args[0];
    }
    else if (command === "playerSpeed") {
        playerGlobalInfo = $gameVariables._data[spriterVarId].player;
        $gamePlayer._spriter._speed = args[0];
        playerGlobalInfo._speed = Number(args[0]);
    }
    else if (command === "playerStop") {
        playerGlobalInfo = $gameVariables._data[spriterVarId].player;
        $gamePlayer._spriter._stop = eval(args[0]);
        playerGlobalInfo._stop = eval(args[0]);    
    }
    else if (command === "playerRecovery") {
        playerGlobalInfo = $gameVariables._data[spriterVarId].player;
        $gamePlayer._spriter._recovery = args[0];
        playerGlobalInfo._recovery = args[0];
    }
    else if (command === "playerSkinPart") {
        playerGlobalInfo = $gameVariables._data[spriterVarId].player;
        a = {};
        a.skinName = args[0];
        a.skinSet = args[1];
        a.fullSprite = eval(args[3]);
        if ($gamePlayer._spriter._skinParts.length > 0) {
            for (i = 0; i < $gamePlayer._spriter._skinParts.length; i++) {
                if ($gamePlayer._spriter._skinParts[i].skinName == a.skinName) {
                    $gamePlayer._spriter._skinParts[i] = a;
                    break;
                }
                else if (i == $gamePlayer._spriter._skinParts.length - 1) {
                    $gamePlayer._spriter._skinParts.push(a);
                }
            }
        }
        else {
            $gamePlayer._spriter._skinParts.push(a);
        }
        playerGlobalInfo._skinParts = $gamePlayer._spriter._skinParts;
    }
    else if (command === "playerRemoveSkinPart") {
        playerGlobalInfo = $gameVariables._data[spriterVarId].player;
        a = {};
        a.skinName = args[0];
        if ($gamePlayer._spriter._skinParts.length > 0) {
            for (i = 0; i < $gamePlayer._spriter._skinParts.length; i++) {
                if ($gamePlayer._spriter._skinParts[i].skinName == a.skinName) {
                    $gamePlayer._spriter._skinParts.splice(i,1);
                    break;
                }
            }
        }
        playerGlobalInfo._skinParts = $gamePlayer._spriter._skinParts;
    }
    else if (command === "playerChildSprite") {
        playerGlobalInfo = $gameVariables._data[spriterVarId].player;
        a = {};
        a.skinName = args[0];
        a.sprite = args[1];
        a.parent = "player";
        a.remove = false;
        if ($gamePlayer._spriter._spriteChildren.length > 0) {
            for (i = 0; i < $gamePlayer._spriter._spriteChildren.length; i++) {
                if ($gamePlayer._spriter._spriteChildren[i].skinName == a.skinName) {
                    $gamePlayer._spriter._spriteChildren[i] = a;
                    break;
                }
                else if (i == event._spriteChildren.length - 1){
                    $gamePlayer._spriter._spriteChildren.push(a);
                }
            }
        }
        else {
            $gamePlayer._spriter._spriteChildren.push(a);
        }
        playerGlobalInfo._spriteChildren = $gamePlayer._spriter._spriteChildren;
        $gameVariables._data[spriterVarId]._spriteRequests.push(a);
    }
    else if (command === "playerRemoveChildSprite") {
        a = {};
        a.skinName = args[0];
        a.sprite = args[1];
        a.parent = "player";
        a.remove = true;
        if ($gamePlayer._spriter._spriteChildren.length > 0) {
            for (i = 0; i < $gamePlayer._spriter._spriteChildren.length; i++) {
                if ($gamePlayer._spriter._spriteChildren[i].skinName == a.skinName) {
                    $gamePlayer._spriter._spriteChildren[i] = a;
                    break;
                }
                else if (i == $gamePlayer._spriter._spriteChildren.length - 1){
                    $gamePlayer._spriter._spriteChildren.push(a);
                }
            }
        }
        else {
            $gamePlayer._spriter._spriteChildren.push(a);
        }
    }   

    //-------------------------------------------------------------------------------------------------------------     
    // Follower
    //-------------------------------------------------------------------------------------------------------------     

    if (command === "followerSkeleton") {
        follower = $gamePlayer.followers()._data[Number(args[0]) - 1]._spriter;
        followerGlobalInfo = $gameVariables._data[spriterVarId].followers['follower_'+ args[0]];
        follower._skeleton = args[1];
        followerGlobalInfo._skeleton = follower._skeleton;
    }
    else if (command === "followerSkin") {
        follower = $gamePlayer.followers()._data[Number(args[0]) - 1]._spriter;
        followerGlobalInfo = $gameVariables._data[spriterVarId].followers['follower_'+ args[0]];
        follower._skin = args[1];
        follower._skinParts = [];
        followerGlobalInfo._skin = follower._skin;
        followerGlobalInfo._skinParts = [];
    }
    else if (command === "followerSpeed") {
        follower = $gamePlayer.followers()._data[Number(args[0]) - 1]._spriter;
        followerGlobalInfo = $gameVariables._data[spriterVarId].followers['follower_'+ args[0] - 1];
        follower._speed = Number(args[1]);
        followerGlobalInfo._speed = follower._speed; 
    }
    else if (command === "followerStop") {
        follower = $gamePlayer.followers()._data[Number(args[0]) - 1]._spriter;
        followerGlobalInfo = $gameVariables._data[spriterVarId].followers['follower_'+ args[0]];
        follower._stop = eval(args[1]);
        followerGlobalInfo._stop = follower._stop;
    }
    else if (command === "followerRecovery") {
        follower = $gamePlayer.followers()._data[Number(args[0]) - 1]._spriter;
        followerGlobalInfo = $gameVariables._data[spriterVarId].followers['follower_'+ args[0]];
        follower._recovery = args[1];
        followerGlobalInfo._recovery = follower._recovery;
    }
    else if (command === "followerSkinPart") {
        follower = $gamePlayer.followers()._data[Number(args[0]) - 1]._spriter;
        followerGlobalInfo = $gameVariables._data[spriterVarId].followers['follower_'+ args[0]];
        a = {};
        a.skinName = args[1];
        a.skinSet = args[2];
        a.fullSprite = eval(args[3]);
        if (follower._skinParts.length > 0) {
            for (i = 0; i < follower._skinParts.length; i++) {
                if (follower._skinParts[i].skinName == a.skinName) {
                    follower._skinParts[i] = a;
                    break;
                }
                else if (i == follower._skinParts.length - 1) {
                    follower._skinParts.push(a);
                }
            }
        }
        else {
            follower._skinParts.push(a);
        }
        followerGlobalInfo._skinParts = follower._skinParts;
    }
    else if (command === "followerRemoveSkinPart") {
        follower = $gamePlayer.followers()._data[Number(args[0]) - 1]._spriter;
        followerGlobalInfo = $gameVariables._data[spriterVarId].followers['follower_'+ args[0]];
        a = {};
        a.skinName = args[1];
        if (follower._skinParts.length > 0) {
            for (i = 0; i < follower._skinParts.length; i++) {
                if (follower._skinParts[i].skinName == a.skinName) {
                    follower._skinParts.splice(i,1);
                    break;
                }
            }
        }
        followerGlobalInfo._skinParts = follower._skinParts;
    }
    else if (command === "followerChildSprite") {
        follower = $gamePlayer.followers()._data[Number(args[0]) - 1]._spriter;
        followerGlobalInfo = $gameVariables._data[spriterVarId].followers['follower_'+ args[0]];
        a = {};
        a.skinName = args[1];
        a.sprite = args[2];
        a.remove = false;
        a.parent = 'follower';
        if (follower._spriteChildren.length > 0) {
            for (i = 0; i < follower._spriteChildren.length; i++) {
                if (follower._spriteChildren[i].skinName == a.skinName) {
                    follower._spriteChildren[i] = a;
                    break;
                }
                else if (i == follower._spriteChildren.length - 1){
                    follower._spriteChildren.push(a);
                }
            }
        }
        else {
           follower._spriteChildren.push(a);
        }
        
        followerGlobalInfo._spriteChildren =  follower._spriteChildren;
        $gameVariables._data[spriterVarId]._spriteRequests.push(a);
    }
    else if (command === "followerRemoveChildSprite") {
        follower = $gamePlayer.followers()._data[Number(args[0]) - 1]._spriter;
        a = {};
        a.skinName = args[1];
        a.sprite = args[2];
        a.parent = 'follower';
        a.remove = true;
        if (follower._spriteChildren.length > 0) {
            for (i = 0; i < follower._spriteChildren.length; i++) {
                if (follower._spriteChildren[i].skinName == a.skinName) {
                    follower._spriteChildren[i] = a;
                    break;
                }
                else if (i == follower._spriteChildren.length - 1){
                    follower._spriteChildren.push(a);
                }
            }
        }
        else {
            follower._spriteChildren.push(a);
        }
    }
};

//-------------------------------------------------------------------------------------------------------------
//*************************************************************************************************************
// Check Character for Active Tags
//*************************************************************************************************************
//-------------------------------------------------------------------------------------------------------------

Game_CharacterBase.prototype.hasActiveTag = function(tagName) {
    for (var i = 0; i < this._spriter.tag.length; i++) {
        if (this._spriter.tag[i].name == tagName) {
            return true;
        }
    }
    return false;
};

var spriter_alias_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
Game_CharacterBase.prototype.update = function() {
	spriter_alias_Game_CharacterBase_update.call(this);
	this.checkTags();
};

Game_CharacterBase.prototype.checkTags = function() {
	if (this.hasOwnProperty("_spriter")) {
		for (var i = 0; i < this._spriter.tag.length; i++) {

			if (this._spriter.tag[i].name.includes("se,")) {
				tagArray = this._spriter.tag[i].name.split(",");
				params = {};
				params.name = tagArray[1];
				params.pan = tagArray[2];
				params.pitch = tagArray[3];
				params.volume = Number(tagArray[4]);
                if (tagArray[5] === "true") {
                    maxVolumeArea = Number(tagArray[6]);
                    maxArea = Number(tagArray[7]);
                    dx = Math.abs(this.x - $gamePlayer.x);
                    dy = Math.abs(this.y - $gamePlayer.y);
                    d = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
                    if (d > maxVolumeArea && (d - maxVolumeArea) <= maxArea) {
                        params.volume -= params.volume * (d - maxVolumeArea) / maxArea;
                    }
                    else if ((d - maxVolumeArea) > maxArea) {
                        params.volume = 0;
                    }
                }
    			AudioManager.playSe(params);
			}
            else if (this._spriter.tag[i].name.includes("ChildSprite,")) {
                tagArray = this._spriter.tag[i].name.split(",");
                params = {};
                params.skinName = tagArray[1];
                params.sprite = tagArray[2];
                if (this.constructor == Game_Player) {
                    command = "player" + tagArray[0];
                    args = [];
                    args[0] = tagArray[1];
                    args[1] = tagArray[2];
                }
                else if (this.constructor == Game_Follower) {
                    command = "follower" + tagArray[0];
                    args = [];
                    args[0] = this._memberIndex;
                    args[1] = tagArray[1];
                    args[2] = tagArray[2];
                }
                else if (this.constructor == Game_Event){
                    command = "event" + tagArray[0];
                    args = [];
                    args[0] = this._eventId;
                    args[1] = tagArray[1];
                    args[2] = tagArray[2];
                }
                $gameInterp = new Game_Interpreter();
                $gameInterp.pluginCommand(command, args);
            }
            else if (this._spriter.tag[i].name.includes("SkinPart,")) {
                tagArray = this._spriter.tag[i].name.split(",");
                params = {};
                params.skinName = tagArray[1];
                params.sprite = tagArray[2];
                if (this.constructor == Game_Player) {
                    command = "player" + tagArray[0];
                    args = [];
                    args[0] = tagArray[1];
                    args[1] = tagArray[2];
                    args[2] = tagArray[3];
                }
                else if (this.constructor == Game_Follower) {
                    command = "follower" + tagArray[0];
                    args = [];
                    args[0] = this._memberIndex;
                    args[1] = tagArray[1];
                    args[2] = tagArray[2];
                    args[3] = tagArray[3];
                }
                else if (this.constructor == Game_Event){
                    command = "event" + tagArray[0];
                    args = [];
                    args[0] = this._eventId;
                    args[1] = tagArray[1];
                    args[2] = tagArray[2];
                    args[3] = tagArray[3];
                }
                $gameInterp = new Game_Interpreter();
                $gameInterp.pluginCommand(command, args);
            }
		}
	}
};

//-------------------------------------------------------------------------------------------------------------
//*************************************************************************************************************
// Pixi Layers
//*************************************************************************************************************
// Courtesy of ivan.popelyshev
// https://github.com/pixijs/pixi-display/tree/layers
//-------------------------------------------------------------------------------------------------------------

var pixi_display;
(function (pixi_display) {
    var Container = PIXI.Container;
    Object.assign(Container.prototype, {
        renderWebGL: function (renderer) {
            if (this._activeParentLayer && this._activeParentLayer != renderer._activeLayer) {
                return;
            }
            if (!this.visible) {
                this.displayOrder = 0;
                return;
            }
            this.displayOrder = renderer.incDisplayOrder();
            if (this.worldAlpha <= 0 || !this.renderable) {
                return;
            }
            this.containerRenderWebGL(renderer);
        },
        renderCanvas: function (renderer) {
            if (this._activeParentLayer && this._activeParentLayer != renderer._activeLayer) {
                return;
            }
            if (!this.visible) {
                this.displayOrder = 0;
                return;
            }
            this.displayOrder = renderer.incDisplayOrder();
            if (this.worldAlpha <= 0 || !this.renderable) {
                return;
            }
            this.containerRenderCanvas(renderer);
        },
        containerRenderWebGL: PIXI.Container.prototype.renderWebGL,
        containerRenderCanvas: PIXI.Container.prototype.renderCanvas
    });
})(pixi_display || (pixi_display = {}));
Object.assign(PIXI.DisplayObject.prototype, {
    parentLayer: null,
    _activeParentLayer: null,
    parentGroup: null,
    zOrder: 0,
    zIndex: 0,
    updateOrder: 0,
    displayOrder: 0,
    layerableChildren: true
});
if (PIXI.particles && PIXI.particles.ParticleContainer) {
    PIXI.particles.ParticleContainer.prototype.layerableChildren = false;
}
if (PIXI.ParticleContainer) {
    PIXI.ParticleContainer.prototype.layerableChildren = false;
}
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pixi_display;
(function (pixi_display) {
    var utils = PIXI.utils;
    var Group = (function (_super) {
        __extends(Group, _super);
        function Group(zIndex, sorting) {
            var _this = _super.call(this) || this;
            _this._activeLayer = null;
            _this._activeStage = null;
            _this._activeChildren = [];
            _this._lastUpdateId = -1;
            _this.canDrawWithoutLayer = false;
            _this.canDrawInParentStage = true;
            _this.zIndex = 0;
            _this.enableSort = false;
            _this._tempResult = [];
            _this._tempZero = [];
            _this.useZeroOptimization = false;
            _this.zIndex = zIndex;
            _this.enableSort = !!sorting;
            if (typeof sorting === 'function') {
                _this.on('sort', sorting);
            }
            return _this;
        }
        Group.prototype.doSort = function (layer, sorted) {
            if (this.listeners('sort', true)) {
                for (var i = 0; i < sorted.length; i++) {
                    this.emit('sort', sorted[i]);
                }
            }
            if (this.useZeroOptimization) {
                this.doSortWithZeroOptimization(layer, sorted);
            }
            else {
                sorted.sort(Group.compareZIndex);
            }
        };
        Group.compareZIndex = function (a, b) {
            if (a.zIndex !== b.zIndex) {
                return a.zIndex - b.zIndex;
            }
            if (a.zOrder > b.zOrder) {
                return -1;
            }
            if (a.zOrder < b.zOrder) {
                return 1;
            }
            return a.updateOrder - b.updateOrder;
        };
        Group.prototype.doSortWithZeroOptimization = function (layer, sorted) {
            throw new Error("not implemented yet");
        };
        Group.prototype.clear = function () {
            this._activeLayer = null;
            this._activeStage = null;
            this._activeChildren.length = 0;
        };
        Group.prototype.addDisplayObject = function (stage, displayObject) {
            this.check(stage);
            displayObject._activeParentLayer = this._activeLayer;
            if (this._activeLayer) {
                this._activeLayer._activeChildren.push(displayObject);
            }
            else {
                this._activeChildren.push(displayObject);
            }
        };
        Group.prototype.foundLayer = function (stage, layer) {
            this.check(stage);
            if (this._activeLayer != null) {
                Group.conflict();
            }
            this._activeLayer = layer;
            this._activeStage = stage;
        };
        Group.prototype.foundStage = function (stage) {
            if (!this._activeLayer && !this.canDrawInParentStage) {
                this.clear();
            }
        };
        Group.prototype.check = function (stage) {
            if (this._lastUpdateId < Group._layerUpdateId) {
                this._lastUpdateId = Group._layerUpdateId;
                this.clear();
                this._activeStage = stage;
            }
            else if (this.canDrawInParentStage) {
                var current = this._activeStage;
                while (current && current != stage) {
                    current = current._activeParentStage;
                }
                this._activeStage = current;
                if (current == null) {
                    this.clear();
                    return;
                }
            }
        };
        Group.conflict = function () {
            if (Group._lastLayerConflict + 5000 < Date.now()) {
                Group._lastLayerConflict = Date.now();
                console.log("PIXI-display plugin found two layers with the same group in one stage - that's not healthy. Please place a breakpoint here and debug it");
            }
        };
        return Group;
    }(utils.EventEmitter));
    Group._layerUpdateId = 0;
    Group._lastLayerConflict = 0;
    pixi_display.Group = Group;
})(pixi_display || (pixi_display = {}));
var pixi_display;
(function (pixi_display) {
    var InteractionManager = PIXI.interaction.InteractionManager;
    Object.assign(InteractionManager.prototype, {
        _queue: [[], []],
        _displayProcessInteractive: function (point, displayObject, hitTestOrder, interactive) {
            if (!displayObject || !displayObject.visible) {
                return 0;
            }
            var hit = 0, interactiveParent = interactive = displayObject.interactive || interactive;
            if (displayObject.hitArea) {
                interactiveParent = false;
            }
            var mask = displayObject._mask;
            if (hitTestOrder < Infinity && mask) {
                if (!mask.containsPoint(point)) {
                    hitTestOrder = Infinity;
                }
            }
            if (hitTestOrder < Infinity && displayObject.filterArea) {
                if (!displayObject.filterArea.contains(point.x, point.y)) {
                    hitTestOrder = Infinity;
                }
            }
            var children = displayObject.children;
            if (displayObject.interactiveChildren && children) {
                for (var i = children.length - 1; i >= 0; i--) {
                    var child = children[i];
                    var hitChild = this._displayProcessInteractive(point, child, hitTestOrder, interactiveParent);
                    if (hitChild) {
                        if (!child.parent) {
                            continue;
                        }
                        hit = hitChild;
                        hitTestOrder = hitChild;
                    }
                }
            }
            if (interactive) {
                if (hitTestOrder < displayObject.displayOrder) {
                    if (displayObject.hitArea) {
                        displayObject.worldTransform.applyInverse(point, this._tempPoint);
                        if (displayObject.hitArea.contains(this._tempPoint.x, this._tempPoint.y)) {
                            hit = displayObject.displayOrder;
                        }
                    }
                    else if (displayObject.containsPoint) {
                        if (displayObject.containsPoint(point)) {
                            hit = displayObject.displayOrder;
                        }
                    }
                }
                if (displayObject.interactive) {
                    this._queueAdd(displayObject, hit);
                }
            }
            return hit;
        },
        processInteractive: function (strangeStuff, displayObject, func, hitTest, interactive) {
            var interactionEvent = null;
            var point = null;
            if (strangeStuff.data &&
                strangeStuff.data.global) {
                interactionEvent = strangeStuff;
                point = interactionEvent.data.global;
            }
            else {
                point = strangeStuff;
            }
            this._startInteractionProcess();
            this._displayProcessInteractive(point, displayObject, hitTest ? 0 : Infinity, false);
            this._finishInteractionProcess(interactionEvent, func);
        },
        _startInteractionProcess: function () {
            this._eventDisplayOrder = 1;
            if (!this._queue) {
                this._queue = [[], []];
            }
            this._queue[0].length = 0;
            this._queue[1].length = 0;
        },
        _queueAdd: function (displayObject, order) {
            var queue = this._queue;
            if (order < this._eventDisplayOrder) {
                queue[0].push(displayObject);
            }
            else {
                if (order > this._eventDisplayOrder) {
                    this._eventDisplayOrder = order;
                    var q = queue[1];
                    for (var i = 0; i < q.length; i++) {
                        queue[0].push(q[i]);
                    }
                    queue[1].length = 0;
                }
                queue[1].push(displayObject);
            }
        },
        _finishInteractionProcess: function (event, func) {
            var queue = this._queue;
            var q = queue[0];
            var i = 0;
            for (; i < q.length; i++) {
                if (event) {
                    func(event, q[i], false);
                }
                else {
                    func(q[i], false);
                }
            }
            q = queue[1];
            for (i = 0; i < q.length; i++) {
                if (event) {
                    if (!event.target) {
                        event.target = q[i];
                    }
                    func(event, q[i], true);
                }
                else {
                    func(q[i], true);
                }
            }
        }
    });
})(pixi_display || (pixi_display = {}));
var pixi_display;
(function (pixi_display) {
    var Container = PIXI.Container;
    var Layer = (function (_super) {
        __extends(Layer, _super);
        function Layer(group) {
            if (group === void 0) { group = null; }
            var _this = _super.call(this) || this;
            _this.isLayer = true;
            _this.group = null;
            _this._activeChildren = [];
            _this._tempChildren = null;
            _this._activeStageParent = null;
            _this._sortedChildren = [];
            _this._tempLayerParent = null;
            _this.insertChildrenBeforeActive = true;
            _this.insertChildrenAfterActive = true;
            if (group != null) {
                _this.group = group;
                _this.zIndex = group.zIndex;
            }
            else {
                _this.group = new pixi_display.Group(0, false);
            }
            _this._tempChildren = _this.children;
            return _this;
        }
        Layer.prototype.beginWork = function (stage) {
            var active = this._activeChildren;
            this._activeStageParent = stage;
            this.group.foundLayer(stage, this);
            var groupChildren = this.group._activeChildren;
            active.length = 0;
            for (var i = 0; i < groupChildren.length; i++) {
                groupChildren[i]._activeParentLayer = this;
                active.push(groupChildren[i]);
            }
            groupChildren.length = 0;
        };
        Layer.prototype.endWork = function () {
            var children = this.children;
            var active = this._activeChildren;
            var sorted = this._sortedChildren;
            for (var i = 0; i < active.length; i++) {
                this.emit("display", active[i]);
            }
            sorted.length = 0;
            if (this.insertChildrenBeforeActive) {
                for (var i = 0; i < children.length; i++) {
                    sorted.push(children[i]);
                }
            }
            for (var i = 0; i < active.length; i++) {
                sorted.push(active[i]);
            }
            if (!this.insertChildrenBeforeActive &&
                this.insertChildrenAfterActive) {
                for (var i = 0; i < children.length; i++) {
                    sorted.push(children[i]);
                }
            }
            if (this.group.enableSort) {
                this.doSort();
            }
        };
        Layer.prototype.updateDisplayLayers = function () {
        };
        Layer.prototype.doSort = function () {
            this.group.doSort(this, this._sortedChildren);
        };
        Layer.prototype._preRender = function (renderer) {
            if (this._activeParentLayer && this._activeParentLayer != renderer._activeLayer) {
                return false;
            }
            if (!this.visible) {
                this.displayOrder = 0;
                return false;
            }
            this.displayOrder = renderer.incDisplayOrder();
            if (this.worldAlpha <= 0 || !this.renderable) {
                return false;
            }
            if (this.children !== this._sortedChildren &&
                this._tempChildren != this.children) {
                this._tempChildren = this.children;
            }
            this._boundsID++;
            this.children = this._sortedChildren;
            this._tempLayerParent = renderer._activeLayer;
            renderer._activeLayer = this;
            return true;
        };
        Layer.prototype._postRender = function (renderer) {
            this.children = this._tempChildren;
            renderer._activeLayer = this._tempLayerParent;
            this._tempLayerParent = null;
        };
        Layer.prototype.renderWebGL = function (renderer) {
            if (this._preRender(renderer)) {
                this.containerRenderWebGL(renderer);
                this._postRender(renderer);
            }
        };
        Layer.prototype.renderCanvas = function (renderer) {
            if (this._preRender(renderer)) {
                this.containerRenderCanvas(renderer);
                this._postRender(renderer);
            }
        };
        return Layer;
    }(Container));
    pixi_display.Layer = Layer;
})(pixi_display || (pixi_display = {}));
var pixi_display;
(function (pixi_display) {
    var WebGLRenderer = PIXI.WebGLRenderer;
    var CanvasRenderer = PIXI.CanvasRenderer;
    Object.assign(WebGLRenderer.prototype, {
        _lastDisplayOrder: 0,
        _activeLayer: null,
        incDisplayOrder: function () {
            return ++this._lastDisplayOrder;
        },
        _oldRender: WebGLRenderer.prototype.render,
        render: function (displayObject, renderTexture, clear, transform, skipUpdateTransform) {
            if (!renderTexture) {
                this._lastDisplayOrder = 0;
            }
            this._activeLayer = null;
            if (displayObject.isStage) {
                displayObject.updateStage();
            }
            this._oldRender(displayObject, renderTexture, clear, transform, skipUpdateTransform);
        }
    });
    Object.assign(CanvasRenderer.prototype, {
        _lastDisplayOrder: 0,
        _activeLayer: null,
        incDisplayOrder: function () {
            return ++this._lastDisplayOrder;
        },
        _oldRender: CanvasRenderer.prototype.render,
        render: function (displayObject, renderTexture, clear, transform, skipUpdateTransform) {
            if (!renderTexture) {
                this._lastDisplayOrder = 0;
            }
            this._activeLayer = null;
            if (displayObject.isStage) {
                displayObject.updateStage();
            }
            this._oldRender(displayObject, renderTexture, clear, transform, skipUpdateTransform);
        }
    });
})(pixi_display || (pixi_display = {}));
var pixi_display;
(function (pixi_display) {
    var Stage = (function (_super) {
        __extends(Stage, _super);
        function Stage() {
            var _this = _super.call(this) || this;
            _this.isStage = true;
            _this._tempGroups = [];
            _this._activeLayers = [];
            _this._activeParentStage = null;
            return _this;
        }
        Stage.prototype.clear = function () {
            this._activeLayers.length = 0;
            this._tempGroups.length = 0;
        };
        Stage.prototype.destroy = function (options) {
            this.clear();
            _super.prototype.destroy.call(this, options);
        };
        Stage.prototype._addRecursive = function (displayObject) {
            if (!displayObject.visible) {
                return;
            }
            if (displayObject.isLayer) {
                var layer_1 = displayObject;
                this._activeLayers.push(layer_1);
                layer_1.beginWork(this);
            }
            if (displayObject != this && displayObject.isStage) {
                var stage = displayObject;
                stage.updateAsChildStage(this);
                return;
            }
            var group = displayObject.parentGroup;
            if (group != null) {
                displayObject.parentGroup.addDisplayObject(this, displayObject);
            }
            var layer = displayObject.parentLayer;
            if (layer != null) {
                layer.group.addDisplayObject(this, displayObject);
            }
            displayObject.updateOrder = ++Stage._updateOrderCounter;
            if (displayObject.alpha <= 0 || !displayObject.renderable || !displayObject.layerableChildren) {
                return;
            }
            var children = displayObject.children;
            if (children && children.length) {
                for (var i = 0; i < children.length; i++) {
                    this._addRecursive(children[i]);
                }
            }
        };
        Stage.prototype._updateStageInner = function () {
            this.clear();
            this._addRecursive(this);
            var layers = this._activeLayers;
            for (var i = 0; i < layers.length; i++) {
                layers[i].endWork();
            }
        };
        Stage.prototype.updateAsChildStage = function (stage) {
            this._activeParentStage = stage;
            Stage._updateOrderCounter = 0;
            this._updateStageInner();
        };
        Stage.prototype.updateStage = function () {
            this._activeParentStage = null;
            pixi_display.Group._layerUpdateId++;
            this._updateStageInner();
        };
        ;
        return Stage;
    }(pixi_display.Layer));
    Stage._updateOrderCounter = 0;
    pixi_display.Stage = Stage;
})(pixi_display || (pixi_display = {}));
Object.assign(PIXI, {
    display: pixi_display
});

//-------------------------------------------------------------------------------------------------------------
//*************************************************************************************************************
// Implementing pixi-layers
//*************************************************************************************************************
//-------------------------------------------------------------------------------------------------------------

var oldGraphicsRender = Graphics.render;
Graphics.render = function(stage) {
  if (!this._realStage) {
    this._realStage = new PIXI.display.Stage();
  }

  if (stage.parent !== this._realStage) {
    this._realStage.removeChildren();
    this._realStage.addChild(stage);
  }

  oldGraphicsRender.call(Graphics, this._realStage);
};