$(document).ready(async function() {

  let lastFetch = new Date().getTime();

  const getSuggestions = function(query) {
    return new Promise((resolve,reject) => {
      let nextFetch = new Date().getTime()-(lastFetch+1000);
      if(nextFetch>0)  { nextFetch = 1; } else { lastFetch = new Date().getTime() + 1000; }
      console.log(nextFetch);
      setTimeout(function() {
        $.getJSON("https://api.corrently.io/v2.0/co2/activitySuggestion?lang="+$('#lang').val()+"&query="+encodeURIComponent(query),function(data) {
            lastFetch = new Date().getTime();
            resolve(data);
        })
    },Math.abs(nextFetch));
    });
  }
  const getCategoryPath = function(query) {
    return new Promise((resolve,reject) => {
      let nextFetch = new Date().getTime()-(lastFetch+1000);
      if(nextFetch>0)  { nextFetch = 1; } else { lastFetch = new Date().getTime() + 1000; }
      console.log(nextFetch);
      setTimeout(function() {
        $.getJSON("https://api.corrently.io/v2.0/co2/categoryPath?lang="+$('#lang').val()+"&category="+encodeURIComponent(query),function(data) {
            lastFetch = new Date().getTime();
            resolve(data);
        })
    },Math.abs(nextFetch));
    });
  }
  const getCategorySuggestions = function(query) {
    return new Promise((resolve,reject) => {
      let nextFetch = new Date().getTime()-(lastFetch+1000);
      if(nextFetch>0)  { nextFetch = 1; } else { lastFetch = new Date().getTime() + 1000; }
      if((typeof query !== 'undefined ') && (query !== null) && (query.length > 0)) {
        setTimeout(function() {
          $.getJSON("https://api.corrently.io/v2.0/co2/categorySuggestion?lang="+$('#lang').val()+"&query="+encodeURIComponent(query),function(data) {
              lastFetch = new Date().getTime();
              resolve(data);
          })
        },Math.abs(nextFetch));
      } else {
        resolve([]);
      }
    });
  }
  const suggestTitle = async function() {
    $('.ef_input').attr('disabled','disabled');
    $('#suggestTitle').empty();


    $('#suggestCategory').empty();
    let html_categories = '<option value="_add">+ add new</option>';
    $('#suggestCategory').html(html_categories);
    $('.suggestions').show();
    if($('#title').val().length>3) {
        getSuggestions($('#title').val()).then(async function(data) {
          window.currentActivities=data;
          let html_titles = '';
          for(let i=0;i<data.length;i++) {
            html_titles += '<option value="'+data[i].activity+'">'+data[i].title+'</option>';
          }
          html_titles += '<option value="_add">+ add new</option>';
          if(data.length>0) {

            if(typeof data[0].category !== 'undefined') {
              let cats = await getCategorySuggestions(data[0].category);
              if((cats.length>0)&&(typeof cats[0].title !=='undefined')) {
                $('#categoryinput').val(cats[0].title);
                $('#categoryinput').attr('disabled','disabled');
                $('#pathCategory').html(await getCategoryPath(data[0].category));
              }

              $('#category').val(data[0].category);
            }
          }
          $('#suggestTitle').html(html_titles);
          $('#refinebtn').removeAttr('disabled');
        })
    } else {
        $('#refinebtn').attr('disabled','disabled');
    }
    refineActivity();
    $('#categoryinput').val('');
    $('#suggestCategory').hide();
  }

  const ldsuggestCategory = async function() {
    console.log("Suggest Cat");
    $('.ef_input').attr('disabled','disabled');
    $('#suggestCategory').empty();
    $('#suggestCategory').hide();
    $('.suggestions').show();
    if($('#categoryinput').val().length>3) {
        getCategorySuggestions($('#categoryinput').val()).then(function(data) {
          window.currentCategories=data;
          if(data.length > 0) {
            let html_titles = '';
            for(let i=0;i<data.length;i++) {
              html_titles += '<option value="'+data[i].category+'">'+data[i].title+'</option>';
            }
            html_titles += '<option value="_add">+ add new</option>';
            $('#suggestCategory').html(html_titles);
            $('#refinebtn').removeAttr('disabled');
            $('#suggestCategory').show();
          }
        });
    } else {
        $('#refinebtn').attr('disabled','disabled');
    }
    refineActivity();
  }
  const suggestTopCategory = async function() {
    $('.ef_input').attr('disabled','disabled');
    $('#suggestTopCategory').empty();
    $('.suggestions').show();
    if($('#topCategory').val().length>3) {
        getCategorySuggestions($('#topCategory').val()).then(function(data) {
          window.currentTopCategories=data;
          let html_titles = '';
          for(let i=0;i<data.length;i++) {
            html_titles += '<option value="'+data[i].category+'">'+data[i].title+'</option>';
          }
          $('#suggestTopCategory').html(html_titles);
          $('.pec').show();
          $('.pec').removeAttr('disabled');
          $('#refinebtn').removeAttr('disabled');
          console.log('Refined with',data);
        });
    } else {

    }
    refineActivity();
  }
  const updateUnit = async function() {
      $('.text-unit').html($("#unit option:selected" ).text())
  }

  const addCategory = function() {
    return new Promise((resolve,reject) => {
      let category = {
        account:$('#account').val(),
        title:$('#categoryinput').val(),
        parent:$('#suggestTopCategory').val(),
        lang:$('#lang').val()
      }

      $.ajax({
          type: "POST",
          url: "https://api.corrently.io/v2.0/co2/addCategory",
          data: category,
          dataType: "json",
          success: function(data){
            $('#category').val(data.category);
            console.log(data),
            resolve(data);
          },
          error: function(errMsg) {
              console.log(errMsg);
          }
      });
    });
  }
  const addActivity = function() {
    return new Promise((resolve,reject) => {
      let activity = {
        account:$('#account').val(),
        title:$('#title').val(),
        category:$('#category').val(),
        sourceurl:$('#sourceurl').val(),
        co2:$('#co2').val(),
        unit:$('#unit').val(),
        lang:$('#lang').val(),
        note:$('#note').val()
      }

      $.ajax({
          type: "POST",
          url: "https://api.corrently.io/v2.0/co2/addActivity",
          data: activity,
          dataType: "json",
          success: function(data){
            $('#activity').val(data.activity);
            resolve(data);
          },
          error: function(errMsg) {
              console.log(errMsg);
          }
      });
    });
  }

  const refineCategory = async function(e) {
    if(typeof window.currentCategories !== 'undefined') {
      let found = false;
      for(let i=0;i<window.currentCategories.length;i++) {
        if(window.currentCategories[i].category == $('#suggestTopCategory').val()) {
          found=true;
          $('#topCategory').val(window.currentCategories[i].title);
        }
      }
    }
  }
  const refineActivity = async function(e) {
    if(typeof window.currentActivities !== 'undefined') {
      let found = false;
      for(let i=0;i<window.currentActivities.length;i++) {
        if(window.currentActivities[i].activity == $('#suggestTitle').val()) {
          $('#category').val(window.currentActivities[i].category);
          let categorymetas = await getCategorySuggestions(window.currentActivities[i].category);
          for(let j=0;j<categorymetas.length;j++) {
            if(categorymetas[j].category == window.currentActivities[i].category) {
              $('#categoryinput').val(categorymetas[j].title);
              $('#categoryinput').attr('disabled','disabled');
              $('#suggestCategory').hide();
              $('.pec').hide();
              $('#applyCO2F').hide();
              found = true;
            }
          }
          $('#co2').val(window.currentActivities[i].co2);
          $('#sourceurl').val(window.currentActivities[i].sourceurl);
          $('#activity').val(window.currentActivities[i].activity);
          $('#unit option[value="'+window.currentActivities[i].unit+'"]').attr('selected','selected').change();
          //$('#unit').val(window.currentActivities[i].unit);
        }
      }
      if(!found) {
        $('#categoryinput').removeAttr('disabled');
        // $('#categoryinput').change();
        $('.pec').hide();
        // $('#suggestCategory').show();
        refineCategory();
      }
    }
    if(($('#suggestTitle').val() == null) || ($('#suggestTitle').val().length == 0) || ($('#suggestTitle').val() == '_add')) {
      if($('#title').val().length>3) {
        $('#refinebtn').removeAttr('disabled');
      } else {
        $('#refinebtn').attr('disabled','disabled');
      }
      // $('#categoryinput').change();
      $('#refinebtn').show();
      $('#applybtn').hide();
      $('#applyCO2F').show();
    } else {
      // removed
      $('#refinebtn').hide();
      $('#applybtn').show();
      $('#applyCO2F').hide();
    }
  }

  $('#refinebtn').attr('disabled','disabled');
  $('#refinebtn').click(function() {
    $('.ef_input').removeAttr('disabled');
    $('.activityinput').attr('disabled','disabled');
    $('#refinebtn').attr('disabled','disabled');
    $('#category').val($('#suggestCategory').val());
    if(($('#suggestCategory').val().length == 0) || ($('#suggestCategory').val() == '_add')) {
      $('.topCatSelection').show();
    } else {
      $('.topCatSelection').hide();
    }
  });

  if(window.localStorage.getItem("account") == null) {
      $.getJSON("https://api.corrently.io/v2.0/stromkonto/create",function(data) {
          window.localStorage.setItem("account",data);
          $('#account').val(data);
      });
  } else {
    $('#account').val(window.localStorage.getItem("account"));
  }

  $('#suggestTitle').change(function() {
    refineActivity();
    if($('#suggestTitle').val() == '_add') {
      $('#categoryinput').val('');
      $('#pathCategory').html('');
    }
  });
  $('#suggestTopCategory').change(refineCategory);
  $('#topCategory').change(suggestTopCategory);

  $('#categoryinput').change(ldsuggestCategory);
  $('#suggestCategory').change(function() {
    if($('#suggestCategory').val() == "_add") {
      $('.pec').show();
      $('.pec').removeAttr('disabled');
    } else {
      //$('.pec').removeAttr('disabled');
      $('.pec').hide();
    }
  });
  $('#unit').change(updateUnit);

  $('#title').on('keyup',suggestTitle);
  updateUnit();
  $('#applyCO2F').click(async function() {
    if($('#suggestCategory').val() == "_add") {
      await addCategory();
    }
    await addActivity();
  });
  $('#btnAddNote').click(async function() {
    $('#note').show();
    $('#btnAddNote').hide();
  });
  $('.ef_input').attr('disabled','disabled');
});
