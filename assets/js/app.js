$('document').ready(function() {
  $('#getQuote').click(function() {
    $.getJSON("https://api.corrently.io/v2.0/co2/price?co2="+$('#co2eq').val(),function(data) {
      $('#co2req').html(data.reqCO2);
      $('#co2get').html(data.getCO2);
      $('#price').html(data.priceEUR);
      $('#offsetnow').click(function() {
          $.getJSON("https://api.corrently.io/v2.0/co2/compensate?co2="+$('#co2eq').val(),function(data) {
            location.href = data ;
          })
      })
    })
  })

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

});
