/// <reference path="jquery-1.7.1.intellisense.js"/>
/// <reference path="jquery-1.7.1.js" />

// Controller

if (typeof M === "undefined")
	M = {};

M.Controller = new (function ()
{
	var Ctrl = this;

	this.ActiveController = null;
	this.Instance = null;

	// ---------------------------- Browser Detection -----------------------------
	this.DetectBrowser = function()
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

	// ----------------------------Process start ----------------------------
	this.StartApplication = function ()
	{
		var unsupported = this.DetectBrowser();
		if (unsupported)
			return false;

		var canvas = document.getElementById("Canvas");
		var m = new M.Main(canvas);
		m.Init();
		//m.Reset();
		this.Instance = m;
		setInterval(function () { m.Process(); }, 10);

		return true;
	}

	this.GetQueryParameters = function ()
	{
		var parameters = {};

		var link = document.URL;
		if (link.indexOf('?') > 0)
			var query = link.substring(link.indexOf('?') + 1);
		else
			return parameters;

		var parts = query.split('&');
		for (i in parts)
		{
			var part = parts[i];
			var key = part.split('=')[0];
			var val = part.split('=')[1];
			parameters[key] = val;
		}

		return parameters;
	}

	// -----------------Default Canvas size and reload controls -----------------
	this.SetDefaults = function ()
	{
		var params = this.GetQueryParameters();

		if ('version' in params && 'config' in params && 'settings' in params)
		{
			this.Instance.Deserialize(params.version, params.config, params.settings);
		}
		else
		{

			// Set default size
			this.Instance.Config.CanvasWidth = Math.roundTo(window.innerWidth * 0.9, 0);
			this.Instance.Config.CanvasHeight = Math.roundTo(window.innerHeight * 0.85, 0);
		}

		this.Instance.ResizeCanvas();
		this.RefreshControls();
		this.RefreshSettings();
	}

	// refresh all display values and sliders from values stored in the current instance
	this.RefreshControls = function()
	{
		$('.Controller').each(function ()
		{
			var id = $(this).prop('id');
			var val = Ctrl.Instance.Config[id];
			Ctrl.SetValue(id, val, false, true);
		});
	}

	// refresh all settings (show/hide sections) from values stored in the current instance
	this.RefreshSettings = function()
	{
		$('#Control .Settings').each(function ()
		{
			var id = $(this).prop('id');
			Ctrl.ShowHideSettings(id);
		});
	}

	// Add controller element and label
	this.AddController = function(elem)
	{
		var id = $(elem).prop('id');
		var label = '<span>' + M.Labels[id] + ':</span>';
		var type = M.ConfigInfo[id].type;

		if (type === 'limit' || type === 'explimit')
			var ctrl = '<div class="ControlHandle"><div class="bar"><div class="indicator">&nbsp;</div></div></div>';
		else if (type === 'lin' || type === 'exp')
			var ctrl = '<div class="ControlHandle"><div class="spinner">Drag</div></div>';
		else if (type === 'color')
			var ctrl = '<div class="ControlColor">&nbsp;</div>';
		else
			var ctrl = '';

		$(elem).before(label);
		$(elem).after(ctrl);

		if (type === 'color')
		{
			$(elem).parent().find('.ControlColor').click(function ()
			{
				Ctrl.GetColor(id);
			});
		}
		else
		{
			$(elem).parent().find('.ControlHandle').mousedown(function ()
			{
				Ctrl.ActiveController = id;
				$('#Control input').css('-moz-user-select', '-moz-none');
				$('#Control input').css('-webkit-user-select', 'none');
			});
		}

		// Event handler for input vox
		$(elem).change(function ()
		{
			Ctrl.SetValue(id, $(this).val(), false);
		});

		// set default value
		this.SetValue(id, M.ConfigInfo[id].def, true, true);
	}

	// Set the control value
	this.SetValue = function(id, val, round, force)
	{
		var info = M.ConfigInfo[id];

		if (info.type !== 'color')
		{
			val = Number(val);
			if (val < info.min)
				val = info.min;
			else if (val > info.max)
				val = info.max;
		}

		if (this.Instance.Config[id] == val && (force !== true))
			return;

		// update slider
		if (info.type == 'limit')
		{
			var width = (val - info.min) / (info.max - info.min) * 100;
			width = Math.roundTo(width, 1);
			width = width.toString() + '%';
			$('#' + id).parent().find('.bar .indicator').css('width', width);
		}
		else if (info.type == 'explimit')
		{
			var width = Math.log(val + 1) / Math.log(info.max + 1) * 100;
			width = Math.roundTo(width, 1);
			width = width.toString() + '%';
			$('#' + id).parent().find('.bar .indicator').css('width', width);
		}

		if (info.type === 'color')
		{
			$('#' + id).val(val);
			$('#' + id).parent().find('.ControlColor').css('background-color', val);
		}
		else
		{
			var roundedVal = Math.roundTo(val, info.precision);

			if (round === true)
				$('#' + id).val(roundedVal);
			else
				$('#' + id).val(val);
		}

		this.Instance.Config[id] = val;
		this.Instance.Reset();
		this.Instance.Process();

		if (id.indexOf('ColorPick') >= 0)
			this.UpdateColorDialog();
	}

	this.UpdateColorDialog = function()
	{
		$('#Swatch').css('background-color', this.GetDialogColor());
	}

	this.GetDialogColor = function()
	{
		var R = this.Instance.Config.ColorPickR.toString(16);
		var G = this.Instance.Config.ColorPickG.toString(16);
		var B = this.Instance.Config.ColorPickB.toString(16);

		if (R.length < 2)
			R = '0' + R;
		if (G.length < 2)
			G = '0' + G;
		if (B.length < 2)
			B = '0' + B;

		var str = '#' + R + G + B;
		return str;
	}

	// Show or hide the current setting (config block) depending on model state
	this.ShowHideSettings = function(id)
	{
		var elem = $('#' + id).first();

		var state = this.Instance.Settings[id];
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
	this.ShowDialog = function(dialogId, onCloseEvent)
	{
		var dialog = $('#' + dialogId);
		dialog.addClass('DialogActive');
		dialog.appendTo("body");

		var dialogClose = $(".DialogClose").clone();
		dialogClose.appendTo(dialog);

		var blinds = $(".DialogBlinds").clone();
		blinds.addClass('BlindsActive');
		blinds.appendTo("body");

		// add close action
		$(".DialogCloseButton").click(function ()
		{
			$("body .BlindsActive").remove();
			$("body .DialogActive .DialogClose").remove();
			$("body .DialogActive").appendTo('#DialogContainer');
			$(".DialogActive").removeClass('DialogActive');

			if (typeof onCloseEvent !== "undefined" && onCloseEvent !== null)
				onCloseEvent();
		});
	}

	this.GetColor = function(id)
	{
		var color = DecomposeColor(this.Instance.Config[id]);
		this.SetValue('ColorPickR', color[0]);
		this.SetValue('ColorPickG', color[1]);
		this.SetValue('ColorPickB', color[2]);

		var callback = function () { Ctrl.SetValue(id, Ctrl.GetDialogColor()); };
		this.ShowDialog('ColorPickerDialog', callback);
	}

	// ----------------------------------------------------------------------
	// --------------------------- Event Handlers ---------------------------
	// ----------------------------------------------------------------------

	this.EventToggleSettings = function (id)
	{
		var state = this.Instance.Settings[id];
		state = !state;
		this.Instance.Settings[id] = state;

		this.ShowHideSettings(id);
		this.Instance.Reset();
		this.Instance.Process();
	}

	this.EventGetImage = function ()
	{
		var dataURL = document.getElementById("Canvas").toDataURL();
		document.getElementById("ImageOutput").src = dataURL;
		this.ShowDialog("GetImageDialog");
	}

	this.EventSaveShare = function ()
	{
		var serialized = this.Instance.Serialize();

		var link = document.URL;
		if (link.indexOf('?') > 0)
			link = link.substring(0, link.indexOf('?'));

		link = link + '?version=' + M.VersionInfo + '&config=' + serialized.Config + '&settings=' + serialized.Settings;

		$('#ImageUrl').val(link);

		this.ShowDialog("SaveShareDialog");
	}

	this.EventInstructions = function ()
	{
		this.ShowDialog("InstructionsDialog");
	}

	this.EventAbout = function ()
	{
		this.ShowDialog("AboutDialog");
	}

})();
