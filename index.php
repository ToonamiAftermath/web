<!DOCTYPE html>
<head>
<?php include './includes/head.html'; ?>
</head>
<!--Background!-->
<div id="theme-fx">
<div id="snow"></div>
<div class="stars"></div>
<div class="twinkling"></div>
<div class="clouds"></div>
</div>
<div id="background"></div>
<body>

<!--Page Container!-->
<div id="page-contain" class="no-select">
	<div id="page-shift">
		<div id="page" class="front">
				<nav>
				<a href="/">Home</a>
				<a href="schedule" target="_blank" >Schedule</a>
				<a href="forum" target="_blank" >Forum</a>
				<a href="media" target="_blank" >Media</a>
				<a href="faq" target="_blank" >FAQ</a>
				<a href="stats" target="_blank" >Stats</a>
				<a href="rules" target="_blank" >Rules</a>
				<a href="changelog" target="_blank" >Changelog</a>
				</nav>
				<a href="./"><div id="logo"></div></a>
			<div id="content">
			<div id="main-contain-spacer"></div>
		</div>
			<?php include './includes/footer.html'; ?>
		</div>
	</div>
</div>
<!--Main Container!-->
<div id="main-contain">
<?php include './includes/share.html'; ?>
<div id="view-contain">
	<div id="vid">
		<!--a href="https://getadblock.com/" target="_blank"-->
		<!--img id="vidover" src="./css/images/ui/blank.png"></a-->
		<div id="vid-embed-container"></div>
		<!--div id="vidoutline" onclick="pauseJwplayer()"></div-->
		<img id="watermark" src="./css/images/ui/logo.png" alt="toonami logo">
		<div id="hoverPlayButton" onclick="pauseJwplayer()"></div>
		<!--a id="connectcastLogo" href="http://connectcast.tv/toonamiest" target="_blank"></a-->
		<div id="controls" class="noselect">
			<div id="controls-inner">
			<div id="controls-bg-container">
				<img id="controls-overlay" src="./css/images/ui/controlover.png">
			</div>
			<button id="play-button" title="Play/Pause (Spacebar)" onclick="pauseJwplayer()"></button>
			<button id="mute-button" title="Mute/Unmute" onclick="muteJwplayer()"></button>
			<div id="volume"></div>
			<button id="pst-button" class="channel-button" title="Pacific Broadcast" onclick="streamSelect('pst')">PST</button>
			<button id="est-button" class="channel-button" title="Eastern Broadcast" onclick="streamSelect('est')">EST</button>
			<button id="radio-button" class="channel-button" title="Absolution Radio" onclick="streamSelect('radio')">RADIO</button>
			<!--button id="test-button" class="channel-button" title="Test Broadcast" onclick="streamSelect('test')">TEST</button-->
			<button id="refresh-button" onclick="streamSelect(channelSelected)" title="Reload"></button>
			<button id="dimmer-button" title="Lights" onclick="dimmer()"></button>
			<button id="chat-button" title="Chat" onclick="toggleChat()"></button>
			<button id="popout-button" title="Popout" onclick="popout();"></button>
			<div id="fullpage" title="Theater Mode (F11)">
				<button id="fullpage-button" onclick="toggleSwitch()"></button>
			</div>
			</div>
		</div>
	</div>
	<div id="chat"></div>
</div>
</div>
</body>
</html>

