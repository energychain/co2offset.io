

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
  $.getJSON("https://api.corrently.io/v2.0/stromkonto/create",function(session) {
    $('#loginlink').attr('href','https://api.corrently.io/auth/google/?&redirect='+encodeURIComponent(location.href)+"&session="+session);
    window.localStorage.setItem("session",session);
    $('.loggedout').show();
  });

  if(typeof getUrlVars().account !== 'undefined') {

    // $('.walletid').html("ID: "+getUrlVars().account);
  }
});
