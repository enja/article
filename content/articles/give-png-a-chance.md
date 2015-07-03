---
title: Give PNG a chance
date: 2013-10-04
author: Stoyan Stefanov
translator: Shogo Sensui
site_url: http://calendar.perfplanet.com/
article_url: http://calendar.perfplanet.com/2009/give-png-a-chance/
---

みんな、「色んなブラウザで動かないから…」だとか「GIFよりファイルサイズが大きい」などと言ってPNGを選ばない。
確かに多少の真実はそこにはあるけど、ほとんどが誤解なんだ。誤解に目を向ける前に、PNG8とは何なのか、どんなにクールなのか知ってほしい。

## PNG8

PNGにもいくつか種類があり、次のどれかに分類できる。

+ アルファチャネルを持つことが可能なTrueColorのPNG。これらはPNG24、アルファチャネルのあるものはPNG32として知られている。
+ アルファチャネルを持つ、または持たないグレイスケールのPNG。
+ インデックスPNG、またはパレットPNG、あるいはPNG8

PNG8はGIFのようなものだ。256色のパレットを保持し、透過もサポートしている。
しかし、GIFが1ピクセルに透明か不透明かを表現できるのに対し、PNG8は段階的な透過度もサポートしている。
つまりGIFで出来ることはPNG8でもできるし、それ以上の表現をすることが可能だ。

IE6には欠陥があって、PNG8で半透明に表現している場所がIE6では完全に透明になってしまう。そう、GIFのように。
だから、プログレッシブ・エンハンスメントとしてのオプションがある。
同じ画像を利用していても、モダンブラウザでは完全に表現し、IE6ではGIFと同じように利用できるわけだ。

このサンプルを見て欲しい。[こちらの素晴らしい記事](http://www.sitepoint.com/png8-the-clear-winner/)からお借りしたものだ。
モダンブラウザで見ると、電球は輝きを放っている。

![](/images/give-png-a-chance/ie7.png)

IE6以下で見た場合には適切に機能を制限し、輝きの部分は表現されない。

![](/images/give-png-a-chance/ie6.png)

Photoshopがアルファチャネルを持ったPNG8を出力することができないのも辛いポイントだ。
(彼らがPNG8という名前を思いついてくれたおかげでパレットPNGやインデックスPNGと呼ばずに済んだが)
アルファチャネルを持つPNG8を出力できるのがFireworksだけ、というのもこの問題を少々難しくしてはいる。
そして、このPNG8を取り巻く状況を理解し、モダンブラウザでも、そうでなくても画像がきちんと表示できるようにする、という問題に対して取り組むデザイナーも必要になる。

方法の1つとして、まずGIFのみを利用すると想定しておき、モダンブラウザの場合にのみ、
きちんと分離した半透明のピクセル部分を表示するとアプローチもある。
こうすることで、GIFのような挙動をするレイヤーと半透明の部分を表示するレイヤーとを分離することができるため、
IE6でどんな見た目になるのかを簡単にプレビューすることができる。常に心に留めておくべきことは、最悪の状況(IE6)でもPNG8はGIFと同じ表現が可能であることだ。

## PNG doesn’t work in browsers?

2つのエッジケースを除いて、PNGはブラウザで正常に動作しつづけている。

+ PNG8の半透明をIE6で(上記を参照)表現できないケース。しかし、GIFでもそれはできない。
+ IE6でtruecolorのPNGにおける透明部分がベタ一色(大抵はグレー)で表現されてしまうケース。GIFはそもそもアルファチャネルをサポートしていないので、ここでもGIFを代わりに利用することはできない。
  多くの人がこれらの問題を回避するのにGIFを利用しようとする(GIFを利用するということは減色する可能性があることを意味する)が、GIFを利用することで解決できる問題であれば、PNG8を利用する方がよりよい解決だ(ファイルサイズも小さくなる)。

二番目の問題については、IEのAlphaImageLoader CSS Filter（と、これを自動で実行してくれるたくさんのスクリプト）を使うことだが、このフィルタは描画パフォーマンスに深刻な影響が出るため、最後の手段とするべきだろう。このAlphaImageLoaderを使う前に次の3つのことを検討して欲しい。

1. プログレッシブ・エンハンスメントとしてPNG8を試してみよう
2. 透過を使わないことを検討しよう - もし背景色がソリッドカラーなら画像をソリッドカラーに変換しよう。もしImageMagickが使えるなら、`-flatten`オプションを付けることで可能だ。
3. IE6なんて忘れてしまおう :)

それでもAlphaImageLoaderを使わざるを得ないのであれば、
是非アンダースコアハックを使ってIE6ユーザーだけに適用されるようにして欲しい。

