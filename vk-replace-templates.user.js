(function () {

	function getCaretPos(element) {
		element.focus();
		if (document.selection) {
			var sel = document.selection.createRange();
			var clone = sel.duplicate();
			sel.collapse(true);
			clone.moveToElementText(element);
			clone.setEndPoint('EndToEnd', sel);
			return clone.text.length;
		} else {
			return window.getSelection().getRangeAt(0).startOffset;
		}
		return 0;
	}
	
	function isEditField(element) {
		return [].slice.call(element.classList).indexOf('im_editable') >= 0;
	}
	
	function getTextBeforeSelection(element) {
		var caretPos = getCaretPos(element);
		return element.innerText.substr(0, caretPos);
	}
	
	function replace(text) {
		var patterns = [];
		
		patterns.push([/w(?:.(\w+))?#(\S+?)$/, function (match, lang, title) {
			return (lang || 'ru') + '.wikipedia.org/wiki/' + title;
		}]);
		
		patterns.push([/ev#\((\S+?)\)$/, function (match, expression) {
			return expression + '=' + eval(expression);
		}]);
		
		patterns.push([/\*(\w+)$/, function (match, id) {
			return 'vk.com/' + id;
		}]);
		
		patterns.push([/\w+\/\w+$/, function (match) {
			return 'github.com/' + match;
		}]);
		
		for (var i = 0; i < patterns.length; i++) {
			var pattern = patterns[i];
			if (pattern[0].test(text)) {
				return text.replace(pattern[0], pattern[1]);
				break;
			}
		}
		
		return text;
	}
	
	document.addEventListener('keydown', function (e) {
		var el = document.activeElement;
		
		// 17 = Ctrl
		if (e.keyCode === 17 && isEditField(el)) {
			var sel = getTextBeforeSelection(el);
			el.innerText = el.innerText.replace(sel, replace(sel));
		}
	}, true);
}());
