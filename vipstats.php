<!DOCTYPE html>
<head>
<?php include './includes/head.html'; ?>
</head>
<script language="javascript" type="text/javascript">
  function resizeIframe(obj) {
    obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
  }
</script>
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
				<iframe name="Stack" src="./includes/mircstat/aftvip.html" width="100%" frameborder="0" scrolling="no" id="iframe" onload='javascript:resizeIframe(this);' />
			</div>
			<?php include './includes/footer.html'; ?>
		</div>
	</div>
</div>
</body>
</html>