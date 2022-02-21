// ライブラリの読み込み
const request = require('superagent');
const NCMB = require('ncmb');

// 定数を定義
const applicationKey = 'bc37c27bd86064fb7b6e3c3c5447a87f82900ce8544e836bf80b35c413e229a9';
const clientKey = '57f595bdb31ecf6a842025cb1acede7630f0708f57041d0ac612bcccc24f5c66';

// NCMBの準備
const ncmb = new NCMB(applicationKey, clientKey);
const Feed = ncmb.DataStore('Feed');
const Entry = ncmb.DataStore('Entry');

// メイン処理
module.exports = async (req, res) => {
  if (!req.query.url) {
    res.json({});
    return;
  }
  // キャッシュの検索
  const date = new Date;
  date.setHours(date.getHours() - 1);
  let feed = await Feed.equalTo('url', req.query.url).fetch();
  if (feed.objectId) {
    if (new Date(feed.fetchDate.iso) > date) {
      res.json({
        objectId: feed.objectId,
        nextFetchDate: new Date(feed.fetchDate.iso)
      });
      return;
    }
  } else {
    feed = new Feed;
    feed.set('url', req.query.url);
  }
  // フィードを取得
  const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURI(feed.url)}`;
  response = await request
    .get(url)
    .send();
  const json = await response.body;
  for (const key in json.feed) {
    if (key !== 'items' && key !== 'url') {
      feed.set(key, json[key]);
    }
  }
  feed.set('fetchDate', new Date);
  if (feed.objectId) {
    await feed.update();
  } else {
    await feed.save();
  }
  // フィールの中の記事を検索&登録
  const guids = json.items.map(item => item.guid);
  const entries = await Entry.in('guid', guids).limit(100).fetchAll();
  const promises = [];
  for (const item of json.items) {
    if (entries.filter(entry => entry.guid === item.guid).length > 0) {
      // すでにあるので無視
      continue;
    }
    const entry = new Entry;
    for (const key in item) {
      if (['created', 'updated', 'pubDate'].indexOf(key) > -1) {
        entry.set(key, new Date(item[key]));
      } else {
        entry.set(key, item[key]);
      }
    }
    promises.push(entry.set('feed', feed).save());
  }
  try {
    await Promise.all(promises);
    res.json({
      objectId: feed.objectId,
      nextFetchDate: feed.fetchDate
    });
  } catch (e) {
    console.log(e);
    res.json(e);
  }
}
