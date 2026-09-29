'use client';

import React, { useState, useEffect, useMemo } from 'react';
import './menuModal.css';
import { useCartStore } from '../../store/cartStore'; // adjust path as needed
import { nanoid } from 'nanoid';


export default function MenuModal({ item, onClose }: { item: any; onClose: () => void }) {
  const [quantity, setQuantity] = useState<number>(1);
  //const [selectedToppings, setSelectedToppings] = useState<number[]>([]);
  //const [selectedToppings, setSelectedToppings] = useState<Record<number, number[]>>({});
  // toppings with quantities
  const [selectedToppings, setSelectedToppings] = useState<{
    [parentId: number]: {
      [toppingId: number]: number;
    };
  }>({});

  const changeToppingQty = (
    parentId: number,
    toppingId: number,
    delta: number
  ) => {
    setSelectedToppings((prev) => {
      const current = prev[parentId] || {};
      const nextQty = (current[toppingId] || 0) + delta;

      const updated = { ...current };

      if (nextQty <= 0) {
        delete updated[toppingId];
      } else {
        updated[toppingId] = nextQty;
      }

      return {
        ...prev,
        [parentId]: updated,
      };
    });
  };

  //const [selectedComponents, setSelectedComponents] = useState<{ [componentId: number]: number[] }>({});

  // Update for +- of Item menu
  // components with quantities
  const [selectedComponents, setSelectedComponents] = useState<{
    [componentId: number]: {
      [subItemId: number]: number; // qty
    };
  }>({});

  const getComponentTotal = (componentId: number) => {
    const items = selectedComponents[componentId] || {};
    return Object.values(items).reduce((sum: number, qty: any) => sum + qty, 0);
  };

  const increaseComponentItem = (component: any, subItemId: number) => {
    setSelectedComponents((prev: any) => {
      const componentItems = prev[component.id] || {};
      const currentQty = componentItems[subItemId] || 0;
      const total = Object.values(componentItems).reduce(
        (sum: number, q: any) => sum + q,
        0
      );

      // 🚫 block if max reached
      if (total >= component.max_selections) return prev;

      return {
        ...prev,
        [component.id]: {
          ...componentItems,
          [subItemId]: currentQty + 1
        }
      };
    });
  };

  const decreaseComponentItem = (componentId: number, subItemId: number) => {
    setSelectedComponents((prev: any) => {
      const componentItems = { ...(prev[componentId] || {}) };
      const currentQty = componentItems[subItemId] || 0;

      if (currentQty <= 1) {
        delete componentItems[subItemId];
      } else {
        componentItems[subItemId] = currentQty - 1;
      }

      return {
        ...prev,
        [componentId]: componentItems
      };
    });
  };

  const selectRadioComponent = (componentId: number, subItemId: number) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [componentId]: {
        [subItemId]: 1,
      },
    }));
  };

  const normalizeComponents = (
  selectedComponents: any,
  components: any[]
) => {
  const normalized: any[] = [];

  components.forEach((component) => {
    const selectedMap = selectedComponents[component.id];

    if (!selectedMap) return;

    Object.entries(selectedMap).forEach(([itemId, qty]) => {
      const item = component.items.find(
        (compItem: any) => compItem.id === Number(itemId)
      );

      if (!item || Number(qty) <= 0) return;

      normalized.push({
        id: item.id,
        name: item.name,
        category: component.category,
        price: item.price,
        quantity: Number(qty),
      });
    });
  });

  return normalized;
};

  const normalizeToppings = (
    selectedToppings: Record<number, Record<number, number>>
  ) => {
    return Object.values(selectedToppings).flatMap(toppingMap =>
      Object.entries(toppingMap).flatMap(([id, qty]) =>
        Array(qty).fill(Number(id))
      )
    );
  };

  // message if item add to cart
  const [message, setMessage] = useState('');

  // Modal
  useEffect(() => {
      // 🔒 lock body scroll when modal opens
      document.body.classList.add("modal-open");

      return () => {
        // 🔓 restore body scroll when modal closes
        document.body.classList.remove("modal-open");
      };
  }, []);

  // Store Cart
  const { addItem } = useCartStore();

  // base price
  const basePrice = Number(item.price || 0);

  //const toggleTopping = (id: number) => {
    //setSelectedToppings((prev) =>
      //prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    //);
  //};

  const toggleTopping = (itemId: number, toppingId: number) => {
    setSelectedToppings((prev) => {
      const current = prev[itemId] ?? {};

      const updated = {
        ...current,
        [toppingId]: current[toppingId] ? 0 : 1,
      };

      // Optional: remove topping if quantity becomes 0
      if (updated[toppingId] === 0) {
        delete updated[toppingId];
      }

      return {
        ...prev,
        [itemId]: updated,
      };
    });
  };

  type Topping = {
    id: number;
    name: string;
    price?: number | string;
  };

  const componentTotal = useMemo(() => {
    if (!item.components) return 0;

    return item.components.reduce((sum: number, component: any) => {
      //const selectedIds = selectedComponents[component.id] || [];

      //const selectedItems = component.items.filter((item: any) =>
        //selectedIds.includes(item.id)
      //);

      const selectedMap = selectedComponents[component.id] || {};

      const selectedItems = component.items.filter(
        (item: any) => selectedMap[item.id] > 0
      );

      const componentSum = selectedItems.reduce(
        (subSum: number, i: any) => subSum + Number(i.price || 0),
        0
      );

      return sum + componentSum;
    }, 0);
  }, [selectedComponents, item.components]);

  // Topping Total Function
  const toppingTotal = useMemo(() => {
    let total = 0;

    // 1️⃣ Component-based toppings
    item.components?.forEach((component: any) => {
      if (
        component.category?.toLowerCase().includes('topping') &&
        selectedComponents[component.id]
      ) {
        component.items.forEach((compItem: any) => {
          const componentSelections = selectedComponents[component.id] ?? {};
          if (compItem.id in componentSelections) {
            total += Number(compItem.price || 0);
          }
        });
      }
    });

    // 2️⃣ Direct toppings with quantity
    const selectedToppingTotal =
      item.toppings?.reduce((sum: number, t: any) => {
        let quantity = 0;

        Object.values(selectedToppings).forEach((toppingMap: any) => {
          if (toppingMap[t.id] > 0) {
            quantity += toppingMap[t.id];
          }
        });

        return sum + quantity * Number(t.price || 0);
      }, 0) || 0;

    total += selectedToppingTotal;

    return total;
  }, [item.components, selectedComponents, selectedToppings, item.toppings]);
  // End toppingTotal

  // Validate to input
  const validateRequiredComponents = () => {
    if (!item.components) return true;

    for (const component of item.components) {
      const selectedIds = selectedComponents[component.id] || {};
      const totalSelected = Object.values(selectedIds).reduce(
        (sum, qty) => sum + qty,
        0
      );

      if (component.required) {
        if (totalSelected < component.max_selections) {
          return false; // ⛔ Not enough selected
        }
      }
    }

    return true; // ✅ All required components have enough selections
  };

  // Total price
  const total = useMemo(() => {
    return (basePrice + toppingTotal) * quantity;
  }, [basePrice, toppingTotal, quantity]);

  const normalizedComponents = normalizeComponents(
    selectedComponents,
    item.components || []
  );

  const normalizedToppings = normalizeToppings(selectedToppings);

  const addToCart = () => {
    if (!validateRequiredComponents()) {
      setMessage("⚠️ Please complete all required selections.");
      return;
    }

    const price = basePrice + toppingTotal;

    const cartItem = {
      ...item,
      cartId: nanoid(),
      quantity,
      price,
      total: price * quantity,

      // ✅ SAVE BACKEND FORMAT
      components: normalizedComponents,
      toppings: normalizedToppings,
    };

    addItem(cartItem);

    console.log("Bis - Cart")
    console.log(cartItem)
    setMessage("✅ Added to cart!");
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        {/*header*/}
        <div className="modal-header">

          <button className="close-button" onClick={onClose}>×</button>

          <div className="titleDesign">
            <h2 className="menuTitle">{item.name}</h2>
            <p className="menuTextTitle"><strong>Base Price:</strong> £{basePrice.toFixed(2)}</p>
          </div>
        </div>
        {/*close header*/}

        {/*modal body*/}
        <div className="modal-body">

        {item.components?.map((component: any) => (
          <div key={component.id} className="component-section">
            <div className="menu-title">
              <p className="menuText">
                <strong>{component.category}</strong>
                {' '}({component.required ? 'Required' : 'Optional'}, choose up to {component.max_selections})
              </p>
            </div>

            {/*Bis - Pizza and Drinks */}
            {component.items?.length > 0 &&
              (component.max_selections === 1 ? (
                // Radio selection
                component.items.map((subItem: any) => (
                  <div key={subItem.id} className="sub-item-block">
                    <label className="menuText">
                      <input
                        type="radio"
                        name={`component-${component.id}`}
                        value={subItem.id}
                        checked={!!selectedComponents[component.id]?.[subItem.id]}
                        onChange={() => selectRadioComponent(component.id, subItem.id)}
                        // onChange={...}
                      />
                      {subItem.name}
                    </label>

                    {/* ✅ Show toppings if available */}
                    {subItem.toppings?.length > 0 && (
                      <div className="toppings-section">
                        <p className="menuText" style={{ marginLeft: '1.5em' }}>
                          <strong>Select Toppings (optional):</strong>
                        </p>
                        {subItem.toppings.map((topping: any) => (
                          <div key={topping.id} className="topping-checkbox" style={{ marginLeft: '2em' }}>
                            <label className="menuText">
                              <input
                                type="checkbox"
                                checked={Boolean(selectedToppings[subItem.id]?.[topping.id])}
                                onChange={() => toggleTopping(subItem.id, topping.id)}
                              />
                              {topping.name} {`(+ $${Number(topping.price || 0).toFixed(2)})`}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}


                  </div>
                ))
              ) : (
                // Checkbox selection
              // Bis - Sharing Munch Box
              <>
                {component.items.map((subItem: any) => {
                  const qty = selectedComponents[component.id]?.[subItem.id] || 0;
                  const total = getComponentTotal(component.id);
                  const disabled = total >= component.max_selections && qty === 0;

                  return (
                    <div key={subItem.id} className="option-row">
                      <div className="left">
                        {qty === 0 ? (
                          <button
                            className="circle-btn"
                            disabled={disabled}
                            onClick={() => increaseComponentItem(component, subItem.id)}
                          >
                            +
                          </button>
                        ) : (
                          <div className="qty-pill">
                            <button onClick={() => decreaseComponentItem(component.id, subItem.id)}>−</button>
                            <span>{qty}</span>
                            <button
                              onClick={() => increaseComponentItem(component, subItem.id)}
                              disabled={total >= component.max_selections}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="menuText">{subItem.name}</div>
                      <div className="menuText">
                        +£{Number(subItem.price || 0).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </>

              )
            )}
          </div>
        ))}


        {/*Bis toppings*/}
        {item.toppings?.length > 0 && (
          <div className="toppings-section">
            <div className="menu-title">
              <p className="menuText"><strong>Select Toppings (optional):</strong></p>
            </div>
            {item.toppings?.map((topping: any) => {
              const qty = selectedToppings[item.id]?.[topping.id] || 0;

              return (
                <div key={topping.id} className="option-row">
                  <div className="left">
                    {qty === 0 ? (
                      <button
                        className="circle-btn"
                        onClick={() =>
                          changeToppingQty(item.id, topping.id, 1)
                        }
                      >
                        +
                      </button>
                    ) : (
                      <div className="qty-pill">
                        <button
                          onClick={() =>
                            changeToppingQty(item.id, topping.id, -1)
                          }
                        >
                          −
                        </button>

                        <span>{qty}</span>

                        <button
                          onClick={() =>
                            changeToppingQty(item.id, topping.id, 1)
                          }
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="menuText">
                    {topping.name} (+ £{Number(topping.price || 0).toFixed(2)})
                  </div>
                </div>
              );
            })}

          </div>
        )}

        </div>
        {/*close modal body*/}

        {/*modal footer*/}
        <div className="modal-footer">
            <label className="menuText">
               {/*Quantity:*/}
                <div className="qty-pill-blue">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="qty-btn"
                  >
                    −
                  </button>

                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    readOnly
                    className="quantity-input"
                  />

                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
            </label>

            {/*<p className="total-price menuText">
              <strong>Total Price:</strong>£{total.toFixed(2)}
            </p>*/}

            <button className="add-to-cart-button" onClick={addToCart}>
              {/*<strong>Total Price:</strong>£{total.toFixed(2)}*/}
              <strong>£{total.toFixed(2)}</strong>&nbsp;&nbsp;&nbsp;
              Order
            </button>

            <button
              className="checkout-button"
              onClick={(e) => {
                e.stopPropagation();
                // Navigate to cart or checkout page
                window.location.href = '/checkout'; // or use Next.js router if needed
              }}
            >
              💳 Checkout
            </button>

            {message && (
              <p className="feedback-message" style={{ color: message.includes("⚠️") ? 'red' : 'green', marginTop: '0.5rem' }}>
                {message}
              </p>
            )}
        </div>
        {/*close modal footer*/}
      </div>
    </div>
  );
}

