$(document).ready(function() {
  let lastFetch = new Date().getTime();
  let selCatId = '';
  let catsCache = {};

  const getChilds = function(category) {
    return new Promise((resolve,reject) => {
      let nextFetch = new Date().getTime()-(lastFetch+1000);
      if(nextFetch>0)  { nextFetch = 1; } else { lastFetch = new Date().getTime() + 1000; }
      setTimeout(function() {
        if((typeof category !== 'undefined') && (category !== null)) {
          $.getJSON("https://api.corrently.io/v2.0/co2/categoryChilds?lang="+$('#lang').val()+"&category="+category,function(data) {
              lastFetch = new Date().getTime();
              resolve(data);
          })
        } else {
          $.getJSON("https://api.corrently.io/v2.0/co2/categoryChilds?lang="+$('#lang').val(),function(data) {
              lastFetch = new Date().getTime();
              resolve(data);
          })
        }
    },Math.abs(nextFetch));
    });
  }

  const getActivities = function(category) {
    return new Promise((resolve,reject) => {
      let nextFetch = new Date().getTime()-(lastFetch+1000);
      if(nextFetch>0)  { nextFetch = 1; } else { lastFetch = new Date().getTime() + 1000; }
      setTimeout(function() {
        if((typeof category !== 'undefined') && (category !== null)) {
          $.getJSON("https://api.corrently.io/v2.0/co2/categoryActivities?lang="+$('#lang').val()+"&category="+category,function(data) {
              lastFetch = new Date().getTime();
              resolve(data);
          })
        } else {
          $.getJSON("https://api.corrently.io/v2.0/co2/categoryActivities?lang="+$('#lang').val(),function(data) {
              lastFetch = new Date().getTime();
              resolve(data);
          })
        }
    },Math.abs(nextFetch));
    });
  }

  const addCatsToElement = async function(id,cats) {
    if((typeof id == 'undefined')||(id == null)||(id.length < 3)) return; else {
      console.log(id,cats);
      $('.'+id).empty();
      let html ='';
      for(let i=0;i<cats.length;i++) {
        catsCache[cats[i].category] = cats[i];
        html+='<li>';
        html+='<button type="button" class="btn btn-sm catsel" data="'+cats[i].category+'">';
        html+='<strong>';
        html+='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-node-plus-fill" style="margin-right: 5px;"><path d="M11 13a5 5 0 1 0-4.975-5.5H4A1.5 1.5 0 0 0 2.5 6h-1A1.5 1.5 0 0 0 0 7.5v1A1.5 1.5 0 0 0 1.5 10h1A1.5 1.5 0 0 0 4 8.5h2.025A5 5 0 0 0 11 13zm.5-7.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2a.5.5 0 0 1 1 0z"></path></svg>';
        html+=cats[i].title;
        html+="</strong>";
        html+="</button>";
        html+='<ul class="'+cats[i].category+'" id="'+cats[i].category+'"></ul>';
        let actions = await getActivities(cats[i].category);
        html += '<ul>'
        for(let j=0;j<actions.length;j++) {
          html += '<li>'
          html += '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" class="bi bi-calculator"><path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z"></path><path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-2zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v 1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-4z"></path></svg>';
          html += actions[j].title;
          html += '</li>';
        }
        html += '</ul>';
        html+='</li>';
      }
      $('#'+id).html(html);
      $('.catsel').unbind('click');
      $('.catsel').click(async function(e) {
        selCatId = $(e.currentTarget).attr('data');
        let cats = await getChilds(selCatId);
        addCatsToElement(selCatId,cats);
        $('#activeCategory').html(catsCache[selCatId].title);

      });
    }
  }

  const renderRoot = async function() {
    let topCats = await getChilds();
    addCatsToElement('pathTree',topCats);
  }

  const addCategory = function() {
    return new Promise((resolve,reject) => {
      let category = {
        account:$('#account').val(),
        title:$('#subcatTitle').val(),
        parent:selCatId,
        lang:$('#lang').val()
      }

      $.ajax({
          type: "POST",
          url: "https://api.corrently.io/v2.0/co2/addCategory",
          data: category,
          dataType: "json",
          success: async function(data){
            let cats = await getChilds(selCatId);
            addCatsToElement(selCatId,cats);
            if(typeof catsCache[selCatId] !== 'undefined') {
              $('#activeCategory').html(catsCache[selCatId].title);
            }
            location.reload();
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
        category:selCatId,
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
            location.reload();
            resolve(data);
          },
          error: function(errMsg) {
              console.log(errMsg);
          }
      });

    });
  }

  $('#btnSaveCat').click(function() {
    addCategory();
  });

  $('#saveActivity').click(function() {
    addActivity();
  });

  if(window.localStorage.getItem("account") == null) {
      $.getJSON("https://api.corrently.io/v2.0/stromkonto/create",function(data) {
          window.localStorage.setItem("account",data);
          $('#account').val(data);
      });
  } else {
    $('#account').val(window.localStorage.getItem("account"));
  }

  renderRoot();
});
