function googl(url, cb) {
  jsonlib.fetch({
    url: 'https://www.googleapis.com/urlshortener/v1/url',
    header: 'Content-Type: application/json',
    data: JSON.stringify({longUrl: url})
  }, function (m) {
    var result = null;
    try {
      result = JSON.parse(m.content).id;
      if (typeof result != 'string') result = null;
    } catch (e) {
      result = null;
    }
    cb(result);
  });
}
