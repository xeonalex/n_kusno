console.log('hello from script.js');

// svg4everybody();

$(document).ready(function() { // начало document.ready

    // установка класса для активного таба
      $('.j_tabs__link').click(function(event) {
        event.preventDefault();
          /* Act on the event */
          $('.j_tabs__link.active').removeClass('active');

          $('.tab__content-wrap.active').removeClass('active').attr('style', '');
          $($(this).addClass('active').attr('href')).addClass('active').fadeIn();
        return false;
      });

      $('.j_tabs__link.active').click();

    // установка класса для типа отображения списка в каталоге
    var curMode = $('#j_cat-prod-list').data('mode')
    $('#j_cat-prod-list').addClass($('#j_cat-prod-list').data('mode'));
    $('a[class*="'+curMode+'"]').closest('.view__mode').addClass('current');


    // // загрузим SVG спрайт
    $.get("img/sprites/sprite.svg", function(data) {
        var div = document.createElement("div");
        div.innerHTML = new XMLSerializer().serializeToString(data.documentElement);
        div.style.display = 'none';
        document.body.insertBefore(div, document.body.childNodes[0]);
    });

    // форма поиска
	    $('.j_search-init').click(function(event) {
	    	event.preventDefault();
	    	/* Act on the event */

	    	$('.header').addClass('search_activated');
	    	$('.j_search-result').slideDown('fast',function(){
	    		$(this).css('display', 'flex');
	    	});
	    	$('.header .search-block__field').focus();
	    	return false;
	    });

	    $('.j_search-close').click(function(event) {
	    	// event.preventDefault();
	    	/* Act on the event */

	    	$('.header').removeClass('search_activated');
	    	$('.j_search-result').slideUp();
	    });
  //

  $('.j_recipes').owlCarousel({
    nav: true,
    onInitialize: function(event){
    },
    onInitialized: function(event){
      var element   = event.target;

      $(element).find('.owl-prev').text('').append($('<span class="slider-left"><svg class="icon-i_slider_arr_l icon" ><use xlink:href="#i_slider_arr_l"></use></svg></span>'));
      $(element).find('.owl-next').text('').append($('<span class="slider-right"><svg class="icon-i_slider_arr_r icon" ><use xlink:href="#i_slider_arr_r"></use></svg></span>'));
    },
    responsive : {
      // breakpoint from 0 up
      0 : {
      },
      // breakpoint from 480 up
      480 : {
      },
      // breakpoint from 768 up
      1024 : {
        items: 4
      }
    }
  });

  $('.j_recent-news').owlCarousel({
    nav: true,
    onInitialize: function(event){
    },
    onInitialized: function(event){
      var element   = event.target;

      $(element).find('.owl-prev').text('').append($('<span class="slider-left"><svg class="icon-i_slider_arr_l icon" ><use xlink:href="#i_slider_arr_l"></use></svg></span>'));
      $(element).find('.owl-next').text('').append($('<span class="slider-right"><svg class="icon-i_slider_arr_r icon" ><use xlink:href="#i_slider_arr_r"></use></svg></span>'));
    },
    responsive : {
      // breakpoint from 0 up
      0 : {
      },
      // breakpoint from 480 up
      480 : {
      },
      // breakpoint from 768 up
      1024 : {
        items: 3
      }
    }
  });

  $('.j_popular-goods').owlCarousel({
    nav: true,
    onInitialize: function(event){
      $(event.target).addClass('visible'); // кратковременный клас для корректного отображения карточек при ховере
    },
    onInitialized: function(event){
      var element   = event.target;
      var wrap = $(element).find('.owl-stage-outer');
      wrap.css('height', wrap.height());
      $(element).removeClass('visible'); // кратковременный клас для корректного отображения карточек при ховере

      $(element).find('.owl-prev').text('').append($('<span class="slider-left"><svg class="icon-i_slider_arr_l icon" ><use xlink:href="#i_slider_arr_l"></use></svg></span>'));
      $(element).find('.owl-next').text('').append($('<span class="slider-right"><svg class="icon-i_slider_arr_r icon" ><use xlink:href="#i_slider_arr_r"></use></svg></span>'));
    },
    responsive : {
      // breakpoint from 0 up
      0 : {
      },
      // breakpoint from 480 up
      480 : {
      },
      // breakpoint from 768 up
      1024 : {
        items: 3
      }
    }
  });

  $('.j_recently-viewed').owlCarousel({
    nav: true,
    onInitialize: function(event){
      $('.j_recently-viewed').addClass('visible'); // кратковременный клас для корректного отображения карточек при ховере
    },
    onInitialized: function(event){
      var element   = event.target;
      var wrap = $(element).find('.owl-stage-outer');
      wrap.css('height', wrap.height());
      $('.j_recently-viewed').removeClass('visible'); // кратковременный клас для корректного отображения карточек при ховере

      $(element).find('.owl-prev').text('').append($('<span class="slider-left"><svg class="icon-i_slider_arr_l icon" ><use xlink:href="#i_slider_arr_l"></use></svg></span>'));
      $(element).find('.owl-next').text('').append($('<span class="slider-right"><svg class="icon-i_slider_arr_r icon" ><use xlink:href="#i_slider_arr_r"></use></svg></span>'));
    },
    responsive : {
      // breakpoint from 0 up
      0 : {
      },
      // breakpoint from 480 up
      480 : {
      },
      // breakpoint from 768 up
      1024 : {
        items: 4
      }
    }
  });

	// детали корзины
		$('.j_cart-init').click(function(event) {
	    	event.preventDefault();
	    	$('.j_cart-result').slideDown('fast', function(){
	    		$(this).css('display', 'flex');
	    	});
	    	return false;
		});
	    $('.j_cart-close').click(function(event) {
	    	event.preventDefault();
	    	/* Act on the event */

	    	$('.j_cart-result').slideUp();
	    	return false;
	    });
	    // +- контролеры

		$('.j_cart-item-amount .decrease').click(function(event) {
	    	event.preventDefault();
	    	var parent = $(this).closest('.j_cart-item-amount'),
	    		input = parent.find('.j_cart-item-amount_input');
          console.log(input.val());
          if (input.val()) {
            input.val(input.val() <= 1 ? 1 : input.val()-1 );
          } else {
            input.val(1);
          }
	    	return false;
		});
		$('.j_cart-item-amount .increase').click(function(event) {
	    	event.preventDefault();
	    	var parent = $(this).closest('.j_cart-item-amount'),
	    		input = parent.find('.j_cart-item-amount_input');
        if (input.val() == false) {
          input.val(1);
        }
  			input.val(+input.val()+1);
	    	return false;
		});

    // блоки одинаковой высоты
        $('.news__item, .j_equal-height .goods__item').matchHeight({ byRow: true });

        $(window).on('resize', function(event) {
            $.fn.matchHeight._update()
        });


    $('.j_rating').each(function(index, el) {
        var flag = $(el).hasClass('j_rating_read');
        $(el).barrating('show', {
            theme: 'bars-1to10',
            showValues: false,
            initialRating: ''+$(el).data('rating'),
            readonly: flag
        });
    });

    $('.view__mode_block').click(function(e){
        e.preventDefault();
        $('.view__mode').removeClass('current');
        $('.view__mode_block').closest('.view__mode').addClass('current');
        $('#j_cat-prod-list') .removeClass($('#j_cat-prod-list').data('mode'))
                              .data('mode','mode_block')
                              .addClass('mode_block');
        return false;
    });

    $('.view__mode_line').click(function(e){
        e.preventDefault();
        $('.view__mode').removeClass('current');
        $('.view__mode_line').closest('.view__mode').addClass('current');
        $('#j_cat-prod-list') .removeClass($('#j_cat-prod-list').data('mode'))
                              .data('mode','mode_line')
                              .addClass('mode_line');
        return false;
    });
    $('.show-more').click(function(){
        $(this)
            .toggleClass('show-more--active')
            .next()
            .stop(true)
            .slideToggle('slow');
    });



});
var icon1 = "img/icons/marker.svg";
var icon2 = "img/icons/marker-h.svg";
// google map
function initialize() {
    //получаем наш div куда будем карту добавлять
    var mapCanvas = document.getElementById('map_canvas');
    // задаем параметры карты
    var mapOptions = {
        //Это центр куда спозиционируется наша карта при загрузке
        center: new google.maps.LatLng(55.64020519, 37.64585495),
        //увеличение под которым будет карта, от 0 до 18
        // 0 - минимальное увеличение - карта мира
        // 18 - максимально детальный масштаб
        zoom: 14,
        scrollwheel: true,
        disableDefaultUI: true,
        // styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}],
        //Тип карты - обычная дорожная карта
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    //Инициализируем карту
    var map = new google.maps.Map(mapCanvas, mapOptions);

    //Объявляем массив с нашими местами и маркерами
    var markers = [],
        myPlaces = [];
    //Добавляем места в массив
    myPlaces.push(new Place('', 55.64253033, 37.63486862, ''));
    myPlaces.push(new Place('', 55.64020519, 37.64585495, ''));
    myPlaces.push(new Place('', 55.63729857, 37.66181946, ''));
    //Теперь добавим маркеры для каждого места
    for (var i = 0, n = myPlaces.length; i < n; i++) {

        var companyImage = new google.maps.MarkerImage(icon1,
          new google.maps.Size(113,130)
        //   new google.maps.Point(0,0),
        //   new google.maps.Point(0,0)
        );



        var marker = new google.maps.Marker({
            //расположение на карте
            position: new google.maps.LatLng(myPlaces[i].latitude, myPlaces[i].longitude),
            map: map,
            icon: companyImage,
            //То что мы увидим при наведении мышкой на маркер
            // title: myPlaces[i].name
          });
        //Добавим попап, который будет появляться при клике на маркер
        var infowindow = new google.maps.InfoWindow({
          content: myPlaces[i].name
        });
        //привязываем попап к маркеру на карте
        makeInfoWindowEvent(map, infowindow, marker);
        markers.push(marker);
    }
  }
  function makeInfoWindowEvent(map, infowindow, marker) {
    //Привязываем событие КЛИК к маркеру
    google.maps.event.addListener(marker, 'mouseover', function() {
        // infowindow.open(map, marker);
        marker.setIcon(icon2);
    });
    google.maps.event.addListener(marker, 'mouseout', function() {
        marker.setIcon(icon1);
    });
  }
  //Это класс для удобного манипулирования местами
  function Place(name, latitude, longitude, description){
    this.name = name;  // название
    this.latitude = latitude;  // широта
    this.longitude = longitude;  // долгота
    this.description = description;  // описание места
  }
  //Когда документ загружен полностью - запускаем инициализацию карты.
  google.maps.event.addDomListener(window, 'load', initialize);
