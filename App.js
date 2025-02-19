import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { jsPDF } from "jspdf";
import './App.css'; 


const VoucherApproval = () => {
  const [formData, setFormData] = useState({
    date: "",
    vendorName: "",
    reason: "",
    amount: "", 
    status: "Pending", 
  });

  const vendorSignRef = useRef(null);
  const managerSignRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveVendorSignature = () => {
    setFormData({ ...formData, vendorSignature: vendorSignRef.current.toDataURL() });
  };

  const approveVoucher = () => {
    if (!formData.date || !formData.vendorName || !formData.reason || !formData.amount || !formData.vendorSignature) {
      alert("All fields and vendor signature are required before approval.");
      return;
    }
    setFormData({ ...formData, status: "Approved" });
  };
  
  const generatePDF = () => {
    if (!formData.managerSignature) {
      alert("Manager signature is required before generating the PDF.");
      return;
    }
    const doc = new jsPDF();
    doc.text(`Date: ${formData.date}`, 10, 10);
    doc.text(`Vendor: ${formData.vendorName}`, 10, 20);
    doc.text(`Reason: ${formData.reason}`, 10, 30);
    doc.text(`Amount: ${formData.amount}`, 10, 40);
    if (formData.vendorSignature) {
      doc.addImage(formData.vendorSignature, "PNG", 10, 50, 50, 20);
    }
    if (formData.managerSignature) {
      doc.addImage(formData.managerSignature, "PNG", 10, 80, 50, 20);
    }
    doc.save("voucher.pdf");
  };
  
  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-bold mb-4">BeneathAtree Voucher Approval</h2>
      <input type="date" name="date" placeholder="Date" value={formData.date} onChange={handleChange} className="border p-2 w-full mb-2" />
      <input type="text" name="vendorName" placeholder="Vendor Name" value={formData.vendorName} onChange={handleChange} className="border p-2 w-full mb-2" />
      <input type="text" name="reason" placeholder="Reason" value={formData.reason} onChange={handleChange} className="border p-2 w-full mb-2" />
      <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} className="border p-2 w-full mb-2" />
      <h3 className="font-bold">Vendor Signature</h3>
      <SignatureCanvas ref={vendorSignRef} penColor="black" canvasProps={{ width: 300, height: 100, className: "border" }} />
      <button onClick={saveVendorSignature} className="bg-blue-500 text-white p-2 mt-2">Save Signature</button>
      <button onClick={approveVoucher} className="bg-green-500 text-white p-2 mt-2 ml-2">Approve</button>
      {formData.status === "Approved" && (
        <>
          <h3 className="font-bold mt-4">Manager Signature</h3>
          <SignatureCanvas ref={managerSignRef} penColor="black" canvasProps={{ width: 300, height: 100, className: "border" }} />
          <button onClick={() => setFormData({ ...formData, managerSignature: managerSignRef.current.toDataURL() })} className="bg-blue-500 text-white p-2 mt-2">Save Manager Signature</button>
        </>
      )}
      {formData.managerSignature && <button onClick={generatePDF} className="bg-red-500 text-white p-2 mt-2">Generate PDF</button>}
    </div>
  );
};

export default VoucherApproval;