```css
#some-element {
    background: url(image.png);
    _background: none;
    _filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='image.png', sizingMethod='crop');
}
```

## PNGs are bigger than GIFs?

この誤解は、数千色を保持するPNG24に対して256色のGIFというフェアではない比較から生まれている。
Photoshopや他のソフトで画像を作る人はみんな、Web用にエクスポートするときに、
まずPNG24で保存しようとして、サイズが大きくなるからという理由でGIFに切り替えるみたいだ。
しかしGIFで保存する段階で多くの色を失っているわけで、それでもいいのなら、PNG8なら同等の表現を小さいファイルサイズで表現可能だ。
（PhotoshopはPNG8で適切にエクスポートできないから、もし出力されたPNG8がおかしなことになっていてGIFで大丈夫であればそのときはGIFで出力し、`optipng`のようなツールでPNGにコンバートして欲しい。）
もう一度言おう。PNG8はGIFと同等の表現が可能であり、大抵の場合においてGIFよりファイルサイズの小さいフォーマットだ。

## Comparing GIF vs. PNG filesizes

(次の実験は1年以上前に私が海のど真ん中に浮かぶカーニバルクルーズの船の中で退屈を極めていた際に行ったものだ。
以来データを見返して来なかった。ここでようやく古いデータを捨て、20Gに及ぶ"もしかしたら、また使うかも知れない"テスト画像を整理するチャンスが来たわけだ :) )
Yahoo!の画像検索でいくつかGIFを(「ロゴ」や「グラフ」にマッチしたもの)、1700枚程ダウンロードした。そして`optipng`を使って全てpngに変換し結果を見た。オプションは特に指定していない。

```bash
$ optipng *.gif
```

次の実験から`optipng`と`pngout`を利用することはよりよい結果となることだ。これらの結果から(画像をPNGに変換することで)、最低でもGIFを小さなファイルサイズにできることについて考えてみて欲しい。

実験から得た統計データから:

+ 平均して、実際には中央値だが、Web上のGIF画像(昨年の、この小さなサンプルからの判断だが)は 525x388の縦横サイズで、139色を使っている (半分役立たずのデータは大好きだ ;) )
+ ファイルサイズの中央値は24Kだった。
+ PNGに変換したあとの中央値は18Kだった。
+ 全てのGIFをPNGに変換することで、約23%を削減できた。

興味深いことに、画像の4%程はGIFと同程度のサイズになってしまった。これは非常に残念な結果だ（どうか誰にも言わないで欲しい）。なので、もう少し頑張らなければならなくなったわけだが、`OptiPNG`を最高品質（`-o7`オプション）で実行する代わりに`PNGOut`を実行することにした。
結果、1706枚中4枚を除いてGIFよりファイルサイズが小さくなった。もう少し頑張ってみたら(`PNGSlim`を利用したら。昨日の記事を見て欲しい)、解決できるかもしれないが、1700枚のうちの4枚であれば、気にならない程度だ。
ところで、`OptiPNG`で小さなPNGを生成できなかった画像たちは、`PNGOut`を使って中央値で21%ほどファイルサイズを縮小できた。ごくわずかなじゃじゃ馬GIFたちをならすのには悪くない手法だろう。

