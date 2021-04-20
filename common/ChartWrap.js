class ChartWrap {
  // using proposal private class member
  #chart;
  #canvas;
  #data;
  #colorPerRecord;

  static #default = {
    data: {
      labels: [],
      datasets: [],
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              return `${
                context.chart.config._config.type === 'pie'
                  ? context.label
                  : context.dataset.label
              }: ${
                typeof context.parsed !== 'object'
                  ? context.parsed
                  : context.parsed.y
              } ${context.dataset.units[context.datasetIndex]}`;
            },
          },
        },
      },
    },
  };

  constructor(canvas, type, colorPerRecord = false) {
    this.#colorPerRecord = colorPerRecord;
    this.#data = {
      fields: new Map(),
      records: new Map(),
    };
    this.#canvas = canvas;
    this.#chart = new Chart(canvas.getContext('2d'), {
      type,
      ...ChartWrap.#default,
    });
  }

  #updateChart() {
    const fields = [...this.#data.fields.values()];
    const backgroundColor = this.#colorPerRecord
      ? null
      : fields.map((field) => field.color);
    this.#chart.data.datasets = [...this.#data.records.values()].map(
      (record) => {
        return {
          label: record.name,
          data: fields.map((field) => record.data.get(field.key)),
          backgroundColor: ((hexes) => {
            return hexes.map((hex) => {
              if (hex.match(/^#(?:[0-9a-fA-F]{3}){2}$/) === null) return [hex];

              return `rgba(${parseInt(
                hex.slice(1).substr(0, 2),
                16,
              )}, ${parseInt(hex.slice(1).substr(2, 2), 16)}, ${parseInt(
                hex.slice(1).substr(4, 2),
                16,
              )}, 0.45)`;
            });
          })(backgroundColor ? backgroundColor : [record.color]),
          borderColor: backgroundColor ? backgroundColor : [record.color],
          units: fields.map((field) => field.unit),
          borderWidth: 1,
        };
      },
    );
    this.#chart.data.labels = fields.map((field) => field.name);

    this.#chart.update();
  }

  forceUpdate() {
    this.#updateChart();
  }

  setType(type) {
    this.#chart.destroy();
    this.#chart = new Chart(this.#canvas.getContext('2d'), {
      type,
      ...ChartWrap.#default,
    });

    this.#updateChart();
  }

  getField(key) {
    return this.#data.fields.get(key) ?? null;
  }

  getRecord(key) {
    return this.#data.records.get(key) ?? null;
  }

  getFields() {
    return [...this.#data.fields.values()].map((field) => ({
      name: field.name,
      key: field.key,
    }));
  }

  createNewField() {
    let key = '';

    do {
      key = (~~(Math.random() * 1e6)).toString().padStart(6, '0');
    } while (this.#data.fields.has(key));

    const field = {
      key,
      name: 'Field',
      color: '#000000',
      unit: '',
    };

    this.#data.fields.set(key, field);
    for (const record of this.#data.records.values()) record.data.set(key, 0);

    this.#updateChart();

    return field;
  }

  updateField(fieldKey, prop, value) {
    if (!this.#data.fields.has(fieldKey)) return;

    const field = this.#data.fields.get(fieldKey);

    if (!(prop in field) || prop === 'key') return;

    if (typeof field[prop] !== typeof value) return;

    field[prop] = value;

    this.#data.fields.set(fieldKey, field);
    this.#updateChart();
  }

  deleteField(fieldKey) {
    if (!this.#data.fields.has(fieldKey)) return;

    this.#data.fields.delete(fieldKey);

    for (const key of this.#data.records.keys()) {
      const record = this.#data.records.get(key);
      record.data.delete(fieldKey);
    }

    this.#updateChart();
  }

  createNewRecord() {
    let key = '';

    do {
      key = (~~(Math.random() * 1e6)).toString().padStart(6, '0');
    } while (this.#data.records.has(key));

    const record = {
      key,
      name: 'Record',
      color: '#000000',
      data: new Map(),
    };

    for (const field of this.#data.fields.values()) {
      record.data.set(field.key, 0);
    }

    this.#data.records.set(key, record);

    this.#updateChart();

    return record;
  }

  updateRecord(recordKey, prop, value) {
    if (!this.#data.records.has(recordKey)) return;

    const record = this.#data.records.get(recordKey);

    if (!(prop in record) || prop === 'key') return;

    if (typeof record[prop] !== typeof value) return;

    record[prop] = value;

    this.#data.records.set(recordKey, record);
    this.#updateChart();
  }

  deleteRecord(recordKey) {
    this.#data.records.delete(recordKey);
    this.#updateChart();
  }
}
