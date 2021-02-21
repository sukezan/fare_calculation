function getQuery(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return results[2].replace(/\+/g, " ");
}

function getObj() {
    var stop_d = getQuery('key_d');
    var stop_a = getQuery('key_a'); //query: get detail of station
    var checked = getQuery('checked'); // checked or not

    var list_d = setData(stop_d);
    var list_a = setData(stop_a); //type: all, two, one

    var type_d = list_d[0];
    var type_a = list_a[0];

    var d_station = list_d[1];
    var a_station = list_a[1];

    var value_d = station_list(d_station);
    var value_a = station_list(a_station); //get dictionary from list function

    var key_d =  Object.keys(value_d)-0;
    var name_d = value_d[key_d];

    var key_a = Object.keys(value_a)-0;
    var name_a = value_a[key_a];

    var from_kilo = business_kilo(d_station, a_station);

    var green = green_fare(from_kilo);

    var array= [type_d, type_a, key_d, key_a, d_station, a_station, name_d, name_a, checked, from_kilo, green]; 
    //ex: [all, all, 0, 16, 'tokyo', 'shinosaka', '東京', '新大阪', 'true', 120.3]

    return array;
}

function setData(key) {
    var STOP = key.substring(0,3);

    var without_stop = key.replace(STOP+':', '');

    return [STOP, without_stop];
}

function output_direct(array) {
    normal_fee = table(to_east, to_west, 'normal');
    reserve_fee = table(to_east, to_west, 'reserve');
    exp_reserve = table(to_east, to_west, 'exp_reserve');
    exp_free = table(to_east, to_west, 'exp_free');
    d_station = array[6];
    a_station = array[7];
    judged = array[8];
    distance = array[9];
    green = array[10];

    var reserve_all = normal_fee + reserve_fee;
    var nozomi_all = normal_fee + exp_reserve;
    var free_all = normal_fee + exp_free;
    var students_fare = normal_fee * 0.8; //2割引
    var decimal = students_fare/10;
    var Belowed = Math.floor(decimal);
    var students_fare = (Belowed * 10) + exp_reserve;

    var add_green = normal_fee + (reserve_fee - 530) + green;
    var green_exp = normal_fee + (exp_reserve- 530) + green;

    var trip_route = d_station +' ~ '+ a_station +'間の料金詳細';
    var non_reserve = '普通車自由席料金: ' + free_all + '円';
    var reserve = 'ひかり・こだま指定席料金: ' + reserve_all + '円';
    var nozomi_reserve = 'のぞみ指定席料金: ' + nozomi_all + '円';
    var green_reserve = 'ひかり・こだまグリーン料金: ' + add_green + '円';
    var green_nozomi = 'のぞみグリーン料金: ' + green_exp + '円';

    if (judged == 'true' && distance >= 601) {
        var disc_fare = (normal_fee * 0.9) + exp_reserve;
        var for_round = ((normal_fee * 0.9) / 10);
        var belowed = Math.floor(for_round);
        var round_fare_students = ((belowed + 10) + exp_reserve) * 2;
        var round_fare = '往復割引料金: ' + disc_fare * 2 + '円';
        var round_students = '往復学生割引料金: ' + round_fare_students + '円'; 
    } else if (judged == 'true' && distance <= 601) {
        var round_fare = '往復運賃は片道601km以上で適応されます';
        var round_students = '';
    } else if (judged == 'false') {
        var round_fare = '';
        var round_students = '';
    }

    if (distance >= 101) {
        var students = '学生割引料金(のぞみ普通車指定席): ' + students_fare + '円';
    } else {
        var students = ''
    }

    document.getElementById('trip_route').innerHTML = trip_route;
    document.getElementById('non_reserve').innerHTML = non_reserve;
    document.getElementById('reserve').innerHTML = reserve;
    document.getElementById('nozomi_reserve').innerHTML = nozomi_reserve;
    document.getElementById('green').innerHTML = green_reserve;
    document.getElementById('green_nozomi').innerHTML = green_nozomi;
    document.getElementById('students').innerHTML = students;
    document.getElementById('round').innerHTML = round_fare;
    document.getElementById('round_students').innerHTML = round_students;

}

