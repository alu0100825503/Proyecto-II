$(document).ready(function() {
	var screen = $.mobile.getScreenHeight();
	var header = $(".ui-header").hasClass("ui-header-fixed") ? $(".ui-header").outerHeight()  - 1 : $(".ui-header").outerHeight();
	var footer = $(".ui-footer").hasClass("ui-footer-fixed") ? $(".ui-footer").outerHeight() - 1 : $(".ui-footer").outerHeight();
	var contentCurrent = $(".ui-content").outerHeight() - $(".ui-content").height();
	var content = screen - header - footer - contentCurrent;

	$(".ui-content").height(content);

	var cssStyle = "max-width:100%;max-height:100%;overflow:hidden;";
	$("html").css("max-width", "100%");
	$("html").css("max-height", "100%");
	$("html").css("overflow", "hidden");
	
	$("body").css("max-width", "100%");
	$("body").css("max-height", "100%");
	$("body").css("overflow", "hidden");
});