import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    confirmAction: () => {},
    type: "confirm", // 'confirm', 'success', 'error'
  });

  const openConfirmModal = (
    title,
    message,
    confirmAction,
    confirmText = "Confirm",
    cancelText = "Cancel"
  ) => {
    setModal({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      confirmAction,
      type: "confirm",
    });
  };

  const openSuccessModal = (title, message) => {
    setModal({
      isOpen: true,
      title,
      message,
      confirmText: "OK",
      type: "success",
    });
  };

  const openErrorModal = (title, message) => {
    setModal({
      isOpen: true,
      title,
      message,
      confirmText: "OK",
      type: "error",
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleConfirm = () => {
    modal.confirmAction();
    closeModal();
  };

  return (
    <ModalContext.Provider
      value={{
        openConfirmModal,
        openSuccessModal,
        openErrorModal,
        closeModal,
      }}
    >
      {children}
      {modal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={closeModal}
          ></div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full relative z-10 shadow-xl">
            <div className="text-center">
              {/* Icon based on modal type */}
              {modal.type === "success" && (
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                  <svg
                    className="h-6 w-6 text-green-600 dark:text-green-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
              {modal.type === "error" && (
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                  <svg
                    className="h-6 w-6 text-red-600 dark:text-red-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}
              {modal.type === "confirm" && (
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                  <svg
                    className="h-6 w-6 text-blue-600 dark:text-blue-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              )}

              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {modal.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {modal.message}
              </p>

              <div className="flex justify-center space-x-4">
                {modal.type === "confirm" && (
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={closeModal}
                  >
                    {modal.cancelText}
                  </button>
                )}
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md ${
                    modal.type === "error"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : modal.type === "success"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                  onClick={
                    modal.type === "confirm" ? handleConfirm : closeModal
                  }
                >
                  {modal.confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
