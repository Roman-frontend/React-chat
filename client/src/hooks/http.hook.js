export const reduxServer = async (url, token, method = 'GET', body = null) => {
  try {
    const headers = {};

    headers['authorization'] = token;

    if (body) {
      /**передаємо body на сервер як строку а не обєкт */
      body = JSON.stringify(body);
      /**Щоб на сервері пирйняти json */
      headers['Content-Type'] = 'application/json';
    }

    console.log('http req ', url, { method, body, headers });
    const response = await fetch(url, { method, body, headers });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Щось пішло не так ');
    }

    console.log('http data ', data);
    return data;
  } catch (e) {
    console.log('http response error ', e);
    if (url.match(/\/api\/chat\/post-message/gi)) {
      return { messages: '403' };
    } else return { e, messages: '403' };
    throw e;
  }
};
