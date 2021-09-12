$('document').ready(function() {
  const getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
  };

  const updateCurrency = function() {
      let visits = $('#amount').val() * 9793;
      if($('input[name=currency]:checked').val() == 'USD') {
        $('.currency').html("$");
        visits = visits / 0.82;
      } else {
        $('.currency').html("€");
      }
      $('#visits').html("<strong>"+Math.round(visits)+"</strong>");
  }

  const checkout = function() {
    $.getJSON("https://api.corrently.io/v2.0/co2/offset?currency="+$('input[name=currency]:checked').val()+"&v="+($('#amount').val()*100)+"&token="+new Date().getTime()+"_"+getUrlParameter("host")+"&host="+getUrlParameter("host")+"&name=Offset+"+getUrlParameter("host"),function(data) {
      location.href=data;
    })
  }

  if(getUrlParameter("host")) {
    $('.entity').html(getUrlParameter("host"))
    $('.entity-strong').html('<strong>'+getUrlParameter("host")+"</strong>");
    $.getJSON("https://api.corrently.io/v2.0/ghgmanage/statusimg?host="+getUrlParameter("host")+"&stats=only",function(data) {
      let freedays = 30;
      let ts = new Date().getTime();
      data.credited *= 1;
      if(data.credited > ts) {
        ts = data.credited
      } else {
        if( data.credited > (ts - (86400000 * freedays))) {
          ts = data.credited + (86400000 * freedays);
        } else {
          if(data.debit < freedays) {
            ts += (86400000 * (freedays-data.debit));
          } else {
            ts = data.credited
          }
        }
      }
      $('.sponsor').html(data.sponsor);
      $('.neutralstrong').html("<strong>"+new Date(ts).toLocaleDateString()+"</strong>");
      updateCurrency();
    });
  }

  $('.form-check-input').click(updateCurrency);
  $('.form-check-input').change(updateCurrency);
  $('#amount').change(updateCurrency);
  $('#checkout').click(checkout);
});
