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
  const retrieveQuote = function() {
    $.getJSON("https://api.corrently.io/v2.0/co2/price?co2="+$('#co2eq').val(),function(data) {
      $('#co2req').html(data.reqCO2);
      $('#co2get').html(data.getCO2);
      $('#price').html(data.priceEUR);
      $('#offsetnow').click(function() {
          $.getJSON("https://api.corrently.io/v2.0/co2/compensate?co2="+$('#co2eq').val(),function(data) {
            location.href = data ;
          })
      })
      $('#priceModal').modal("show");
    })
  }


  $('#getQuote').click(retrieveQuote)

  const ui = SwaggerUIBundle({
    url: "/assets/js/openapi.json",
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  });

  if(getUrlParameter("co2")) {
    $('#co2eq').val(getUrlParameter("co2"));
    retrieveQuote();
  }

});