それに、100K以上無駄があったファイルもあったし、最大で600K程もセーブできたファイルがあった。そんなの見たことないでしょ？
もし詳しい数字が見たかったら、`OptiPNG`と`PNGOut`を実行した結果の[CSV](http://www.phpied.com/files/pngchance/everything.csv)があるからそれを見て欲しい。
今日覚えておいて欲しいのは「GIFをPNGにすることで、少なくとも20%はネットワーク上のデータを削減できる」ということだ。

## Comparing PNG optimizers

この検証のために12000以上の画像をダウンロードして（もう一度言うけど、Yahoo!の検索APIを使ったよ）、
それらにオプティマイザをまとめて実行したけど、いくつかはオプションを変えてある。
これは想像だけど、有用な結果とはいえない。オプティマイザには、圧縮・圧縮前のフィルタリング、チャンクの除去など、それぞれの特性があるから、
それらのツールを組み合わせてケースに応じて使うのが一番良いと思う。でも少なくとも、指標のひとつには違いない。

画像は、「baby」「background」「bkg」「flower」「graph」「graphic」「icon」「illustration」「kittens」（もちろん！）、「logo」「monkeys」「png」「transparency」などそれぞれ1000マッチした画像から、4xxエラーや5xxエラー、他のミスなどを除きながら10000個収集した。それらに対し、以下のツールを実行した。  

+ pngcrush – `pngcrush -rem alla -reduce before.png after.png`
+ pngcrush-none – チャンクを維持する `pngcrush -rem none -reduce before.png after.png`
+ pngcrush-brute – 更に多くのフィルタを試す `pngcrush -rem alla -brute -reduce before.png` after.png
+ pngout – `pngout /q /y /force before.png after.png`. PNGOutのデフォルトの圧縮レベルは“extreme”なので、2段階下げて試した。
+ pngout-match – `pngout /s2 /q /y /force before.png after.png`
+ pngout-intense – `pngout /s1 /q /y /force before.png after.png`
+ pngrewrite – `pngrewrite before.png after.png` PNGRewriteはPNG8に対してのみ働き、truecolorからPNG8へコンバートする。
+ optipng – `optipng before.png -force -out after.png`. OptiPNG’sのデフォルトは2 (7が最大)なのでその前後で実行した。
+ optipng1 – `optipng before.png -o1 -force -out after.png`
+ optipng3 – `optipng before.png -o3 -force -out after.png`
+ optipng7 – `optipng before.png -o7 -force -out after.png`
+ advpng – `cp before.png after.png; advpng -z -f -q after.png`
+ advpng-insane – “insane”というレベル4の圧縮 `cp before.png after.png; advpng -z4 -f -q after.png`
+ deflopt – `cp before.png after.png; deflopt -s -f after.png`
+ pngoptimizercl – `cp before.png after.png; pngoptimizercl -file:"after.png"`

以下が結果になる。

| Tool | Median time to run | Median savings | Success rate |
|------|-----|-----|-----|
| pngcrush | 0.25s | 6.06% | 93.85% |
| pngcrush-none | 0.23s | 5.58% | 90.22% |
| pngcrush-brute | 3.08s | 8.10% | 96.31% |
| pngout | 1.89s | 12.21% | 94.35% |
| pngout-match | 0.22s | 13.89% | 44.57% |
| pngout-intense | 1.63s | 12.10% | 94.22% |
| pngrewrite | 0.07s | 29.84% | 22.37% |
| optipng | 0.23s | 7.32% | 93.21% |
| optipng1 | 0.10s | 4.24% | 85.16% |
| optipng3 | 0.66s | 7.10% | 94.26% |
| optipng7 | 4.13s | 7.57% | 94.81% |
| advpng | 0.34s | 11.55% | 52.47% |
| advpng-insane | 0.76s 15.64% | 56.09% |
| deflopt | 0.34s | 0.44% | 96.94% |
| pngoptimizercl | 0.48s | 9.71% | 97.99% |

Success rateは、ツールを使って、オリジナルよりどれだけ小さい結果を出せたかだ。
例えば、PNGRewriteのSuccess rateはとても少ない。なぜならば256色までしか実行しないからだ。
Median time to runは1つの画像を最適化するのにツールがかかった時間だ。

それでは皆さん、お待ちかねの...

## Give PNG a chance (.com)

もしこの結果を面白いと思ってくれたら私は嬉しい。少なくとも私は面白い結果だったと思っている。

私の隠れたゴールは、みんなが聞いたりビデオを見たりして、よく考えて、次回Photoshopを使うときにWebの為にセーブを実行してくれることだ。

- [Link to Youtube Movie](http://www.youtube.com/watch?v=bPdkWJe9XH0)

音楽：ガレージバンドを使ったドラムと、私は2本のギターとベース（ギターにエフェクトをかけてある）とヴォーカルをやった。女の人の声が聴こえるかもしれないけど、ヘリウム効果をかけた私の声だ。MP3は[ここ](http://www.phpied.com/files/pngchance/give-png-a-chance.mp3)にある。もしこの曲を自分で試したかったらそれぞれ[zipにしてある](http://www.phpied.com/files/pngchance/givePNGaChance.zip)。

映像：気に食わないかもしれないけど、全部Webでの開発だ。 :) 全部JavaScriptとCSSでできてる。ビデオはSafariのウィンドウをキャプチャしたものだ。画像は一切使っていなくて、HTMLで構成されている。`-webkit-`のアニメーション・トランジションを多用している。実際のソースのバージョンは[ここ](http://www.phpied.com/files/pngchance/vid.html)にあるからSafariでみてくれ。スターウォーズのようなエフェクトは[ここ](http://esquevin.com/starwars.html)からお借りした。

`http://givepngachance.com`というURLに、今は何もないけど、PNGについての記事などを載せていきたいと思う。

## Thanks!

読んでくれてありがとう。そして「PNGにチャンスを」 :)
