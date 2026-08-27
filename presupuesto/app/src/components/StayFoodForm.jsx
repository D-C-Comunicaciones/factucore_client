export function StayForm({ budget, onUpdate, currencySymbol }) {
  return (
    <div className="card">
      <div className="section-title-row">
        <div className="section-icon">🏨</div>
        <div>
          <div className="section-title">Estadía</div>
          <div className="section-desc">Hospedaje durante el viaje</div>
        </div>
      </div>

      <div className="form-grid">
        <div className="field">
          <label className="field-label">Costo por noche (total, no por persona)</label>
          <div className="field-affix">
            <span className="field-affix-symbol">{currencySymbol}</span>
            <input
              className="field-input"
              type="number"
              min="0"
              placeholder="0"
              value={budget.stay.costPerNight === 0 ? "" : budget.stay.costPerNight}
              onChange={(e) => onUpdate({ ...budget, stay: { ...budget.stay, costPerNight: Number(e.target.value) } })}
            />
          </div>
        </div>
        <div className="field">
          <label className="field-label">Número de noches</label>
          <input
            className="field-input"
            type="number"
            min="0"
            value={budget.nights}
            onChange={(e) => onUpdate({ ...budget, nights: Number(e.target.value) })}
          />
          <span className="field-hint">Se ajusta con las fechas del viaje</span>
        </div>
      </div>
    </div>
  );
}

export function FoodForm({ budget, onUpdate, currencySymbol }) {
  const food = budget.food;
  function updateFood(patch) {
    onUpdate({ ...budget, food: { ...food, ...patch } });
  }
  const perDay = (Number(food.breakfast) || 0) + (Number(food.lunch) || 0) + (Number(food.dinner) || 0);

  return (
    <div className="card">
      <div className="section-title-row">
        <div className="section-icon">🍽️</div>
        <div>
          <div className="section-title">Alimentación</div>
          <div className="section-desc">Costo por persona, por comida y día</div>
        </div>
      </div>

      <div className="form-grid cols-3">
        <div className="field">
          <label className="field-label">Desayuno</label>
          <div className="field-affix">
            <span className="field-affix-symbol">{currencySymbol}</span>
            <input
              className="field-input"
              type="number"
              min="0"
              placeholder="0"
              value={food.breakfast === 0 ? "" : food.breakfast}
              onChange={(e) => updateFood({ breakfast: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="field">
          <label className="field-label">Almuerzo</label>
          <div className="field-affix">
            <span className="field-affix-symbol">{currencySymbol}</span>
            <input
              className="field-input"
              type="number"
              min="0"
              placeholder="0"
              value={food.lunch === 0 ? "" : food.lunch}
              onChange={(e) => updateFood({ lunch: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="field">
          <label className="field-label">Cena</label>
          <div className="field-affix">
            <span className="field-affix-symbol">{currencySymbol}</span>
            <input
              className="field-input"
              type="number"
              min="0"
              placeholder="0"
              value={food.dinner === 0 ? "" : food.dinner}
              onChange={(e) => updateFood({ dinner: Number(e.target.value) })}
            />
          </div>
        </div>
      </div>
      <span className="field-hint">
        {perDay.toLocaleString("es-CO")} por persona al día × {budget.days} día(s) × {budget.travelers} viajero(s)
      </span>
    </div>
  );
}
