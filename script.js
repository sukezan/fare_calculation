function getObject() {
    var departure_obj = document.getElementById('departure_station'); //get object from html
    var arrival_obj = document.getElementById('arrival_station');
    const round_trip = getCheckBox().checked;

    var idx_d = departure_obj.selectedIndex; //get index
    var idx_a = arrival_obj.selectedIndex;

    var d_value = departure_obj.options[idx_d].value;
    var a_value = arrival_obj.options[idx_a].value;

    var key_d = departure_obj.options[idx_d].value;
    var key_a = arrival_obj.options[idx_a].value;

    var text_d = departure_obj.options[idx_d].text;
    var text_a = departure_obj.options[idx_a].text;

    return [d_value, a_value, key_d, key_a, text_d, text_a, round_trip]
}

function getCheckBox()
{
    var round_trip = document.getElementById('round-trip');

    return round_trip
}

function booleans(select) {
    switch (select) {
        case 'selected':
            return true
            break;
        default:
            return false
            break;
    }
}

function judge(decide) { 
    if (decide.length == 2) {
        return true
    }
}

function ButtonClick() 
{
    url = './output.html?'
    add_query = url

    var output = ['error_d','error_a', 'key_d', 'key_a']

    var obj =  getObject();
    var decide = [];
    for (var i = 0; i < 2; i++) {
        var check = booleans(obj[i]);
        if (check) {
            var text = obj[i+4].replace(/--/g, ''); //--乗車駅選択-- から'--'を置き換え　
            var text = text.substring(0,3) + 'を' + text.substring(3,5);
            document.getElementById(output[i]).innerHTML = text + 'してください'
        } else {
            document.getElementById(output[i]).innerHTML = ''
            add_query += ('&' + output[i+2] + '=' + obj[i]);
            decide.push('true') //リストにtrueを追加
        }
    }
    var JUDGE = judge(decide); 

    if (JUDGE) {
        location.href = add_query + '&checked=' + obj[6]
    }
}