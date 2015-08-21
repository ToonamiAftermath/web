//Stream Watermark
$(document).ready(function(){
	function fadein() {$("#watermark").delay(15000).fadeIn(1000, "linear", fadeout);}
	function fadein2() {$("#watermark").delay(360000).fadeIn(1000, "linear", fadeout);}
	function fadeout() {$("#watermark").delay(30000).fadeOut(1000, "linear", fadein2);}
	$("#watermark").fadeOut(1, "linear", fadein);
});

//Parallax Background
$(window).scroll(function(e){
	parallax();
});
function parallax(){
  var scrolled = $(window).scrollTop();
  if(scrolled > 4470) {
	window.scrolled = 4470;
  }
  $('#background').css('top',-(scrolled*0.1)+'px');
}


// Cookies
function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

//Get URL Query by variable name
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//Timezone Detect
function streamTimezoneDetect(){
    var dtDate = new Date('1/1/' + (new Date()).getUTCFullYear());
    var intOffset = 10000; //set initial offset high so it is adjusted on the first attempt
    var intMonth;
    var intHoursUtc;
    var intHours;
    var intDaysMultiplyBy;

    //go through each month to find the lowest offset to account for DST
    for (intMonth=0;intMonth < 12;intMonth++){
        //go to the next month
        dtDate.setUTCMonth(dtDate.getUTCMonth() + 1);

        //To ignore daylight saving time look for the lowest offset.
        //Since, during DST, the clock moves forward, it'll be a bigger number.
        if (intOffset > (dtDate.getTimezoneOffset() * (-1))){
            intOffset = (dtDate.getTimezoneOffset() * (-1));
        }
    }
	//Custom for stream detect
	var stream;

	intOffset=intOffset/60;
	var pstOffset=Math.abs(intOffset-(-7));
	var estOffset=Math.abs(intOffset-(-5));
    if(pstOffset<estOffset) {
		stream="pst";
	}
	else {
		stream="est";
	}
	console.log(stream+" stream closest timezone detected");

	return stream;
}


var channelSelected = readCookie('channelSelected');
if (channelSelected==null || channelSelected==""){
	channelSelected=streamTimezoneDetect();
}
var chat = "on";
var chattoggle = readCookie('chattoggle');

var fullPageMode = "off";
var dimSwitch = "false";



var chatframe;
var channelList= [];
$(document).ready(function() {
	//Chat Script
	if($('#chat').length){
		if (chattoggle == 'hide') hideChat();
		var randservnum;
		var read = readCookie('randservnum');
		if (read!=null) {
			randservnum = parseInt(read, 10) + 1;
			if (randservnum > 2) {
				randservnum = 0;
			}
		}
		else {
			randservnum = Math.floor((Math.random() * 3));
		}
		var port = "909" + randservnum;
		//var port = "7778";
		chatframe = "<iframe src=\"http://www.toonamiaftermath.com:" + port + "/\" id=\"chat-embed\"><p>Your browser does not support iframes.</p></iframe>";
			if (!chattoggle) $('#chat').html(chatframe);
		createCookie('randservnum', randservnum, 7);
	}
	if($('#vid-embed-container').length){
		urlChannel=getParameterByName('channel');
		if(getParameterByName('channel')!="") {
			if(urlChannel=='radio'){streamSelect(channelSelected);}
			setTimeout(function(){streamSelect(urlChannel)},500);
		}
		else {
			streamSelect(channelSelected);
		}
	}//end vid exist
	if($('#volume').length){
		var volumeStored;
		if(readCookie('volume')!= null){volumeStored = parseInt(readCookie('volume'));}
		else{volumeStored=100;}
		if(volumeStored==0){
			$('#mute-button').addClass('mute').attr('original-title','Unmute');
		}
		$("#volume").slider({
			min: 0,
			max: 100,
			value: volumeStored,
			range: "min",
			start: function( event, ui ) {
				$('#controls button').css('pointer-events','none');
				$('#controls').css('cursor','pointer');
				$('#volume .ui-slider-handle').addClass('active');
			},
			stop: function(event, ui) {
				$('#controls button').css('pointer-events','auto');
				$('#controls').css('cursor','');
				$('#volume .ui-slider-handle').removeClass('active');
			},
			change: function(event, ui) {
				if($('#vid').hasClass('jwplayer')){
					jwplayer('jwplayer').setVolume(ui.value);
					if(ui.value==0){jwplayer('jwplayer').setMute(true);}
					else{jwplayer('jwplayer').setMute(false);}
				}
				else if($('#vid').hasClass('ustream')){
					if(ui.value==0){$('#mute-button').addClass('mute').attr('original-title','Unmute');}
					else{$('#mute-button').removeClass('mute').attr('original-title','Mute');}
					ustream.callMethod('volume', ui.value);
				}
				createCookie('volume', ui.value, 7000);
			}
		});
	}
	if($('#controls').length){
		$('.channel-button').each(function() {
			channelList.push($(this).html());
		});
	}
});

function hideChat(noCookie) {
	chat = "off";
	$("#chat").css("display", "none");
	$("#main-contain").css({
		"background-color": "rgb(16, 16, 16)",
		"width": "1040px",
		"left": "50%",
		"margin-left": "-520px"
	});
	$("#view-contain").css("margin-left", "200px");
	$("#chat").html("");
	setTimeout(function () {
		if (fullPageMode == 'on') {fullPage("on");}
	}, 0);
	if(noCookie!=true){
		createCookie('chattoggle', 'hide', 7000);
	}
}

function showChat() {
	chat = "on";
	$("#chat, #main-contain, #view-contain").attr("style", "");
	$("#chat").html(chatframe);
	setTimeout(function () {
		if (fullPageMode == 'on') {fullPage("on");}
	}, 0);
	eraseCookie('chattoggle');
}

function toggleChat() {
	if (chat == 'on') hideChat();
	else showChat();
}

//Stream Loader
var channel, player, currentStream, ustream, playState, autoplayInterval;
function streamSelect(stream) {
	//if(stream!="radio"){
	hudSelect(stream);
	createCookie('channelSelected', stream, 7000);
	//}
	if($('#vid-embed-container').length){
			channelSelected = stream;
			$('.channel-button').removeClass('active');
			$('#play-button').css({
				'pointer-events':'all',
				'opacity':'1'
			});
			if(typeof autoplayInterval!=undefined){clearInterval(autoplayInterval);}
			if(stream=="est"){
				/*channel="toonamiest";
				channelUrl="http://connectcast.tv/toonamiest";
				player='connectcast';*/
				channel='19964595';
				player='ustream';
			}
			else if(stream=="pst"){
				/*channel="toonamipst";
				player='vaughnlive';*/
				/*channel="toonamipst";
				channelUrl="http://connectcast.tv/toonamipst";
				player='connectcast';*/
				channel='19964352';
				player='ustream';
			}
			else if(stream=="radio"){
				var theme=readCookie('theme');
				if(theme=='Auto' || theme==''){
					loadTheme('Aftermath');
					createCookie('theme', theme, 7000);
				}
				/*channel="toonami";
				player='vaughnlive'

				channel="toonami";
				channelUrl="http://connectcast.tv/toonami";
				player='connectcast';
				*/
				channel='19963542';
				player='ustream';

			}
			else if(stream=="test"){
				channel="mrshow";
				channelUrl="http://connectcast.tv/mrshow";
				player='connectcast';
			}
			$('#vid').attr('class', player);
			$('#'+stream+'-button').addClass('active');
			$(document).ready(function(){
				if(player=='vaughnlive'){
					$("#vid-embed-container").html("<iframe id=\"vidembed\" frameborder=\"0\" framespacing=\"0\" src=\"http://vaughnlive.tv/embed/video/"+channel+"\"></iframe>");
					if(fullPageMode=="on"){setTimeout(function(){fullPage("on");},0);}
				}
				else if(player=='connectcast'){
					$('#vidoutline').css('display','none');
					setTimeout(function(){$('#vidoutline').css('display','block');},20000);
					$('#connectcastLogo').attr("href",channelUrl);
					$('#play-button').addClass("pause");
					$('#hoverPlayButton').addClass('playing');
					$("#vid-embed-container").html("<iframe id=\"vidembed\" width=\"100%\" height=\"100%\" scrolling=\"no\" src=\"http://connectcast.tv/embed/"+channel+"\" frameborder=\"0\" allowfullscreen></iframe>");
					if(fullPageMode=="on"){setTimeout(function(){fullPage("on");},0);}
				}
				else if(player=='ustream'){
					$('#hoverPlayButton').addClass('playing');
					$('#play-button').css({
						'pointer-events':'none',
						'opacity':'0.5'
					});
					$('#play-button').addClass('pause').attr('original-title','Pause (Spacebar)');
					$('#play-button').attr('original-title','Pause (Spacebar)');
					$('.tipsy-inner').html('Pause (Spacebar)');
					playState='playing';
					$("#vid-embed-container").html("<iframe id=\"vidembed\" width=\"100%\" height=\"100%\" src=\"http://www.ustream.tv/embed/"+channel+"\" scrolling=\"no\" frameborder=\"0\" style=\"border: 0px none transparent;\"></iframe>");
					if(fullPageMode=="on"){setTimeout(function(){fullPage("on");},0);}
					//Autoplay
					var i=0;
					ustream = UstreamEmbed('vidembed');
					setTimeout(function(){
						//autoplayInterval=setInterval(autoplay,3000);
						//autoplay();
						playOnce();
					},5000);
					function playOnce(){
						ustream.callMethod('play');
						var volume=$("#volume").slider('value');
						$("#volume").slider('value',volume);
						clearInterval(autoplayInterval);
						$('#play-button').css({
							'pointer-events':'all',
							'opacity':'1'
						});
					}

					function autoplay(){
						ustream.callMethod('play');
						var volume=$("#volume").slider('value');
						$("#volume").slider('value',volume);
						i++;
						if(i>=2){
							clearInterval(autoplayInterval);
							$('#play-button').css({
								'pointer-events':'all',
								'opacity':'1'
							});
						}
					}
				}
				else if(player=='jwplayer') {
					$.getScript( "http://jwpsrv.com/library/hEYkxmcXEeOd8iIACmOLpg.js", function() {
						$("#vid-embed-container").html("<div id=\"jwouter\"><div id=\"jwinner\"><div id=\"jwplayer\"></div></div></div>");
						jwplayer('jwplayer').setup({
							file: 'rtmp://stream.connectcast.tv/live/'+channel,
							image: 'http://i.imgur.com/R2xy324.png',
							width: '100%',
							height: '100%',
							controls: false,
							autostart: 'true'
						});
						jwplayer('jwplayer').onReady(function(){
							var volume=jwplayer('jwplayer').getVolume();
							var muteState=jwplayer('jwplayer').getMute();
							$("#volume").slider('value',volume);
							if(volume==0 || muteState==true){
								$('#mute-button').addClass('mute').attr('original-title','Unmute');
							}
							else{$('#mute-button').attr('original-title','Mute');}
							createCookie('volume', volume, 7000);
							if(fullPageMode=="on"){setTimeout(function(){fullPage("on");},0);}
						});
						jwplayer('jwplayer').onPlay(function(){
							$('#play-button').addClass('pause').attr('original-title','Pause (Spacebar)');
							$('#hoverPlayButton').addClass('playing');
						});
						jwplayer('jwplayer').onPause(function(){
							$('#play-button').removeClass('pause').attr('original-title','Play (Spacebar)');
							$('#hoverPlayButton').removeClass('playing');
						});
						jwplayer('jwplayer').onMute(function(e){
							if(e.mute==true){$('#mute-button').addClass('mute').attr('original-title','Unmute');}
							else{$('#mute-button').removeClass('mute').attr('original-title','Mute');}
						});
						jwplayer('jwplayer').onError(function(){
							console.log("could not load");
							setTimeout(function(){
								pauseJwplayer();
							},5000);
						});
						jwplayer('jwplayer').onDisplayClick(pauseJwplayer);
					});
				}
			});
		currentStream=stream;
	}
}