function output_exp(array) {
    normal_fee = table(to_east, to_west, 'normal');
    reserve_fee = table(to_east, to_west, 'reserve');
    d_station = array[6];
    a_station = array[7];
    judged = array[8];
    distance = array[9];
    green = array[10];

    var transfer_info = transfer(array);
    var normal = normal_fee + reserve_fee;
    var include_transfer = normal + transfer_info[2];
    var students_fare = normal_fee * 0.8; //2割引
    var decimal = students_fare/10;
    var Belowed = Math.floor(decimal);
    var students_fare = (Belowed * 10) + reserve_fee;

    var add_green = normal_fee + (reserve_fee - 530) + green;

    let trip_route = d_station +' ~ '+ a_station +'間の料金詳細';
    let non_reserve = '普通車自由席料金: ' + normal - 530 + '円';
    let reserve = '普通車指定席料金: ' + normal + '円';
    let green_reserve = 'グリーン料金(ひかり・こだま利用): ' + add_green + '円';

    if (transfer_info[2] == 0) {
        var transfer_fare = '';
        var transfer_detail = '';
    } else {
        var transfer_fare = 'のぞみ乗り換え料金: ' + include_transfer + '円';
        var transfer_detail = ' ※' + transfer_info[0] + ' - ' + transfer_info[1] + '間でのぞみ利用の場合';
    }

    if (judged == 'true' && distance >= 601) {
        var disc_fare = (normal_fee * 0.9) + exp_reserve;
        var for_round = ((normal_fee * 0.9) / 10);
        var belowed = Math.floor(for_round);
        var round_fare_students = ((belowed + 10) + exp_reserve) * 2;
        var round_fare = '往復割引料金: ' + disc_fare * 2 + '円';
        var round_students = '往復学生割引料金: ' + round_fare_students + '円'; 
        var round_fare = '往復割引料金: ' + disc_fare * 2 + '円';
    } else if (judged == 'true' && distance <= 601) {
        var round_fare = '往復運賃は片道601km以上で適応されます';
        var round_students = '';
    } else if (judged == 'false') {
        var round_fare = '';
        var round_students = '';
    }

    if (distance >= 101) {
        var students = '学生割引料金: ' + students_fare + '円';
    } else {
        var students = '';
    }
    document.getElementById('trip_route').innerHTML = trip_route;
    document.getElementById('non_reserve').innerHTML = non_reserve;
    document.getElementById('reserve').innerHTML = reserve;
    document.getElementById('transfer').innerHTML = transfer_fare;
    document.getElementById('transfer_detail').innerHTML = transfer_detail;
    document.getElementById('green').innerHTML = green_reserve;
    document.getElementById('students').innerHTML = students;
    document.getElementById('round').innerHTML = round_fare;
    document.getElementById('round_students').innerHTML = round_students;
}

function output_normal(array) {
    normal_fee = table(to_east, to_west, 'normal');
    reserve_fee = table(to_east, to_west, 'reserve');
    d_station = array[6];
    a_station = array[7];
    judged = array[8];
    distance = array[9];
    green = array[10];

    var normal = normal_fee + reserve_fee;
    var students_fare = normal_fee * 0.8; //2割引
    var decimal = students_fare/10;
    var Belowed = Math.floor(decimal);
    var students_fare = (Belowed * 10) + reserve_fee;

    var add_green = normal_fee + (reserve_fee - 530) + green;

    let trip_route = d_station +' ~ '+ a_station +'間の料金詳細';
    let reserve = '普通車指定席料金: ' + normal + '円';
    let non_reserve = '普通車自由席料金: ' + (normal - 530) + '円';
    let green_reserve = 'グリーン料金: ' + add_green + '円';

    if (judged == 'true' && distance >= 601) {
        var disc_fare = (normal_fee * 0.9) + reserve_fee;
        var for_round = ((normal_fee * 0.9) / 10);
        var belowed = Math.floor(for_round);
        var round_fare_students = ((belowed + 10) + exp_reserve) * 2;
        var round_fare = '往復割引料金: ' + disc_fare * 2 + '円';
        var round_students = '往復学生割引料金: ' + round_fare_students + '円';
        var round_fare = '往復割引料金: ' + disc_fare * 2 + '円';
    } else if (judged == 'true' && distance <= 601) {
        var round_fare = '往復運賃は片道601km以上で適応されます';
    } else if (judged == 'false') {
        var round_fare = '';
        var round_students = '';
    }

    if (distance >= 101) {
        var students = '学生割引料金(普通車指定席): ' + students_fare + '円';
    } else {
        var students = '';
        var round_students = '';
    }

    document.getElementById('trip_route').innerHTML = trip_route;
    document.getElementById('non_reserve').innerHTML = non_reserve;
    document.getElementById('reserve').innerHTML = reserve;
    document.getElementById('green').innerHTML = green_reserve;
    document.getElementById('students').innerHTML = students;
    document.getElementById('round').innerHTML = round_fare;    
    document.getElementById('round_students').innerHTML = round_students;
}

