console.log('hello from script.js');

// svg4everybody();

$(function(){

    // // загрузим SVG спрайт
    $.get("img/sprites/sprite.svg", function(data) {
        var div = document.createElement("div");
        div.innerHTML = new XMLSerializer().serializeToString(data.documentElement);
        div.style.display = 'none';
        document.body.insertBefore(div, document.body.childNodes[0]);
    });

    $('.j_search-init').click(function(event) {
    	event.preventDefault();
    	/* Act on the event */

    	$('.header').addClass('search_activated');
    	$('.j_search-result').slideDown();
    	$('.header .search-form input').focus();
    	return false;
    });

    $('.j_search-close').click(function(event) {
    	// event.preventDefault();
    	/* Act on the event */

    	$('.header').removeClass('search_activated');
    	$('.j_search-result').slideUp();
    	// return false;
    });



//     // var ajax = new XMLHttpRequest();
//     // ajax.open("GET", "img/sprites/sprite.svg", true);
//     // ajax.send();
//     // ajax.onload = function(e) {
//     //   var div = document.createElement("div");
//     //   div.innerHTML = ajax.responseText;
//     //   document.body.insertBefore(div, document.body.childNodes[0]);
//     // }

})