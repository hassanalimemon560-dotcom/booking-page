// AUTH with Hint
let loginAttempts = 0;
function login(){
  if(username.value==='muzammil' && password.value==='0000'){
    loginCard.classList.add('hidden');
    panel.classList.remove('hidden');
    document.getElementById('hint').innerText = '';
    loginAttempts = 0;
  } else {
    loginAttempts++;
    alert('Invalid Login');
    if(loginAttempts >= 3){
      document.getElementById('hint').innerText = 'Hint: Default username is muzammil password is 0000';
    }
  }
}
function logout(){ location.reload(); }

// ORDERS (LOCAL STORAGE)
let orders = JSON.parse(localStorage.getItem('ups_orders')) || [];
function save(){ localStorage.setItem('ups_orders', JSON.stringify(orders)); }

// PRICE SETTINGS
const PRICE_MAP = {
  "1.5 Liter": 120,
  "500 ML": 60
};
size.onchange = quantity.oninput = calcPrice;
function calcPrice(){
  const rate = PRICE_MAP[size.value] || 0;
  const qty = Number(quantity.value || 0);
  price.value = rate && qty ? `Rs ${rate * qty}` : '';
}

function addOrder(){
  const totalPrice = (PRICE_MAP[size.value]||0) * Number(quantity.value||0);
  const order={
    name:name.value,
    mobile:mobile.value,
    product:product.value,
    size:size.value,
    quantity:quantity.value,
    price: totalPrice,
    address:address.value,
    date:new Date().toLocaleDateString()
  };
  orders.push(order);
  save();
  render();
  name.value=mobile.value=product.value=size.value=quantity.value=price.value=address.value='';
}

function removeOrder(i){ orders.splice(i,1); save(); render(); }

function render(){
  const ordersDiv = orders.map((o,i)=>
    `<div class='order'>
      <div>
        <b>${o.name}</b><br>
        📞 ${o.mobile}<br>
        📦 ${o.product} (${o.size}) x ${o.quantity}<br>
        💰 Rs ${o.price}<br>
        📍 ${o.address}<br>
        📅 ${o.date}
      </div>
      <div>
        <button onclick='printOrder(${i})'>Print</button>
        <button onclick='shareWA(${i})'>WhatsApp</button>
        <button class='danger' onclick='removeOrder(${i})'>Delivered</button>
      </div>
    </div>`
  ).join('');

  document.getElementById('orders').innerHTML = ordersDiv;
  report.innerText = 'Today Orders: ' + orders.filter(o=>o.date===new Date().toLocaleDateString()).length;
}

function printOrder(i){
  const o=orders[i];
  const w=window.open('');
  w.document.write(`<h2>Ultra Pure Sip</h2><p>${o.name}<br>${o.mobile}<br>${o.product} (${o.size}) x ${o.quantity}<br>💰 Rs ${o.price}<br>${o.address}</p>`);
  w.print();
}

function shareWA(i){
  const o=orders[i];
  window.open(`https://wa.me/?text=Order%20from%20Ultra%20Pure%20Sip%0A${o.name}%0A${o.mobile}%0A${o.product}%20(${o.size})%20x%20${o.quantity}`);
}

// LANGUAGE
const lang={
  ur:{t_new:'نیا آرڈر',t_orders:'آرڈرز'},
  ru:{t_new:'Naya Order',t_orders:'Orders'},
  en:{t_new:'New Order',t_orders:'Orders'}
};
function setLang(l){
  document.getElementById('t_new').innerText=lang[l].t_new;
  document.getElementById('t_orders').innerText=lang[l].t_orders;
}

render();