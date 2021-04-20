(() => {
  const chart = new ChartWrap(document.getElementById('cv'), 'bar');

  const addFieldBtn = document.getElementById('new-field');
  const addRecordBtn = document.getElementById('new-record');
  const tableHead = document.getElementById('table-head');
  const tableBody = document.getElementById('table-body');

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

      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.value = newField.color;

      colorInput.addEventListener('input', (e) => {
        chart.updateField(newField.key, 'color', e.target.value);
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
      fieldContainer.appendChild(colorInput);
      fieldContainer.appendChild(deleteBtn);

      tableHead.appendChild(fieldContainer);
    }

    tableHead.appendChild(addFieldBtn.parentElement);

    [...tableBody.children].forEach((row) => {
      if (row === addRecordBtn.parentElement.parentElement) return;

      const record = chart.getRecord(row.getAttribute('data-record-id'));
      record.data.set(newField.key, 0);

      const fieldContainer = document.createElement('td');
      fieldContainer.className = 'd-flex justify-center';
      fieldContainer.setAttribute('data-field-id', newField.key);

      const label = document.createElement('p');
      label.innerText = `${newField.name}: `;

      const input = document.createElement('input');
      input.type = 'number';
      input.value = 0;

      input.addEventListener('input', (e) => {
        record.data.set(newField.key, parseInt(e.target.value));
        chart.forceUpdate();
      });

      fieldContainer.appendChild(label);
      fieldContainer.appendChild(input);
      row.appendChild(fieldContainer);
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
      const fieldContainer = document.createElement('td');
      fieldContainer.className = 'd-flex justify-center';
      fieldContainer.setAttribute('data-field-id', field.key);

      const label = document.createElement('p');
      label.innerText = `${field.name}: `;

      const input = document.createElement('input');
      input.type = 'number';
      input.value = newRecord.data.get(field.key);

      fieldContainer.appendChild(label);
      fieldContainer.appendChild(input);
      row.appendChild(fieldContainer);

      input.addEventListener('input', (e) => {
        newRecord.data.set(field.key, parseInt(e.target.value));
        chart.forceUpdate();
      });
    });

    tableBody.appendChild(row);

    tableBody.appendChild(addRecordBtn.parentElement.parentElement);
  });
})();
