$(document).ready(function() {
  window.hitCache = {};

  const retrieveQuote = function() {
    $('#modal_shop').modal("hide");
    $.getJSON("https://api.corrently.io/v2.0/co2/price?co2="+$('#co2eqbasket').attr("data-g"),function(data) {
      $('#co2req').html(niceNumberUnitCO2(data.reqCO2));
      $('#co2get').html(niceNumberUnitCO2(data.getCO2));
      if($('input[name=currency]:checked').val() == 'USD') {
        $('#price').html(data.priceUSD + " $");
      } else {
        $('#price').html(data.priceEUR + " €");
      }
      $('#offsetnow').click(function() {
          $.getJSON("https://api.corrently.io/v2.0/co2/compensate?co2="+$('#co2eqbasket').attr("data-g"),function(data) {
            location.href = data;
          })
      })
      $('#priceModal').modal("show");
    })
  }

  $('#getQuote').click(retrieveQuote)

  const unitChange = async function() {
    $('.text-unit').html($("#unit option:selected" ).text())
  }

  const niceNumberUnitCO2 = function(n) {
    let result = n + "g";
    if(n > 2000) {
      result = (n/1000).toFixed(1) + "kg";
    }
    if(n > 900000) {
      result = (n/1000000).toFixed(1) + "t";
    }
    return result;
  }

  const recalcCO2 = function() {
    let co2 = $('#qty').val() * ($('#shopunits').attr('data-co2') * $('#shopunits').val());
    $('#co2eqbasket').attr("data-g",co2);
    $('#co2eqbasket').html(niceNumberUnitCO2(co2));
  }
  const processResults = async function(d) {
    $('#resultsGroup').empty();
    $('#resultsTable').empty();

    let html = '';
    let table = '';

    for(let i=0;i<d.length;i++) {
      let hit = d[i]._source;
      window.hitCache[hit.activity] = hit;
      if(i<3) {
          html += '<div class="card" style="min-width:350px;padding:10px;">';
          html += ' <div class="card-header text-truncate text-nowrap text-start">';
          html += '  <a href="'+hit.sourceurl+'" target="_blank">'+hit.title+'</a>';
          html += '  <span class="badge rounded-pill bg-info text-center float-end">'+niceNumberUnitCO2(hit.co2eq)+'/'+hit.unit+'</span>';
          html += ' </div>';
          html += ' <div class="card-body text-start">';
          html += ' <div class="row">';
          html += ' <div class="col-10">';
          html += '  <p class="card-text">'+hit.description+'</p>'
          html += ' </div>';
          html += ' <div class="col text-center">';
          html += ' <button type="button" style="float:right" data="'+hit.activity+'" class="btn btn-sm btn-succcess btn-shop semi-white w-100"><i class="fas fa-shopping-cart"></i></button>'
          html += ' <button type="button" style="float:right" data="'+hit.activity+'" class="btn btn-sm btn-succcess btn-clone semi-white w-100"><i class="far fa-clone"></i></button>';
          html += ' </div>';
          html += ' </div>';
          html += ' </div>';
          html += ' <div class="card-footer text-muted">';
          let tags = hit.tags;
          for(let j=0;j<tags.length;j++) {
            html += tags[j]
            if(j < tags.length -1) html +=", ";
          }
          html += ' </div>';
          html += '</div>';
      }
      table += '<tr>';
      table += '<td>'+hit.title+'</td>';
      table += '<td>'+niceNumberUnitCO2(hit.co2eq)+'/'+hit.unit+'</td>';
      table += '<td>';
      table += ' <button type="button" style="float:right" data="'+hit.activity+'" class="btn btn-sm btn-succcess btn-shop semi-white"><i class="fas fa-shopping-cart"></i></button>'
      table += ' <button type="button" style="float:right" data="'+hit.activity+'" class="btn btn-sm btn-succcess btn-clone semi-white"><i class="far fa-clone"></i></button>';
      table += '</td>';
      table += '</tr>';
    }
    $('#btn_missing').show();
    $('#tblResults').show();
    $('#resultsGroup').html(html);
    $('#resultsTable').html(table);

    $('.btn-clone').unbind();
    $('.btn-clone').click(function(e) {
      $('#title').val(window.hitCache[$(this).attr('data')].title);
      let tags = window.hitCache[$(this).attr('data')].tags;
      let ts = '';
      for(let j=0;j<tags.length;j++) {
        ts += tags[j]
        if(j < tags.length -1) ts +=", ";
      }
      $('#tags').val(ts);
      $('#description').val(window.hitCache[$(this).attr('data')].description);
      $('#unit').val(window.hitCache[$(this).attr('data')].unit);
      $('#co2eq').val(window.hitCache[$(this).attr('data')].co2eq);
      $('#sourceurl').val(window.hitCache[$(this).attr('data')].sourceurl);
      $('#lang').val(window.hitCache[$(this).attr('data')].lang);
      var myModal = new bootstrap.Modal($(modal_add))
      myModal.show()
  });
  $('.btn-shop').click(function(e) {
    $('.activityTitle').html(window.hitCache[$(this).attr('data')].title);
    $('.activityDescription').html(window.hitCache[$(this).attr('data')].description);
    $('#unit').val(window.hitCache[$(this).attr('data')].unit);
    $('#co2eq').val(window.hitCache[$(this).attr('data')].co2eq);
    $('#sourceurl').val(window.hitCache[$(this).attr('data')].sourceurl);
    $('#lang').val(window.hitCache[$(this).attr('data')].lang);
    $('#shopunits').empty();
    if( window.hitCache[$(this).attr('data')].unit == 'yr') {
      $('#shopunits').unbind();
      $('#shopunits').attr('data-unit','yr');
      $('#shopunits').attr('data-co2',window.hitCache[$(this).attr('data')].co2eq);
      let html = '';
      html += '<option value="1" selected="selected">Year</option>';
      html += '<option value="0.083333333">Month</option>';
      html += '<option value="0.019230769">Week</option>';
      html += '<option value="0.002739726">Day</option>';
      html += '<option value="0.000114155">Hour</option>';
      $('#shopunits').html(html);
      $('#shopunits').change(function() {
        recalcCO2();
      });
      recalcCO2();
    }
    if( window.hitCache[$(this).attr('data')].unit == 'kwh') {
      $('#shopunits').unbind();
      $('#shopunits').attr('data-unit','kwh');
      $('#shopunits').attr('data-co2',window.hitCache[$(this).attr('data')].co2eq);
      let html = '';
      html += '<option value="1" selected="selected">kWh</option>';
      $('#shopunits').html(html);
      $('#shopunits').change(function() {
        recalcCO2();
      });
      recalcCO2();
    }
    if( window.hitCache[$(this).attr('data')].unit == 'pc') {
      $('#shopunits').unbind();
      $('#shopunits').attr('data-unit','pc');
      $('#shopunits').attr('data-co2',window.hitCache[$(this).attr('data')].co2eq);
      let html = '';
      html += '<option value="1" selected="selected">pcs</option>';
      $('#shopunits').html(html);
      $('#shopunits').change(function() {
        recalcCO2();
      });
      recalcCO2();
    }
    if( window.hitCache[$(this).attr('data')].unit == 'km') {
      $('#shopunits').unbind();
      $('#shopunits').attr('data-unit','km');
      $('#shopunits').attr('data-co2',window.hitCache[$(this).attr('data')].co2eq);
      let html = '';
      html += '<option value="1" selected="selected">km</option>';
      html += '<option value="0.6213">mi</option>';
      $('#shopunits').html(html);
      $('#shopunits').change(function() {
        recalcCO2();
      });
      recalcCO2();
    }
    if( window.hitCache[$(this).attr('data')].unit == 'kg') {
      $('#shopunits').unbind();
      $('#shopunits').attr('data-unit','kg');
      $('#shopunits').attr('data-co2',window.hitCache[$(this).attr('data')].co2eq);
      let html = '';
      html += '<option value="1" selected="selected">kg</option>';
      html += '<option value="1000" >g</option>';
      html += '<option value="0.001">t</option>';
      $('#shopunits').html(html);
      $('#shopunits').change(function() {
        recalcCO2();
      });
      recalcCO2();
    }
    if( window.hitCache[$(this).attr('data')].unit == 't') {
      $('#shopunits').unbind();
      $('#shopunits').attr('data-unit','t');
      $('#shopunits').attr('data-co2',window.hitCache[$(this).attr('data')].co2eq);
      let html = '';
      html += '<option value="1" selected="selected">t</option>';
      html += '<option value="1000" >kg</option>';
      html += '<option value="1000000">g</option>';
      $('#shopunits').html(html);
      $('#shopunits').change(function() {
        recalcCO2();
      });
      recalcCO2();
    }
    if( window.hitCache[$(this).attr('data')].unit == 'l') {
      $('#shopunits').unbind();
      $('#shopunits').attr('data-unit','l');
      $('#shopunits').attr('data-co2',window.hitCache[$(this).attr('data')].co2eq);
      let html = '';
      html += '<option value="1" selected="selected">l</option>';
      html += '<option value="0.264" >gl</option>';
      $('#shopunits').html(html);
      $('#shopunits').change(function() {
        recalcCO2();
      });
      recalcCO2();
    }
    var myModal = new bootstrap.Modal($(modal_shop))
    myModal.show()
  });
  }

  $('#frm_search').ajaxForm();

  $('#frm_search').on('submit', function(e) {
    e.preventDefault(); // prevent native submit
    $(this).ajaxSubmit({
        success:processResults
    })
  });

  $('#frm_addActivity').ajaxForm();

  $('#frm_addActivity').on('submit', function(e) {
    e.preventDefault(); // prevent native submit
    $(this).ajaxSubmit({
        success:function(d) {
          location.reload();
        }
    })
  });

  $('#qty').change(recalcCO2);

  $('#unit').change(unitChange);

  if(window.localStorage.getItem("account") == null) {
      $.getJSON("https://api.corrently.io/v2.0/stromkonto/create",function(data) {
          window.localStorage.setItem("account",data);
          $('#account').val(data);
      });
  } else {
    $('#account').val(window.localStorage.getItem("account"));
  }
  const browserLang = navigator.language || navigator.userLanguage;
  let lng = 'en';
  if(browserLang.substring(0,2) == 'de') lng = 'de';

  $('.fldlang').val(lng);
});
