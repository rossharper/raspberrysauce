function generateChart(data, chart, value, xAxisValues) {
    var chart = c3.generate({
        bindto: chart,
        data: {
            json: data,
            keys: {
                x: 'date',
                value: [value]
            }
        },
        axis: {
            x: {
                tick: {
                    fit: false,
                    format: function(d) {
                        var matches = data[d].date.match(/\d{4}-\d{2}-\d{2}T(\d{2}:\d{2}).*/);
                        return matches[1];
                    }
                },
                type: 'category'
            }
        },
        grid: {
            x: {
                show: true
            },
            y: {
                show: true
            }
        },
        legend: {
            show: false
        },
        point: {
            show: false
        },
        tooltip: {
            format: {
                title: function (d) {
                    var matches = data[d].date.match(/\d{4}-\d{2}-\d{2}T(\d{2}:\d{2}).*/);
                    return 'Time: ' + matches[1];
                },
                value: function (value, ratio, id) {
                    return parseFloat(value).toFixed(2) + "&deg;C";
                }
            }
        },
        zoom: {
            enabled: true
        }
    });
}