function pauseJwplayer(forceState){
	if($('#vid').hasClass('connectcast')){
		if($('#vidembed').length) {
			$('#vid-embed-container').html("");
			$('#play-button').removeClass('pause').attr('original-title','Play (Spacebar)');
			$('.tipsy-inner').html('Play (Spacebar)');
			$('#hoverPlayButton').removeClass('playing');
		}
		else{
			streamSelect(channelSelected);
			$('#play-button').addClass('pause').attr('original-title','Pause (Spacebar)');
			$('.tipsy-inner').html('Pause (Spacebar)');
			$('#hoverPlayButton').addClass('playing');
		}
	}
	else if($('#vid').hasClass('ustream')){
		if(playState=='playing'){
			ustream.callMethod('pause');
			playState='paused';
			$('.tipsy-inner').html('Play (Spacebar)');
			$('#play-button').removeClass('pause').attr('original-title','Play (Spacebar)');
			$('#hoverPlayButton').removeClass('playing');
		}
		else {
			ustream.callMethod('play');
			playState='playing';
			$('.tipsy-inner').html('Pause (Spacebar)');
			$('#play-button').addClass('pause').attr('original-title','Pause (Spacebar)');
			$('#hoverPlayButton').addClass('playing');
		}
	}
	else{
		var state=jwplayer('jwplayer').getState();
		if(state=="PLAYING" || state=="BUFFERING" || forceState=="pause") {
			if(state!="PAUSED"){
				jwplayer('jwplayer').pause();
				$('#play-button').removeClass('pause').attr('original-title','Play (Spacebar)');
				$('.tipsy-inner').html('Play (Spacebar)');
				$('#hoverPlayButton').removeClass('playing');
			}
		}
		else {
			jwplayer('jwplayer').play();
			$('#play-button').addClass('pause').attr('original-title','Pause (Spacebar)');
			$('.tipsy-inner').html('Pause (Spacebar)');
			$('#hoverPlayButton').addClass('playing');
		}
	}
}

function muteJwplayer(){
	if($('#vid').hasClass('jwplayer')){
		var state=jwplayer('jwplayer').getMute();
		if(state==true) {
			jwplayer('jwplayer').setMute(false);
			$('.tipsy-inner').html('Mute');
		}
		else {
			jwplayer('jwplayer').setMute(true);
			$('.tipsy-inner').html('Unmute');
		}
	}
	else if($('#vid').hasClass('ustream')){
		var preMute;
		var volume=$("#volume").slider('value');
		if(readCookie('preMute')!= null){preMute=parseInt(readCookie('preMute'));}
		else{createCookie('preMute', 100, 7000);}
		if(volume==0){
			$("#volume").slider('value',preMute);
			$('.tipsy-inner').html('Mute');
		}
		else{
			createCookie('preMute', volume, 7000);
			$("#volume").slider('value',0);
			$('.tipsy-inner').html('Unmute');
		}
	}
}

function popout(){
	if($('#vid').hasClass('jwplayer')){pauseJwplayer("pause");}
	else{$('#vid-embed-container').html("");}
	window.open('/popout', 'newwindow', 'width=640, height=508');
}

function fullPage(mode) {
	if(mode=="on"){
		var controlHeight, embedControlHeight, height, width, embedHeight, embedWidth, embedWidthPadding, windowWidth, windowHeight, windowAspectRatio, aspectRatio;
		var embedHeightRatio, embedWidthRatio, newHeight, newWidth, newContainerHeight, newEmbedHeight, newEmbedWidth, newEmbedMarginLeft;
		var newEmbedMarginTop, newChatHeight, newChatWidth, newChatMarginTop, newVideoOverlayHeight, newControlsTop, newVidMarginLeft;

		/*Settings*/
		controlHeight=28//Universal
		height=480;//Universal
		width=640;//Universal

		if($('#vid').hasClass('connectcast')){
			embedControlHeight=0;//Connectcast
			embedHeight=height;//Connectcast
			embedWidth=853;//Connectcast
			embedWidthPadding=0;//Vaughn
		}
		else if($('#vid').hasClass('jwplayer')){
			embedControlHeight=0;//jwplayer
			embedHeight=height;//jwplayer
			embedWidth=width;//jwplayer
			embedWidthPadding=130;//jwplayer
		}
		else if($('#vid').hasClass('vaughnlive')){
			embedControlHeight=controlHeight;//Vaughn
			embedHeight=560;//Vaughn
			embedWidth=width;//Vaughn
			embedWidthPadding=0;//Vaughn
		}
		else if($('#vid').hasClass('ustream')){
			embedControlHeight=33;//Ustream
			embedHeight=480;//Ustream
			embedWidth=width;//Ustream
			embedWidthPadding=0;//Ustream
		}

		/*Process*/
		aspectRatio = width/height;//Universal
		embedWidthRatio=embedWidth/width;//Universal
		embedHeightRatio = embedHeight/height;//Universal

		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;
		windowAspectRatio = windowWidth / (windowHeight - controlHeight);
		if (windowAspectRatio > 1.3333) {//WIDE
			newHeight = windowHeight - controlHeight;//Universal//W
			newWidth = newHeight * aspectRatio;//Universal//W
			newChatWidth = windowWidth - newWidth;//Universal//W
			newChatHeight = windowHeight;//Universal//W
			newChatMarginTop = 0;//Universal//W
			if (chat == 'off') {
				newContainerMarginLeft = newChatWidth / 2;//Universal//W
			}
			else {
				newContainerMarginLeft = 0;//Universal//W
			}
			newContainerMarginTop = 0;//Universal//W
		}
		else {//TALL
			newHeight = windowWidth * height / width;//Universal//T
			newContainerControlHeight=newHeight+controlHeight;
			newWidth = windowWidth;//Universal//T
			newContainerMarginLeft = 0;//Universal//T
			newChatWidth = windowWidth;//Universal//T
			newChatHeight = windowHeight-newContainerControlHeight;//Universal//T
			newChatMarginTop = newContainerControlHeight;//Universal//T
			if (chat == 'off') {
				newContainerMarginTop = newChatHeight / 2;//Universal//T
			}
			else if (chat == 'on') {
				newContainerMarginTop = 0;//Universal//T
			}
		}
		newContainerHeight = newHeight + embedControlHeight; //Universal//U
		newControlsTop = newHeight;//Universal//U
		newEmbedHeight = newHeight * embedHeightRatio + embedControlHeight;//Universal//U
		newEmbedWidth = embedWidthRatio * newWidth + (2 * embedWidthPadding);//Universal//U
		newEmbedMarginLeft = -1/2 * (newEmbedWidth - newWidth);//Universal//U
		newEmbedMarginTop = newContainerHeight - newEmbedHeight;//Universal//U
		newVideoOverlayHeight = newHeight;//Universal//U

		//////////////////
		var controlsUnderlayWidth=155;//Vaughn/U
		if(!$('#vid').hasClass('vaughnlive')){
			controlsUnderlayWidth=0;//jwplayer//connectcast/U
		}
		if($('#vid').hasClass('ustream')){
			newContainerHeight = newHeight + controlHeight; //Ustream
			newEmbedMarginTop = 0;
		}
		//////////////////
		newControlsWidth = newWidth - controlsUnderlayWidth;//Universal//U
		//css
		$(".slide-out, #nav-contain, #hud, #page-contain, .bgshadow").css("display", "none");
		$("#view-contain, #main-contain, #background").css("width", windowWidth);
		$("#main-contain, #view-contain, #background").css("height", windowHeight);
		$("#vidover, #vidoutline, #vid-embed-container, #jwouter, #vid").css("width", newWidth);
		$("#vidover, #vidoutline").css("height", newVideoOverlayHeight);
		$("#vid-embed-container, #jwouter, #jwinner, #vid").css("height", newContainerHeight);
		$("#jwinner, #vidembed").css("width", newEmbedWidth);
		$("#main-contain").css({
			"background-color": "transparent",
			"left": "0",
			"margin-left": "0",
			"top": "0",
			"overflow": "hidden",
			"z-index": "1000"
		});
		$("#view-contain").css({
			"padding": "0",
			"margin-left": newContainerMarginLeft,
			"margin-top": newContainerMarginTop
		});
		/*$("#jwinner")*/$("#vidembed").css("margin-left", newEmbedMarginLeft);
		$("#vidembed").css("margin-top", newEmbedMarginTop);
		$("#vidembed").css("height", newEmbedHeight);
		$("#chat").css({
			"margin-top": newChatMarginTop,
			"height": newChatHeight,
			"width": newChatWidth
		});
		$("#controls").css({
			"top": newControlsTop,
			"width": newControlsWidth
		});
	}
	else if(mode=="off") {
		$("#view-contain,"+
		"#main-contain,"+
		"#chat,"+
		"#vid-embed-container,"+
		"#vidoutline,"+
		"#vidembed,"+
		"#jwouter,"+
		"#jwinner,"+
		"#vid,"+
		"#vidover,"+
		"#controls,"+
		"#hud,"+
		"#nav-contain,"+
		"#page-contain").attr("style", "");
		$(".slide-out").css("display", "");
		if (chat == 'off') {
			hideChat();
		}
		$("#background").css("margin-top","1px");
		setTimeout(function(){$("#background").attr("style","");},100);
	}
	fullPageMode = mode;
}


