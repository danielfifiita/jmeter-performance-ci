/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "T03_Create"], "isController": true}, {"data": [0.0, 500, 1500, "T04_Update"], "isController": true}, {"data": [0.0, 500, 1500, "T01_GetUsers"], "isController": true}, {"data": [1.0, 500, 1500, "GET /posts/3"], "isController": false}, {"data": [0.0, 500, 1500, "T05_Delete"], "isController": true}, {"data": [0.0, 500, 1500, "T02_GetUserByID"], "isController": true}, {"data": [1.0, 500, 1500, "GET /posts/"], "isController": false}, {"data": [1.0, 500, 1500, "PUT /posts/3"], "isController": false}, {"data": [1.0, 500, 1500, "POST /posts"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE /posts/3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 732, 0, 0.0, 72.3565573770492, 9, 487, 84.0, 115.0, 123.70000000000005, 253.01999999999975, 2.3559173111645375, 16.219545640064435, 0.5263952453597762], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["T03_Create", 144, 0, 0.0, 5091.479166666669, 5076, 5488, 5088.0, 5100.5, 5108.5, 5335.4500000000035, 0.4880379856232143, 0.6891365370993597, 0.1453628765772269], "isController": true}, {"data": ["T04_Update", 144, 0, 0.0, 5112.5972222222235, 5082, 5269, 5111.0, 5125.0, 5168.75, 5265.85, 0.48804956414462536, 0.6279944403867792, 0.15203887789271042], "isController": true}, {"data": ["T01_GetUsers", 152, 0, 0.0, 5065.4473684210525, 5016, 6164, 5039.0, 5050.0, 5063.4, 6162.94, 0.481649777236978, 13.522151631747057, 0.07902066657794171], "isController": true}, {"data": ["GET /posts/3", 148, 0, 0.0, 14.858108108108109, 9, 26, 15.5, 19.0, 20.0, 24.529999999999973, 0.485144100909973, 0.7092453858042902, 0.08054150112763223], "isController": false}, {"data": ["T05_Delete", 144, 0, 0.0, 5110.194444444449, 5081, 5284, 5109.0, 5126.5, 5145.75, 5279.5, 0.4882944958359331, 0.566918466475531, 0.08917096750128856], "isController": true}, {"data": ["T02_GetUserByID", 148, 0, 0.0, 5016.2027027027025, 5010, 5028, 5017.0, 5021.0, 5022.0, 5027.02, 0.4773146535598643, 0.6977993032979863, 0.07924169053239935], "isController": true}, {"data": ["GET /posts/", 152, 0, 0.0, 39.907894736842124, 15, 249, 38.0, 49.0, 62.39999999999998, 247.94, 0.49084984838552387, 13.780440461043638, 0.08053005325075001], "isController": false}, {"data": ["PUT /posts/3", 144, 0, 0.0, 111.29861111111109, 81, 268, 110.0, 124.0, 167.75, 263.5000000000001, 0.49647468496267816, 0.6388354070058094, 0.15466350049130306], "isController": false}, {"data": ["POST /posts", 144, 0, 0.0, 90.1527777777778, 75, 487, 86.0, 99.5, 107.5, 334.45000000000385, 0.4964575683922015, 0.7010254520694351, 0.14787066246056782], "isController": false}, {"data": ["DELETE /posts/3", 144, 0, 0.0, 108.9652777777778, 80, 282, 108.0, 125.0, 144.5, 277.9500000000001, 0.4967195810998199, 0.5767001381070155, 0.09070953287662728], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 732, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