function Sort(array) {
    var key_d = array[2];
    var key_a = array[3];

    var d_station = array[4];
    var a_station = array[5];

    if (key_a < key_d) {
        to_east = a_station;
        to_west = d_station;
    } else {
        to_east = d_station;
        to_west = a_station;
    }

}

function translate(name) {
    key = Object.keys(station_list(name));
    station_name = station_list(name)[key];

    return station_name;
}

function transfer(array) {
    var key_d = array[2];
    var key_a = array[3];

    var d_station = array[4];
    var a_station = array[5];

    var stops = nozomi_stops(); //get data of nozomi stops from another file
    
    var stop_detail = array[11];
    var idx = stop_detail.indexOf(-1);

    var local = array[idx+2];

    var indx = stop_detail.indexOf(1);

    var nozomi = array[indx+2];
    
    stops[key_d] = d_station;
    stops[key_a] = a_station;

    var sorted = {};
    var key = Object.keys(stops);

    key.sort();

    for( var i = 0; i < key.length; i++ ) {
    
        sorted[ key[i] ] = stops[ key[i] ];
    }

    sorted_list = Object.entries(sorted); //change to the list from dictionary
    var index = 0;

    for (var i = 0; i < sorted_list.length; i++) {
        if (local == sorted_list[i][0]) {
            index = i;
            if (nozomi == sorted_list[index-1][0]) {
                idx = 2;
            } else if (nozomi == sorted_list[index+1][0]) {
                idx = 2;
            } else {
                break;
            }
        } 
    }

    var name_first = '';
    var name_last = '';
    var transfer_fee = 0;

    switch (idx) {
        case 0:
            if (key_d < key_a) {
                index += 1; 
                transfer_stop = sorted_list[index][1];
                transfer_fee = table(transfer_stop, a_station, 'transfer');//get fare information

            } else if (key_d > key_a) {
                index -= 1;
                transfer_stop = sorted_list[index][1];
                transfer_fee = table(a_station, transfer_stop, 'transfer');

            }
            name_first = translate(transfer_stop);
            name_last = translate(a_station);
            break;
        case 1:
            if (key_d < key_a) {
                index -= 1;
                transfer_stop = sorted_list[index][1];
                transfer_fee = table(d_station,transfer_stop, 'transfer');

            } else {
                index += 1;
                transfer_stop = sorted_list[index][1];
                transfer_fee = table(transfer_stop, d_station, 'transfer');
            }
            name_first = translate(d_station);
            name_last = translate(transfer_stop);
        default:
            break;
    }
    transfer_info = [name_first, name_last, transfer_fee];

    return transfer_info;
}

function judge(type) {
    switch (type) {
        case 'all':
            return 1;
    
        default:
            return -1;
    }
}

function switch_func(array) {
    Sort(array);

    var count = 0;
    var Bools = [];
    for (var i = 0; i < 2; i++) {
        judged = judge(array[i]);
        Bools.push(judged);
        count += judged;
    }

    switch (count) {
        case 2:
            output_direct(array);
            break;
        case 0:
            array.push(Bools);
            output_exp(array);
        case -2:
            output_normal(array);
        default:
            break;
    }
}

function Return() {
    location.href = "./index.html";
}

function main(){
    array = getObj();
    switch_func(array);
}

main()