function changeChannel(direction) {
	var currentChannel=channelList.indexOf(currentStream.toUpperCase())+1;
	var newChannel;
	if(direction=="left"){newChannel=currentChannel-1;}
	else if(direction=="right"){newChannel=currentChannel+1;}
	if(newChannel>channelList.length){
		newChannel=newChannel-channelList.length;
	}
	else if(newChannel<1){
		newChannel=newChannel+channelList.length;
	}
	streamSelect(channelList[newChannel-1].toLowerCase());
}


$(document).keydown(function (e) {
	if (e.keyCode == 122) {
		setTimeout(function(){fullPage("on");}, 1000);
	}
	else if (e.keyCode == 27) {
		fullPage("off");
	}
	else if (e.keyCode == 32) {
		pauseJwplayer();
	}
	else if (e.keyCode == 38) {
		var volume = $('#volume').slider("option", "value") + 10;
		if(volume>100){volume=100;}
		$("#volume").slider('value',volume);
	}
	else if (e.keyCode == 40) {
		var volume = $('#volume').slider("option", "value") - 10;
		if(volume<0){volume=0;}
		$("#volume").slider('value',volume);
	}
	else if (e.keyCode == 37) {
		changeChannel("left");
	}
	else if (e.keyCode == 39) {
		changeChannel("right");
	}
});

function toggleSwitch() {
	if (fullPageMode == 'off') {fullPage("on");}
	else {fullPage("off");}
}
$(window).resize(function () {
	if (fullPageMode == 'on') {
		fullPage("on");
	}
});

//Dimmer
var dimmerSwitch = "false";
function dimmer() {
	if (dimmerSwitch == 'false') {
		dimmerSwitch = "true";
		$('#background').css('opacity', 1).fadeTo(0, 0.3);
		$('#chat').css('opacity', 0.9).fadeTo(0, 0.35);
		$('#page-contain').css('opacity', 1).fadeTo(0, 0.5);
		$('#hud').css('opacity', 1).fadeTo(0, 0.5);
		if (chat == 'off') {
			$("#chat").css("display", "none");
		}
	}
	else {
		dimmerSwitch = "false";
		$('#background').css('opacity', 0.4).fadeTo(0, 1);
		$('#chat').css('opacity', 0.35).fadeTo(0, 1);
		$('#page-contain').css('opacity', 0.5).fadeTo(0, 1);
		$('#hud').css('opacity', 0.5).fadeTo(0, 1);
		if (chat == 'off') {
			$("#chat").css("display", "none");
		}
	}
}

//Tipsy
$(function() {
	$('#play-button').tipsy({gravity: 's'});
	$('#mute-button').tipsy({gravity: 's'});
	$('#fullpage').tipsy({gravity: 'se'});
	$('#dimmer-button').tipsy({gravity: 's'});
	$('#est-button').tipsy({gravity: 's'});
	$('#pst-button').tipsy({gravity: 's'});
	$('#chat-button').tipsy({gravity: 's'});
	$('#popout-button').tipsy({gravity: 's'});
	$('#radio-button').tipsy({gravity: 's'});
	$('#test-button').tipsy({gravity: 's'});
	$('#refresh-button').tipsy({gravity: 's'});
	$('#hudbutton').tipsy({gravity: 's'});
});

//Theme Script
$(document).ready(function() {
	$(".themeselector a").click(function() {
		$('link[href*="theme"]').attr("href",$(this).attr('rel'));
		return false;
	});
});

var themeList = [
	['Toonami',"./css/theme-1.css"],
	['ToonamiOG',"./css/theme-4.css"],
	['CartoonCartoon',"./css/theme-2.css"],
	['SpecialSamuraiJack',"./css/theme-3.css"],
	['SpecialCartoonTheater',"./css/theme-3.css"],
	['GhostPlanet',"./css/theme-5.css"],
	['MidnightRun',"./css/theme-6.css"],
	['AKOTP',"./css/theme-7.css"],
	['Diablo',"./css/theme-8.css"],
	['TheOcho',"./css/theme-9.css"],
	['Halloween',"./css/theme-10.css"],
	['Thanksgiving',"./css/theme-13.css"],
	['Christmas',"./css/theme-12.css"],
	['Aftermath',"./css/theme-11.css"]
];

//--Theme Loader--//
function loadTheme(selectedTheme) {
	cookie=readCookie('theme');
	urlParam=getParameterByName('theme');
	if(cookie=='Auto' || cookie==''){cookie=null;}
	if(urlParam=='Auto' || urlParam==''){urlParam=null;}
	if(selectedTheme == 'Auto'){theme=blockname;}//Manual Auto
	else if(typeof selectedTheme != 'undefined'){theme=selectedTheme;}//Manual
	else if(cookie != null){theme = cookie;selectedTheme=cookie;}//Cookie
	else if(urlParam != null){theme=urlParam;selectedTheme=urlParam;}//URL Param
	else if(window.location.host=="akotp.com"){theme='AKOTP';selectedTheme='AKOTP';}
	else {theme=blockname;selectedTheme='Auto';}//Auto
	$('button.themeselector').css('color','white');
	$('button.themeselector').css('background-color','rgba(255, 255, 255, 0.2)');
	$('button.themeselector[onclick="loadTheme(\''+selectedTheme+'\')"]').css('color','red');
	$('button.themeselector[onclick="loadTheme(\''+selectedTheme+'\')"]').css('background-color','rgba(255, 255, 255, 0.4)');
	createCookie('theme', selectedTheme, 30);
	var themeIndex='not found';//Find Index of Theme
	for( var i = 0, len = themeList.length; i < len; i++ ) {//Find theme index
		if( themeList[i][0].toUpperCase() === theme.toUpperCase() ) {
			//console.log(themeList[i][0]);
			themeIndex = i;
			break;
		}
	}
	if(themeIndex=='not found'){//If theme index is not found (usually blockname not matching theme name)
		var d = new Date();
		month=d.getMonth()+1;
		date=d.getDate();
		day=d.getDay();
		if(month==10){
			themeIndex = 10;//Halloween
		}
		else if(month==11 && date>=22 && date<=29 && day>=3 && day<=4){
			themeIndex = 11;//Thanksgiving
		}
		else if(month==12 && date>=1 && date<=30){
			themeIndex = 12;//Christmas
		}
		else if(month==12 && date==31){
			themeIndex = 13;//New Years
		}
		else{
			themeIndex = 0;//Default
		}
	};
	currentThemePath=$('link[href*="theme"]').attr("href");
	newThemePath=themeList[themeIndex][1];
	if (currentThemePath != newThemePath) {
		var timer=0;
		//$( document.body ).css('opacity', 1).fadeTo(400, 0);timer=401;
		setTimeout(function() {$('link[href*="theme"]').attr("href",themeList[themeIndex][1]);},timer);
		//setTimeout(function() {$( document.body ).css('opacity', 0).fadeTo(400, 1);},802);
	}
}//End Theme Script

function themeFX(toggle){
	var state=readCookie('themeFX');
	if(toggle==true){
		if(state=='On'){state='Off'}
		else{state='On'}
	}
	var animationState;
	if(state=='On'){
		state='On';
		animationState ='running';
	}
	else {
		state='Off';
		animationState ='paused';
	}
	$('#theme-fx-toggle').html('FX:'+state);
	$('#theme-fx *').css({
		'-webkit-animation-play-state':animationState,
		'animation-play-state':animationState
	});
	createCookie('themeFX', state, 30);
}
$(document).ready(themeFX);

//Load Schedule Data
var schedJson;
$(document).ready(function() {
	$.ajaxSetup({ cache: false });
	$.getJSON("../includes/scheduledata.json", function(json){
		schedJson = json;
		if(typeof curid == 'undefined') {getHudPlayingId(channelSelected,true);}
		findMovies();
	});
});
//--Initiate Functions Using Show Data--//
var curid, curtime, curstream, blockname;
function getHudPlayingId(stream, load, hudNext) {
	curstream=stream;
	if(stream=='est'){currentdir="/includes/eststatus.php";}
	else if(stream=='pst'){currentdir="/includes/pststatus.php";}
	else {currentdir="../includes/current.txt";}
	$.get(currentdir, function( data ) {
		//data='Commercial - 30 - Taco Bell Grilled Steak Nicknames#202#ClassicToon##20';
		current = data.split("#");
		curtime = current[1]*1000;
		curid = current[2];
		curname = current[3];
		//find line of curid
		for (var i=0; i < schedJson.length; i++) {
			if (schedJson[i]['id'] === curid) {
				//skip promo
				if(!schedJson[i]['name']){
					while (!schedJson[i]['name']) {
						i++;
					}
				}
				currentline = i;
				break;
			}
		}
		blockname = schedJson[currentline].block;
		if(load==true){
			loadHud(currentline);
			if($('#schedule-contain').length>0){
				loadSchedule(stream);
			}
		}
		if(curtime<5000) {
			setTimeout(function () {
				getHudPlayingId(stream,load,hudNext);
			}, 5000);
		}
		else{
			if(hudNext==true){hudForward(true);}
			startHudTimer(curtime);
			console.log('Current Data Loaded -- Timeleft:'+curtime+' Name:'+curname);
			clearInterval(ticker);
			startTimer(curtime);
			if(currentStream!="radio"){
				loadTheme();
			}
		}
	});
}

//HUD Script
function hudSelect(timezone) {
	if(typeof curid != 'undefined') {
		getHudPlayingId(timezone,true);findMovies();
	}
}

