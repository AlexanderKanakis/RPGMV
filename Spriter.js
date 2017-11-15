//=============================================================================
// Spriter Pro Plugin
// by KanaX
// version 1.0
// Last Update: 2017.09.6
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
 * @desc Display the Animation Skeleton (true or false). Not very useful, just fun.
 * @default false
 *
 * @help 
 *
 * Spriter Pro Plugin Instructions:
 *
 * Installation:
 * [1] Paste js file in js/plugins/
 * [2] Create path img/characters/Spriter/ and paste the 0 folder from the same path of the demo.
 * [3] Create file SpriterObjects.json in data/ or copy the one from the demo.
 * [4] Create path data/animations/ and paste the 0 file from the same path of the demo.
 * [5] Enable the plugin from the Plugin Maage and assging a number for the variable which stores animation info.
 *     WARNING: Do not modify that variable after activating the plugin.
 * [6] Have some ramen noodles, because you deserve them.
 *
 * Regarding Spriter:
 * [1] The plugin should work as expected in most regards (please check "Future Updates/Fixes" for more information).
 * [2] The first 4 animations in your project will respond to the character's 4 directions. If you want your character
 *     to move without Direction Fix, you have to create at least 4 animations.
 * [3] If something does not work on MV as it does on Spriter Pro, try selecting the key which causes the problem and press "key all" 
 *
 * Plugin Operation:
 * [1] Paste Spriter Pro save file in data/animations/. The file name will be the skeleton
 * [2] Create a folder named after the Skinset. 
 * [3] Inside the Skinset folder, create the folders with the bitmaps you used for the animation.
 * [4] If you want certain Spriter Sprites to appear globally across the game (such as animated armor and weapons for actors)
 * [5] To create a Spriter Sprite for actors, go to Tools -> Dataase and write this on the actors' notes:
 *     <Spriter:>
 *     <_skeleton: The file name of the animation you want to choose from data/animations/>
 *     <_skin: The folder name of the Skinset you want to choose from img/characters/Spriter>
 *     <_speed: Speed of animation>
 *     <_cellX: Width of the area the main animation takes part in (example: the standard MV character cell width is 48)>
 *     <_cellY: Height of the area the main animation takes part in (example: the standard MV character cell height is 48)> 
 * [6] To create a Spriter Sprite for an event create a comment in the active event page:
 *     <Spriter, skeleton, skinset, speed, cellX, cellY>
 *  
 * Plugin Commands:
 * [1] eventSkeleton
 * [2] eventSkin
 * [3] eventStop
 * [4] eventRecovery
 * [5] eventSkinPart
 * [6] eventChildSprite
 * [7] eventRemoveChildSprite
 * [8] playerSkeleton
 * [9] playerSkin
 * [10] playerStop
 * [11] playerRecovery
 * [12] playerSkinPart
 * [13] playerChildSprite
 * [14] playerRemoveChildSprite
 *
 *
 *
 *
 *
 *
 * ----------------------------------------------------------------------------
 * Revisions
 *
 * ----------------------------------------------------------------------------
 *
 */
  var parameters = $plugins.filter(function(p) { return p.description.contains('<Spriter>'); })[0].parameters;
  var spriterVarId = parseInt(parameters['Storing Variable'] || 7);
  var showSkeleton = eval(parameters['Show Skeleton'] || false);

//-------------------------------------------------------------------------------------------------------------
//*************************************************************************************************************
// Initializes New Parameters for Characters
//*************************************************************************************************************
//-------------------------------------------------------------------------------------------------------------

var spriter_alias_Game_CharacterBase_initmembers = Game_CharacterBase.prototype.initMembers;
Game_CharacterBase.prototype.initMembers = function() {
    spriter_alias_Game_CharacterBase_initmembers.call(this);
    this._spriter = {};
    this._spriter._skeleton = '0';
    this._spriter._skin = '0';
    this._spriter._skinParts = [];
    this._spriter._spriteChildren = [];
    this._spriter._speed = 1;
    this._spriter._repeat = false;
    this._spriter._stop = false;
    this._spriter._recovery = "snap";
    this._spriter.tag = [];
    this._spriter.var = {};
};

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

// Give values to properies from meta or stored global values.
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
	}
    var globalInfo = this.getCharacterGlobalInfo(character);
    character._spriter._skeleton = visible ? globalInfo._skeleton|| notes._skeleton : '0';
    character._spriter._skin = visible ? globalInfo._skin || notes._skin : '0';
    character._spriter._skinParts = globalInfo._skinParts || [];
    character._spriter._spriteChildren = globalInfo._spriteChildren || [];
    character._spriter._speed = globalInfo._speed || notes._speed;
    character._spriter._cellX = notes._cellX;
    character._spriter._cellY = notes._cellY;
    character._spriter._stop = globalInfo._stop || false;
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
        spriterVar = this.initLocalVar(character);
    }   
    else {
        spriterVar = this.initLocalVar(character);
    }
    return spriterVar;
};

Game_CharacterBase.prototype.initLocalVar = function (character) {
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
    $gameVariables._data[spriterVarId]._spriterCharacterSprites = this._spriterCharacterSprites;
};

