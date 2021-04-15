(() => {
  const bars = new BarsChart(document.getElementById('cv'));
  bars.setChartLabel('Test label');

  const dataBody = document.getElementById('data-body');

  function createNewRecordInput() {
    const recordKey = bars.createRecord();
    const record = bars.getRecord(recordKey);
    const row = document.createElement('tr');

    const deleteBtnContainer = document.createElement('td');
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'x';
    deleteBtnContainer.appendChild(deleteBtn);
    row.appendChild(deleteBtnContainer);

    deleteBtn.addEventListener('click', () => {
      bars.deleteRecord(recordKey);

      row.remove();
    });

    const idContainer = document.createElement('td');
    idContainer.innerText = record.id;
    bars.observe(recordKey, (newRecord) => {
      idContainer.innerText = newRecord.id;
    });
    row.appendChild(idContainer);

    const nameInputContainer = document.createElement('td');
    const nameInput = document.createElement('input');
    nameInput.placeholder = 'Name';
    nameInput.type = 'text';
    nameInput.value = record.name;
    nameInputContainer.appendChild(nameInput);
    row.appendChild(nameInputContainer);

    nameInput.addEventListener('input', (event) => {
      bars.updateRecord(recordKey, 'name', event.target.value);
    });

    const valueInputContainer = document.createElement('td');
    const valueInput = document.createElement('input');
    valueInput.placeholder = 'Value';
    valueInput.type = 'number';
    valueInput.value = record.value;
    valueInputContainer.appendChild(valueInput);
    row.appendChild(valueInputContainer);

    valueInput.addEventListener('input', (event) => {
      bars.updateRecord(recordKey, 'value', parseInt(event.target.value));
    });

    const colorInputContainer = document.createElement('td');
    const colorInput = document.createElement('input');
    colorInput.placeholder = 'Color';
    colorInput.type = 'color';
    colorInput.value = record.color;
    colorInputContainer.appendChild(colorInput);
    row.appendChild(colorInputContainer);

    colorInput.addEventListener('input', (event) => {
      bars.updateRecord(recordKey, 'color', event.target.value);
    });

    return row;
  }

  document.getElementById('new').addEventListener('click', function (event) {
    const buttonRow = this.parentElement.parentElement;
    dataBody.removeChild(buttonRow);
    dataBody.appendChild(createNewRecordInput());
    dataBody.appendChild(buttonRow);
  });
})();
