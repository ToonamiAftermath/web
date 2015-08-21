<!DOCTYPE html>
<head>
<?php include './includes/head.html'; ?>
</head>
<script language="javascript" type="text/javascript">
  function resizeIframe(obj) {
    obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
  }
  function showStats(e, frame){
		$('button').removeClass("active");
		$(e).addClass("active");
		var src;
		if(frame=="latest"){
			src="./includes/mircstat/toonami-30days.html";
		}
		else {
			src="./includes/mircstat/toonami-alltime.html";
		}
		$("iframe").attr("src",src);
  }
</script>
<style>
	button{
cursor: pointer;
border:0;
outline:0;	
background: transparent;
color: #B2B2B2;
font-size: 16px;
letter-spacing: 1px;
padding: 0px 12px;
margin-top: 0px;
height: 32px;
-webkit-text-stroke: 0.5px;
font-family: SF_TRANSROBOTICS,SF_TRANSROBOTICSIE;
-webkit-transform: scale(1.2,1.2);
-moz-transform: scale(1.2,1.2);
-ms-transform: scale(1.2,1.2);
-o-transform: scale(1.2,1.2);
text-shadow: 0px 1px 2px rgba(0, 0, 0, 1), 0px 1px 2px rgba(0, 0, 0, 1), 0px 1px 2px rgba(0, 0, 0, 1), 0px 1px 2px rgba(0, 0, 0, 1), 0px 1px 2px rgba(0, 0, 0, 1), 0px 1px 2px rgba(0, 0, 0, 1), 0px 1px 2px rgba(0, 0, 0, 1), 0 0 4px black;
}
button.active {
-webkit-transition: color .17s, text-shadow .17s;
color: #FF8B00 !important;
text-shadow: 1px 1px 1px black, 0 0 13px #EF752A , 0 0 15px #FFD200;
}
button:hover {
color: #eee;
}
#frame-control{text-align:center;}
</style>
<div id="theme-fx">
<div id="snow"></div>
<div class="stars"></div>
<div class="twinkling"></div>
<div class="clouds"></div>
</div>
<div id="background"></div>
<body>
<div id="page-contain">
	<div id="page-shift">
		<div id="page">
			<?php include './includes/menu.html'; ?>
			<div id="content">
				<div id="frame-control">
				Date Range:
				<button class="active" onClick="showStats(this, 'alltime')">All Time</button>
				<button onClick="showStats(this, 'latest')">Last 30 Days</button>
				</div>
				<iframe src="./includes/mircstat/toonami-alltime.html" name="Stack" src="" width="100%" frameborder="0" scrolling="no" id="iframe" onload='javascript:resizeIframe(this);' />
			</div>
			<?php include './includes/footer.html'; ?>
		</div>
	</div>
</div>
</body>
</html>