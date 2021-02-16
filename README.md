# 東海道・山陽新幹線　料金計算

乗車券？特急券？結局の合計金額はいくらという疑問を解決するために作成しました

リンク[東海道・山陽新幹線運賃計算](https://sukezan.github.io/fare_calculation/index.html)

# 目次
- [説明](https://github.com/sukezan/fare_calculation#説明)
- [機能](https://github.com/sukezan/fare_calculation#機能)
- [データベース](https://github.com/sukezan/fare_calculation#データベース)
- [動作確認済み](https://github.com/sukezan/fare_calculation#動作確認済み)
- [License](https://github.com/sukezan/fare_calculation#License)
# 説明
東海道と山陽新幹線区間の運賃、特急料金またはグリーン料金を全て加算した合計金額を表示します

表示される運賃は全て通常期の運賃を表示しています　閑散期は200円引き、繁忙期は200円増しです

学生割引は片道101km以上の場合のみ適用されます

検索画面ではさらに往復割引運賃を計算することができます

往復割引は片道601km以上の場合のみ適用され、学生割引と併用することが可能です

# 機能
東海道と山陽新幹線区間の運賃、特急料金またはグリーン料金を全て加算した合計金額を表示します

1. 全列車停車駅 - 全列車停車駅間の運賃表示は以下の通りです
- 普通車自由席料金
- ひかり、こだま指定席料金
- のぞみ指定席料金
- ひかり、こだまグリーン料金
- のぞみグリーン料金
- 学生割引料金(のぞみ普通車指定席)

2. 全列車停車駅 - ひかり、こだま停車駅間の運賃表示は以下の通りです
- 普通車自由席料金
- 普通車指定席料金
- のぞみ乗り換え料金
- グリーン料金
- 学生割引料金(普通車指定席)

3. ひかり、こだま停車駅 - ひかり、こだま停車駅間の運賃表示は以下の通りです
- 普通車自由席料金
- 普通車指定席料金
- グリーン料金
- 学生割引料金(普通車指定席)

# データベース
> 料金の詳細について

料金は[JRおでかけネット](https://www.jr-odekake.net/guide/img/shinkansen_ryoukin.pdf)の運賃・特急料金早見表を参考にしています

# 動作確認済み
- Safari バージョン14.0.3 
- Google Chrome バージョン: 88.0.4324.150 

2021年2月現在

# License
sukezan/fare_calculation is licensed under the MIT License

Copyright (c) 2021 Kosuke Yamagami
