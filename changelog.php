<!DOCTYPE html>
<head>
<?php include './includes/head.html'; ?>
</head>
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
			<?php
				$file = "./includes/changelog.txt";
				$handle = fopen($file, "r");
				$filesize = filesize($file);
				if (!$filesize) exit;
				$data = fread($handle, $filesize);
				echo $data;
			?>
			</div>
			<?php include './includes/footer.html'; ?>
		</div>
	</div>
</div>
</body>
</html>