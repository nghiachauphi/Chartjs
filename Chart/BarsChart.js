class BarsChart {
  // proposal private class member
  #chart;
  #data;

  constructor(canvas) {
    this.#data = new Map();
    this.#chart = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: '',
            data: this.#data,
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  updateChart() {
    const records = [...this.#data.values()];
    this.#chart.data.datasets[0].data = records.map((record) => record.value);
    this.#chart.data.labels = records.map((record) => record.name);
    this.#chart.data.datasets[0].backgroundColor = records.map(
      (record) => record.color,
    );

    this.#chart.update();
  }

  setChartLabel(label) {
    if (typeof label !== 'string') throw new TypeError('Label must be string');

    this.#chart.data.datasets[0].label = label;
    this.#chart.update();
  }

  createRecord() {
    const record = {
      name: 'Name',
      value: 0,
      color: '#000000',
      callbacks: new Map(),
    };

    const key = Symbol('record');

    this.#data.set(key, record);
    this.updateRecordId();

    this.updateChart();

    return key;
  }

  updateRecordId() {
    [...this.#data.values()].forEach((rec, ind) => {
      rec.id = ind;
    });
  }

  updateRecord(key, field, value) {
    if (!this.#data.has(key)) return;

    const record = this.#data.get(key);

    if (!(field in record)) return;

    record[field] = value;

    for (let callback of record.callbacks.values())
      if (typeof callback.call !== 'undefined')
        callback({
          name: record.name,
          value: record.value,
          id: record.id,
          color: record.color,
        });

    this.updateChart();
  }

  deleteRecord(key) {
    if (!this.#data.has(key)) return;

    this.#data.delete(key);
    this.updateRecordId();

    this.updateChart();
  }

  observe(key, callback) {
    if (!this.#data.has(key)) return null;

    const record = this.#data.get(key);
    const callbackKey = Symbol('callback');

    record.callbacks.set(callbackKey, callback);

    return () => {
      record.callbacks.delete(callbackKey);
    };
  }

  getRecord(key) {
    if (!this.#data.has(key)) return;

    const record = this.#data.get(key);

    return {
      name: record.name,
      value: record.value,
      id: record.id,
      color: record.color,
    };
  }
}
