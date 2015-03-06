# HTTP2 for front-end web developers

# フロントエンドWebディベロッパーのためのHTTP2

HTTP2 will mean a change in how we should build websites. The best practices of HTTP1 are harmful in a HTTP2 world.

HTTP2は我々開発者のWebサイト作成の常識を変えるだろう。HTTP1におけるベストプラクティスはHTTP2の世界では害になってしまう。

### HTTP1 is slow and inefficient for the majority of today's use cases on the web.

### HTTP1は今日におけるWebの大半において遅く非効率である

HTTP1.x is the version of HTTP we are all familiar with. It's an old protocol that was designed before we knew what the world wide web would become. While it does the job, it's just not very efficient at it anymore because what we demand of it is quite a lot more complex than what it was designed for.

HTTP1.xは私達が最も慣れ親しんでいるHTTPのバージョンだ。HTTP1.xは、ワールドワイドウェブがどのようになるか予想できなかったときに設計された古いプロトコルである。設計以上に複雑なことを我々が求めている以上、その振る舞いは既に充分なものではない。

To get websites to load in an acceptable time using HTTP1 we have developed a series of techniques; hacks really; to eke performance out of this old protocol. They are:

HTTP1上で許容できるロード時間でWebを提供するために、この古いプロトコルでパフォーマンスを発揮するための、いくつかのハックとも言えるテクニックを施してきた。

- Spriting: taking multiple images, combining them into one image, and using CSS to only show part of that image in a particular place.
- Concatenating: Taking multiple CSS or JS files and sticking them into one large file.
- Serving assets from a cookie-less domain.
- Sharding: creating different domains or sub-domains to host assets like images.

- Spriting: 複数の画像を扱う場合はそれらを1つに結合し、CSSによって画像の特定の位置を表示する
- Concatenating: 複数のCSSやJSファイルは、結合して1つの大きなファイルにする
- クッキーを利用しないドメインからアセットを配信する
- Sharding: 画像のようなアセットを複数のドメイン・サブドメインでホストする

The first two techniques are aimed at avoiding multiple HTTP requests. In HTTP1 a request is a very costly thing and takes a lot of time, each request may be loaded down with cookies that must be sent as part of the request, and none of it is compressed. It's faster to lump a bunch of things together and get it all done in one go than to keep asking for different resources.

はじめの2つのテクニックはHTTPリクエストを削減するためのものだ。HTTP1においてリクエストは高価なうえ時間を要する。それぞれのリクエストは、リクエストの一部に含めるためにクッキーがロードされるし、圧縮もされない。そのため、1つにまとめてしまうほうが異なるリソースを要求するより高速になる。

The third technique is used to minimise the time required to get assets; cookies, if set, must be sent to the requested domain along with every request - that adds up to a lot of 'wasted' space on the line. If your assets are on a different domain that doesn't use cookies, then requests for those files won't need to send cookies with them, and it's all a bit faster.

3つ目のテクニックは要求されたアセットを取得するための時間を短縮するためだ。クッキーが設定されていると、そのドメインへのリクエスト全てに付与されなければならないので、貴重なネットワークラインにおいて無駄なスペースを占めてしまう。クッキーが使われないドメインでアセットを配信すれば、それらへのリクエストへクッキーが付与されないので、少し高速になる。

The last technique, sharding, is because browsers used to only allow two simultaneous HTTP requests per domain. If you create a new domain for some of your assets, then you double the amount of simultaneous connections the browser will allow in order to get your files. Thus, you can pull the website content down faster. In reality, sharding hasn't been too useful in the last couple of years because browser vendors decided the 'two connections' restriction was daft, and they ignored it.

最後のテクニックのシャーディングは、ブラウザがひとつのドメインに対し2つのHTTPリクエストしか実行できないという制限に対してのものだ。もしアセットに対し新しくドメインを作れば、ブラウザがアセットを取得するときのコネクションは倍になる。そのため、Webコンテンツをより早く送り届けることが可能になるのだ。実際には、ブラウザがドメインにつき2コネクションという制限を解放したため、ここ2年間でシャーディングは非常に有効な手段となった。

## HTTP2

### Do not use those HTTP1 based best practices with a website being served over HTTP2.

### HTTP2で配信されるWebサイトに、HTTP1におけるベストプラクティスは使ってはならない

HTTP2 is almost here, it's based on SPDY, and it makes everything much more efficient. It also means that all of those HTTP1 performance techniques are harmful. They will make a HTTP2 website slower, not faster - don't use them.

HTTP2はもうすぐそこだ。HTTP2はSPDYがベースとなっていて、全てがより効率的になる。また、これはHTTP1において有効であったパフォーマンステクニックが害になることを意味している。HTTP2向けのWebサイトを遅くすることはあっても、速くすることにはならない。HTTP2においては使わないことだ。

HTTP2 makes the cost of multiple requests far less because of a number of techniques it does itself.

HTTP2は複数リクエストをプロトコルレベルで最適化し、発生するコストを小さなものにする。

- It can leave the connection open for re-use for very extended periods of time, so there's no need for that costly handshake that HTTP1 requires for every request.
- HTTP2 also uses compression, unlike HTTP1, and so the size of the request is significantly smaller - and thus faster.
- HTTP2 multiplexes; it can send and receive multiple things at the same time over one connection.

- HTTP2では開いたコネクションを再利用のために長い期間維持することが出来るため、HTTP1においてリクエストの度に必要だったハンドシェイクはなくなる
- HTTP1とは異なり圧縮を使うので、リクエストのサイズがかなり小さくなる。結果、高速になる
- HTTP2の多重送信では1つのコネクションで複数の送受信を行う

All that means not only are the old HTTP1 techniques not needed, they'll actually make things slower. You may be loading assets that are not required for the page being viewed (concatenation and spriting are likely to do this), and sharding invokes DNS lookups which slow things down, despite HTTP2 meaning you don't need to shard in the first place.

これらの意味するところはHTTP1におけるテクニックは必要なくなるということであり、むしろ遅くしてしまうということだ。（ファイルの結合やスプライトによって）閲覧中のページには不要なアセットをロードし、シャーディングはDNSルックアップを引き起こす（シャーディングもHTTP2ならその必要がないのにも関わらず、だ）。

The long and short of it is; when you build a front-end to a website, and you know it's going to be served over HTTP2 - you need to ensure you're not using legacy HTTP1 performance techniques that are going to harm the site under HTTP2.

これからWebサイトを構築する際にはHTTP2で配信していくことも検討しよう。そしてその時は、HTTP2においては害となってしまうHTTP1のパフォーマンスのテクニックは使わないようにしなければならない。