var hudAnimateTimer;
function startHudTimer(time) {
	if(typeof hudAnimateTimer != 'undefined'){clearInterval(hudAnimateTimer);}
    hudAnimateTimer = setTimeout(function () {
		line = findline('id',curid,schedJson);
		if(schedJson[line].name){
			getHudPlayingId(curstream,false,true);
			console.clear();
			console.log('Show over detected. Animate Triggered.');
		}
		else {
			console.log('Commercial detected. Reloading Variables.');
			getHudPlayingId(curstream,false,false);
		}
	}, time);
}

var currentline;
function findline(objectname, objectvalue, myArray){
	for (var i=0; i < myArray.length; i++) {
        if (myArray[i][objectname] === objectvalue) {
			//currentline = i;
			return i;
        }
    }
}

function loadHud(currentline) {
		currentline--;
		//skip promo
		if(currentline<0){currentline=currentline+(schedJson.length-1)}
		if(!schedJson[currentline]['name']){
			while (!schedJson[currentline]['name']) {
				currentline--;
				if(currentline<0){currentline=currentline+(schedJson.length-1)}
			}
		}
		returnHudPosition();
		var output="";
			line = currentline;
			for (var i=0;i < 5; i++) {
				switch (i) {
					case 0:hudposition="before";break;
					case 1:hudposition="now";break;
					case 2:hudposition="next";break;
					case 3:hudposition="after";break;
					case 4:hudposition="later";break;
				}

				if(line>=(schedJson.length-1)) {
					line=line-(schedJson.length-1);
				}
				//skip promo
				if(!schedJson[line]['name']){
					while (!schedJson[line]['name']) {
						line++;
						if(line>=(schedJson.length-1)){line=line-(schedJson.length-1)}
					}
				}
				//Time
				if(channelSelected=='est'){utcSeconds=schedJson[line].showtime;}
				if(channelSelected=='pst'){utcSeconds=parseInt(schedJson[line].showtime) + 10800;}
				var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
				d.setUTCSeconds(utcSeconds);
				var showTime=d.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
				switch (schedJson[line].id) {
					case hudp0: hudpdisplay="Now";break;
					case hudp1: hudpdisplay="Up Next";break;
					case hudp2: hudpdisplay="Then";break;
					default: hudpdisplay=showTime;break;
				}
				if(schedJson[line].type=='block'){
					output = output + '<div id="hud'+schedJson[line].id+'" class="sinfo '+hudposition+' hud-block-title-card"><span class="hud-position"></span><div class="showinfo">'+schedJson[line].name+'</div><div class="showinfo blocktime">'+schedJson[line].blocktime+'</div><img src="http://i.imgur.com/9tT8JhR.gif" class="hud-background"><img class="hud-codescroll" src="./css/images/ui/text.gif"><img class="hud-showpicbg" src="./css/images/ui/hudbg.png"></div>';
				}
				else {
					output = output + '<div id="hud'+schedJson[line].id+'" class="sinfo '+hudposition+'"><span class="hud-position">'+hudpdisplay+'</span><div class="showinfo">'+schedJson[line].name+'</div><img src="http://i.imgur.com/9tT8JhR.gif" class="hud-background"><img class="hud-codescroll" src="./css/images/ui/text.gif"><img class="hud-showpicbg" src="./css/images/ui/hudbg.png"><img src="'+schedJson[line].image+'" class="hud-showpic"><img class="hud-showpic-overlay" src="./css/images/ui/blank.png"></div>';
				}

				line++;
			}
		$("div#hud-schedule-view").html(output);
}

var hudp0,hudp1,hudp2,hudp3;
function returnHudPosition(){
		line = findline('id',curid,schedJson);
		for (var i=0;i < 4; i++) {
			if(line>=(schedJson.length-1)){line=line-(schedJson.length-1)}
			//skip promo
			if(!schedJson[line]['name']){
				while (!schedJson[line]['name']) {
					line++;
					if(line>=(schedJson.length-1)){line=line-(schedJson.length-1)}
				}
			}
			switch (i) {
				case 0: hudp0=schedJson[line].id;break;
				case 1: hudp1=schedJson[line].id;break;
				case 2: hudp2=schedJson[line].id;break;
				case 3: hudp3=schedJson[line].id;break;
			}
			line++;
		}
}

function hudForward(auto) {
	currentline++;
	//skip promo
	if(currentline>=(schedJson.length-1)){currentline=currentline-(schedJson.length-1)}
	if(!schedJson[currentline]['name']){
		while (!schedJson[currentline]['name']) {
			//console.log(schedJson[currentline]['filename']+' nskipped!');
			currentline++;
			if(currentline>=(schedJson.length-1)){currentline=currentline-(schedJson.length-1)}
		}
	}
		$(".now").delay(0).switchClass("now", "before", 750);
		$(".next").delay(80).switchClass("next", "now", 750);
		$(".after").delay(160).switchClass("after", "next", 750);
		$(".later").delay(240).switchClass("later", "after", 750);
		setTimeout(function () {
			//if(schedJson[currentline].type=='block'){hudForward(auto);}
			//else {
				if(auto==true){hudSelect(curstream);}
				else{loadHud(currentline);}
			//}
		}, 1050);
}

function hudBackward() {
	currentline--;
	//skip promo
	if(currentline<0){currentline=currentline+(schedJson.length-1)}
	if(!schedJson[currentline]['name']){
		while (!schedJson[currentline]['name']) {
		//console.log(schedJson[currentline]['filename']+' pskipped!');
			currentline--;
			if(currentline<0){currentline=currentline+(schedJson.length-1)}
		}
	}
    $(".after").delay(0).switchClass("after", "later", 750);
    $(".next").delay(80).switchClass("next", "after", 750);
	$(".now").delay(160).switchClass("now", "next", 750);
    $(".before").delay(240).switchClass("before", "now", 750);
	setTimeout(function () {loadHud(currentline);}, 1050);
}

//Hud Views
function hudSwitchView() {
	var schedule=$('#hud-schedule-view');
	var upcoming=$('#hud-upcoming-view');
	var ads=$('#hud-ad-view');
	if(schedule.css("display")=="block") {
		switchMovieView();
		schedule.css("opacity", 0);
		$('.hudbutton').css("display","none");
		setTimeout( function(){
			schedule.css("display","none");
			upcoming.css("display","block");
			setTimeout(function(){
				upcoming.css("margin-top", 0);
			},50);
		}, 500);
	}
	else if(upcoming.css("display")=="block"){
		getRandomAd();
		upcoming.css("margin-top", -141);
		setTimeout( function(){
			upcoming.css("display","none");
			ads.css("display","block");
			setTimeout(function(){
				ads.css("margin-top", 0);
			},50);
		}, 500);
	}
	else {
		ads.css("margin-top", -141);
		$('.hudbutton').css("display","block");
		setTimeout( function(){
			ads.css("display","none");
			schedule.css("display","block");
			setTimeout( function(){schedule.css("opacity", 1);},50);
		}, 250);
	}
	function getRandomAd(){
		r = Math.floor((Math.random() * adlist.length));
		if(adlist[r].image.indexOf("kapptur") > -1) {
			$('.hud-ad img:first, .hud-ad .image-overlay').css({
				width: "392px",
				height: "100px"
			});
		}
		else {
			$('.hud-ad img:first, .hud-ad .image-overlay').attr("style","");
		}
		var imagePath="css/images/aditems/"+adlist[r].image;
		$('#hud-ad-view a').attr("href", adlist[r].url);
		$('.hud-ad > img:nth-child(1)').attr("src", imagePath);
		$('.hud-ad-name').html(adlist[r].name);
		$('.hud-ad-tagline').html(adlist[r].tagline);
		if(adlist[r].url.indexOf("amazon.com") > -1) {
			$('#amazon-logo').css("display","block");
		}
		else {
			$('#amazon-logo').css("display","none");
		}
	}
}

var movieList= [];
var nextweekdata;
$.getJSON("../includes/nextweekdata.json", function(json){
	nextweekdata = json;
});
function findMovies() {
	for(var i=0;i<schedJson.length;i++){
		if(schedJson[i].type=="Movie"){
			//time
				if(channelSelected=='est'){utcSeconds=schedJson[i].showtime;}
				else if(channelSelected=='pst'){utcSeconds=parseInt(schedJson[i].showtime) + 10800;}
				else {utcSeconds=schedJson[i].showtime;}
				var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
				d.setUTCSeconds(utcSeconds);
				var time=d.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
				var day=d.toLocaleTimeString(navigator.language, {weekday: 'long'});
				day = day.split(" ");
				day = day[0];
				var when="This "+day+" at "+time
			movieList.push({ "name": schedJson[i].name, "image": schedJson[i].image, "when": when });
		}
	}
	//Next Monday
	var d = new Date();
	var day = d.getDay();
	if(day!=1){
		movieList[0].name=nextweekdata[0].name;
		movieList[0].image=nextweekdata[0].image;
		movieList[0].when=movieList[0].when.replace("This", "Next");
	}
	movieIndex=0;
	switchMovieView();
}

//Hud Movie View
var movieIndex=0;
function switchMovieView() {
	$('.upcoming-feature > img').attr("src", movieList[movieIndex].image);
	$('.feature-name').html(movieList[movieIndex].name);
	$('.feature-when').html(movieList[movieIndex].when);
	movieIndex++;
	if(movieIndex>=movieList.length){
		movieIndex=0;
	}
}

//Hud Hover
function hudHoverDelay(){
	if($('#hud').is(":hover")){
		clearInterval(hudTimer);
		$('#hud').mouseleave(function() {
			hudTimer = setInterval(hudHoverDelay,20000);
			hudSwitchView();
			$(this).unbind("mouseleave");
		});
	}
	else {
		hudSwitchView();
	}
}
var hudTimer = setInterval(hudHoverDelay,15000);
//hudSwitchView();
//setTimeout(hudSwitchView,2000);
//setTimeout(hudSwitchView,3000);

//Hud Ads
var adlist;
$.getJSON("../includes/adlist.json", function(json){
	adlist = json;
});

//End Hud Script

