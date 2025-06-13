const API = 'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2T0RRNE5qVTRMQ0p1WVcxbElqb2lNVFk0T0RFME16RTBOeTQyT0RrMk5qa2lmUS56MWtlOXpxYVRic0ZxYko2R0xmV01obExGT2x2YW1kSnlOb2owMjVFMGstZmQ4S2hEN3dhc0tia05DT2RLYVVpSV9tR2RJWmNqS2ZrdXFDX0hGby1pUQ=='
// const amount = document.getElementById('amount');

console.log('paymob.js loaded');
async function firststep(user_email,amount=0){
    console.log('firststep() called');
    let data = {
        "api_key":API
    }
    let request = await fetch('https://accept.paymob.com/api/auth/tokens',{
        method : 'post',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify(data)
    })
    let response = await request.json()
    let token = response.token
    secondstep(user_email,token,amount);
}

async function secondstep(user_email,token,amount){
    amount*=100;

    let data = {
        "auth_token": token,
        "delivery_needed": "false",
        "amount_cents": amount,
        "currency": "EGP",
        "items": [],

    }
    let request = await fetch('https://accept.paymob.com/api/ecommerce/orders',{
        method : 'post',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify(data)
    })
    let response = await request.json()
    // console.log(response)
    let id = response.id
    thirdstep(token,id,amount,user_email)
}
async function thirdstep(token,id,amount,user_email){
    let data = {
        "auth_token": token,
        "amount_cents": amount,
        "expiration": 3600,
        "order_id": id,
        "billing_data": {
          "apartment": "803",
          "email": user_email,
          "floor": "42",
          "first_name": "Clifford",
          "street": "Ethan Land",
          "building": "8028",
          "phone_number": "+86(8)9135210487",
          "shipping_method": "PKG",
          "postal_code": "01898",
          "city": "Jaskolskiburgh",
          "country": "CR",
          "last_name": "Nicolas",
        "state": "Utah"
        },
        "currency": "EGP",
        "integration_id": 3994504
      }

    let request = await fetch('https://accept.paymob.com/api/acceptance/payment_keys',{
        method : 'post',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify(data)
    })
    let response = await request.json()
    let Thetoken = response.token
    // console.log(Thetoken)
    cardpayment(Thetoken)
}
async function cardpayment(Thetoken){
    let iframeURL = `https://accept.paymob.com/api/acceptance/iframes/771124?payment_token=${Thetoken}`
    location.href = iframeURL
}
