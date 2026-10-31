// Invite links look like rozhisaab.in/?r=ROZABC12. Show the code and pass it to Google Play.
(function(){
  var m=/[?&]r=(ROZ[A-Z0-9]{3,12})\b/i.exec(location.search);if(!m)return;var code=m[1].toUpperCase();
  var box=document.getElementById('invite');box.style.display='block';
  box.innerHTML='Your friend invited you. Install Roz Hisaab from this page and the code <b>'+code+'</b> is added for you. If it is not, enter it in <strong>Profile &gt; Invite and earn</strong>. You both get 1 month of Family Pro free.';
  var a=document.getElementById('play');a.href+='&referrer='+encodeURIComponent('utm_source=invite&utm_campaign='+code);
  try{navigator.clipboard&&navigator.clipboard.writeText(code)}catch(e){}
})();

// Plan names and prices from the Roz Hisaab admin panel (plan_catalog). The prices written above stay if this fails.
(function(){
  fetch('https://bbuixnyompmraelkjlvr.supabase.co/rest/v1/rpc/plan_catalog',{method:'POST',headers:{'apikey':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidWl4bnlvbXBtcmFlbGtqbHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0Mzg0NjcsImV4cCI6MjEwODAxNDQ2N30.LeH8GJ6Nzku8CU3d3dQiQhoWDeBxAdIvPj8fFEDxSWg','Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidWl4bnlvbXBtcmFlbGtqbHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0Mzg0NjcsImV4cCI6MjEwODAxNDQ2N30.LeH8GJ6Nzku8CU3d3dQiQhoWDeBxAdIvPj8fFEDxSWg','Content-Type':'application/json'},body:'{}'})
  .then(function(r){return r.ok?r.json():null}).then(function(c){if(!c||!c.plans)return;
    Object.keys(c.plans).forEach(function(k){var p=c.plans[k],el=document.querySelector('[data-plan="'+k+'"]');if(!el||!p)return;
      if(p.enabled===false){el.style.display='none';return}
      var h=el.querySelector('h3');if(h&&p.title)h.textContent=p.title;
      var a=el.querySelector('.amt');if(a&&p.price_month!=null)a.innerHTML='\u20b9'+Number(p.price_month).toLocaleString('en-IN')+'<small style="font-size:15px">/month</small>';});
    if(c.trial_days){document.querySelectorAll('[data-trial]').forEach(function(e){e.textContent=c.trial_days})}
  }).catch(function(){});
})();
