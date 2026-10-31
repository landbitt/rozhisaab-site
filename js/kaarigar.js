/* Fill these two from the Supabase project (Settings > API). The anon key is public by design. */
const SB_URL = 'https://bbuixnyompmraelkjlvr.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJidWl4bnlvbXBtcmFlbGtqbHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0Mzg0NjcsImV4cCI6MjEwODAxNDQ2N30.LeH8GJ6Nzku8CU3d3dQiQhoWDeBxAdIvPj8fFEDxSWg';

const CATS = [['plumber','Plumber','प्लंबर'],['electrician','Electrician','इलेक्ट्रीशियन'],['carpenter','Carpenter','बढ़ई'],['ac','AC repair','एसी रिपेयर'],['ro','RO and water','आरओ / पानी'],['appliance','Appliances','उपकरण रिपेयर'],['painter','Painter','पेंटर'],['pest','Pest control','पेस्ट कंट्रोल'],['mechanic','Mechanic','मैकेनिक'],['cleaning','Cleaning','सफ़ाई'],['tutor','Home tutor','होम ट्यूटर'],['other','Other','अन्य']];
const $ = (id) => document.getElementById(id);
$('cats').innerHTML = CATS.map(([k, en, hi]) => `<label><input type="radio" name="cat" value="${k}"><span>${en}<br><small style="font-weight:400">${hi}</small></span></label>`).join('');
let loc = null;
{ const ty = new URLSearchParams(location.search).get('type'); const r = ty && document.querySelector('input[name=cat][value="' + ty.replace(/[^a-z]/g, '') + '"]'); if (r) r.checked = true; }
const setAbout = () => { const c = (document.querySelector('input[name=cat]:checked') || {}).value; $('about').placeholder = c === 'tutor' ? 'e.g. Maths and Science, Class 6 to 10, home visits in the evening' : 'e.g. Bathroom fittings, motor repair, available on Sundays'; };
$('cats').addEventListener('change', setAbout); setAbout();
$('locBtn').onclick = () => {
  if (!navigator.geolocation) { $('locTxt').textContent = 'Location is not available on this phone.'; return; }
  $('locTxt').textContent = 'Finding your location…';
  navigator.geolocation.getCurrentPosition(
    (p) => { loc = { lat: +p.coords.latitude.toFixed(3), lng: +p.coords.longitude.toFixed(3) }; $('locTxt').textContent = 'Location added ✓'; },
    () => { $('locTxt').textContent = 'Could not get location. Pincode is enough.'; },
    { enableHighAccuracy: false, timeout: 12000, maximumAge: 600000 });
};
const fail = (t) => { const m = $('msg'); m.textContent = t; m.className = 'msg full err'; m.scrollIntoView({ block: 'center', behavior: 'smooth' }); };
const digits = (x) => x.replace(/\D/g, '').slice(-10);
$('f').onsubmit = async (e) => {
  e.preventDefault(); $('msg').className = 'msg full';
  const cat = (document.querySelector('input[name=cat]:checked') || {}).value;
  const body = {
    p_name: $('name').value.trim(), p_category: cat || '', p_phone: digits($('phone').value), p_whatsapp: digits($('wa').value),
    p_city: $('city').value.trim(), p_area: $('area').value.trim(), p_pincode: $('pin').value.trim(),
    p_lat: loc ? loc.lat : null, p_lng: loc ? loc.lng : null, p_charge: $('charge').value.trim(),
    p_experience: $('exp').value === '' ? null : +$('exp').value, p_about: $('about').value.trim(), p_consent: $('consent').checked,
  };
  if (body.p_name.length < 2) return fail('Please enter your name or business name. / अपना नाम लिखें।');
  if (!cat) return fail('Please choose your work. / अपना काम चुनें।');
  if (!/^[6-9]\d{9}$/.test(body.p_phone)) return fail('Please enter a valid 10-digit mobile number. / सही मोबाइल नंबर लिखें।');
  if (body.p_city.length < 2) return fail('Please enter your city or town. / शहर लिखें।');
  if (!/^[1-9]\d{5}$/.test(body.p_pincode)) return fail('Please enter a valid 6-digit pincode. / सही पिनकोड लिखें।');
  if (!body.p_consent) return fail('Please tick the box to agree. / सहमति के बॉक्स पर टिक करें।');
  if (SB_URL.startsWith('REPLACE')) return fail('Registration opens soon. Please WhatsApp us for now.');
  $('go').disabled = true; $('go').textContent = 'Listing you…';
  try {
    const r = await fetch(SB_URL.replace(/\/$/, '') + '/rest/v1/rpc/register_helper', {
      method: 'POST', headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.message || 'Something went wrong. Please try again.'); }
    const text = `Namaste! I am now listed on Roz Hisaab as a ${CATS.find((c) => c[0] === cat)[1].toLowerCase()} in ${body.p_city}. Download the free app to find me and other trusted kaarigars near you: https://rozhisaab.in`;
    $('share').href = 'https://wa.me/?text=' + encodeURIComponent(text);
    $('f').style.display = 'none'; $('ok').style.display = 'block'; window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    fail(err.message);
  } finally { $('go').disabled = false; $('go').textContent = 'List me free · मुफ़्त लिस्ट करें'; }
};
