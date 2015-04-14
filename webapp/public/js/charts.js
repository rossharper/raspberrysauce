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
                    fit: false
                },
                type: 'category'
            }
        }
    });
}