//Schedule
function loadSchedule(stream) {
	var activeDay=schedJson[currentline].day.toLowerCase();
	$(function() {
		$( "#daytabs" ).tabs({ active:activeDay });
	});
	var scheduleOutput={};
	var tooltipOutput="";
	line = 0;
	var color;
	if(stream=='est'){
		color='rgb(255, 0, 65)';
		$('#schedule-est-button').css("color", color);
		$('#schedule-pst-button').css("color", "white");
	}
	else if(stream=='pst'){
		color='rgb(0, 100, 255)';
		$('#schedule-pst-button').css("color", color);
		$('#schedule-est-button').css("color", "white");
	}
	for (var i=0;line < schedJson.length-1; i++) {
		//skip promo
		if(!schedJson[line]['name']){
			while (!schedJson[line]['name']) {
				line++;
			}
		}
		if(stream=='est'){utcSeconds=schedJson[line].showtime;}
		if(stream=='pst'){utcSeconds=parseInt(schedJson[line].showtime) + 10800;}
		var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
		d.setUTCSeconds(utcSeconds);
		d=d.toLocaleTimeString(navigator.language, {weekday: 'short', hour: '2-digit', minute:'2-digit'});
		var mouseover="";
		var rerunText="";
		if(schedJson[line].rerun){rerunText=" <span class=\"rerun-text\">(Rerun)</span>";}
		if(schedJson[line].image){
			mouseover=' onmouseover="tooltip.pop(this, \'#tt'+
				schedJson[line].id + '\', {position:1, offsetX:-10, offsetY:0, effect:\'none\'});revealImage(' +
				schedJson[line].id +');"'
			tooltipOutput += '<div id="tt' +
				schedJson[line].id + '" class="tooltipinner">'+'<img data-src="' +
				schedJson[line].image + '"><span class="ttinfovar">Block:</span> ' +
				schedJson[line].blockname + '<br><span class="ttinfovar">Name:</span> '+
				schedJson[line].name+'<br><span class="ttinfovar">Episode Number:</span> '+
				schedJson[line].episode+'<br><span class="ttinfovar">Episode Name:</span> '+
				schedJson[line].episodename+'<br><span class="ttinfovar">Description:</span> '+
				schedJson[line].description+'</div>';
		}

		var scheduleLine;
		if(schedJson[line].type!='block'){
			scheduleLine='<tr id="s'+
				schedJson[line].id+'" class="'+
				schedJson[line].block+'"><td>'+
				d+'</td><td><span>'+
				schedJson[line].name+
				rerunText+
				'</span><img class="infoicon" src="./css/images/ui/info.png" '+
				mouseover+'></td><td>'+
				schedJson[line].episodename+'</td></tr>';
		}
		else{
			scheduleLine='<tr class="schedule-block-header"><td colspan="3">'+schedJson[line].name+'</td></tr>';
		}

		scheduleOutput[schedJson[line].day] += scheduleLine;
		line++;
	}
	$("#schedule-monday").html(scheduleOutput['Monday']);
	$("#schedule-tuesday").html(scheduleOutput['Tuesday']);
	$("#schedule-wednesday").html(scheduleOutput['Wednesday']);
	$("#schedule-thursday").html(scheduleOutput['Thursday']);
	$("#schedule-friday").html(scheduleOutput['Friday']);
	$("#schedule-saturday").html(scheduleOutput['Saturday']);
	$("#schedule-sunday").html(scheduleOutput['Sunday']);
	$("#tooltips").html(tooltipOutput);
	idselector='#s'+schedJson[currentline].id;
	$(idselector).css("background-color", 'black');
	$(idselector).css("color", 'white');
	$(idselector+' :nth-child(2)').append(' <a href="/" class="airingnow" style="color:'+color+'">(Airing Now)</a>');
	$(idselector).children(":first").css("border-left", "1px solid "+color);
	$("#schedule-contain .schedule-tab").scrollTop(0);
	setTimeout(function(){$("#schedule-contain .schedule-tab").scrollTop($(idselector).offset().top-534);},0);
	$('li.'+activeDay+' a')[0].click();
}

function revealImage(id) {
	$('#tt'+id+' img').reveal();
}
(function($){
		$.fn.reveal = function(){
				var args = Array.prototype.slice.call(arguments);
				return this.each(function(){
						var img = $(this),
								src = img.data("src");
						src && img.attr("src", src).load(function(){
								img[args[0]||"show"].apply(img, args.splice(1));
						});
				});
		}
}(jQuery));


//Corner Stream Timer
var timeInSecs, ticker, timerdisplay;
function startTimer(secs){
	timeInSecs = (parseInt(secs, 10)/1000)-1;
	ticker = setInterval(tick,1000);   // every second
}
function tick() {
	var secs = timeInSecs;
	var mins = timeInSecs / 60;
	mins =  Math.floor(mins);
	if (secs>0) {
		timeInSecs--;
		timerdisplay = mins + "m " + (secs % 60) + "s";
	}
	else {
		timerdisplay = "";
		clearInterval(ticker);
	}
	document.getElementById("countdown").innerHTML = timerdisplay;
}

//Experimental
function flickerstream() {
    // Set button's background to a random color
  function streamfade() {$("#vid-embed-container").animate({opacity: 1}, 15);}
  $("#vid-embed-container").animate({opacity: 0.96}, 15, streamfade );
}

function tvmode(mode) {
	if(mode=="on") {
	window.hoverInterval = setInterval(flickerstream, 31);
	}
	else {
	window.clearInterval(hoverInterval);
	}
}



