function generateChart(data, chart, value) {
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
                type: 'category'
            }
        }
    });
}