Spriteset_Map.prototype.createGlobalSpriterCharacters = function () {
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
	this.updateChildren();
	this.updateFollowers();
};

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
		var commandList = character.page(character._pageIndex).list;	
		for (var i = 0; i < commandList.length; i++) {
	    	if (commandList[i].code == 108){
	        	if (commandList[i].parameters[0].substring(1,8) == "Spriter") {
					return true;
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
    this._animationId = 2;
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
    this._spriteChildren = '0';
    this._skeleton = '0';
    this._speed = 1;
    this._cellX = null;
    this._cellY = null;
    this._maskX = null;
    this._maskY = null;
    this._repeat = false;
    this._resetter = false;
    this._recovery = "snap";
    this._globalAnimationInfo = null;
};

Spriter_Character.prototype.setCharacter = function(character) {

    //Getting Character Meta
    this._character = character;
    this._animationId = (character._direction - 2) / 2;
    this._skeleton = this._character._spriter._skeleton;
    this._skin = this._character._spriter._skin;
    this._skinParts = this._character._spriter._skinParts;
    this._spriteChildren = this._character._spriter._spriteChildren;
    this._cellX = this._character._spriter._cellX;
    this._cellY = this._character._spriter._cellY;
    this._speed = Number(this._character._spriter._speed);
    this._recovery = this._character._spriter._recovery;
    this._stop = this._character._spriter._stop;

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
    this._animationFrame = this._globalAnimationInfo.frame || 0;
    this._key = this._globalAnimationInfo.key || 0;
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
    this._object = [];
    this._bone = [];
    this._repeat = this._animation.entity.animation[this._animationId].looping || "true";
    this._repeat = eval(this._repeat);

    var j = 0 ;

    // Creating All Objects and Bones in the Timeline
    for (var i = 0; i < this._pathTime.length; i++) {
        if (!this._pathTime[i].hasOwnProperty('obj')){
            this._object[i-j] = new Sprite();
            this._object[i-j].parent = null;
            this._object[i-j].removeChildren();
            this._object[i-j].parentGroup = this._group;
        }
        else {
            this._bone[j] = new Sprite();
            this._bone[j].parent = null;
            j++;
        }
    }

    /*
    var myMask = new PIXI.Graphics();
	myMask.beginFill();
	myMask.drawRect(-16, -48, 32, 48);
	myMask.endFill();
	this.addChild(myMask);
	this._sprite.mask = myMask;
	*/
};

//-------------------------------------------------------------------------------------------------------------
// Get animation from $spriterAnimations
//-------------------------------------------------------------------------------------------------------------

Spriter_Character.prototype.getAnimation = function(name) {
    var property = name + ".scml";
    this._animation = $spriterAnimations[property];
};

//-------------------------------------------------------------------------------------------------------------
// Draw First Sprite. 
// In case the Sprite has been used before, this._globalAnimationIfo will replace animation values
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.start = function() {
    this.setInitialCharacter();
};

Spriter_Character.prototype.setInitialCharacter = function() {

    this._pathMain = this._animation.entity.animation[this._animationId].mainline.key;
    this._pathTime = this._animation.entity.animation[this._animationId].timeline;

    // Correcting Key
    if (this._key == this._pathMain.length) {
        this._key--;
    }

    // Set Bones
    if (this._pathMain[this._key].hasOwnProperty('bone_ref')) {

        //Setting Bone Inheritance
        for(var j = 0; j < this._pathMain[this._key].bone_ref.length; j++) {
            this.updateBoneInheritance(j);
        
        }

        // Setting Bone Values
        for (var n = 0; n < this._pathMain[this._key].bone_ref.length; n++) {
            this.setInitialBones(n);
        }
    }

    if (this._pathMain[this._key].hasOwnProperty('object_ref')) {

        // Set Object and Bitmap

        //Going through all Objects for Current Key
        for (var i = 0; i < this._pathMain[this._key].object_ref.length; i++){
           this.setInitialObjects(i);
        }
    }
};

Spriter_Character.prototype.setInitialObjects = function(i) {

    // Set Inheritance
    if (this._object[i].parent !== null) {
        this._object[i].parent.removeChild(this._object[i]);
    }
    if (this._pathMain[this._key].object_ref[i].hasOwnProperty('parent')) {
         this._bone[this._pathMain[this._key].object_ref[i].parent].addChild(this._object[i]);
    } 
    else {
        if (this._object[i].parent !== this._sprite || this._object[i].parent === null) {
            this._sprite.addChild(this._object[i]);
        }
    }

    // Get Global Values
    var globals = this._globalAnimationInfo;
    if (!globals.objects.hasOwnProperty("object_" + String(i))) {
        globals.objects["object_" + String(i)] = {};
    }
    var objectGlobal = globals.objects["object_" + String(i)];

    // Get Object Key ID
    var time = Number(this._pathMain[this._key].object_ref[i].key);   

    // Set Object Bitmap

    var object = this._pathTime[this._pathMain[this._key].object_ref[i].timeline].key[time].object;


    var folderId = Number(object.folder);
    var fileId = Number(object.file);
    var timelineName = this._pathTime[this._pathMain[this._key].object_ref[i].timeline].name.replace(/\_(\d){3}/, '');
    var fileName = this._animation.folder[folderId].file[fileId].name.replace(/\_(\d){3}/, '');
    fileName = fileName.replace(".png", '');
    var skin = this._skin;
    var skinParts = this._skinParts;
    var spriteChanges = this._spriteChildren;

    for (var j = 0; j < skinParts.length; j++){
        if (skinParts[j].skinName == timelineName) {
            skin = skinParts[j].skinSet;
            break;
        }
    }
    if (this._object[i]._fileName !== fileName || this._object[i]._skin !== skin) {
        this._object[i].bitmap = ImageManager.loadCharacter("Spriter/"+ skin + "/" + fileName);
        this._object[i]._fileName = fileName;
        this._object[i]._skin = skin;
    }

    // Set Object Values
    var w = Number(this._animation.folder[folderId].file[fileId].width);
    var h = Number(this._animation.folder[folderId].file[fileId].height);
    var ox = Number(object.x) || 0;
    var oy = Number(object.y) || 0;
    var or = Number(object.angle) || 0;
    var oax = Number(object.pivot_x) || 0;
    var oay = 1 - Number(object.pivot_y) || 0;
    var oa = object.a || 1;
    oa = Number(oa);
    var osx = object.scale_x || 1;
    osx = Number(osx);
    var osy = object.scale_y || 1;
    osy = Number(osy);
    var z = Number(this._pathMain[this._key].object_ref[i].z_index);
    var x = objectGlobal.x || ox; 
    var y = objectGlobal.y || -oy; 

    this._object[i].move(x, y);
    this._object[i].alpha = objectGlobal.a || oa;
    this._object[i].rotation = objectGlobal.r || ((-or) * Math.PI / 180);
    this._object[i].anchor.x = objectGlobal.ax || oax;
    this._object[i].anchor.y = objectGlobal.ay || oay;
    this._object[i].scale.x = objectGlobal.sx || osx;
    this._object[i].scale.y = objectGlobal.sy || osy;
    this._object[i].zIndex = objectGlobal.z || z;

    // Set Inherited Sprite
    this.controlChildSprites(i, w, h);

};

Spriter_Character.prototype.setInitialBones = function(n) {

    var globals = this._globalAnimationInfo;
    if (!globals.bones.hasOwnProperty("bone_" + String(n))) {
        globals.bones["bone_" + String(n)] = {};
    }

    if (showSkeleton) {
        var boneId = Number(this._pathTime[this._pathMain[this._key].bone_ref[n].timeline].obj);
        var w = Number(this._animation.entity.obj_info[boneId].w);
        var h = 4;
        this._bone[n].bitmap = new Bitmap(w, h);
        this._bone[n].bitmap.fillAll('black');
        this._bone[n].bitmap.fillRect(1,1, w-2, h-2, 'white');
    }

    var boneGlobal = globals.bones["bone_" + String(n)];

    var time = Number(this._pathMain[this._key].bone_ref[n].key);
    var bone = this._pathTime[this._pathMain[this._key].bone_ref[n].timeline].key[time].bone;    
    var bx = Number(bone.x) || 0;
    var by = Number(bone.y) || 0;
    var br = Number(bone.angle) || 0;
    var bsx = bone.scale_x || 1;
    bsx = Number(bsx);
    var bsy = bone.scale_y || 1;
    bsy = Number(bsy);
    var x = boneGlobal.x || bx;
    var y = boneGlobal.y || -by;
    this._bone[n].move(x, y);
    this._bone[n].rotation = boneGlobal.r || -br * Math.PI / 180;
    this._bone[n].scale.x = boneGlobal.sx || bsx;
    this._bone[n].scale.y = boneGlobal.sy || bsy;
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
        this._repeat = this._animation.entity.animation[this._animationId].looping || "true";
        this._repeat = eval(this._repeat);             
    }
};


//-------------------------------------------------------------------------------------------------------------
// Check elements of Sprite that should be updated according to the character's condition
//------------------------------------------------------------------------------------------------------------- 
Spriter_Character.prototype.updateSprite = function() {
    if (!this._stop) {
    	this.checkChanges();
        this.updateAnimationKey();
        this.setCharacterSprite();
        this.updateTagsAndVars();
        if (this.isMoving(this._character)) {
            this._resetter = false;
            this.updateFrame();
        }
        else if (this._recovery == "snap") {
            // this._resetter resets the animation if !this._character.isMoving() for more that one update loop.
            // Character movement stops after the completion of a step
            if (this._resetter === true) {
                this._key = 0;
                this._animationFrame = 0;
                this._globalAnimationInfo.frame = 0;
                this._globalAnimationInfo.key = 0;
            }
            else {
                this._resetter = true;
            }
        }
        else if (this._recovery == "freeze") {
        }
        else if (this._recovery == "smooth") {
        }
    }
    else {
        this.checkChanges();	
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
        this.displaceSprite();
        this.start();
        this._repeat = this._animation.entity.animation[this._animationId].looping || "true";
        this._repeat = eval(this._repeat);   
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
        this._cellX = this._character._spriter._cellX;
        this.displaceSprite();
    }
    if (this._cellY !== this._character._spriter._cellY) {
        this._cellY = this._character._spriter._cellY;
        this.displaceSprite();
    }
    if (this._speed !== this._character._spriter._speed) {
        this._speed = this._character._spriter._speed;
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
// Update this._key according to this._animationFrame
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.updateAnimationKey = function() {
    this._pathMain = this._animation.entity.animation[this._animationId].mainline.key;
    var animLength = Number(this._animation.entity.animation[this._animationId].length);
    for (var i = 0; i < this._pathMain.length; i++){
        if (this._animationFrame == this._pathMain[i].time){
            this._key = i;
            this._globalAnimationInfo.key = this._key; 
            break;
        }
    }
    if (this._animationFrame == animLength && this._speed > 0) {
        this._key = this._pathMain.length - 1; 
        this._globalAnimationInfo.key = this._key; 
    }
    else if (this._pathMain.length > 1 && this._animationFrame < Number(this._pathMain[1].time) && this._speed < 0) {
	    this._key = 0;
    }
};

//-------------------------------------------------------------------------------------------------------------
// Updates frame. If mid key the frame increases by this._speed. If at key, the frame takes the key time.
// If animation is over, frame does not change or it resets to 0
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.updateFrame = function() {
    this._pathMain = this._animation.entity.animation[this._animationId].mainline.key;
    var animLength =  Number(this._animation.entity.animation[this._animationId].length);
    var speed = Number(this._speed);

    // Animation Going Forwards
    if (speed > 0) {

        // Works Until Last Key
        if (this._key < this._pathMain.length - 1) {

            // If animationFrame is bigger that next Key Frame, then  animationFrame = next Key Frame
            if (this._animationFrame + speed > this._pathMain[this._key + 1].time) {
                this._animationFrame = Number(this._pathMain[this._key + 1].time);
            }
            else {
                this._animationFrame += speed;
            }  
        }

        // Works For Last Key
        else if (this._key == this._pathMain.length - 1) {

            // If animationFrame is bigger than next Key Frame, then animationFrame = next Key Frame
            if (this._animationFrame + speed > animLength) {
                this._animationFrame = animLength;
            }
            else {
                this._animationFrame += speed;
            }

            // If animationFrame is at End of Animation and Animation Repeats, Set To Start Point
            if (this._animationFrame == animLength && this._repeat) {
                this._animationFrame = 0;
                this._key = 0;
            }  
        }
    }
    else if (speed < 0) {

        // Works Until Last Key
        if (this._key > 0) {

            // If animationFrame is bigger that next Key Frame, then  animationFrame = next Key Frame
            if (this._animationFrame + speed < this._pathMain[this._key - 1].time) {
                this._animationFrame = Number(this._pathMain[this._key - 1].time);
            }
            else {
                this._animationFrame += speed;
            }  
        }

        // Works For Last Key
        else if (this._key === 0) {

            // If animationFrame is bigger than next Key Frame, then animationFrame = next Key Frame
            if (this._animationFrame + speed < 0) {
                this._animationFrame = 0;
            }
            else {
                this._animationFrame += speed;
            }

            // If animationFrame is at End of Animation and Animation Repeats, Set To Start Point
            if (this._animationFrame === 0 && this._repeat) {
                this._animationFrame = animLength;
                this._key = this._pathMain.length - 1;
            }  
        }
    }
    this._globalAnimationInfo.key = this._key; 
    this._globalAnimationInfo.frame = this._animationFrame;
};

//-------------------------------------------------------------------------------------------------------------
// Update Bone and Object x/y/angle/opacity/scale/anchor/inheritance
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.setCharacterSprite = function() {
    this._pathMain = this._animation.entity.animation[this._animationId].mainline.key;
    this._pathTime = this._animation.entity.animation[this._animationId].timeline;

    // Set Bones
    var bonePrevFrame;
    var boneNextFrame;
    var boneKey;
    var boneTime;
    var isAnimated;

    if (this._pathMain[this._key].hasOwnProperty('bone_ref')) {

        //Setting Bone Inheritance
        for(var j = 0; j < this._pathMain[this._key].bone_ref.length; j++) {
            this.updateBoneInheritance(j);
        }

        // Setting Bone Values
        for(var n = 0; n < this._pathMain[this._key].bone_ref.length; n++) {
            boneTime = this._pathMain[this._key].bone_ref[n].timeline;
            boneKey = Number(this._pathMain[this._key].bone_ref[n].key);
            bonePrevFrame = this._pathTime[boneTime].key[boneKey].time || 0;
            isAnimated = "this._pathTime[boneTime].key.length > 1";
                

            if (this._speed > 0) {

                // Works Until Last Key
                if (boneKey != this._pathTime[boneTime].key.length - 1){
                    boneNextFrame = this._pathTime[boneTime].key[boneKey + 1].time;
                    if (this._animationFrame == bonePrevFrame) {
                        this.boneKeyUpdate(n);
                    }
                    else if (this._animationFrame > bonePrevFrame && this._animationFrame < boneNextFrame  && eval(isAnimated) && this.isMoving(this._character)) {
                        this.boneMidKeyUpdate(n);
                    }
                }

                // Works For Last Key
                else if (boneKey == this._pathTime[boneTime].key.length - 1) {
                    if (this._animationFrame == bonePrevFrame) {
                        this.boneKeyUpdate(n);
                    }
                    else if (this._animationFrame > bonePrevFrame && this._repeat && eval(isAnimated)) {
                        this.boneMidKeyUpdate(n); 
                    }
                    else if (this._pathTime[boneTime].key.length == 1){
                        this.boneKeyUpdate(n);
                    }
                    else if (this._animationFrame > bonePrevFrame && !this._repeat) {
                        this.boneKeyUpdate(n);
                    }
                }
            }
            else if (this._speed < 0) {

                // Works Until Last Key
                if (boneKey > 0){
                    boneNextFrame = this._pathTime[boneTime].key[boneKey - 1].time;
                    if (this._animationFrame == bonePrevFrame) {
                        this.boneKeyUpdate(n);
                    }
                    else if (this._animationFrame < bonePrevFrame && this._animationFrame > boneNextFrame  && eval(isAnimated) && this.isMoving(this._character)) {
                        this.boneMidKeyUpdate(n);
                    }
                }

                // Works For Last Key
                else if (boneKey == 0) {
                    if (this._animationFrame == bonePrevFrame) {
                        this.boneKeyUpdate(n);
                    }
                    else if (this._animationFrame < bonePrevFrame && this._repeat && eval(isAnimated)) {
                        this.boneMidKeyUpdate(n); 
                    }
                    else if (this._pathTime[boneTime].key.length == 1){
                        this.boneKeyUpdate(n);
                    }
                    else if (this._animationFrame < bonePrevFrame && !this._repeat) {
                        this.boneKeyUpdate(n);
                    }
                }
            }
        }
    }

    // Set Object 
    if (this._pathMain[this._key].hasOwnProperty('object_ref')) {

        //Going through all Objects for Current Key
        for(var i = 0; i < this._pathMain[this._key].object_ref.length; i++){
            var objectKey = Number(this._pathMain[this._key].object_ref[i].key);
            var objectTimeline = this._pathMain[this._key].object_ref[i].timeline;
            var objectCurrentFrame = this._pathTime[objectTimeline].key[objectKey].time || 0;
            var objectNextFrame;
            isAnimated = "this._pathTime[objectTimeline].key.length > 1";

            if (this._speed > 0) {

                // Works Until Last Key
                if (objectKey != this._pathTime[objectTimeline].key.length - 1) {
                    objectNextFrame = this._pathTime[objectTimeline].key[objectKey + 1].time;

                    // If this._animationFrame has a Key Time, the Object is Updated according to Key 
                    if (this._animationFrame == objectCurrentFrame) {
                        this.objectKeyUpdate(i);
                    }

                    // If this._animationFrame Value is Between two Key Values, the Object is Updated by Comparing the Differences Between Keys
                    else if (this._animationFrame > objectCurrentFrame && this._animationFrame < objectNextFrame && eval(isAnimated)) {
                        this.objectMidKeyUpdate(i);
                    }
                }

                // Works For Last Key
                else if (objectKey == this._pathTime[objectTimeline].key.length - 1) {

                    // If this._animationFrame has a Key Time, the Object is Updated according to Key 
                    if (this._animationFrame == objectCurrentFrame) {
                        this.objectKeyUpdate(i);
                    }

                    // If this._animationFrame Value is Higher than Last Key and this._repeat, next key is 0
                    else if (this._animationFrame > objectCurrentFrame && this._repeat && eval(isAnimated)){
                        this.objectMidKeyUpdate(i);
                    }
                    else if (this._pathTime[objectTimeline].key.length == 1){
                        this.objectKeyUpdate(i);
                    }
                    else if (this._animationFrame > objectCurrentFrame && !this._repeat) {
                        this.objectKeyUpdate(i);
                    }
                }    
            }
            else if (this._speed < 0) {
                // Works Until Last Key
                if (objectKey > 0) {
                    objectNextFrame = this._pathTime[objectTimeline].key[objectKey - 1].time;

                    // If this._animationFrame has a Key Time, the Object is Updated according to Key 
                    if (this._animationFrame == objectCurrentFrame) {
                        this.objectKeyUpdate(i);
                    }

                    // If this._animationFrame Value is Between two Key Values, the Object is Updated by Comparing the Differences Between Keys
                    else if (this._animationFrame < objectCurrentFrame && this._animationFrame > objectNextFrame && eval(isAnimated)) {
                        this.objectMidKeyUpdate(i);
                    }
                }

                // Works For Last Key
                else if (objectKey === 0) {

                    // If this._animationFrame has a Key Time, the Object is Updated according to Key 
                    if (this._animationFrame == objectCurrentFrame) {
                        this.objectKeyUpdate(i);
                    }

                    // If this._animationFrame Value is Higher than Last Key and this._repeat, next key is 0
                    else if (this._animationFrame < objectCurrentFrame && this._repeat && eval(isAnimated)){
                        this.objectMidKeyUpdate(i);
                    }
                    else if (this._pathTime[objectTimeline].key.length == 1){
                        this.objectKeyUpdate(i);
                    }
                    else if (this._animationFrame > objectCurrentFrame && !this._repeat) {
                        this.objectKeyUpdate(i);
                    }
                }    
            }
        }
    }
};


//-------------------------------------------------------------------------------------------------------------
// Updates this_object[i] according to the animation's key info.
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.objectKeyUpdate = function(i) {

    // Set Inheritance
    if (this._object[i].parent !== null) {
        this._object[i].parent.removeChild(this._object[i]);
    }
    if (this._pathMain[this._key].object_ref[i].hasOwnProperty('parent')) {
         this._bone[this._pathMain[this._key].object_ref[i].parent].addChild(this._object[i]);
    } 
    else {
        if (this._object[i].parent !== this._sprite || this._object[i].parent === null) {
            this._sprite.addChild(this._object[i]);
        }
    }

    // Get Object Key ID
    var time = Number(this._pathMain[this._key].object_ref[i].key);    
    var object = this._pathTime[this._pathMain[this._key].object_ref[i].timeline].key[time].object;
    var folderId = Number(object.folder);
    var fileId = Number(object.file);
    var timelineName = this._pathTime[this._pathMain[this._key].object_ref[i].timeline].name.replace(/\_(\d){3}/, '');
    var fileName = this._animation.folder[folderId].file[fileId].name.replace(/\_(\d){3}/, '');
    fileName = fileName.replace(".png", '');
    var skin = this._skin;
    var skinParts = this._skinParts;

    // Check for Skin Parts
    for (var j = 0; j < skinParts.length; j++){
        if (skinParts[j].skinName == timelineName) {
            skin = skinParts[j].skinSet;
            break;
        }
    }

    // Set Bitmap
    if (this._object[i]._fileName !== fileName || this._object[i]._skin !== skin) {
        this._object[i].bitmap = ImageManager.loadCharacter("Spriter/"+ skin + "/" + fileName);
        this._object[i]._fileName = fileName;
        this._object[i]._skin = skin;
    }

    // Set Object Values
    var w = Number(this._animation.folder[folderId].file[fileId].width);
    var h = Number(this._animation.folder[folderId].file[fileId].height);
    var ox = Number(object.x) || 0;
    var oy = Number(object.y) || 0;
    var or = Number(object.angle) || 0;
    var oax = Number(object.pivot_x) || 0;
    var oay = 1 - Number(object.pivot_y) || 0;
    var oa = object.a || 1;
    oa = Number(oa);
    var osx = object.scale_x || 1;
    osx = Number(osx);
    var osy = object.scale_y || 1;
    osy = Number(osy);
    var z = Number(this._pathMain[this._key].object_ref[i].z_index);
    var x = ox; 
    var y = oy;

    this._object[i].move(x, -y);
    this._object[i].alpha = oa;
    this._object[i].rotation = ((-or) * Math.PI / 180);
    this._object[i].anchor.x = oax;
    this._object[i].anchor.y = oay;
    this._object[i].scale.x = osx;
    this._object[i].scale.y = osy;
    this._object[i].zIndex = z;

    // Set Inherited Sprite
    this.controlChildSprites(i, w, h);

    //Storing Values to Global Variable 
    this.storeToGlobal("object", this._object[i], i);

};

//-------------------------------------------------------------------------------------------------------------
// Check if this._object has a Child Sprite and set inheritance
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.controlChildSprites = function(i, w, h) {
    var timelineName = this._pathTime[this._pathMain[this._key].object_ref[i].timeline].name.replace(/\_(\d){3}/, '');
    var spriteChanges = this._spriteChildren;
    for (var k = 0; k < spriteChanges.length; k++) {
        if (spriteChanges[k].skinName == timelineName) {
            var childSprites = $gameVariables._data[spriterVarId]._childSprites;  
            for (var l = 0; l < childSprites.length; l++) {
            	var case_1 = "childSprites[l]._character._name == spriteChanges[k].sprite";
            	var case_2 = "childSprites[l]._spriteParent === undefined";
            	var case_3 = "childSprites[l]._spriteParent == spriteChanges[k].parent";
                if (eval(case_1) && (eval(case_2) || eval(case_3))) {
                	if (!spriteChanges[k].remove) {
                		childSprites[l].x = 0;
	                    childSprites[l].y = 0;
	                    childSprites[l]._sprite.x = 0 - (this._object[i].anchor.x * w);
	                    childSprites[l]._sprite.y = 0 - (this._object[i].anchor.y * h);
	                    this._object[i].addChild(childSprites[l]);
	                    childSprites[l]._spriteParent = spriteChanges[k].parent;
	                    break;	
                	}
                    // Removes child Sprte from character's Sprite Children and Global 
                	else {
                		childSprites[l].alpha = 0;
            		    spriteChanges.splice(k, 1);
                		childSprites.splice(l, 1);
                		break;
                	}
                }
            }
        }
    }
};

//-------------------------------------------------------------------------------------------------------------
// Updates this_object[i] according to the mid-key info.
// Difference in value between two keys is divided with the difference in time between two keys.
// The fraction is added to the previous frame value.
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.objectMidKeyUpdate = function(i) {

    var globals = this._globalAnimationInfo;
    if (!globals.objects.hasOwnProperty("object_" + String(i))) {
        globals.objects["object_" + String(i)] = {};
    }
    var globalsObject = globals.objects["object_" + String(i)];

    // Getting Keys & Times
    var time = Number(this._pathMain[this._key].object_ref[i].key);
    var key = this._pathTime[this._pathMain[this._key].object_ref[i].timeline].key;
    var currentKey = key[time];
    var nextKey;
    var firstKey = key[0];
    var lastKey = key[key.length - 1];
    var currentKeyTime = currentKey.time || 0;

    if (this._repeat && this._speed > 0 && currentKeyTime == lastKey.time) {
        nextKey = 0;
    }
    else if (!this._repeat && this._speed > 0 && currentKeyTime == lastKey.time) {
        nextKey = currentKey;
    }
    else if (this._speed > 0) {
        nextKey = time + 1;
    }
    else if (this._repeat && this._speed < 0 && currentKeyTime == firstKey.time) {
        nextKey = lastKey;
    }
    else if (!this._repeat && this._speed < 0 && currentKeyTime == firstKey.time) {
        nextKey = currentKey;
    }
    else if (this._speed < 0) {
        nextKey = time - 1;
    }
    var pt = Number(key[time].time) || 0;
    var nt;

    if (this._repeat && this._speed > 0 && currentKeyTime == lastKey.time) {
        nt = Number(this._animation.entity.animation[this._animationId].length);
    }
    else if (this._repeat && this._speed < 0 && currentKeyTime == firstKey.time) {
    	nt = 0;
    }
    else {
        nt =  Number(key[nextKey].time) || 0;
    }

    var t = Math.abs((nt - pt) / this._speed);
    var object = this._pathTime[this._pathMain[this._key].object_ref[i].timeline].key[time].object;
    var folderId = Number(object.folder);
    var fileId = Number(object.file);
    var timelineName = this._pathTime[this._pathMain[this._key].object_ref[i].timeline].name.replace(/\_(\d){3}/, '');
    var fileName = this._animation.folder[folderId].file[fileId].name.replace(/\_(\d){3}/, '');
    fileName = fileName.replace(".png", '');
    var skin = this._skin;
    var skinParts = this._skinParts;
    var spriteChanges = this._spriteChildren;

    // Check for Skin Parts
    for (var j = 0; j < skinParts.length; j++){
        if (skinParts[j].skinName == timelineName) {
            skin = skinParts[j].skinSet;
            break;
        }
    }

    // Set Bitmap
    if (this._object[i]._fileName !== fileName || this._object[i]._skin !== skin) {
        this._object[i].bitmap = ImageManager.loadCharacter("Spriter/"+ skin + "/" + fileName);
        this._object[i]._fileName = fileName;
        this._object[i]._skin = skin;
    }

    //Getting Previous Key Object Values
    var pObject = key[time].object;
    var px = Number(pObject.x) || 0;
    var py = Number(pObject.y) || 0;
    var pr = Number(pObject.angle) || 0;
    var pa = (pObject.a) || 1;
    pa = Number(pa);
    var psx = (pObject.scale_x) || 1;
    psx = Number(psx);
    var psy = (pObject.scale_y) || 1;
    psy = Number(psy);

    //Getting Next Key Object Values
    var nObject = key[nextKey].object;
    var nx = Number(nObject.x) || 0;
    var ny = Number(nObject.y) || 0;
    var nr = Number(nObject.angle) || 0;
    var na = (nObject.a) || 1;
    na = Number(na);
    var nsx = (nObject.scale_x) || 1;
    nsx = Number(nsx);
    var nsy = (nObject.scale_y) || 1;
    nsy = Number(nsy);

    //Determining Spin
    var spin = Number(key[time].spin) || 1;
    var dr;

    if (this._speed > 0) {
    	if (spin == -1 && nr > pr) {
        	dr = nr - pr - 360;
	    }
	    else if (spin == 1 && nr < pr) {
	        dr = nr - pr + 360;
	    }
	    else {
	        dr = nr - pr;
	    }
    }
    else if (this._speed < 0) {
    	if (spin == -1 && nr < pr) {
        	dr = nr - pr + 360;
	    }
	    else if (spin == 1 && nr > pr) {
	        dr = nr - pr - 360;
	    }
	    else {
	        dr = nr - pr;
	    }
    }
    

	// Getting Object Values for Previous Frame
    var ox = this._object[i].x;
    var oy = this._object[i].y;
    var or = this._object[i].rotation;
    var oa = this._object[i].alpha;
    var osx = this._object[i].scale.x;
    var osy = this._object[i].scale.y;

    // Setting Object Values for Current Frame
    this._object[i].x = ox + ((nx - px) / t);
    this._object[i].y = oy + ((-ny + py) / t);
    this._object[i].rotation = or + (((-dr) / t) * Math.PI / 180);
    this._object[i].alpha = oa + ((na - pa) / t);
    this._object[i].scale.x = osx + ((nsx - psx) / t);
    this._object[i].scale.y = osy + ((nsy - psy) / t);

    //Storing Values to Global Variable 
    this.storeToGlobal("object", this._object[i], i);
};

//-------------------------------------------------------------------------------------------------------------
// Check if this._bone[n] has parent and check inheritance
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.updateBoneInheritance = function(j) {
    if (this._pathMain[this._key].bone_ref[j].hasOwnProperty('parent')) {
        this._bone[this._pathMain[this._key].bone_ref[j].parent].addChild(this._bone[j]);
    }
    else {
        this._sprite.addChild(this._bone[j]);
    }
};

//-------------------------------------------------------------------------------------------------------------
// Updates this._bone[n] according to key info.
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.boneKeyUpdate = function(n) {

    var globals = this._globalAnimationInfo;
    if (!globals.bones.hasOwnProperty("bone_" + String(n))) {
        globals.bones["bone_" + String(n)] = {};
    }

    if (showSkeleton) {
        var boneId = Number(this._pathTime[this._pathMain[this._key].bone_ref[n].timeline].obj);
        var w = Number(this._animation.entity.obj_info[boneId].w);
        var h = 4;
        this._bone[n].bitmap = new Bitmap(w, h);
        this._bone[n].bitmap.fillAll('black');
        this._bone[n].bitmap.fillRect(1,1, w-2, h-2, 'white');
    }

    var time = Number(this._pathMain[this._key].bone_ref[n].key);
    var bone = this._pathTime[this._pathMain[this._key].bone_ref[n].timeline].key[time].bone;    
    var bx = Number(bone.x) || 0;
    var by = Number(bone.y) || 0;
    var br = Number(bone.angle) || 0;
    var bsx = bone.scale_x || 1;
    bsx = Number(bsx);
    var bsy = bone.scale_y || 1;
    bsy = Number(bsy);
    this._bone[n].move(bx, -by);
    this._bone[n].rotation = -br * Math.PI / 180;
    this._bone[n].scale.x = bsx;
    this._bone[n].scale.y = bsy;

    //Storing Values to Global Variable 
    this.storeToGlobal("bone", this._bone[n], n);
};

//-------------------------------------------------------------------------------------------------------------
// Updates this._bone[n] according to the mid-key info.
// Difference in value between two keys is divided with the difference in time between two keys.
// The fraction is added to the previous frame value.
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.boneMidKeyUpdate = function(n) {

    var globals = this._globalAnimationInfo;
    if (!globals.bones.hasOwnProperty("bone_" + String(n))) {
        globals.bones["bone_" + String(n)] = {};
    }
    var globalsBone = globals.bones["bone_" + String(n)];

    // Getting Keys & Times
    var time = Number(this._pathMain[this._key].bone_ref[n].key);
    var key = this._pathTime[this._pathMain[this._key].bone_ref[n].timeline].key;
    var currentKey = key[time];
    var currentKeyTime = currentKey.time || 0;
    var nextKey;
    var firstKey = key[0];
    var lastKey = key[key.length - 1];
 
    if (this._repeat && this._speed > 0 && currentKeyTime == lastKey.time) {
        nextKey = 0;
    }
    else if (this._speed > 0) {
        nextKey = time + 1;
    }
    else if (this._repeat && this._speed < 0 && currentKeyTime == firstKey.time) {
        nextKey = lastKey;
    }
    else if (this._speed < 0) {
        nextKey = time - 1;
    }
    var pt = Number(key[time].time) || 0;
    var nt;
    if (this._repeat && this._speed > 0 && currentKeyTime == lastKey.time) {
        nt = Number(this._animation.entity.animation[this._animationId].length);
    }
    else if (this._repeat && this._speed < 0 && currentKeyTime == firstKey.time) {
        nt = 0;
    }
    else {
        nt =  Number(key[nextKey].time) || 0;
    }

    var t = Math.abs((nt - pt) / this._speed);

    //Getting Previous Key Bone Values
    var pBone = key[time].bone;
    var px = Number(pBone.x) || 0;
    var py = Number(pBone.y) || 0;
    var pr = Number(pBone.angle) || 0;
    var psx = pBone.scale_x || 1;
    psx = Number(psx);
    var psy = pBone.scale_y || 1;
    psy = Number(psy);

    //Getting Next Key Bone Values
    var nBone = key[nextKey].bone;
    var nx = Number(nBone.x) || 0;
    var ny = Number(nBone.y) || 0;
    var nr = Number(nBone.angle) || 0;
    var nsx = nBone.scale_x || 1;
    nsx = Number(nsx);
    var nsy = nBone.scale_y || 1;
    nsy = Number(nsy);

    //Determining Spin
    var spin = Number(key[time].spin) || 1;
    var dr;
    if (this._speed > 0) {
    	if (spin == -1 && nr > pr) {
        	dr = nr - pr - 360;
	    }
	    else if (spin == 1 && nr < pr) {
	        dr = nr - pr + 360;
	    }
	    else {
	        dr = nr - pr;
	    }
    }
    else if (this._speed < 0) {
    	if (spin == 1 && nr < pr) {
        	dr = nr - pr + 360;
	    }
	    else if (spin == -1 && nr > pr) {
	        dr = nr - pr - 360;
	    }
	    else {
	        dr = nr - pr;
	    }
    }

    // Getting Previous Frame Values 
    var bx = this._bone[n].x;
    var by = this._bone[n].y;
    var br = this._bone[n].rotation;
    var bsx = this._bone[n].scale.x;
    var bsy = this._bone[n].scale.y;

    // Setting Bone Values for Current Frame
    this._bone[n].x = bx + ((nx - px) / t);
    this._bone[n].y = by + ((-ny + py) / t);
    this._bone[n].rotation = br + ((-dr / t) * Math.PI / 180);
    this._bone[n].scale.x = bsx + ((nsx - psx) / t);
    this._bone[n].scale.y = bsy + ((nsy - psy) / t);

    //Storing Values to Global Variable 
    this.storeToGlobal("bone", this._bone[n], n);
};

//-------------------------------------------------------------------------------------------------------------
// Moves Sprite from 0,0 point to -width/2,-height point. 
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.displaceSprite = function() {
    this._sprite.x = -this._cellX/2;
    this._sprite.y = -this._cellY;
};

//-------------------------------------------------------------------------------------------------------------
// Storing bone/object values to global
//-------------------------------------------------------------------------------------------------------------
Spriter_Character.prototype.storeToGlobal = function(type, item, number) {
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
    if (type === "bone") {
        var bone = characterGlobal.bones[type + "_" + String(number)];
        bone.x = item.x;
        bone.y = item.y;
        bone.r = item.rotation;
        bone.sx = item.scale.x;
        bone.sy = item.scale.y;
    }
    else if (type === "object") {
    	if (characterGlobal.objects.hasOwnProperty(type + "_" + String(number))) {
    		characterGlobal.objects[type + "_" + String(number)] = {};
    	}
        var object = characterGlobal.objects[type + "_" + String(number)];
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
            var varline = this._animation.entity.animation[this._animationId].meta.varline;
            for (var i = 0; i < varline.length; i++) {
                for (var j = 0; j < varline[i].key.length; j++) {
                    var time = Number(varline[i].key[j].time);
                    var case_1 = "this._animationFrame == time";
                    var case_2 = "this._animationFrame > time && this._animationFrame < time + this._speed";

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
            for (var i = 0; i < tagline.key.length; i++) {
                var time = Number(tagline.key[i].time);
                var case_1 = "this._animationFrame == time";
                var case_2 = "this._animationFrame > time && this._animationFrame < time + this._speed";
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
// Functions shared with Sprite Characters
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
    console.log(data);
    $spriterAnimations[name] = data;
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

var spriter_alias_game_interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    spriter_alias_game_interpreter_pluginCommand.apply(this);
    var event;
    var follower;
    var mapId;
    var eventId;
    var eventGlobalInfo;
    var playerGlobalInfo;
    var followerGlobalInfo;

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
        var a = {};
        a.skinName = args[1];
        a.skinSet = args[2];
        if (event._skinParts.length > 0) {
            for (var i = 0; i < event._skinParts.length; i++) {
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
    else if (command === "eventChildSprite") {
        event = $gameMap.event(args[0])._spriter;
        mapId = "map_" + String($gameMap.event(args[0])._mapId);
        eventId = "event_" + String($gameMap.event(args[0])._eventId);
        eventGlobalInfo = $gameVariables._data[spriterVarId].maps[mapId][eventId];
        var a = {};
        a.skinName = args[1];
        a.sprite = args[2];
        a.remove = false;
        a.parent = 'event_' + args[0];
        if (event._spriteChildren.length > 0) {
            for (var i = 0; i < event._spriteChildren.length; i++) {
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
        var a = {};
        a.skinName = args[1];
        a.sprite = args[2];
        a.parent = 'event_' + args[0];
        a.remove = true;
        if (event._spriteChildren.length > 0) {
            for (var i = 0; i < event._spriteChildren.length; i++) {
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
        var a = {};
        a.skinName = args[0];
        a.skinSet = args[1];
        if ($gamePlayer._spriter._skinParts.length > 0) {
            for (var i = 0; i < $gamePlayer._spriter._skinParts.length; i++) {
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
    else if (command === "playerChildSprite") {
        playerGlobalInfo = $gameVariables._data[spriterVarId].player;
        var a = {};
        a.skinName = args[0];
        a.sprite = args[1];
        a.parent = "player";
        a.remove = false;
        if ($gamePlayer._spriter._spriteChildren.length > 0) {
            for (var i = 0; i < $gamePlayer._spriter._spriteChildren.length; i++) {
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
        var a = {};
        a.skinName = args[0];
        a.sprite = args[1];
        a.parent = "player";
        a.remove = true;
        if ($gamePlayer._spriter._spriteChildren.length > 0) {
            for (var i = 0; i < $gamePlayer._spriter._spriteChildren.length; i++) {
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
        var a = {};
        a.skinName = args[1];
        a.skinSet = args[2];
        if (follower._skinParts.length > 0) {
            for (var i = 0; i < follower._skinParts.length; i++) {
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
    else if (command === "followerChildSprite") {
        follower = $gamePlayer.followers()._data[Number(args[0]) - 1]._spriter;
        followerGlobalInfo = $gameVariables._data[spriterVarId].followers['follower_'+ args[0]];
        var a = {};
        a.skinName = args[1];
        a.sprite = args[2];
        a.remove = false;
        a.parent = 'follower';
        if (follower._spriteChildren.length > 0) {
            for (var i = 0; i < follower._spriteChildren.length; i++) {
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
        var a = {};
        a.skinName = args[1];
        a.sprite = args[2];
        a.parent = 'follower';
        a.remove = true;
        if (follower._spriteChildren.length > 0) {
            for (var i = 0; i < follower._spriteChildren.length; i++) {
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

/*
reverse
freeze becomes invisible at times
smooth
careful of scales
add spriter_characters as children
bezier curves
masks
*/