//Share
$(document).ready(function() {
if($('#vid-embed-container').length){
	$(function(){
        $('.share-slide-out').tabSlideOut({
            tabHandle: '.handle',
			pathToTabImage: 'images/ui/share.png',
            imageHeight: '92px',
            imageWidth: '30px',
            tabLocation: 'left',
            speed: 0,
            action: 'hover',
            topPos: '381px',
            leftPos: '20px',
            fixedPosition: true
        });
        $('.theme-slide-out').tabSlideOut({
            tabHandle: '.handle',
            pathToTabImage: 'images/ui/share.png',
            imageHeight: '92px',
            imageWidth: '30px',
            tabLocation: 'left',
            speed: 0,
            action: 'hover',
            topPos: '281px',
            leftPos: '20px',
            fixedPosition: true
        });

    });
!function(t){t.fn.tabSlideOut=function(o){var a=t.extend({tabHandle:".handle",speed:200,action:"hover",tabLocation:"left",topPos:"200px",leftPos:"20px",fixedPosition:!0,positioning:"fixed",pathToTabImage:null,imageHeight:null,imageWidth:null,onLoadSlideOut:!1},o||{});a.tabHandle=t(a.tabHandle);var e=this;a.positioning=a.fixedPosition===!0?"fixed":"absolute",!document.all||window.opera||window.XMLHttpRequest||(a.positioning="absolute"),null!=a.pathToTabImage&&a.tabHandle.css({width:a.imageWidth,height:a.imageHeight}),a.tabHandle.css({display:"block",outline:"none",position:"absolute"}),e.css({"line-height":"1",position:a.positioning});var n={containerWidth:parseInt(e.outerWidth(),10)+"px",containerHeight:parseInt(e.outerHeight(),10)+"px",tabWidth:parseInt(a.tabHandle.outerWidth(),10)+"px",tabHeight:parseInt(a.tabHandle.outerHeight(),10)+"px"};("top"===a.tabLocation||"bottom"===a.tabLocation)&&(e.css({left:a.leftPos}),a.tabHandle.css({right:0})),"top"===a.tabLocation&&(e.css({top:"-"+n.containerHeight}),a.tabHandle.css({bottom:"-"+n.tabHeight})),"bottom"===a.tabLocation&&(e.css({bottom:"-"+n.containerHeight,position:"fixed"}),a.tabHandle.css({top:"-"+n.tabHeight})),("left"===a.tabLocation||"right"===a.tabLocation)&&(e.css({top:a.topPos}),a.tabHandle.css({top:0})),"left"===a.tabLocation&&(e.css({left:"-"+n.containerWidth}),a.tabHandle.css({right:"-"+n.tabWidth})),"right"===a.tabLocation&&(e.css({right:"-"+n.containerWidth}),a.tabHandle.css({left:"-"+n.tabWidth}),t("html").css("overflow-x","hidden")),a.tabHandle.click(function(t){t.preventDefault()});var i=function(){"top"===a.tabLocation?e.animate({top:"-"+n.containerHeight},a.speed).removeClass("open"):"left"===a.tabLocation?e.animate({left:"-"+n.containerWidth},a.speed).removeClass("open"):"right"===a.tabLocation?e.animate({right:"-"+n.containerWidth},a.speed).removeClass("open"):"bottom"===a.tabLocation&&e.animate({bottom:"-"+n.containerHeight},a.speed).removeClass("open")},s=function(){"top"==a.tabLocation?e.animate({top:"-3px"},a.speed).addClass("open"):"left"==a.tabLocation?e.animate({left:"-3px"},a.speed).addClass("open"):"right"==a.tabLocation?e.animate({right:"-3px"},a.speed).addClass("open"):"bottom"==a.tabLocation&&e.animate({bottom:"-3px"},a.speed).addClass("open")},c=function(){e.click(function(t){t.stopPropagation()}),t(document).click(function(){i()})},l=function(){a.tabHandle.click(function(){e.hasClass("open")?i():s()}),c()},d=function(){e.hover(function(){s()},function(){i()}),a.tabHandle.click(function(){e.hasClass("open")&&i()}),c()},p=function(){i(),setTimeout(s,4e3),setTimeout(i,12e3)};"click"===a.action&&l(),"hover"===a.action&&d(),a.onLoadSlideOut&&p()}}(jQuery);
}
});


	//Tooltip For Schedule
	var tooltipOptions=
	{
		showDelay: 30,
		hideDelay: 300,
		effect: "fade",
		duration: 200,
		relativeTo: "element",
		position: 2,
		smartPosition: true,
		offsetX: 0,
		offsetY: 0,
		maxWidth: 384,
		calloutSize: 5,
		calloutPosition: 0.5,
		sticky: false,
		overlay: false,
		license: "64628"
	};
	/* JavaScript Tooltip v2014.6.20. Copyright www.menucool.com */
	var tooltip=function(z){var i="length",Gb="addEventListener",U,gc,Nb=function(){},sb=function(a,c,b){if(a[Gb])a[Gb](c,b,false);else a.attachEvent&&a.attachEvent("on"+c,b)},c={},O=function(a){if(a&&a.stopPropagation)a.stopPropagation();else if(a&&typeof a.cancelBubble!="undefined")a.cancelBubble=true},fc=function(b){var a=b?b:window.event;if(a.preventDefault)a.preventDefault();else if(a)a.returnValue=false},Yb=function(d){var a=d.childNodes,c=[];if(a)for(var b=0,e=a[i];b<e;b++)a[b].nodeType==1&&c.push(a[b]);return c},bb={a:0,b:0},g=null,cc=function(a){if(!a)a=window.event;bb.a=a.clientX;bb.b=a.clientY},ac=function(b){if(window.getComputedStyle)var c=window.getComputedStyle(b,null);else if(b.currentStyle)c=b.currentStyle;else c=b[a];return c},A="offsetLeft",D="offsetTop",rb="clientWidth",qb="clientHeight",y="appendChild",Y="display",r="border",I="opacity",T=0,N="createElement",ob="getElementsByTagName",E="parentNode",W="calloutSize",Q="position",Hb="calloutPosition",m=Math.round,lb="overlay",F="sticky",V="hideDelay",fb="onmouseout",kb="onclick",Kb=function(){this.a=[];this.b=null},H="firstChild",xb=0,x=document,L="getElementById",Z=navigator,P="innerHTML",l=function(a,b){return b?x[a](b):x[a]},Ib=function(){var c=50,b=Z.userAgent,a;if((a=b.indexOf("MSIE "))!=-1)c=parseInt(b.substring(a+5,b.indexOf(".",a)));return c},wb=Ib()<9,Ab=!!Z.msMaxTouchPoints,db=!!("ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch),Lb=(Z.msPointerEnabled||Z.pointerEnabled)&&Ab;if(Lb)var Vb=Z.msPointerEnabled?"onmspointerout":"onpointerOut";var Qb=function(a){return a.pointerType==a.MSPOINTER_TYPE_MOUSE||a.pointerType=="mouse"},C="marginTop",ib="marginLeft",u="offsetWidth",t="offsetHeight",vb="documentElement",X="borderColor",tb="nextSibling",a="style",p="visibility",J="width",w="left",q="top",S="height",ec=["$1$2$3","$1$2$3","$1$24","$1$23","$1$22"],v,pb,B=function(c,a,b){return setTimeout(c,a?a.showDelay:b)},eb=function(a){clearTimeout(a);return null};Kb.prototype={d:{b:Nb,c:function(a){return-Math.cos(a*Math.PI)/2+.5}},e:function(i,d,h,f){for(var a=[],g=h-d,c=Math.ceil((k.duration||9)/15),e,b=1;b<=c;b++){e=d+f.c(b/c)*g;a.push(e)}a.d=0;return a},f:function(){this.b==null&&this.g()},g:function(){this.h();var a=this;this.b=setInterval(function(){a.h()},15)},h:function(){var a=this.a[i];if(a){for(var c=0;c<a;c++)this.i(this.a[c]);while(a--){var b=this.a[a];if(b.c.d==b.c[i]){b.d();this.a.splice(a,1)}}}else{clearInterval(this.b);this.b=null}},i:function(b){if(b.c.d<b.c[i]){var d=b.b,c=b.c[b.c.d];if(b.b==I){b.a.op=c;if(wb){d="filter";c="alpha(opacity="+m(c*100)+")"}}else c+="px";b.a[a][d]=c;b.c.d++}},j:function(e,b,d,f,a){a=this.k(this.d,a);var c=this.e(b,d,f,a);this.a.push({a:e,b:b,c:c,d:a.b});this.f()},k:function(c,b){b=b||{};var a,d={};for(a in c)d[a]=b[a]!==undefined?b[a]:c[a];return d}};var jb=new Kb,h=function(d,b,c,e,a){jb.j(d,b,c,e,a)},dc=[/(?:.*\.)?(\w)([\w\-])[^.]*(\w)\.[^.]+$/,/.*([\w\-])\.(\w)(\w)\.[^.]+$/,/^(?:.*\.)?(\w)(\w)\.[^.]+$/,/.*([\w\-])([\w\-])\.com\.[^.]+$/,/^(\w)[^.]*(\w)$/],mb=function(d,a){var c=[];if(xb)return xb;for(var b=0;b<d[i];b++)c[c[i]]=String.fromCharCode(d.charCodeAt(b)-(a&&a>7?a:3));return c.join("")},Ob=function(a){return a.replace(/(?:.*\.)?(\w)([\w\-])?[^.]*(\w)\.[^.]*$/,"$1$3$2")},Sb=function(e,c){var d=function(a){for(var c=a.substr(0,a[i]-1),e=a.substr(a[i]-1,1),d="",b=0;b<c[i];b++)d+=c.charCodeAt(b)-e;return unescape(d)},a=Ob(x.domain)+Math.random(),b=d(a);pb="%66%75%6E%63%74%69%6F%6E%20%71%51%28%73%2C%6B%29%7B%76%61%72%20%72%3D%27%27%3B%66%6F%72%28%76%61%72%20%69%";if(b[i]==39)try{a=(new Function("$","_",mb(pb))).apply(this,[b,c]);pb=a}catch(f){}},bc=function(c,a){var b=function(b){var a=b.charCodeAt(0).toString();return a.substring(a[i]-1)};return c+b(a[parseInt(mb("4"))])+a[2]+b(a[0])},d,b,e,ab,f,j,k,R=null,G=null,gb=function(){if(R!=null)R=eb(R)},s=function(){if(G!=null)G=eb(G)},hb=function(b,c){if(b){b.op=c;if(wb)b[a].filter="alpha(opacity="+c*100+")";else b[a][I]=c}},Pb=function(a,c,b,d,g,e,h,f){xf=b>=a;yf=d>=c;var k=xf?b-a<g:a-b<h,l=yf?d-c<e:c-d<f,i=k?b-a:xf?g:-h,j=l?d-c:yf?e:-f;if(k&&l)if(Math.abs(i)>Math.abs(j))i=xf?g:-h;else j=yf?e:-f;return[i,j]},Zb=function(m,g,k){cb(b,1);var c=l(N,"div");c[a][J]=m+"px";e=l(N,"div");hb(e,0);e.className="mcTooltipInner";if(k==1){e[P]=g;var f=1}else{var d=l(L,g);if(d[E].sw)e=d[E];else{e.sw=d[E];e[y](d);f=1}}if(wb){var h=e[ob]("select"),j=h[i];while(j--)h[j][fb]=O}c[y](e);b[y](c);e[a][J]=e[u]+(f?1:0)+"px";e[a][S]=e[t]+(f?1:0)+"px";e[a][w]=e[a][q]="auto";e=b.insertBefore(e,b[H]);e[a][Q]="absolute";c=b.removeChild(c);c=null;delete c;return e},Rb=function(a){if(a.sw){a.sw[y](a);hb(a,1)}else{a=a[E].removeChild(a);a=null;delete a}},cb=function(b,c){for(var a=c;a<b.childNodes[i];a++)Rb(b.childNodes[a])},Ub=function(){d.cO=T=0;d[a][p]=f[a][p]=ab[a][p]="hidden";d[a][Y]="none";if(g.Q)g.Q[a][Y]="none";cb(b,0)},n=null,Xb={a:function(d,b,a){var e=null,f=null,h=null,c="html";if(a){f=a.success||null;c=a.responseType||"html";e=a.context&&f?a.context:null;h=a.fail||null}n=this.b();n.onreadystatechange=function(){if(n&&n.readyState===4){s();if(n.status===200){if(k==d&&R){s();var j=c.toLowerCase()=="xml"?n.responseXML:n.responseText,l=j;if(c.toLowerCase()=="json")l=eval("("+j+")");if(c=="html"){var p=b.match(/.+#([^?]+)/);if(p){var r=function(e,b){var d=null;if(b.id==e)return b;for(var c=b[ob]("*"),a=0,f=c[i];a<f;a++)if(c[a].id==e){d=c[a];break}return d},o=x[N]("div");o[P]=j;var m=r(p[1],o);if(m)j=l=m[P];o=null}if(!m){var q=j.split(/<\/?body[^>]*>/i);if(q[i]>1)j=l=q[1]}}if(f)j=a.success(l,e);g.f(d,j,1)}}else if(h)g.f(d,h(e),1);else g.f(d,"Failed to get data.",1);n=null}};if(b.indexOf("#")!=-1&&Ib()<19)b=b.replace("#","?#");n.open("GET",b,true);n.send(null)},b:function(){var a;try{if(window.XMLHttpRequest)a=new XMLHttpRequest;else a=new ActiveXObject("Microsoft.XMLHTTP")}catch(b){throw new Error("AJAX not supported.");}return a}},Mb=function(){d=l(N,"div");d.id="mcTooltipWrapper";d[P]='<div id="mcTooltip"><div>&nbsp;</div></div><div id="mcttCo"><em></em><b></b></div><div id="mcttCloseButton"></div>';v=x.body;j=v;j[y](d);b=d[H];d.cW=d.cH=d.cO=0;this.a(z);Sb(d,c.a);ab=d.lastChild;f=b[tb];this.c(z[Q],z[W]);var a=this.k();U=function(b){s();a.i();O(b)};ab[kb]=U;this.l();this.Q[kb]=function(a){if(k[lb]!==1)U(a);else O(a)};b[fb]=function(){R!=1&&gb();!k[F]&&a.h(k[V])};b[kb]=O;if(db)b[kb]=function(a){k[F]!==1&&U(a)};sb(x,"click",function(a){if(k&&k[F]!==1)G=B(function(){U(a)},0,k[V]+100)});hb(d,0)},Db=function(a){return a[E]?a[E].nodeName.toLowerCase()!="form"?Db(a[E]):a[E]:v},o=function(c,b){var a=c.getBoundingClientRect();return b?a[q]:a[w]},K=function(b){return b?x[vb][qb]:x[vb][rb]},Wb=function(){var a=x[vb];return[window.pageXOffset||a.scrollLeft,window.pageYOffset||a.scrollTop]},Tb=function(h,g,c,d){var f=K(0),e=K(1),a=0,b=0;if(j!=v){a=o(j,0)-j[A];b=o(j,1)-j[D]}if(c+a+h>f)c=f-h-a;if(c+a<0)c=-a;if(d+b+g>e)d=e-g-b;if(d+b<0)d=-b;return{l:c,t:d}};Mb.prototype={j:function(n,i){var l=i*2+"px",m=c.b+i+"px",h=c.b+"px",j,k,e;j=k=e="";var g=f[H],d=f.lastChild;b[a][X]=g[a][X]=c.d;b[a].backgroundColor=d[a][X]=c.c;switch(n){case 0:case 2:j="Left";k="Right";f[a][J]=l;f[a][S]=m;d[a][ib]=d[a].marginRight="auto";break;case 3:default:j="Top";k="Bottom";f[a][J]=m;f[a][S]=l}switch(n){case 0:e="Top";f[a][C]="-"+h;g[a][C]=h;d[a][C]="-"+m;break;case 2:e="Bottom";f[a][C]=h;g[a][C]="-"+h;d[a][C]=-(i-c.b)+"px";break;case 3:e="Left";f[a][ib]="-"+h;g[a][ib]=h;d[a][C]="-"+l;break;default:e="Right";f[a].marginRight="-"+h;d[a][C]="-"+l;d[a][ib]=h}g[a][r+j]=g[a][r+k]=d[a][r+j]=d[a][r+k]="dashed "+i+"px transparent";g[a][r+e+"Style"]=d[a][r+e+"Style"]="solid";g[a][r+e+"Width"]=d[a][r+e+"Width"]=i+"px"},c:function(e,b){c.e=e;c.f=b;d[a].padding=c.f+"px";this.j(c.e,c.f)},d:function(a,c,b){gb();s();G=B(function(){(T!=1||a!=d.cO)&&g.f(a,c,b)},a)},e:function(a,c,b){gb();s();G=B(function(){g.g(a,c,b)},a)},a:function(g){var d=1,f="#FBF5E6",e="#CFB57C",a=ac(b);d=parseInt(a.borderLeftWidth);f=a.backgroundColor;e=a.borderLeftColor;c={a:g.license||"4321",b:d,c:f,d:e,l:b[rb]-b[H][u],m:b[qb]-b[H][t]}},f:function(i,z,y){T=1;s();jb.a=[];if(this.Q)this.Q[a][Y]=i[lb]?"block":"none";ab[a][p]=i[F]?"visible":"hidden";if(db)ab[a][p]="visible";var g=this.n(i,z,y);if(d.cO){h(d,w,d[A],g.l);h(d,q,d[D],g.t);h(b,J,b.cW,b.tw);h(b,S,b.cH,b.th);h(f,w,f[A],g.x);h(f,q,f[D],g.y)}else if(c.e==4){var B=o(i,0),C=o(i,1);h(d,w,B,g.l);h(d,q,C,g.t);h(b,J,i[u],b.tw);h(b,S,i[t],b.th)}else{if(c.e>4)h(d,q,g.t+6,g.t);else d[a][q]=g.t+"px";d[a][w]=g.l+"px";b[a][J]=b.tw+"px";b[a][S]=b.th+"px";f[a][w]=g.x+"px";f[a][q]=g.y+"px"}if(i.effect=="slide"){var j,k;if(!d.cO&&c.e<4){switch(c.e){case 0:j=0;k=1;break;case 1:j=-1;k=0;break;case 2:j=0;k=-1;break;case 3:j=1;k=0}var m=[j*e[u],k*e[t]]}else{if(!d.cO&&c.e>3){j=i[A];k=i[D]}else{j=d[A];k=d[D];if(c.e>3){j+=d.cO[A]-i[A];k+=d.cO[D]-i[D]}}var v=c.l+c.b+c.b,x=c.m+c.b+c.b;m=Pb(j,k,g.l,g.t,b.cW+v,b.cH+x,b.tw+v,b.th+x)}var n=c.l/2,r=c.m/2;h(e,w,m[0]+n,n);h(e,q,m[1]+r,r);var l=e[tb];if(l){h(l,w,n,-m[0]+n,{b:function(){cb(b,1)}});h(l,q,r,-m[1]+r)}hb(e,1)}else{h(e,I,e.op-.1,1,{b:function(){cb(b,1)}});var l=e[tb];l&&h(l,I,l.op,0)}h(d,I,d.op,1);d.cO=i},g:function(a,c,b){n=null;G=B(function(){g.f(a,'<div id="tooltipAjaxSpin">&nbsp;</div>',1)},a);R=1;Xb.a(a,c,b)},h:function(a){s();G=B(function(){g.i()},0,a)},i:function(){T=-1;gb();jb.a=[];h(d,I,d.op,0,{b:Ub})},l:function(){if(l(L,"mcOverlay")==null){this.Q=l(N,"div");this.Q.id="mcOverlay";v[y](this.Q);this.Q[a][Q]="fixed"}},m:function(g,e){if(g!=c.e||e!=c.f){var b=f[H],d=f.lastChild;b[a].margin=d[a].margin=f[a].margin=b[a][r]=d[a][r]="0";b[a][X]=c.d;d[a][X]=c.c;this.c(g,e)}},k:function(){return(new Function("a","b","c","d","e","f","g","h","i",function(e){var c=[];b.onmouseover=function(a){if(!k[F]){s();if(T==-1){jb.a=[];h(d,I,d.op,1)}}O(a)};for(var a=0,f=e[i];a<f;a++)c[c[i]]=String.fromCharCode(e.charCodeAt(a)-4);return c.join("")}("zev$pAi,k,g,+kvthpu+0405--\u0080\u0080+6+-?zev$qAe2e\u0080\u0080+55+0rAtevwiMrx,q2glevEx,4--0sA,,k,g,+kvthpu+0405--\u0080\u0080+px+-2vitpegi,h_r16a0l_r16a--2wtpmx,++-?mj,e2e%Aj,r/+8+0s--qAQexl_g,+yhukvt+-a,-?mj,q@259-wixXmqisyx,jyrgxmsr,-m,40g,+Ch'oylmD.o{{wA66~~~5tlu|jvvs5jvt6.E[vvs{pw'W|yjohzl'YltpuklyC6hE+-0tswmxmsr>:\u0081-?\u008106444-?\u0081\u0081vixyvr$xlmw?"))).apply(this,[c,H,mb,dc,Ob,bc,l,ec,nb])},n:function(h,B,s){d[a][Y]="block";var o=v;if(s==2){var C=l(L,B),A=C[ob]("input"),D=A[i];while(D--)if(A[D].type=="submit")o=Db(C)}if(j!=o){j=o;j[y](d)}b.cW=b[rb]-c.l;b.cH=b[qb]-c.m;e=Zb(h.maxWidth,B,s);b.tw=e[u];b.th=e[t];var r=b.tw+c.l+c.b+c.b,q=b.th+c.m+c.b+c.b,m=this.p(h,r,q);if(h.smartPosition)var g=Tb(r+c.f,q+c.f,m.x,m.y);else g={l:m.x,t:m.y};var k=h[Q],n=this.u(k,h[Hb],r,q);if(h.smartPosition&&k<4){var x=g.l-m.x,z=g.t-m.y;if(k==0||k==2)n[0]-=x;else if(x)f[a][p]="hidden";if(k==1||k==3)n[1]-=z;else if(z)f[a][p]="hidden"}this.m(k,h[W]);if(j==v){var w=Wb();g.l=g.l+w[0];g.t=g.t+w[1]}g.x=n[0];g.y=n[1];d[a][p]="visible";return g},p:function(a,x,w){var b,d,g,f,q=a[Q],n=a[Hb];if(q<4)if(a.nodeType!=1)b=d=g=f=0;else if(a.relativeTo=="mouse"){b=bb.a;d=bb.b;if(bb.a==null){b=o(a,0)+m(a[u]/2);d=o(a,1)+m(a[t]/2)}g=0;f=0}else{var h=a,e=Yb(a);if(e[i]){e=e[0];if(e[u]>=a[u]||e[t]>=a[t])h=e}b=o(h,0);d=o(h,1);g=h[u];f=h[t]}var p=20,l=x+2*a[W],k=w+2*a[W];switch(q){case 0:b+=m(g/2-l*n);d-=k+p;break;case 2:b+=m(g/2-l*n);d+=f+p;break;case 3:b-=l+p;d+=m(f/2-k*n);break;case 4:b=m((K(0)-l)/2);d=m((K(1)-k)/2);break;case 5:b=d=0;break;case 6:b=K(0)-l-Math.ceil(c.l/2);d=K(1)-k-Math.ceil(c.m/2);break;case 1:default:b+=g+p;d+=m(f/2-k*n)}var r=0,s=0;if(j!=v){r=j[A]-o(j,0);s=j[D]-o(j,1)}return{x:b+r+a.offsetX,y:d+s+a.offsetY}},u:function(h,d,g,e){if(h<4)f[a][p]="visible";var b;switch(h){case 0:b=[g*d,m(e+c.f)];break;case 1:b=[0,e*d];break;case 2:b=[g*d,0];break;case 3:b=[m(g+c.f),e*d];break;default:b=[0,0];f[a][p]="hidden"}return b}};var Eb=function(){if(g==null){if(typeof console!=="undefined"&&typeof console.log==="function"){var a=console.log;console.log=function(){a.call(this,++xb,arguments)}}g=new Mb;if(a)console.log=a}if(k&&k.id=="mcttDummy"&&d[P].indexOf(mb("kdvh#Uh"))!=-1)g.i=Nb;return g},yb=function(d,c,b){b=b||{};var a;for(a in c)d[a]=b[a]!==undefined?b[a]:c[a]},ub=0,M,Jb=function(b)
	{if(1==2){b=l(L,"mcttDummy");
	if(1==1){alert("mcttDummy");b=l(N,"div");b.id="mcttDummy";b[a][Y]="none";v[y](b)}
	}if(typeof b==="string")b=l(L,b);k=b;
	return b
	},zb=function(b,a){return db&&b.target==a?0:1},Bb=function(a,b){yb(a,z,b);if(Ab||db){a.showDelay=1;a[V]=30}if(a[lb])if(!a[F])a[F]=a[lb];sb(a,"click",O);if(a[F])a[fb]=function(a){zb(a,this)&&s()};else if(Lb)a[Vb]=function(a){Qb(a)&&g.h(this[V])};else a[fb]=function(a){zb(a,this)&&g.h(this[V])};if(a.relativeTo=="mouse")a.onmousemove=cc;a.set=1},nb=function(a,c,f){a=Jb(a);var b=0;if(c.charAt(0)=="#"){if(c[i]>2&&c.charAt(1)=="#")b=2;else b=1;var d=c.substring(b),e=l(L,d);if(e){if(b==2)c=e[P]}else b=-1}if(!a||!g||b==-1){if(++ub<40)M=B(function(){nb(a,c,f)},0,90)}else{M=eb(M);!a.set&&Bb(a,f);if(b==1)g.d(a,d,2);else g.d(a,c,1)}},Cb=function(a,d,b,c){a=Jb(a);if(!a||!g){if(++ub<40)M=B(function(){Cb(a,d,b,c)},0,90)}else{M=eb(M);!a.set&&Bb(a,c);g.e(a,d,b)}};sb(window,"load",Eb);var Fb=function(a){if(++ub<20)if(!g)B(function(){Fb(a)},0,90);else{yb(z,z,a);g.m(z[Q],z[W])}};return{changeOptions:function(options){Fb(options)},pop:function(elm,text,options){nb(elm,text,options)},ajax:function(elm,url,ajaxSettings,options){Cb(elm,url,ajaxSettings,options)},hide:function(){var a=Eb();a.i()}}}(tooltipOptions)

// Tipsy
!function(t){function e(t,e){return"function"==typeof t?t.call(e):t}function i(e,i){this.$element=t(e),this.options=i,this.enabled=!0,this.fixTitle()}i.prototype={show:function(){var i=this.getTitle();if(i&&this.enabled){var s=this.tip();s.find(".tipsy-inner")[this.options.html?"html":"text"](i),s[0].className="tipsy",s.remove().css({top:0,left:0,visibility:"hidden",display:"block"}).prependTo(document.body);var n,o=t.extend({},this.$element.offset(),{width:this.$element[0].offsetWidth,height:this.$element[0].offsetHeight}),l=s[0].offsetWidth,a=s[0].offsetHeight,f=e(this.options.gravity,this.$element[0]);switch(f.charAt(0)){case"n":n={top:o.top+o.height+this.options.offset,left:o.left+o.width/2-l/2};break;case"s":n={top:o.top-a-this.options.offset,left:o.left+o.width/2-l/2};break;case"e":n={top:o.top+o.height/2-a/2,left:o.left-l-this.options.offset};break;case"w":n={top:o.top+o.height/2-a/2,left:o.left+o.width+this.options.offset};break;case"z":n={top:o.top+o.height/2-a/2,left:o.left+o.width/2-l/2}}2==f.length&&(n.left="w"==f.charAt(1)?o.left+o.width/2-15:o.left+o.width/2-l+15),s.css(n).addClass("tipsy-"+f),s.find(".tipsy-arrow")[0].className="tipsy-arrow tipsy-arrow-"+f.charAt(0),this.options.className&&s.addClass(e(this.options.className,this.$element[0])),this.options.fade?s.stop().css({opacity:0,display:"block",visibility:"visible"}).animate({opacity:this.options.opacity}):s.css({visibility:"visible",opacity:this.options.opacity})}},hide:function(){this.options.fade?this.tip().stop().fadeOut(function(){t(this).remove()}):this.tip().remove()},fixTitle:function(){var t=this.$element;(t.attr("title")||"string"!=typeof t.attr("original-title"))&&t.attr("original-title",t.attr("title")||"").removeAttr("title")},getTitle:function(){var t,e=this.$element,i=this.options;this.fixTitle();var t,i=this.options;return"string"==typeof i.title?t=e.attr("title"==i.title?"original-title":i.title):"function"==typeof i.title&&(t=i.title.call(e[0])),t=(""+t).replace(/(^\s*|\s*$)/,""),t||i.fallback},tip:function(){return this.$tip||(this.$tip=t('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>')),this.$tip},validate:function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},toggleEnabled:function(){this.enabled=!this.enabled}},t.fn.tipsy=function(e){function s(s){var n=t.data(s,"tipsy");return n||(n=new i(s,t.fn.tipsy.elementOptions(s,e)),t.data(s,"tipsy",n)),n}function n(){var t=s(this);t.hoverState="in",0==e.delayIn?t.show():(t.fixTitle(),setTimeout(function(){"in"==t.hoverState&&t.show()},e.delayIn))}function o(){var t=s(this);t.hoverState="out",0==e.delayOut?t.hide():setTimeout(function(){"out"==t.hoverState&&t.hide()},e.delayOut)}if(e===!0)return this.data("tipsy");if("string"==typeof e){var l=this.data("tipsy");return l&&l[e](),this}if(e=t.extend({},t.fn.tipsy.defaults,e),e.live||this.each(function(){s(this)}),"manual"!=e.trigger){var a=e.live?"live":"bind",f="hover"==e.trigger?"mouseenter":"focus",h="hover"==e.trigger?"mouseleave":"blur";this[a](f,n)[a](h,o)}return this},t.fn.tipsy.defaults={className:null,delayIn:0,delayOut:0,fade:!1,fallback:"",gravity:"n",html:!1,live:!1,offset:10,opacity:.8,title:"title",trigger:"hover"},t.fn.tipsy.elementOptions=function(e,i){return t.metadata?t.extend({},i,t(e).metadata()):i},t.fn.tipsy.autoNS=function(){return t(this).offset().top>t(document).scrollTop()+t(window).height()/2?"s":"n"},t.fn.tipsy.autoWE=function(){return t(this).offset().left>t(document).scrollLeft()+t(window).width()/2?"e":"w"},t.fn.tipsy.autoBounds=function(e,i){return function(){var s={ns:i[0],ew:i.length>1?i[1]:!1},n=t(document).scrollTop()+e,o=t(document).scrollLeft()+e,l=t(this);return l.offset().top<n&&(s.ns="n"),l.offset().left<o&&(s.ew="w"),t(window).width()+t(document).scrollLeft()-l.offset().left<e&&(s.ew="e"),t(window).height()+t(document).scrollTop()-l.offset().top<e&&(s.ns="s"),s.ns+(s.ew?s.ew:"")}}}(jQuery);
// ustream
var UstreamEmbed=function(){function a(a){return b(a)}function b(a){var b=c(a),m=function(a){function b(b){if("socialstream"!==b){if(!v)return x||(x=[]),x.push(arguments),void 0;var d=i(arguments).slice(1);d[0]&&"function"==typeof d[0]&&(y[b]||(y[b]=[]),y[b].push(d[0])),g(a,s,{cmd:b,args:d})}else if(j(window,"message",n),u=c(arguments[1]),t=h(u.getAttribute("src")),w=!0,A.length)for(var e=0,k=A.length;k>e;e++)f(A[e])}function m(){if(x){for(;x.length;)b.apply(this,x.shift());x=null}}function n(a){var b=u;b&&b.contentWindow&&b.contentWindow===a.source?r.onmessage(a):a.source===u.id&&r.onmessage(a)}function o(a){var c,d=JSON.parse(a.data);return d.cmd&&"ready"==d.cmd?(g(u,t,{cmd:"ready"}),void 0):(c=[d.cmd],c=c.concat(d.args),b.apply(this,c),void 0)}function p(){v=!0,g(a,s,{cmd:"apihandshake",args:[]}),m()}function q(){b.apply(this,arguments)}var r,s,t,u,v=!1,w=!1,x=[],y={},z={},A=[];return s=h(a.getAttribute("src")),r={host:s,callMethod:q,getProperty:function(){q.apply(this,arguments)},addListener:function(a,b){z[a]||(z[a]=[]),z[a].push(b)},removeListener:function(a,b){if(b)for(var c=0,d=z[a].length;d>c;c++)z[a][c]===b&&z[a].splice(c,1);else z[a]=null},onmessage:function(a){var b;if(s||t||A.push({origin:a.origin,data:a.data}),a.origin==s){try{b=JSON.parse(a.data)}catch(c){return}if(b.sstream)return o(a),void 0;if(b.event&&b.event.ready&&(p(),d(z,"ready")),b.event&&b.event.live===!0)return d(z,"live"),void 0;if(b.event&&b.event.live===!1)return d(z,"offline"),void 0;if(b.event&&!b.event.ready)if(k)Object.keys(b.event).forEach(function(a){d(z,a,b.event[a])});else for(var f in b.event)b.event.hasOwnProperty(f)&&d(z,f,b.event[f]);if(b.property)if(k)Object.keys(b.property).forEach(function(a){e(y,a,b.property[a])});else for(var f in b.property)b.property.hasOwnProperty(f)&&e(y,f,b.property[f])}else if(w&&a.origin==t)return o(a),void 0},destroy:function(){v=!1,s="",w=!1,t="",u=null,x=[],y={},z={},A=[],l[a.id]&&(l[a.id]=null),a=null}}}(b);return b.id||(b.id="UstreamEmbed"+Math.ceil(1e5*Math.random())),m.id=b.id,l[b.id]=m,m}function c(a){return"string"==typeof a&&(a=document.getElementById(a)),a}function d(a,b,c){for(var d in a[b])a[b].hasOwnProperty(d)&&a[b][d].call(window,b,c)}function e(a,b,c){if(a[b]){for(var d in a[b])a[b].hasOwnProperty(d)&&a[b][d].call(window,c);a[b]=null,delete a[b]}}function f(a){var b,c;for(b in l)l.hasOwnProperty(b)&&l[b]&&(c=document.getElementById(b),c&&c.contentWindow?c.contentWindow===a.source&&l[b].onmessage(a):"string"==typeof a.source&&a.source==b&&l[b].onmessage(a))}function g(a,b,c){a.contentWindow.postMessage(JSON.stringify(c),b)}function h(a){return a.indexOf("http")<0&&(a=location.protocol+a),a.match(m)[1].toString()}function i(a){return Array.prototype.slice.call(a,0)}function j(a,b,c){a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent("on"+b,c)}var k="undefined"!=typeof Object.keys,l={},m=new RegExp("^(http(?:s)?://[^/]+)","im");return j(window,"message",f),"function"==typeof define&&define.amd?(define([],function(){return a}),void 0):window.UstreamEmbed=a}();
