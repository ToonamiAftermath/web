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
				<div id="content" class="schedule-content">
					<h2>Schedule</h2>
					<button id="schedule-est-button" type="button" onclick="streamSelect('est')" class="schedule-button">EST</button>
					<button id="schedule-pst-button" type="button" onclick="streamSelect('pst')" class="schedule-button">PST</button>
					<span id="timezone">Time Zone:</span>
					<div id="daytabs">
						<ul class="daytabs" style="padding-left:0">
							<li class="monday"><a href="#monday">Monday</a></li>
							<li class="tuesday"><a href="#tuesday">Tuesday</a></li>
							<li class="wednesday"><a href="#wednesday">Wednesday</a></li>
							<li class="thursday"><a href="#thursday">Thursday</a></li>
							<li class="friday"><a href="#friday">Friday</a></li>
							<li class="saturday"><a href="#saturday">Saturday</a></li>
							<li class="sunday"><a href="#sunday">Sunday</a></li>
						</ul>
						<div id="schedule-contain">
							<div id="monday" class="schedule-tab"><table id="schedule-monday"></table></div>
							<div id="tuesday" class="schedule-tab"><table id="schedule-tuesday"></table></div>
							<div id="wednesday" class="schedule-tab"><table id="schedule-wednesday"></table></div>
							<div id="thursday" class="schedule-tab"><table id="schedule-thursday"></table></div>
							<div id="friday" class="schedule-tab"><table id="schedule-friday"></table></div>
							<div id="saturday" class="schedule-tab"><table id="schedule-saturday"></table></div>
							<div id="sunday" class="schedule-tab"><table id="schedule-sunday"></table></div>
						</div>
					</div>
					<span>All showtimes estimated using your detected time zone.</span>
					<div id="tooltips" style="display:none;"></div>
				</div>
				<?php include './includes/footer.html'; ?>
			</div>
		</div>
	</div>
</body>
</html>
