import React, { createContext, useContext, useState, useCallback } from 'react';

export type ModalName =
  | 'calc'
  | 'caseTracker'
  | 'grievance'
  | 'notificationSearch'
  | 'dgpsViewer'
  | 'digitalAward'
  | 'bulkUpload'
  | 'openData'
  | 'siteMap'
  | 'privacyPolicy'
  | 'exportModal'
  | 'commandPalette'
  | 'notifications'
  | 'about'
  | 'helpline'
  | 'faqs'
  | 'orgChart';

export interface ModalContextType {
  modals: Record<ModalName, boolean>;
  openModal: (modal: ModalName) => void;
  closeModal: (modal: ModalName) => void;
  toggleModal: (modal: ModalName) => void;
  isModalOpen: (modal: ModalName) => boolean;
}

const initialModalsState: Record<ModalName, boolean> = {
  calc: false,
  caseTracker: false,
  grievance: false,
  notificationSearch: false,
  dgpsViewer: false,
  digitalAward: false,
  bulkUpload: false,
  openData: false,
  siteMap: false,
  privacyPolicy: false,
  exportModal: false,
  commandPalette: false,
  notifications: false,
  about: false,
  helpline: false,
  faqs: false,
  orgChart: false,
};


const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<Record<ModalName, boolean>>(initialModalsState);

  const openModal = useCallback((modal: ModalName) => {
    setModals((prev) => ({ ...prev, [modal]: true }));
  }, []);

  const closeModal = useCallback((modal: ModalName) => {
    setModals((prev) => ({ ...prev, [modal]: false }));
  }, []);

  const toggleModal = useCallback((modal: ModalName) => {
    setModals((prev) => ({ ...prev, [modal]: !prev[modal] }));
  }, []);

  const isModalOpen = useCallback((modal: ModalName) => {
    return !!modals[modal];
  }, [modals]);

  return (
    <ModalContext.Provider
      value={{
        modals,
        openModal,
        closeModal,
        toggleModal,
        isModalOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModals = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModals must be used within ModalProvider');
  }
  return context;
};
