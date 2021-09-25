$(document).ready(function() {
  window.hitCache = {};
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

  const processResults = async function(d) {
    $('#resultsGroup').empty();
    let html = '';
    for(let i=0;i<d.length;i++) {
      let hit = d[i]._source;
      window.hitCache[hit.activity] = hit;

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
      html += ' <button type="button" style="float:right" data="'+hit.activity+'" class="btn btn-sm btn-succcess btn-clone semi-white w-100"><i class="far fa-clone"></i></button>';
      html += ' <button type="button" style="float:right" data="'+hit.activity+'" class="btn btn-sm btn-succcess btn-shop semi-white w-100"><i class="fas fa-shopping-cart"></i></button>'
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
    $('#btn_missing').show();
    $('#resultsGroup').html(html);
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
    })
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


  $('#unit').change(unitChange);

  if(window.localStorage.getItem("account") == null) {
      $.getJSON("https://api.corrently.io/v2.0/stromkonto/create",function(data) {
          window.localStorage.setItem("account",data);
          $('#account').val(data);
      });
  } else {
    $('#account').val(window.localStorage.getItem("account"));
  }

});
