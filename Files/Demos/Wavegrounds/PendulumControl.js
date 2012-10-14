/// <reference path="jquery-1.7.1.intellisense.js"/>
/// <reference path="jquery-1.7.1.js" />
/// <reference path="Pendulum.js" />


$(document).ready(function ()
{
	var unsupported = DetectBrowser();
	if (unsupported)
		return;

	// ----------------------------Process start ----------------------------

	var canvas = document.getElementById("Canvas");

	var m = new M.Main(canvas);
	m.Init();
	M.Instance = m;

	setInterval(function () { m.Process(); }, 10);

	// ---------------------------- Browser Detection -----------------------------

	function DetectBrowser()
	{
		var browser = BrowserDetect.browser.toLowerCase();
		var version = BrowserDetect.version;

		if (browser == 'explorer' && version < 9)
		{
			alert('Your browser it too old.\nInternet Explorer 8 and below are not supported.\nYou should most definitely upgrade your browser!');
			return true;
		}

		if (browser === 'chrome')
		{
			$('.IE').css('display', 'none');
			$('.Firefox').css('display', 'none');
		}
		else if (browser === 'explorer')
		{
			$('.Chrome').css('display', 'none');
			$('.Firefox').css('display', 'none');
		}
		else if (browser === 'firefox')
		{
			$('.IE').css('display', 'none');
			$('.Chrome').css('display', 'none');
		}

		return false;
	}

	// ----------------------------Helper functions ----------------------------

	var activeController = null;
	var lastMousePos = null;

	// refresh all display values and sliders from values stored in the current instance
	function refreshControls()
	{
		$('.Controller').each(function ()
		{
			var id = $(this).prop('id');
			var val = M.Instance.Config[id];
			setValue(id, val, false, true);
		});
	}

	// refresh all settings (show/hide sections) from values stored in the current instance
	function refreshSettings()
	{
		$('#Control .Settings').each(function ()
		{
			var id = $(this).prop('id');
			ShowHideSettings(id);
		});
	}

	// event that occurs when tweaking the sliders
	function UpdateMouseControl(id, dx, dy)
	{
		var val = Number($('#Control #' + id).val());
		var info = M.ConfigInfo[id];

		if(info.type === 'exp' || info.type == 'explimit')
		{
			var d = (info.type === 'exp') ? -dy : dx;
			
			if (d == 0)
				return;

			var minChange = Math.pow(10, -info.precision);

			var dVal = val * (info.scale * d);
			if(Math.abs(dVal) < minChange)
				dVal = (d > 0) ? minChange : -minChange;
			
			val = val + dVal;
		}
		else if (info.type === 'lin')
		{
			if (dy == 0)
				return;

			val = val - info.scale * dy;
		}
		else if (info.type === 'limit')
		{
			if (dx == 0)
				return;

			val = val + info.scale * dx;
		}

		setValue(id, val, true);
	}

	// Set the control value
	function setValue(id, val, round, force)
	{
		var info = M.ConfigInfo[id];
		
		if (val < info.min)
			val = info.min;
		else if (val > info.max)
			val = info.max;

		if (M.Instance.Config[id] == val && (force !== true))
			return;

		// update slider
		if (info.type == 'limit')
		{
			var width = (val - info.min) / (info.max - info.min) * 100;
			width = Math.roundTo(width, 1);
			width = width.toString() + '%';
			$('#Control #' + id).parent().find('.bar .indicator').css('width', width);
		}
		else if (info.type == 'explimit')
		{
			var width = Math.log(val+1) / Math.log(info.max+1) * 100;
			width = Math.roundTo(width, 1);
			width = width.toString() + '%';
			$('#Control #' + id).parent().find('.bar .indicator').css('width', width);
		}

		var roundedVal = Math.roundTo(val, info.precision);

		if (round === true)
			$('#Control #' + id).val(roundedVal);
		else
			$('#Control #' + id).val(val);

		M.Instance.Config[id] = val;
		M.Instance.Reset();
		M.Instance.Process();
	}

	// Add controller element and label
	function addController(elem)
	{
		var id = $(elem).prop('id');
		var label = '<span>' + id + ':</span>';
		var type = M.ConfigInfo[id].type;

		if(type === 'limit' || type === 'explimit')
			var ctrl = '<div class="ControlHandle"><div class="bar"><div class="indicator">&nbsp;</div></div></div>';
		else
			var ctrl = '<div class="ControlHandle"><div class="spinner">Drag</div></div>';

		$(elem).before(label);
		$(elem).after(ctrl);


		$(elem).parent().find('.ControlHandle').mousedown(function ()
		{
			activeController = id;
			$('#Control input').css('-moz-user-select', '-moz-none');
			$('#Control input').css('-webkit-user-select', 'none');
		});
	}

	// Show or hide the current setting (config block) depending on model state
	function ShowHideSettings(id)
	{
		var elem = $('#' + id).first();

		var state = M.Instance.Settings[id];
		var disabledLabel = '<div class="DisabledLabel">(Disabled)</div>';

		if (state === false)
		{
			$(elem).parent().addClass('DisabledState');
			$(elem).after(disabledLabel);

			// save original height
			var height = $(elem).parent().height();
			$.data(document.getElementById(id), 'height', height);

			$(elem).parent().animate({ 'height': '30px' }, 200);
		}
		else
		{
			$(elem).parent().removeClass('DisabledState');
			$(elem).parent().find('.DisabledLabel').remove();

			// retrieve original height
			var height = $.data(document.getElementById(id), 'height');

			$(elem).parent().animate({ 'height': height }, 200);
		}
	}

	// Show modal dialogs
	function ShowDialog(dialogId)
	{
		var dialog = $('#' + dialogId).clone();
		dialog.addClass('DialogActive');
		dialog.appendTo("body");

		var dialogClose = $(".DialogClose").clone();
		dialogClose.appendTo(dialog);

		var blinds = $(".DialogBlinds").clone();
		blinds.addClass('DialogActive');
		blinds.appendTo("body");

		// add close action
		$(".DialogCloseButton").click(function ()
		{
			$("body .DialogActive").remove();
		});
	}

	// ----------------------------Control events ----------------------------

	$(document).mouseup(function ()
	{
		console.log('mouse up, active was ' + activeController);
		activeController = null;
		$('#Control input').css('-moz-user-select', 'text');
		$('#Control input').css('-webkit-user-select', 'text');
	});

	$(document).mousemove(function (event)
	{
		if (lastMousePos == null || activeController == null)
		{
			lastMousePos = [event.pageX, event.pageY];
			return;
		}

		var dx = event.pageX - lastMousePos[0];
		var dy = event.pageY - lastMousePos[1];

		lastMousePos = [event.pageX, event.pageY];
		console.log('move: ' + lastMousePos[0] + ', ' + lastMousePos[1]);

		UpdateMouseControl(activeController, dx, dy);
	});

	// Show/Hide the clicked settings block
	$('#Control .Settings').click(function ()
	{
		var id = $(this).prop('id');
		var state = M.Instance.Settings[id];
		state = !state;
		M.Instance.Settings[id] = state;


		ShowHideSettings(id);
	});

	$('#Control .Controller').each(function ()
	{
		$(this).prop('unselectable', 'on');
		var id = $(this).prop('id');

		// add mouse controller
		addController(this);

		$(this).change(function ()
		{
			setValue(id, Number($(this).val()), false);
		});

		// set default value
		setValue(id, M.ConfigInfo[id].def, true, true);

	});

	// Read canvas ingo png image and show image dialog
	$('#GetImage').click(function ()
	{
		var dataURL = document.getElementById("Canvas").toDataURL();
		document.getElementById("ImageOutput").src = dataURL;
		ShowDialog("GetImageDialog");
	});

	// Open Save & Share dialog
	$('#SaveShare').click(function ()
	{
		var serialized = M.Instance.Serialize();

		var link = document.URL;
		if (link.indexOf('?') > 0)
			link = link.substring(0, link.indexOf('?'));

		link = link + '?data=' + serialized;

		$('#ImageUrl').val(link);

		ShowDialog("SaveShareDialog");
	});

	// Open Instructions dialog
	$('#Instructions').click(function ()
	{
		ShowDialog("InstructionsDialog");
	});

	// Open About dialog
	$('#About').click(function ()
	{
		ShowDialog("AboutDialog");
	});

	// Assign a custom scrollbar to the settings window
	$("#Control").mCustomScrollbar({
		advanced: {
			updateOnBrowserResize: true,
			updateOnContentResize: true,
			autoExpandHorizontalScroll: true
		}
	});

	$('#ControlMinimize').click(function ()
	{
		if ($('#ControlMinimize').html() == '˄')
		{
			$('#ControlContainer').animate({ 'height': '0px', 'width': '120px' }, 200);
			$('#ControlMinimize').html('˅');
		}
		else
		{
			$('#ControlContainer').animate({ 'height': '80%', 'width': '430px' }, 200);
			$('#ControlMinimize').html('˄');
		}
	});

	// Set default size
	M.Instance.Config.CanvasWidth = Math.roundTo(window.innerWidth * 0.9, 0);
	M.Instance.Config.CanvasHeight = Math.roundTo(window.innerHeight * 0.85, 0);
	M.Instance.ResizeCanvas();
	refreshControls();

	// show and hide settings by default
	refreshSettings();
});

Math.roundTo = function (number, decimalPlaces)
{
	var factor = Math.pow(10, decimalPlaces);
	return Math.round(number * factor) / factor;
};