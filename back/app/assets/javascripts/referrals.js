function getCsrfToken() {
  var res = {};
  var metas = document.getElementsByTagName('meta');

  for (var i=0; i<metas.length; i++) {
    if (metas[i].getAttribute("name") === "csrf-param") {
      res.param = metas[i].getAttribute("content");
    }

    if (metas[i].getAttribute("name") === "csrf-token") {
      res.value = metas[i].getAttribute("content");
    }
  }

  return res;
}

function addCsrfParam(dto) {
  var csrfToken = getCsrfToken();

  if (csrfToken.param && csrfToken.value) {
    dto[csrfToken.param] = csrfToken.value;
  }

  return dto;
}


function saveReferralToken(token) {
  return localStorage.setItem('__bettermask_referral_token__', token)
}

function getReferralToken() {
  return localStorage.getItem('__bettermask_referral_token__')
}

function createPendingReferral(data) {
  var dto = addCsrfParam(data);
  return axios.post('/referrals', dto);
}

function claimReferralToken(token) {
  var dto = addCsrfParam({ token: token });
  return axios.post('/referral_tokens/claim', dto);
}
