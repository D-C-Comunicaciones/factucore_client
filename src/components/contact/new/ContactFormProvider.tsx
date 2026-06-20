"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface AssociatedPerson {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  phone: string;
  send_notifications: boolean;
}

export interface CommentItem {
  id?: number;
  comment: string;
  is_internal: boolean;
  created_at?: string;
  isDeleted?: boolean;
}

export interface ContactFormState {
  mode: "simple" | "advanced";
  setMode: (mode: "simple" | "advanced") => void;
  contactTypes: ("cliente" | "proveedor")[];
  setContactTypes: React.Dispatch<React.SetStateAction<("cliente" | "proveedor")[]>>;
  
  docType: string;
  setDocType: (val: string) => void;
  docNumber: string;
  setDocNumber: (val: string) => void;
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  registrationName: string;
  setRegistrationName: (val: string) => void;
  municipalityId: string;
  setMunicipalityId: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  postalCode: string;
  setPostalCode: (val: string) => void;
  country: string;
  setCountry: (val: string) => void;
  comments: CommentItem[];
  setComments: React.Dispatch<React.SetStateAction<CommentItem[]>>;
  city: string;
  setCity: (val: string) => void;

  email: string;
  setEmail: (val: string) => void;
  phone1: string;
  setPhone1: (val: string) => void;
  phone2: string;
  setPhone2: (val: string) => void;
  mobile: string;
  setMobile: (val: string) => void;

  paymentTermId: string;
  setPaymentTermId: (val: string) => void;
  priceListId: string;
  setPriceListId: (val: string) => void;
  sellerId: string;
  setSellerId: (val: string) => void;
  sendAccountStatement: boolean;
  setSendAccountStatement: (val: boolean) => void;

  accountsReceivableAccountId: string;
  setAccountsReceivableAccountId: (val: string) => void;
  accountsPayableAccountId: string;
  setAccountsPayableAccountId: (val: string) => void;

  associatedPersons: AssociatedPerson[];
  setAssociatedPersons: React.Dispatch<React.SetStateAction<AssociatedPerson[]>>;

  autocompleting: boolean;
  setAutocompleting: (val: boolean) => void;
  creating: boolean;
  setCreating: (val: boolean) => void;

  errors: { [key: string]: boolean };
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;

  resetForm: () => void;
  toggleContactType: (type: "cliente" | "proveedor") => void;
}

const ContactFormContext = createContext<ContactFormState | undefined>(undefined);

export function ContactFormProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"simple" | "advanced">("simple");
  const [contactTypes, setContactTypes] = useState<("cliente" | "proveedor")[]>(["cliente"]);
  
  const [docType, setDocType] = useState<string>("");
  const [docNumber, setDocNumber] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [registrationName, setRegistrationName] = useState<string>("");
  const [municipalityId, setMunicipalityId] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [city, setCity] = useState<string>("");

  const [email, setEmail] = useState<string>("");
  const [phone1, setPhone1] = useState<string>("");
  const [phone2, setPhone2] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");

  const [paymentTermId, setPaymentTermId] = useState<string>("");
  const [priceListId, setPriceListId] = useState<string>("");
  const [sellerId, setSellerId] = useState<string>("");
  const [sendAccountStatement, setSendAccountStatement] = useState<boolean>(false);

  const [accountsReceivableAccountId, setAccountsReceivableAccountId] = useState<string>("");
  const [accountsPayableAccountId, setAccountsPayableAccountId] = useState<string>("");

  const [associatedPersons, setAssociatedPersons] = useState<AssociatedPerson[]>([]);

  const [autocompleting, setAutocompleting] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const toggleContactType = (type: "cliente" | "proveedor") => {
    setContactTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      }
      return [...prev, type];
    });
  };

  const resetForm = () => {
    setMode("simple");
    setContactTypes(["cliente"]);
    setDocType("");
    setDocNumber("");
    setFirstName("");
    setLastName("");
    setRegistrationName("");
    setMunicipalityId("");
    setAddress("");
    setPostalCode("");
    setCountry("");
    setCity("");
    setEmail("");
    setPhone1("");
    setPhone2("");
    setMobile("");
    setPaymentTermId("");
    setPriceListId("");
    setSellerId("");
    setSendAccountStatement(false);
    setAccountsReceivableAccountId("");
    setAccountsPayableAccountId("");
    setComments([]);
    setErrors({});
  };

  return (
    <ContactFormContext.Provider
      value={{
        mode, setMode,
        contactTypes, setContactTypes, toggleContactType,
        docType, setDocType,
        docNumber, setDocNumber,
        firstName, setFirstName,
        lastName, setLastName,
        registrationName, setRegistrationName,
        municipalityId, setMunicipalityId,
        address, setAddress,
        postalCode, setPostalCode,
        country, setCountry,
        city, setCity,
        email, setEmail,
        phone1, setPhone1,
        phone2, setPhone2,
        mobile, setMobile,
        paymentTermId, setPaymentTermId,
        priceListId, setPriceListId,
        sellerId, setSellerId,
        sendAccountStatement, setSendAccountStatement,
        accountsReceivableAccountId, setAccountsReceivableAccountId,
        accountsPayableAccountId, setAccountsPayableAccountId,
        comments, setComments,
        associatedPersons, setAssociatedPersons,
        autocompleting, setAutocompleting,
        creating, setCreating,
        errors, setErrors,
        resetForm,
      }}
    >
      {children}
    </ContactFormContext.Provider>
  );
}

export function useContactForm() {
  const context = useContext(ContactFormContext);
  if (context === undefined) {
    throw new Error("useContactForm must be used within a ContactFormProvider");
  }
  return context;
}
