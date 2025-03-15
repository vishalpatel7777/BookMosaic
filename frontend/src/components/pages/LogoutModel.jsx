import { useState } from "react";
import CustomAlert from "../Alert/CustomAlert";

export default function LogoutModal() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <button onClick={() => setShowModal(true)} className="px-4 py-2 text-white bg-red-500 rounded-lg">Logout</button>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold">Are you sure you want to log out?</p>
            <div className="mt-4 flex justify-center gap-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setAlertMessage("Logged out!");
                  setShowAlert(true);
                  setTimeout(() => setShowAlert(false), 2000);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
    </div>
  );
}