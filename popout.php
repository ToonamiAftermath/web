<!DOCTYPE html>
<head>
<meta name="description" content="Toonami Aftermath - The Leading Independent InternetTV Channel in Animation. What is Toonami? Toonami was an influential block of action-adventure cartoons and anime.">
<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
<meta content="utf-8" http-equiv="encoding">
<link rel="shortcut icon" href="./favicon.ico" />
<link href="./css/style.css" rel="stylesheet" type="text/css"/>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.min.js"></script>
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.0/jquery-ui.min.js"></script>
<script src="http://jquery-ui.googlecode.com/svn/tags/latest/ui/jquery.effects.core.js"></script>
<script src="./js/custom.js"></script>
</head>
<body>
<!--Main Container!-->
<div id="main-contain">
<div id="view-contain">
	<div id="vid">
		<!--a href="https://getadblock.com/" target="_blank" -->
		<!--img id="vidover" src="./css/images/blank.png"></a-->
		<div id="vid-embed-container"></div>
		<!--div id="vidoutline" onclick="pauseJwplayer()"></div-->
		<img id="watermark" src="./css/images/ui/logo.png" alt="toonami logo">
		<!--div id="hoverPlayButton" onclick="pauseJwplayer()"></div-->
		<!--a id="connectcastLogo" href="http://connectcast.tv/toonamiest" target="_blank"></a-->
		<div id="controls" class="noselect">
			<div id="controls-inner">
			<div id="controls-bg-container">
				<img id="controls-overlay" src="./css/images/ui/controlover.png">
			</div>
			<button id="play-button" title="Play/Pause" onclick="pauseJwplayer()"></button>
			<button id="mute-button" title="Mute/Unmute" onclick="muteJwplayer()"></button>
			<div id="volume"></div>
			<button id="pst-button" class="channel-button" title="Pacific Broadcast" onclick="streamSelect('pst')">PST</button>
			<button id="est-button" class="channel-button" title="Eastern Broadcast" onclick="streamSelect('est')">EST</button>
			<button id="radio-button" class="channel-button" title="Absolution Radio" onclick="streamSelect('radio')">RADIO</button>
			<button id="test-button" class="channel-button" title="Test Broadcast" onclick="streamSelect('test')">TEST</button>
			<button id="refresh-button" onclick="streamSelect(channelSelected)" title="Refresh"></button>
			<button id="dimmer-button" title="Lights" onclick="dimmer()"></button>
			<button id="chat-button" title="Chat" onclick="toggleChat()"></button>
			</div>
		</div>
	</div>
	<div id="chat"></div>
</div>
</div>
</body>
<script>
fullPage("on");
hideChat(true);
</script>
</html>