import React from "react";

const OrderItemsTable = ({ items }) => {
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="overflow-x-auto">
      <table className="table w-full border mt-4">
        <thead className="bg-gray-100">
          <tr>
            <th>Product (Code - Name)</th>
            <th>Net Unit Cost</th>
            <th>Quantity</th>
            <th>Discount</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.code} - {item.name}</td>
              <td>Rs. {item.cost}</td>
              <td>{item.quantity}</td>
              <td>{item.discount}%</td>
              <td>Rs. {item.subtotal}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-100 font-semibold">
          <tr>
            <td colSpan="2">Total</td>
            <td>{totalQty}</td>
            <td>-</td>
            <td>Rs. {totalValue}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default OrderItemsTable;
