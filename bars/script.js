(() => {
  const chart = new ChartWrap(document.getElementById('cv'), 'bar', true);

  const addFieldBtn = document.getElementById('new-field');
  const addRecordBtn = document.getElementById('new-record');
  const tableHead = document.getElementById('table-head');
  const tableBody = document.getElementById('table-body');

  function createFieldInput(record, field) {
    const fieldContainer = document.createElement('td');
    fieldContainer.className = 'd-flex justify-center';
    fieldContainer.setAttribute('data-field-id', field.key);

    const valueLabel = document.createElement('p');
    valueLabel.innerText = `${field.name}: `;

    const valueInput = document.createElement('input');
    valueInput.type = 'number';
    valueInput.value = 0;

    valueInput.addEventListener('input', (e) => {
      record.data.set(field.key, parseFloat(e.target.value));
      chart.forceUpdate();
    });

    fieldContainer.appendChild(valueLabel);
    fieldContainer.appendChild(valueInput);

    return fieldContainer;
  }

  addFieldBtn.addEventListener('click', (e) => {
    const newField = chart.createNewField();

    tableHead.removeChild(addFieldBtn.parentElement);

    {
      const fieldContainer = document.createElement('th');
      fieldContainer.className = 'field d-flex flex-row justify-center';
      fieldContainer.setAttribute('data-field-id', newField.key);

      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.value = newField.name;

      nameInput.addEventListener('input', (e) => {
        chart.updateField(newField.key, 'name', e.target.value);

        [...tableBody.children].forEach((row) => {
          const label = row.querySelector(
            `[data-field-id="${newField.key}"] p`,
          );

          label && (label.innerText = `${e.target.value}: `);
        });
      });

      const unitLabel = document.createElement('p');
      unitLabel.innerText = 'Unit: ';

      const unitInput = document.createElement('input');
      unitInput.type = 'text';
      unitInput.value = '';

      unitInput.addEventListener('input', (e) => {
        chart.updateField(newField.key, 'unit', e.target.value);
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.innerText = 'x';

      deleteBtn.addEventListener('click', (e) => {
        chart.deleteField(newField.key);
        e.target.parentElement.remove();

        [...tableBody.children].forEach((row) => {
          const field = row.querySelector(`[data-field-id="${newField.key}"]`);

          field && field.remove();
        });
      });

      fieldContainer.appendChild(nameInput);
      fieldContainer.appendChild(unitLabel);
      fieldContainer.appendChild(unitInput);
      fieldContainer.appendChild(deleteBtn);

      tableHead.appendChild(fieldContainer);
    }

    tableHead.appendChild(addFieldBtn.parentElement);

    [...tableBody.children].forEach((row) => {
      if (row === addRecordBtn.parentElement.parentElement) return;

      const record = chart.getRecord(row.getAttribute('data-record-id'));

      row.appendChild(createFieldInput(record, newField));
    });
  });

  addRecordBtn.addEventListener('click', (e) => {
    const newRecord = chart.createNewRecord();
    tableBody.removeChild(addRecordBtn.parentElement.parentElement);

    const row = document.createElement('tr');
    row.setAttribute('data-record-id', newRecord.key);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'x';

    document.createElement('td').appendChild(deleteBtn);
    row.appendChild(deleteBtn.parentElement);

    deleteBtn.addEventListener('click', () => {
      chart.deleteRecord(newRecord.key);
      row.remove();
    });

    const colorContainer = document.createElement('td');
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = newRecord.color;
    colorContainer.appendChild(colorInput);
    row.appendChild(colorContainer);

    colorInput.addEventListener('input', (e) => {
      chart.updateRecord(newRecord.key, 'color', e.target.value);
    });

    const nameContainer = document.createElement('td');
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = newRecord.name;
    nameContainer.appendChild(nameInput);
    row.appendChild(nameContainer);

    nameInput.addEventListener('input', (e) => {
      chart.updateRecord(newRecord.key, 'name', e.target.value);
    });

    const fields = chart.getFields();

    fields.forEach((field) => {
      row.appendChild(createFieldInput(newRecord, field));
    });

    tableBody.appendChild(row);

    tableBody.appendChild(addRecordBtn.parentElement.parentElement);
  });
})();
