$(document).ready(function() {
  const getUrlVars = function()
  {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }

  $('.loggedout').hide();

  if(typeof getUrlVars().account !== 'undefined') {
       window.localStorage.setItem("account",getUrlVars().account);
      $('#account').val(getUrlVars().account);
      $('.isloggedout').hide();
      $('.isloggedin').show();
  } else {
      $.getJSON("https://api.corrently.io/v2.0/stromkonto/create",function(session) {
        $('#loginlink').attr('href','https://api.corrently.io/auth/google/?&redirect='+encodeURIComponent(location.href)+"&session="+session);
        window.localStorage.setItem("session",session);
        $('.sessionfld').val(session);
        $('.redirectfld').val(location.href);
        $('.isloggedout').show();
        $('.isloggedin').hide();
      });
      if(window.localStorage.getItem("account") == null) {
          $.getJSON("https://api.corrently.io/v2.0/stromkonto/create",function(data) {
              window.localStorage.setItem("account",data);
              $('#account').val(data);
          });
      } else {
        $('#account').val(window.localStorage.getItem("account"));
      }
  }
  if(window.localStorage.getItem("account") !== null) {
      $.getJSON("https://api.corrently.io/v2.0/co2/credits?account="+window.localStorage.getItem("account"),function(data) {
          $('.credits').html(data.balance);
          $('#fldcredits').val(data.balance);
      });
  }
});
