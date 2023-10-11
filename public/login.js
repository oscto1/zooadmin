$( ".input" ).focusin(function() {
    $( this ).find( "span" ).animate({"opacity":"0"}, 200);
  });
  
  $( ".input" ).focusout(function() {
    $( this ).find( "span" ).animate({"opacity":"1"}, 300);
  });
  
  $(".login").submit(async function(){
    // e.preventDefault();
    $(this).find(".submit i").removeAttr('class').addClass("fa fa-check").css({"color":"#fff"});
    $(".submit").css({"background":"#2ecc71", "border-color":"#2ecc71"});
    // $(".feedback").show().animate({"opacity":"1", "bottom":"-80px"}, 400);
    $("input").css({"border-color":"#2ecc71"});
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.status === 200) {
        console.log(getCookie("rol"));
        if(getCookie("rol")==="admin"){
           window.location.href = '/admin/lista-cuidadores.html'; // Redirect to dashboard or home page
        }else{
          console.log("TODO"); // Redirect to dashboard or home page
        }
        // Successful login
        // window.location.href = '/admin/agregar-cuidador.html'; // Redirect to dashboard or home page
    } else {
        // Failed login
        document.getElementById('error-message').textContent = data.error;
    }


  });

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }