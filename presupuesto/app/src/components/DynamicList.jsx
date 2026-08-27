import { makeId } from "../lib/id";

export default function DynamicList({ items, onChange, addLabel, currencySymbol }) {
  function updateItem(id, patch) {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function removeItem(id) {
    onChange(items.filter((it) => it.id !== id));
  }

  function addItem() {
    onChange([...items, { id: makeId(), label: "", amount: 0, perDay: false, perTraveler: false }]);
  }

  return (
    <div>
      <div className="item-list">
        {items.map((item) => (
          <div className="item-row" key={item.id}>
            <input
              className="field-input"
              type="text"
              placeholder="Descripción"
              value={item.label}
              onChange={(e) => updateItem(item.id, { label: e.target.value })}
            />
            <div className="field-affix">
              <span className="field-affix-symbol">{currencySymbol}</span>
              <input
                className="field-input"
                type="number"
                min="0"
                placeholder="0"
                value={item.amount === 0 ? "" : item.amount}
                onChange={(e) => updateItem(item.id, { amount: Number(e.target.value) })}
              />
            </div>
            <label className="checkbox-row" title="Multiplicar por número de días">
              <input
                type="checkbox"
                checked={item.perDay}
                onChange={(e) => updateItem(item.id, { perDay: e.target.checked })}
              />
              x días
            </label>
            <label className="checkbox-row" title="Multiplicar por número de viajeros">
              <input
                type="checkbox"
                checked={item.perTraveler}
                onChange={(e) => updateItem(item.id, { perTraveler: e.target.checked })}
              />
              x pers.
            </label>
            <button type="button" className="btn-icon" onClick={() => removeItem(item.id)} aria-label="Eliminar">
              ✕
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="btn-add" onClick={addItem}>
        + {addLabel}
      </button>
    </div>
  );
}
